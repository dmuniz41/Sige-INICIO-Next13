import { connectDB } from "@/libs/mongodb";
import { NextResponse } from "next/server";

import Material, { IMaterial } from "@/models/material";
import Operation from "@/models/operation";
import { verifyJWT } from "@/libs/jwt";
import Warehouse from "@/models/warehouse";
import Nomenclator, { INomenclator } from "@/models/nomenclator";

export async function POST(request: Request) {
  const {
    category = "",
    costPerUnit = 0,
    description = "",
    enterDate = "",
    materialName = "",
    minimumExistence = 1,
    operation = {},
    provider = "",
    unitMeasure = "",
    warehouse = "",
  } = await request.json();
  const accessToken = request.headers.get("accessToken");
  try {
    if (!accessToken || !verifyJWT(accessToken)) {
      return NextResponse.json(
        {
          ok: false,
          message: "Su sesión ha expirado, por favor autentiquese nuevamente",
        },
        {
          status: 401,
        }
      );
    }
    await connectDB();
    let BDMaterial = (await Material.findOne({ materialName, category, costPerUnit, description })) as IMaterial;

    // * Si ya existe un material con ese código suma la cantidad que se está entrando al total y agrega la nueva operacion a la lista de operaciones del material ya existente

    if (BDMaterial && operation.tipo === "Añadir") {
      let newTotal = BDMaterial.unitsTotal + operation?.amount;
      let newTotalValue = BDMaterial.materialTotalValue! + operation?.amount * BDMaterial.costPerUnit;
      let updatedMaterial = await Material.findOneAndUpdate(
        { materialName, category, costPerUnit, description },
        {
          $push: { operations: operation },
          materialTotalValue: newTotalValue,
          unitsTotal: newTotal,
        },
        { new: true }
      );

      //* Actualiza el valor total del almacén
      const DBWarehouse = await Warehouse.findById(warehouse);
      let newWarehouseValue = DBWarehouse.totalValue + operation?.amount * costPerUnit;
      await Warehouse.findByIdAndUpdate(warehouse, { totalValue: newWarehouseValue });

      return new NextResponse(
        JSON.stringify({
          ok: true,
          updatedMaterial,
        }),
        {
          headers: {
            "Access-Control-Allow-Origin": "*",
            "Content-Type": "application/json",
          },
          status: 200,
        }
      );
    }
    // * Si ya existe un material con ese código sustrae la cantidad que se está entrando al total  agrega la nueva operacion a la lista de operaciones del material ya existente

    if (BDMaterial && operation.tipo === "Sustraer") {
      let newTotal = BDMaterial.unitsTotal - operation?.amount;
      let newTotalValue = BDMaterial.materialTotalValue! - operation?.amount * BDMaterial.costPerUnit;
      if (newTotal < 0) {
        return NextResponse.json(
          {
            ok: false,
            message: "No hay existencias suficientes para extraer esa cantidad de material",
          },
          {
            status: 400,
          }
        );
      } else {
        // * Si las existencias después de extraer el material es cero elimina el material
        if (newTotal === 0) {
          let code = BDMaterial.code;
          let deletedMaterial: IMaterial = (await Material.findOneAndDelete({ code })) as IMaterial;

          const materialList: IMaterial[] = await Material.find({ category: deletedMaterial.category, materialName: deletedMaterial.materialName });
          console.log("🚀 ~ POST ~ materialList:", materialList)
          if (materialList.length == 0) {
            console.log('borrar');
            
            await await Nomenclator.findOneAndDelete({ category: "Material", code: `${deletedMaterial.category} ${deletedMaterial.materialName}` });
          }
          const prices = materialList.map((material) => material.costPerUnit);
          const maxPrice = Math.max(...prices);

          // * Verifica si exsite un nomenclador con esa categoría y material en la BD, si no existe crea uno nuevo
          await Nomenclator.findOneAndUpdate({ category: "Material", code: `${deletedMaterial.category} ${deletedMaterial.materialName}` }, { value: maxPrice }, { new: true });

          let DBWarehouse = await Warehouse.findById(warehouse);
          let newWarehouseValue = DBWarehouse.totalValue - deletedMaterial?.materialTotalValue!;
          await Warehouse.findByIdAndUpdate(warehouse, { totalValue: newWarehouseValue });

          return NextResponse.json(
            {
              ok: true,
              message: "Material eliminado",
            },
            {
              status: 200,
            }
          );
        }
      }
      let updatedMaterial = await Material.findOneAndUpdate(
        { materialName, category, costPerUnit, description },
        {
          $push: { operations: operation },
          unitsTotal: newTotal,
          materialTotalValue: newTotalValue,
        },
        { new: true }
      );

      //* Actualiza el valor total del almacén
      const DBWarehouse = await Warehouse.findById(warehouse);
      let newWarehouseValue = DBWarehouse.totalValue - operation?.amount * costPerUnit;
      await Warehouse.findByIdAndUpdate(warehouse, { totalValue: newWarehouseValue });

      return new NextResponse(
        JSON.stringify({
          ok: true,
          updatedMaterial,
        }),
        {
          headers: {
            "Access-Control-Allow-Origin": "*",
            "Content-Type": "application/json",
          },
          status: 200,
        }
      );
      // * Si no existe un material con ese código crea una nueva entrada en el almacén
    } else {
      let newOperation = new Operation(operation);
      let listOfMaterials = await Material.find();
      let materialCount = 0;
      if (listOfMaterials.length != 0) {
        materialCount = listOfMaterials.at(-1).code;
      }

      const newMaterial = new Material({
        category,
        code: ++materialCount,
        costPerUnit,
        description,
        enterDate,
        key: category + materialName + costPerUnit + description,
        materialName,
        materialTotalValue: costPerUnit * operation?.amount,
        minimumExistence,
        provider,
        unitMeasure,
        unitsTotal: operation?.amount,
        warehouse,
      });

      newMaterial.operations.push(newOperation);

      //* Actualiza el valor total del almacén
      const DBWarehouse = await Warehouse.findById(warehouse);
      let newWarehouseValue = DBWarehouse.totalValue + operation?.amount * costPerUnit;
      await Warehouse.findByIdAndUpdate(warehouse, { totalValue: newWarehouseValue });

      await newMaterial.save();

      // * Calcula el mayor valor dentro de un grupo de materiales con igual categoria y nombre
      const materialList: IMaterial[] = await Material.find({ category: category, materialName: materialName });
      const prices: number[] = materialList.map((material) => material.costPerUnit);
      const maxPrice: number = Math.max(...prices);

      // * Crea un nuevo nomenclador asociado a ese material
      const BDNomenclator = (await Nomenclator.findOne({ category: "Material", code: `${category} ${materialName}` })) as INomenclator;

      if (!BDNomenclator) {
        const newNomenclator = new Nomenclator({
          key: category + materialName + costPerUnit + description,
          category: "Material",
          code: `${category} ${materialName}`,
          value: maxPrice,
        });
        await newNomenclator.save();
      } else {
        await Nomenclator.findOneAndUpdate({ category: "Material", code: `${category} ${materialName}` }, { value: maxPrice }, { new: true });
      }

      return new NextResponse(
        JSON.stringify({
          ok: true,
          newMaterial,
        }),
        {
          headers: {
            "Access-Control-Allow-Origin": "*",
            "Content-Type": "application/json",
          },
          status: 200,
        }
      );
    }
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json(
        {
          ok: false,
          message: error.message,
        },
        {
          status: 400,
        }
      );
    }
  }
}

export async function GET(request: Request) {
  const accessToken = request.headers.get("accessToken");
  try {
    if (!accessToken || !verifyJWT(accessToken)) {
      return NextResponse.json(
        {
          ok: false,
          message: "Su sesión ha expirado, por favor autentiquese nuevamente",
        },
        {
          status: 401,
        }
      );
    }
    await connectDB();
    const listOfMaterials = (await Material.find()).reverse();
    return new NextResponse(
      JSON.stringify({
        ok: true,
        listOfMaterials,
      }),
      {
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Content-Type": "application/json",
        },
        status: 200,
      }
    );
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json(
        {
          ok: false,
          message: error.message,
        },
        {
          status: 400,
        }
      );
    }
  }
}

export async function PUT(request: Request) {
  const { category = "", code = "", description = "", materialName = "", minimumExistence = 1 } = await request.json();
  const accessToken = request.headers.get("accessToken");

  try {
    if (!accessToken || !verifyJWT(accessToken)) {
      return NextResponse.json(
        {
          ok: false,
          message: "Su sesión ha expirado, por favor autentiquese nuevamente",
        },
        {
          status: 401,
        }
      );
    }
    await connectDB();

    const materialToUpdate: IMaterial = (await Material.findOne({ code })) as IMaterial;

    if (!materialToUpdate) {
      return NextResponse.json({
        ok: false,
        message: "El material a actualizar no existe",
      });
    }

    const updatedMaterial = (await Material.findOneAndUpdate({ code }, { materialName, minimumExistence, description }, { new: true })) as IMaterial;

    // * Calcula el mayor valor dentro de un grupo de materiales con igual categoria y nombre
    const auxMaterialList: IMaterial[] = await Material.find({ category: updatedMaterial.category, materialName: updatedMaterial.materialName });
    const auxPrices = auxMaterialList.map((material) => material.costPerUnit);
    const auxMaxPrice = Math.max(...auxPrices);

    // * Verifica si exsite un nomenclador con esa categoría y material en la BD, si no existe crea uno nuevo
    const updatedMaterialNomenclator = (await Nomenclator.findOne({ category: "Material", code: `${updatedMaterial.category} ${updatedMaterial.materialName}` })) as INomenclator;

    if (!updatedMaterialNomenclator) {
      const newNomenclator = new Nomenclator({
        key: updatedMaterial.category + materialName + updatedMaterial.costPerUnit + updatedMaterial.description,
        category: "Material",
        code: `${updatedMaterial.category} ${updatedMaterial.materialName}`,
        value: auxMaxPrice,
      });
      await newNomenclator.save();
    } else {
      await Nomenclator.findOneAndUpdate({ category: "Material", code: `${updatedMaterial.category} ${updatedMaterial.materialName}` }, { value: auxMaxPrice }, { new: true });
    }

    // * Calcula el mayor valor dentro de un grupo de materiales con igual categoria y nombre
    const materialList: IMaterial[] = await Material.find({ category: materialToUpdate.category, materialName: materialToUpdate.materialName });
    if (materialList.length == 0) {
      await await Nomenclator.findOneAndDelete({ category: "Material", code: `${materialToUpdate.category} ${materialToUpdate.materialName}` });
    } else {
      const prices: number[] = materialList.map((material) => material.costPerUnit);
      const maxPrice: number = Math.max(...prices);

      // * Verifica si exsite un nomenclador con esa categoría y material en la BD, si no existe crea uno nuevo
      const BDNomenclator = (await Nomenclator.findOne({ category: "Material", code: `${materialToUpdate.category} ${materialToUpdate.materialName}` })) as INomenclator;

      if (!BDNomenclator) {
        const newNomenclator = new Nomenclator({
          key: materialToUpdate.category + materialName + materialToUpdate.costPerUnit + materialToUpdate.description,
          category: "Material",
          code: `${materialToUpdate.category} ${materialToUpdate.materialName}`,
          value: maxPrice,
        });
        await newNomenclator.save();
      } else {
        await Nomenclator.findOneAndUpdate({ category: "Material", code: `${materialToUpdate.category} ${materialToUpdate.materialName}` }, { value: maxPrice }, { new: true });
      }
    }

    return new NextResponse(
      JSON.stringify({
        ok: true,
        updatedMaterial,
      }),
      {
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Content-Type": "application/json",
        },
        status: 200,
      }
    );
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json(
        {
          ok: false,
          message: error.message,
        },
        {
          status: 400,
        }
      );
    }
  }
}

export async function PATCH(request: Request) {
  const { code, warehouse } = await request.json();
  const accessToken = request.headers.get("accessToken");

  try {
    if (!accessToken || !verifyJWT(accessToken)) {
      return NextResponse.json(
        {
          ok: false,
          message: "Su sesión ha expirado, por favor autentiquese nuevamente",
        },
        {
          status: 401,
        }
      );
    }
    await connectDB();
    const materialToDelete: IMaterial = (await Material.findOne({ code })) as IMaterial;

    if (!materialToDelete) {
      return NextResponse.json({
        ok: true,
        message: "El material a borrar no existe",
      });
    }

    //* Actualiza el valor total del almacén si se elimina un material
    const deletedMaterial = await Material.findOneAndDelete({ code });
    const DBWarehouse = await Warehouse.findById(warehouse);
    let newWarehouseValue = DBWarehouse.totalValue - deletedMaterial.materialTotalValue;
    await Warehouse.findByIdAndUpdate(warehouse, { totalValue: newWarehouseValue });

    // * Al borrar el material re-calcula el valor del nomenclador de ese material
    const BDNomenclator = (await Nomenclator.findOne({ category: "Material", code: `${materialToDelete.category} ${materialToDelete.materialName}` })) as INomenclator;

    // * Calcula el mayor valor dentro de un grupo de materiales con igual categoria y nombre
    const materialList: IMaterial[] = await Material.find({ category: materialToDelete.category, materialName: materialToDelete.materialName });
    const prices: number[] = materialList.map((material) => material.costPerUnit);
    const maxPrice: number = Math.max(...prices);

    await Nomenclator.findOneAndUpdate({ category: "Material", code: `${materialToDelete.category} ${materialToDelete.materialName}` }, { value: maxPrice }, { new: true });

    return new NextResponse(
      JSON.stringify({
        ok: true,
        deletedMaterial,
      }),
      {
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Content-Type": "application/json",
        },
        status: 200,
      }
    );
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json(
        {
          ok: false,
          message: error.message,
        },
        {
          status: 400,
        }
      );
    }
  }
}

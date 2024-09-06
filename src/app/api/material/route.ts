import { connectDB } from "@/libs/mongodb";
import { NextRequest, NextResponse } from "next/server";

import { generateRandomString } from "@/helpers/randomStrings";
import { updateServiceFeesMaterials } from "@/helpers/udpateServiceFeesFunctions";
import { verifyJWT } from "@/libs/jwt";
import Material, { IMaterial } from "@/models/material";
import Nomenclator, { INomenclator } from "@/models/nomenclator";
import Operation from "@/models/operation";
import ServiceFee from "@/models/serviceFees";
import Warehouse from "@/models/warehouse";

export async function POST(request: NextRequest) {
  const { ...material }: any = await request.json();
  const accessToken = request.headers.get("accessToken");
  try {
    if (!accessToken || !verifyJWT(accessToken)) {
      return NextResponse.json(
        {
          ok: false,
          message: "Su sesión ha expirado, por favor autentiquese nuevamente"
        },
        {
          status: 401
        }
      );
    }
    await connectDB();

    let BDMaterial = (await Material.findOne({
      materialName: material?.materialName,
      category: material?.category,
      costPerUnit: material?.costPerUnit,
      description: material?.description
    })) as IMaterial;

    // ? SI YA EXISTE UN MATERIAL CON ESE CODIGO, SUMA LA CANTIDAD QUE SE ESTA EN ENTRANDO AL TOTAL Y AGREGA LA NUEVA OPERACION A LA LISTA DE OPERACIONES DEL MATERIAL YA EXISTENTE //
    if (BDMaterial && material?.operation?.tipo === "Añadir") {
      let newTotal = BDMaterial.unitsTotal + material?.operation?.amount;
      let newTotalValue = BDMaterial.materialTotalValue! + material?.operation?.amount * BDMaterial.costPerUnit;
      let updatedMaterial = await Material.findOneAndUpdate(
        {
          materialName: material.materialName,
          category: material.category,
          costPerUnit: material.costPerUnit,
          description: material.description
        },
        {
          $push: { operations: material?.operation },
          materialTotalValue: newTotalValue,
          unitsTotal: newTotal
        },
        { new: true }
      );

      // ? ACTUALIZA EL VALOR TOTAL DEL ALMACEN //'
      const DBWarehouse = await Warehouse.findById(material?.warehouse);
      let newWarehouseValue = DBWarehouse.totalValue + material?.operation?.amount * material?.costPerUnit;
      await Warehouse.findByIdAndUpdate(material?.warehouse, { totalValue: newWarehouseValue });

      return new NextResponse(
        JSON.stringify({
          ok: true,
          updatedMaterial
        }),
        {
          headers: {
            "Access-Control-Allow-Origin": "*",
            "Content-Type": "application/json"
          },
          status: 200
        }
      );
    }

    // ? SI YA EXISTE UN MATERIAL CON ESE CODIGO, SUSTRAE LA CANTIDAD QUE SE ESTA EN ENTRANDO AL TOTAL Y AGREGA LA NUEVA OPERACION A LA LISTA DE OPERACIONES DEL MATERIAL YA EXISTENTE //
    if (BDMaterial && material?.operation.tipo === "Sustraer") {
      let newTotal = BDMaterial.unitsTotal - material?.operation?.amount;
      let newTotalValue = BDMaterial.materialTotalValue! - material?.operation?.amount * BDMaterial.costPerUnit;
      if (newTotal < 0) {
        return NextResponse.json(
          {
            ok: false,
            message: "No hay existencias suficientes para extraer esa cantidad de material"
          },
          {
            status: 500
          }
        );
      } else {
        // ? SI LAS EXISTENCIAS DESPUES DE EXTRAER EL MATERIAL ES CERO ELIMINA EL MATERIAL //
        if (newTotal === 0) {
          let code = BDMaterial?.code;
          let deletedMaterial: IMaterial = (await Material.findOneAndDelete({ code })) as unknown as IMaterial;

          const materialList: IMaterial[] = await Material.find({
            category: deletedMaterial?.category,
            materialName: deletedMaterial?.materialName
          });

          if (materialList.length == 0) {
            await Nomenclator.findOneAndDelete({
              category: "Material",
              code: `${deletedMaterial?.category} ${deletedMaterial?.materialName}`
            });
          }

          const prices = materialList.map((material) => material.costPerUnit);
          const maxPrice = Math.max(...prices);

          // ? VERIFICA SI EXISTE UN NOMENCLADOR CON ESA CATEGORIA Y MATERIAL EN LA BD, SI NO EXISTE CREA UN NUEVO //
          const updatedMaterialNomenclator = await Nomenclator.findOneAndUpdate(
            {
              category: "Material",
              code: `${deletedMaterial?.category} ${deletedMaterial?.materialName}`
            },
            { value: maxPrice },
            { new: true }
          );

          let DBWarehouse = await Warehouse.findById(material?.warehouse);
          let newWarehouseValue = DBWarehouse?.totalValue - deletedMaterial?.materialTotalValue!;
          await Warehouse.findByIdAndUpdate(material?.warehouse, { totalValue: newWarehouseValue });
          await updateServiceFeesMaterials(updatedMaterialNomenclator, await ServiceFee.find());

          return NextResponse.json(
            {
              ok: true,
              message: "Material eliminado"
            },
            {
              status: 200
            }
          );
        }
      }
      let updatedMaterial = await Material.findOneAndUpdate(
        {
          materialName: material?.materialName,
          category: material?.category,
          costPerUnit: material?.costPerUnit,
          description: material?.description
        },
        {
          $push: { operations: material?.operation },
          unitsTotal: newTotal,
          materialTotalValue: newTotalValue
        },
        { new: true }
      );

      // ? ACTUALIZA EL VALOR TOTAL DEL ALMACEN //
      const DBWarehouse = await Warehouse.findById(material.warehouse);
      let newWarehouseValue = DBWarehouse.totalValue - material?.operation?.amount * material?.costPerUnit;
      await Warehouse.findByIdAndUpdate(material?.warehouse, { totalValue: newWarehouseValue });

      return new NextResponse(
        JSON.stringify({
          ok: true,
          updatedMaterial
        }),
        {
          headers: {
            "Access-Control-Allow-Origin": "*",
            "Content-Type": "application/json"
          },
          status: 200
        }
      );
    } else {
      // ? SI NO EXISTE UN MATERIAL CON ESE CODIGO CREA UNA NUEVA ENTRADA EN EL ALMACEN //
      let newOperation = new Operation(material?.operation);
      let listOfMaterials = await Material.find();
      let materialCount = 0;
      if (listOfMaterials.length != 0) {
        materialCount = listOfMaterials.at(-1)?.code;
      }

      const newMaterial = new Material({
        category: material?.category,
        code: ++materialCount,
        costPerUnit: material?.costPerUnit,
        description: material?.description,
        enterDate: material?.enterDate,
        key: material?.category + material?.materialName + material?.costPerUnit + material?.description,
        materialName: material.materialName,
        materialTotalValue: material?.costPerUnit * material?.operation?.amount,
        minimumExistence: material.minimumExistence,
        provider: material.provider,
        unitMeasure: material.unitMeasure,
        unitsTotal: material?.operation?.amount,
        warehouse: material?.warehouse
      });

      newMaterial.operations.push(newOperation);

      // ? ACTUALIZA EL VALOR TOTAL DEL ALMACEN //
      const DBWarehouse = await Warehouse.findById(material?.warehouse);
      let newWarehouseValue = DBWarehouse?.totalValue + material?.operation?.amount * material?.costPerUnit;
      await Warehouse.findByIdAndUpdate(material?.warehouse, { totalValue: newWarehouseValue });

      await newMaterial.save();

      // ? CALCULA EL MAYOR VALOR DENTRO DE UN GRUPO DE MATERIALES CON IGUAL CATEGORIA Y NOMBRE //
      const materialList: IMaterial[] = await Material.find({
        category: material?.category,
        materialName: material?.materialName
      });
      const prices: number[] = materialList.map((material) => material?.costPerUnit);
      const maxPrice: number = Math.max(...prices);

      // ? CREA UN NUEVO NOMENCLADOR ASOCIADO A ESE MATERIAL //
      const BDNomenclator = (await Nomenclator.findOne({
        category: "Material",
        code: `${material?.category} ${material?.materialName}`
      })) as INomenclator;

      const key = generateRandomString(26);

      if (!BDNomenclator) {
        const newNomenclator = new Nomenclator({
          key: key,
          category: "Material",
          code: `${material?.category} ${material?.materialName}`,
          value: maxPrice
        });

        await newNomenclator.save();
      } else {
        const updatedMaterialNomenclator = await Nomenclator.findOneAndUpdate(
          { category: "Material", code: `${material?.category} ${material?.materialName}` },
          { value: maxPrice },
          { new: true }
        );
        //? MANDA A ACTUALIZAR TODAS LAS TARIFAS EN LA BD
        await updateServiceFeesMaterials(updatedMaterialNomenclator, await ServiceFee.find());
      }

      return new NextResponse(
        JSON.stringify({
          ok: true,
          newMaterial
        }),
        {
          headers: {
            "Access-Control-Allow-Origin": "*",
            "Content-Type": "application/json"
          },
          status: 200
        }
      );
    }
  } catch (error) {
    if (error instanceof Error) {
      console.log("🚀 ~ POST ~ error:", error);
      return NextResponse.json(
        {
          ok: false,
          message: error.message
        },
        {
          status: 500
        }
      );
    }
  }
}

export async function GET(request: NextRequest) {
  const accessToken = request.headers.get("accessToken");
  try {
    if (!accessToken || !verifyJWT(accessToken)) {
      return NextResponse.json(
        {
          ok: false,
          message: "Su sesión ha expirado, por favor autentiquese nuevamente"
        },
        {
          status: 401
        }
      );
    }

    await connectDB();
    const listOfMaterials = (await Material.find()).reverse() as IMaterial[];

    return new NextResponse(
      JSON.stringify({
        ok: true,
        listOfMaterials
      }),
      {
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Content-Type": "application/json"
        },
        status: 200
      }
    );
  } catch (error) {
    if (error instanceof Error) {
      console.log("🚀 ~ GET ~ error:", error);
      return NextResponse.json(
        {
          ok: false,
          message: error.message
        },
        {
          status: 500
        }
      );
    }
  }
}

export async function PUT(request: NextRequest) {
  const { code = "", description = "", materialName = "", minimumExistence = 1 } = await request.json();
  const accessToken = request.headers.get("accessToken");
  const key = generateRandomString(26);

  try {
    if (!accessToken || !verifyJWT(accessToken)) {
      return NextResponse.json(
        {
          ok: false,
          message: "Su sesión ha expirado, por favor autentiquese nuevamente"
        },
        {
          status: 401
        }
      );
    }
    await connectDB();

    const materialToUpdate: IMaterial = (await Material.findOne({ code })) as IMaterial;

    if (!materialToUpdate) {
      return NextResponse.json({
        ok: false,
        message: "El material a actualizar no existe"
      });
    }

    const updatedMaterial = (await Material.findOneAndUpdate(
      { code },
      { materialName, minimumExistence, description },
      { new: true }
    )) as IMaterial;

    // ? CALCULA EL MAYOR VALOR DENTRO DE UN GRUPO DE MATERIALES CON IGUAL CATEGORIA Y NOMBRE //

    const auxMaterialList: IMaterial[] = await Material.find({
      category: updatedMaterial.category,
      materialName: updatedMaterial.materialName
    });
    const auxPrices = auxMaterialList.map((material) => material.costPerUnit);
    const auxMaxPrice = Math.max(...auxPrices);

    // ? VERIFICA SI EXISTE UN NOMENCLADOR CON ESA CATEGORIA Y MATERIAL EN LA BD, SI NO EXISTE CREA UNO NUEVO //

    const updatedMaterialNomenclator = (await Nomenclator.findOne({
      category: "Material",
      code: `${updatedMaterial.category} ${updatedMaterial.materialName}`
    })) as INomenclator;

    if (!updatedMaterialNomenclator) {
      const newNomenclator = new Nomenclator({
        key: key,
        category: "Material",
        code: `${updatedMaterial.category} ${updatedMaterial.materialName}`,
        value: auxMaxPrice
      });
      await newNomenclator.save();
    } else {
      await Nomenclator.findOneAndUpdate(
        {
          category: "Material",
          code: `${updatedMaterial.category} ${updatedMaterial.materialName}`
        },
        { value: auxMaxPrice },
        { new: true }
      );
    }

    // ? CALCULA EL MAYOR VALOR DENTRO DE UN GRUPO DE MATERIALES CON IGUAL CATEGORIA Y NOMBRE //

    const materialList: IMaterial[] = await Material.find({
      category: materialToUpdate.category,
      materialName: materialToUpdate.materialName
    });
    if (materialList.length == 0) {
      await await Nomenclator.findOneAndDelete({
        category: "Material",
        code: `${materialToUpdate.category} ${materialToUpdate.materialName}`
      });
    } else {
      const prices: number[] = materialList.map((material) => material.costPerUnit);
      const maxPrice: number = Math.max(...prices);

      // ? VERIFICA SI EXISTE UN NOMENCLADOR CON ESA CATEGORIA Y MATERIAL EN LA BD, SI NO EXISTE CREA UNO NUEVO //

      const BDNomenclator = (await Nomenclator.findOne({
        category: "Material",
        code: `${materialToUpdate.category} ${materialToUpdate.materialName}`
      })) as INomenclator;

      if (!BDNomenclator) {
        const newNomenclator = new Nomenclator({
          key: key,
          category: "Material",
          code: `${materialToUpdate.category} ${materialToUpdate.materialName}`,
          value: maxPrice
        });
        await newNomenclator.save();
      } else {
        const updatedNMaterialNomenclator = await Nomenclator.findOneAndUpdate(
          {
            category: "Material",
            code: `${materialToUpdate.category} ${materialToUpdate.materialName}`
          },
          { value: maxPrice },
          { new: true }
        );
        //? MANDA A ACTUALIZAR TODAS LAS TARIFAS EN LA BD
        await updateServiceFeesMaterials(updatedNMaterialNomenclator, await ServiceFee.find());
      }
    }

    return new NextResponse(
      JSON.stringify({
        ok: true,
        updatedMaterial
      }),
      {
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Content-Type": "application/json"
        },
        status: 200
      }
    );
  } catch (error) {
    if (error instanceof Error) {
      console.log("🚀 ~ PUT ~ error:", error);
      return NextResponse.json(
        {
          ok: false,
          message: error.message
        },
        {
          status: 500
        }
      );
    }
  }
}

export async function DELETE(request: NextRequest) {
  const params = request.nextUrl.searchParams;
  const accessToken = request.headers.get("accessToken");

  try {
    if (!accessToken || !verifyJWT(accessToken)) {
      return NextResponse.json(
        {
          ok: false,
          message: "Su sesión ha expirado, por favor autentiquese nuevamente"
        },
        {
          status: 401
        }
      );
    }
    await connectDB();
    const materialToDelete: IMaterial = (await Material.findOne({
      code: params.get("code")
    })) as IMaterial;

    if (!materialToDelete) {
      return NextResponse.json(
        {
          ok: true,
          message: "El material a borrar no existe"
        },
        {
          status: 404
        }
      );
    }

    // ? ACTUALIZA EL VALOR TOTAL DEL ALMACEN SI SE ELIMINA UN MATERIAL //
    const deletedMaterial = (await Material.findOneAndDelete({
      code: params.get("code")
    })) as unknown as IMaterial;
    const DBWarehouse = await Warehouse.findById(params.get("warehouse"));
    let newWarehouseValue = DBWarehouse.totalValue - deletedMaterial.materialTotalValue!;
    await Warehouse.findByIdAndUpdate(params.get("warehouse"), { totalValue: newWarehouseValue });

    // ? CALCULA EL MAYOR VALOR DENTRO DE UN GRUPO DE MATERIALES CON IGUAL CATEGORIA Y NOMBRE //
    const materialList: IMaterial[] = await Material.find({
      category: deletedMaterial.category,
      materialName: deletedMaterial.materialName
    });
    if (materialList.length == 0) {
      await Nomenclator.findOneAndDelete({
        category: "Material",
        code: `${deletedMaterial.category} ${deletedMaterial.materialName}`
      });
    } else {
      const prices: number[] = materialList.map((material) => material.costPerUnit);
      const maxPrice: number = Math.max(...prices);

      // ? VERIFICA SI EXISTE UN NOMENCLADOR CON ESA CATEGORIA Y MATERIAL EN LA BD, SI NO EXISTE CREA UNO NUEVO //
      const updatedNMaterialNomenclator = await Nomenclator.findOneAndUpdate(
        {
          category: "Material",
          code: `${deletedMaterial.category} ${deletedMaterial.materialName}`
        },
        { value: maxPrice },
        { new: true }
      );
      //? MANDA A ACTUALIZAR TODAS LAS TARIFAS EN LA BD
      await updateServiceFeesMaterials(updatedNMaterialNomenclator, await ServiceFee.find());
    }
    return new NextResponse(
      JSON.stringify({
        ok: true,
        deletedMaterial
      }),
      {
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Content-Type": "application/json"
        },
        status: 200
      }
    );
  } catch (error) {
    if (error instanceof Error) {
      console.log("🚀 ~ DELETE ~ error:", error);
      return NextResponse.json(
        {
          ok: false,
          message: error.message
        },
        {
          status: 500
        }
      );
    }
  }
}

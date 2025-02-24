import { and, eq, max, sum } from "drizzle-orm";
import { db } from "@/db/drizzle";
import { NextRequest, NextResponse } from "next/server";
import jwt, { JwtPayload } from "jsonwebtoken";

import { InsertMaterial } from "@/types/DTOs/materials/materials";
import { Material, materials, serviceFeeMaterialNomenclators, stockMovements, warehouse } from "@/db/migrations/schema";
import { updateServiceFeesMaterials } from "@/helpers/udpateServiceFeesFunctions";
import { verifyJWT } from "@/libs/jwt";
import logger from "@/utils/logger";

export async function POST(request: NextRequest) {
  const { ...materialToCreate }: InsertMaterial = await request.json();
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

    const decoded = jwt.decode(accessToken) as JwtPayload;
    logger.info("Crear Material", { method: request.method, url: request.url, user: decoded.userName });

    const materialExist = await db
      .select()
      .from(materials)
      .where(
        and(
          eq(materials.name, materialToCreate.name),
          eq(materials.category, materialToCreate.category),
          eq(materials.costPerUnit, materialToCreate.costPerUnit),
          eq(materials.description, materialToCreate.description)
        )
      );

    if (materialExist.length > 0) {
      await updateExistingMaterial(materialExist[0], materialToCreate, decoded.userName);
    } else {
      await addNewMaterial(materialToCreate, decoded.userName);
    }
    return new NextResponse(
      JSON.stringify({
        ok: true
      }),
      {
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Content-Type": "application/json"
        },
        status: 200
      }
    );

    // // ? SI YA EXISTE UN MATERIAL CON ESE CODIGO, SUSTRAE LA CANTIDAD QUE SE ESTA EN ENTRANDO AL TOTAL Y AGREGA LA NUEVA OPERACION A LA LISTA DE OPERACIONES DEL MATERIAL YA EXISTENTE //
    // if (BDMaterial && material?.operation.tipo === "Sustraer") {
    //   let newTotal = BDMaterial.unitsTotal - material?.operation?.amount;
    //   let newTotalValue = BDMaterial.materialTotalValue! - material?.operation?.amount * BDMaterial.costPerUnit;
    //   if (newTotal < 0) {
    //     return NextResponse.json(
    //       {
    //         ok: false,
    //         message: "No hay existencias suficientes para extraer esa cantidad de material"
    //       },
    //       {
    //         status: 500
    //       }
    //     );
    //   } else {
    //     // ? SI LAS EXISTENCIAS DESPUES DE EXTRAER EL MATERIAL ES CERO ELIMINA EL MATERIAL //
    //     if (newTotal === 0) {
    //       let code = BDMaterial.code;
    //       let deletedMaterial: IMaterial = (await Material.findOneAndDelete({ code })) as unknown as IMaterial;

    //       const materialList: IMaterial[] = await Material.find({
    //         category: deletedMaterial?.category,
    //         materialName: deletedMaterial?.materialName
    //       });
    //       if (materialList.length == 0) {
    //         await Nomenclator.findOneAndDelete({
    //           category: "Material",
    //           code: `${deletedMaterial?.category} ${deletedMaterial?.materialName}`
    //         });
    //       }
    //       const prices = materialList.map((material) => material.costPerUnit);
    //       const maxPrice = Math.max(...prices);

    //       // ? VERIFICA SI EXISTE UN NOMENCLADOR CON ESA CATEGORIA Y MATERIAL EN LA BD, SI NO EXISTE CREA UN NUEVO //

    //       await Nomenclator.findOneAndUpdate(
    //         {
    //           category: "Material",
    //           code: `${deletedMaterial?.category} ${deletedMaterial?.materialName}`
    //         },
    //         { value: maxPrice },
    //         { new: true }
    //       );

    //       let DBWarehouse = await Warehouse.findById(material?.warehouse);
    //       let newWarehouseValue = DBWarehouse?.totalValue - deletedMaterial?.materialTotalValue!;
    //       await Warehouse.findByIdAndUpdate(material?.warehouse, { totalValue: newWarehouseValue });

    //       return NextResponse.json(
    //         {
    //           ok: true,
    //           message: "Material eliminado"
    //         },
    //         {
    //           status: 200
    //         }
    //       );
    //     }
    //   }
    //   let updatedMaterial = await Material.findOneAndUpdate(
    //     {
    //       materialName: material?.materialName,
    //       category: material?.category,
    //       costPerUnit: material?.costPerUnit,
    //       description: material?.description
    //     },
    //     {
    //       $push: { operations: material?.operation },
    //       unitsTotal: newTotal,
    //       materialTotalValue: newTotalValue
    //     },
    //     { new: true }
    //   );

    //   // ? ACTUALIZA EL VALOR TOTAL DEL ALMACEN //

    //   const DBWarehouse = await Warehouse.findById(material.warehouse);
    //   let newWarehouseValue = DBWarehouse.totalValue - material?.operation?.amount * material?.costPerUnit;
    //   await Warehouse.findByIdAndUpdate(material?.warehouse, { totalValue: newWarehouseValue });

    //   return new NextResponse(
    //     JSON.stringify({
    //       ok: true,
    //       updatedMaterial
    //     }),
    //     {
    //       headers: {
    //         "Access-Control-Allow-Origin": "*",
    //         "Content-Type": "application/json"
    //       },
    //       status: 200
    //     }
    //   );
    // }

    // await updateServiceFeesMaterials(updatedMaterialNomenclator, await ServiceFee.find());
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

// export async function GET(request: NextRequest) {
//   const accessToken = request.headers.get("accessToken");
//   try {
//     if (!accessToken || !verifyJWT(accessToken)) {
//       return NextResponse.json(
//         {
//           ok: false,
//           message: "Su sesión ha expirado, por favor autentiquese nuevamente"
//         },
//         {
//           status: 401
//         }
//       );
//     }
//     await connectDB();
//     const listOfMaterials = (await Material.find()).reverse();

//     return new NextResponse(
//       JSON.stringify({
//         ok: true,
//         listOfMaterials
//       }),
//       {
//         headers: {
//           "Access-Control-Allow-Origin": "*",
//           "Content-Type": "application/json"
//         },
//         status: 200
//       }
//     );
//   } catch (error) {
//     if (error instanceof Error) {
//       console.log("🚀 ~ GET ~ error:", error);
//       return NextResponse.json(
//         {
//           ok: false,
//           message: error.message
//         },
//         {
//           status: 500
//         }
//       );
//     }
//   }
// }

// export async function PUT(request: NextRequest) {
//   const { code = "", description = "", materialName = "", minimumExistence = 1 } = await request.json();
//   const accessToken = request.headers.get("accessToken");
//   const key = generateRandomString(26);

//   try {
//     if (!accessToken || !verifyJWT(accessToken)) {
//       return NextResponse.json(
//         {
//           ok: false,
//           message: "Su sesión ha expirado, por favor autentiquese nuevamente"
//         },
//         {
//           status: 401
//         }
//       );
//     }
//     await connectDB();

//     const materialToUpdate: IMaterial = (await Material.findOne({ code })) as IMaterial;

//     if (!materialToUpdate) {
//       return NextResponse.json({
//         ok: false,
//         message: "El material a actualizar no existe"
//       });
//     }

//     const updatedMaterial = (await Material.findOneAndUpdate(
//       { code },
//       { materialName, minimumExistence, description },
//       { new: true }
//     )) as IMaterial;

//     // ? CALCULA EL MAYOR VALOR DENTRO DE UN GRUPO DE MATERIALES CON IGUAL CATEGORIA Y NOMBRE //

//     const auxMaterialList: IMaterial[] = await Material.find({
//       category: updatedMaterial.category,
//       materialName: updatedMaterial.materialName
//     });
//     const auxPrices = auxMaterialList.map((material) => material.costPerUnit);
//     const auxMaxPrice = Math.max(...auxPrices);

//     // ? VERIFICA SI EXISTE UN NOMENCLADOR CON ESA CATEGORIA Y MATERIAL EN LA BD, SI NO EXISTE CREA UNO NUEVO //

//     const updatedMaterialNomenclator = (await Nomenclator.findOne({
//       category: "Material",
//       code: `${updatedMaterial.category} ${updatedMaterial.materialName}`
//     })) as INomenclator;

//     if (!updatedMaterialNomenclator) {
//       const newNomenclator = new Nomenclator({
//         key: key,
//         category: "Material",
//         code: `${updatedMaterial.category} ${updatedMaterial.materialName}`,
//         value: auxMaxPrice
//       });
//       await newNomenclator.save();
//     } else {
//       await Nomenclator.findOneAndUpdate(
//         {
//           category: "Material",
//           code: `${updatedMaterial.category} ${updatedMaterial.materialName}`
//         },
//         { value: auxMaxPrice },
//         { new: true }
//       );
//     }

//     // ? CALCULA EL MAYOR VALOR DENTRO DE UN GRUPO DE MATERIALES CON IGUAL CATEGORIA Y NOMBRE //

//     const materialList: IMaterial[] = await Material.find({
//       category: materialToUpdate.category,
//       materialName: materialToUpdate.materialName
//     });
//     if (materialList.length == 0) {
//       await await Nomenclator.findOneAndDelete({
//         category: "Material",
//         code: `${materialToUpdate.category} ${materialToUpdate.materialName}`
//       });
//     } else {
//       const prices: number[] = materialList.map((material) => material.costPerUnit);
//       const maxPrice: number = Math.max(...prices);

//       // ? VERIFICA SI EXISTE UN NOMENCLADOR CON ESA CATEGORIA Y MATERIAL EN LA BD, SI NO EXISTE CREA UNO NUEVO //

//       const BDNomenclator = (await Nomenclator.findOne({
//         category: "Material",
//         code: `${materialToUpdate.category} ${materialToUpdate.materialName}`
//       })) as INomenclator;

//       if (!BDNomenclator) {
//         const newNomenclator = new Nomenclator({
//           key: key,
//           category: "Material",
//           code: `${materialToUpdate.category} ${materialToUpdate.materialName}`,
//           value: maxPrice
//         });
//         await newNomenclator.save();
//       } else {
//         const updatedNMaterialNomenclator = await Nomenclator.findOneAndUpdate(
//           {
//             category: "Material",
//             code: `${materialToUpdate.category} ${materialToUpdate.materialName}`
//           },
//           { value: maxPrice },
//           { new: true }
//         );
//         //? MANDA A ACTUALIZAR TODAS LAS TARIFAS EN LA BD
//         await updateServiceFeesMaterials(updatedNMaterialNomenclator, await ServiceFee.find());
//       }
//     }

//     return new NextResponse(
//       JSON.stringify({
//         ok: true,
//         updatedMaterial
//       }),
//       {
//         headers: {
//           "Access-Control-Allow-Origin": "*",
//           "Content-Type": "application/json"
//         },
//         status: 200
//       }
//     );
//   } catch (error) {
//     if (error instanceof Error) {
//       console.log("🚀 ~ PUT ~ error:", error);
//       return NextResponse.json(
//         {
//           ok: false,
//           message: error.message
//         },
//         {
//           status: 500
//         }
//       );
//     }
//   }
// }

// export async function DELETE(request: NextRequest) {
//   const params = request.nextUrl.searchParams;
//   const accessToken = request.headers.get("accessToken");

//   try {
//     if (!accessToken || !verifyJWT(accessToken)) {
//       return NextResponse.json(
//         {
//           ok: false,
//           message: "Su sesión ha expirado, por favor autentiquese nuevamente"
//         },
//         {
//           status: 401
//         }
//       );
//     }
//     await connectDB();
//     const materialToDelete: IMaterial = (await Material.findOne({
//       code: params.get("code")
//     })) as IMaterial;

//     if (!materialToDelete) {
//       return NextResponse.json(
//         {
//           ok: true,
//           message: "El material a borrar no existe"
//         },
//         {
//           status: 404
//         }
//       );
//     }

//     // ? ACTUALIZA EL VALOR TOTAL DEL ALMACEN SI SE ELIMINA UN MATERIAL //
//     // TODO: Revisar
//     const deletedMaterial = (await Material.findOneAndDelete({
//       code: params.get("code")
//     })) as unknown as IMaterial;
//     const DBWarehouse = await Warehouse.findById(params.get("warehouse"));
//     let newWarehouseValue = DBWarehouse.totalValue - deletedMaterial.materialTotalValue!;
//     await Warehouse.findByIdAndUpdate(params.get("warehouse"), { totalValue: newWarehouseValue });

//     // ? CALCULA EL MAYOR VALOR DENTRO DE UN GRUPO DE MATERIALES CON IGUAL CATEGORIA Y NOMBRE //
//     const materialList: IMaterial[] = await Material.find({
//       category: deletedMaterial.category,
//       materialName: deletedMaterial.materialName
//     });
//     if (materialList.length == 0) {
//       await Nomenclator.findOneAndDelete({
//         category: "Material",
//         code: `${deletedMaterial.category} ${deletedMaterial.materialName}`
//       });
//     } else {
//       const prices: number[] = materialList.map((material) => material.costPerUnit);
//       const maxPrice: number = Math.max(...prices);

//       // ? VERIFICA SI EXISTE UN NOMENCLADOR CON ESA CATEGORIA Y MATERIAL EN LA BD, SI NO EXISTE CREA UNO NUEVO //
//       const updatedNMaterialNomenclator = await Nomenclator.findOneAndUpdate(
//         {
//           category: "Material",
//           code: `${deletedMaterial.category} ${deletedMaterial.materialName}`
//         },
//         { value: maxPrice },
//         { new: true }
//       );
//       //? MANDA A ACTUALIZAR TODAS LAS TARIFAS EN LA BD
//       await updateServiceFeesMaterials(updatedNMaterialNomenclator, await ServiceFee.find());
//     }
//     return new NextResponse(
//       JSON.stringify({
//         ok: true,
//         deletedMaterial
//       }),
//       {
//         headers: {
//           "Access-Control-Allow-Origin": "*",
//           "Content-Type": "application/json"
//         },
//         status: 200
//       }
//     );
//   } catch (error) {
//     if (error instanceof Error) {
//       console.log("🚀 ~ DELETE ~ error:", error);
//       return NextResponse.json(
//         {
//           ok: false,
//           message: error.message
//         },
//         {
//           status: 500
//         }
//       );
//     }
//   }
// }

/**
 * @abstract: Funcion que actualiza el stock de un material existente
 * @param {Material} materialToUpdate: Material que se va a actualizar
 * @param {InsertMaterial} materialToInsert: Material que se esta insertando y conincide con el existente
 */
const updateExistingMaterial = async (materialToUpdate: Material, materialToInsert: InsertMaterial, userName: string) => {
  const newStock = (materialToUpdate.stock += materialToInsert?.stock); // Calcula el nuevo stock
  const newTotalValue = materialToUpdate?.stock * materialToUpdate?.costPerUnit; // Calcula el nuevo totalValue
  const quantityChange = Math.abs(materialToInsert?.stock - materialToUpdate?.stock);

  // ? ACTUALIZA EL VALOR TOTAL DEL MATERIAL EXISTENTE //
  const updatedMaterial = await db
    .update(materials)
    .set({
      ...materialToUpdate,
      stock: newStock,
      totalValue: newTotalValue
    })
    .where(eq(materials.id, materialToUpdate.id))
    .returning();

  // ? ACTUALIZA EL NOMENCLADOR CON EL NUEVO COSTO MAXIMO//
  const maxCostPerUnit = await calculateMaxMaterialCostPerUnit(materialToInsert.category, materialToInsert.name);
  await db
    .update(serviceFeeMaterialNomenclators)
    .set({
      costPerUnit: maxCostPerUnit!
    })
    .where(eq(serviceFeeMaterialNomenclators.id, updatedMaterial[0].serviceFeeMaterialNomenclatorId!));

  // ? REGISRA UN MOVIMIENTO DE INVENTARIO //
  await db.insert(stockMovements).values({
    materialId: materialToUpdate.id,
    quantityChange: quantityChange,
    movementType: "ADDED",
    notes: `Se ha añadido ${materialToInsert?.stock} unidades de ${materialToUpdate?.category} ${materialToUpdate?.name}`,
    userId: userName
  });

  // ? ACTUALIZA EL VALOR TOTAL DEL ALMACEN //
  const newWarehouseValue = await db
    .select({ totalAmount: sum(materials.totalValue) })
    .from(materials)
    .where(eq(materials.warehouseId, materialToUpdate.warehouseId));

  await db
    .update(warehouse)
    .set({ totalValue: Number(newWarehouseValue[0].totalAmount) })
    .where(eq(warehouse.id, materialToUpdate.warehouseId))
    .returning();
};

/**
 * @abstract: Funcion que anade un material nuevo
 * @param {InsertMaterial} materialToInsert: Material que se esta insertando
 */
const addNewMaterial = async (materialToInsert: InsertMaterial, userName: string) => {
  /**
   *  1. Verificar si existe un nomenclador con esa combinacion de categoria y nombre
   *  2. Si existe, actualizar el costo por unidad
   *  3. Si no existe, crear un nuevo nomenclador
   */

  //? CALCULA EL DISPLAY_NAME DEL NOMENCLADOR PARA BUSCAR EN LA BD//
  const code = `${materialToInsert.category} ${materialToInsert.name}`.trim().toLowerCase();

  const nomenclatorExist = await db
    .select()
    .from(serviceFeeMaterialNomenclators)
    .where(and(eq(serviceFeeMaterialNomenclators.code, code)));

  if (nomenclatorExist.length > 0) {
    const maxCostPerUnit = await calculateMaxMaterialCostPerUnit(materialToInsert.category, materialToInsert.name);

    // ? ACTUALIZA EL NOMENCLADOR CON EL NUEVO COSTO MAXIMO//
    await db
      .update(serviceFeeMaterialNomenclators)
      .set({
        costPerUnit: maxCostPerUnit!
      })
      .where(eq(serviceFeeMaterialNomenclators.id, nomenclatorExist[0].id));
  } else {
    // ? CREA UN NUEVO NOMENCLADOR //
    await db.insert(serviceFeeMaterialNomenclators).values({
      code: code,
      displayName: `${materialToInsert.category} ${materialToInsert.name}`,
      costPerUnit: materialToInsert.costPerUnit,
      unitMeasure: materialToInsert.unitMeasure
    });
  }

  // ?  BUSCA EL NOMENCLADOR PARA ASOCIARLO AL MATERIAL //
  const newNomenclator = await db.select().from(serviceFeeMaterialNomenclators).where(eq(serviceFeeMaterialNomenclators.code, code));

  // ? ANADE EL NUEVO MATERIAL Y LO VINCULA A ESE NOMENCLADOR //
  const newMaterial = await db
    .insert(materials)
    .values({
      ...materialToInsert,
      serviceFeeMaterialNomenclatorId: newNomenclator[0].id,
      totalValue: materialToInsert.costPerUnit * materialToInsert.stock
    })
    .returning();

  const maxCostPerUnit = await calculateMaxMaterialCostPerUnit(materialToInsert.category, materialToInsert.name);

  // ? ACTUALIZA EL NOMENCLADOR CON EL NUEVO COSTO MAXIMO//
  await db
    .update(serviceFeeMaterialNomenclators)
    .set({
      costPerUnit: maxCostPerUnit!
    })
    .where(eq(serviceFeeMaterialNomenclators.id, newNomenclator[0].id));

  // ? REGISRA UN MOVIMIENTO DE INVENTARIO //
  await db.insert(stockMovements).values({
    materialId: newMaterial[0].id,
    quantityChange: newMaterial[0].stock,
    movementType: "ADDED",
    notes: `Se ha añadido un nuevo material :${newMaterial[0]?.category} ${newMaterial[0]?.name}`, 
    userId: userName
  });

  // ? ACTUALIZA EL VALOR TOTAL DEL ALMACEN //
  const newWarehouseValue = await db
    .select({ totalAmount: sum(materials.totalValue) })
    .from(materials)
    .where(eq(materials.warehouseId, newMaterial[0].warehouseId));

  await db
    .update(warehouse)
    .set({ totalValue: Number(newWarehouseValue[0].totalAmount) })
    .where(eq(warehouse.id, newMaterial[0].warehouseId));
};

/**
 * @abstract: Calcula el costo maximo de un material
 * @param {string} category: Categoria del material
 * @param {string} name: Nombre del material
 */
const calculateMaxMaterialCostPerUnit = async (category: string, name: string) => {
  const materialExist = await db
    .select()
    .from(materials)
    .where(and(eq(materials.name, name), eq(materials.category, category)));

  if (materialExist.length > 0) {
    const filteredMax = await db
      .select({
        maxCostPerUnit: max(materials.costPerUnit)
      })
      .from(materials)
      .where(and(eq(materials.name, name), eq(materials.category, category)))
      .groupBy(materials.category, materials.name);
      return filteredMax[0].maxCostPerUnit;
  }else{
    return null;
  }
};

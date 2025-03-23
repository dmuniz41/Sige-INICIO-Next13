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
    materialId: updatedMaterial[0].id,
    warehouseId: materialToInsert.warehouseId,
    quantityChange: quantityChange,
    movementType: "ADDED",
    notes: `Se ha añadido ${materialToInsert?.stock} unidades de ${materialToUpdate?.category} ${materialToUpdate?.name}`,
    userName: userName
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
    warehouseId: newMaterial[0].warehouseId,
    quantityChange: newMaterial[0].stock,
    movementType: "ADDED",
    notes: `Se ha añadido un nuevo material :${newMaterial[0]?.category} ${newMaterial[0]?.name}`,
    userName: userName
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
  } else {
    return null;
  }
};

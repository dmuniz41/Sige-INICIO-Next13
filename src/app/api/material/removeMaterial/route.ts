import { and, eq, max, sum } from "drizzle-orm";
import { db } from "@/db/drizzle";
import { NextRequest, NextResponse } from "next/server";
import jwt, { JwtPayload } from "jsonwebtoken";

import { RemoveMaterial } from "@/types/DTOs/materials/materials";
import { Material, materials, serviceFeeMaterialNomenclators, stockMovements, warehouse } from "@/db/migrations/schema";
import { updateServiceFeesMaterials } from "@/helpers/udpateServiceFeesFunctions";
import { verifyJWT } from "@/libs/jwt";
import logger from "@/utils/logger";

export async function POST(request: NextRequest) {
  const { ...materialToRemove }: RemoveMaterial = await request.json();
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
    logger.info("Remover Material", { method: request.method, url: request.url, user: decoded.userName });

    const materialExist = await db
      .select()
      .from(materials)
      .where(and(eq(materials.warehouseId, materialToRemove.warehouseId), eq(materials.id, materialToRemove.id)));

    if (materialExist.length > 0) {
      if (materialExist[0].stock < materialToRemove.amount) {
        return new NextResponse(
          JSON.stringify({
            ok: false,
            message: `No hay suficiente stock para remover ${materialToRemove.amount} unidades`
          }),
          {
            headers: {
              "Access-Control-Allow-Origin": "*",
              "Content-Type": "application/json"
            },
            status: 400
          }
        );
      }
      await updateExistingMaterial(materialExist[0], materialToRemove.amount, decoded.userName);
    } else {
      return new NextResponse(
        JSON.stringify({
          ok: false,
          message: `No existe material con id: ${materialToRemove.id}`
        }),
        {
          headers: {
            "Access-Control-Allow-Origin": "*",
            "Content-Type": "application/json"
          },
          status: 404
        }
      );
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
 * @abstract: Funcion que actualiza el stock de un material existente durante la accion de remover material
 * @param {Material} materialToUpdate: Material que se va a actualizar
 * @param {InsertMaterial} materialToInsert: Material que se esta insertando y conincide con el existente
 */
const updateExistingMaterial = async (materialToUpdate: Material, amountToRemove: number, userName: string) => {
  const newStock = (materialToUpdate.stock -= amountToRemove); // Calcula el nuevo stock
  const newTotalValue = materialToUpdate?.stock * materialToUpdate?.costPerUnit; // Calcula el nuevo totalValue

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
  const maxCostPerUnit = await calculateMaxMaterialCostPerUnit(materialToUpdate.category, materialToUpdate.name);
  await db
    .update(serviceFeeMaterialNomenclators)
    .set({
      costPerUnit: maxCostPerUnit!
    })
    .where(eq(serviceFeeMaterialNomenclators.id, updatedMaterial[0].serviceFeeMaterialNomenclatorId!));

  // ? REGISRA UN MOVIMIENTO DE INVENTARIO //
  await db.insert(stockMovements).values({
    materialId: materialToUpdate.id,
    quantityChange: amountToRemove,
    movementType: "REMOVED",
    notes: `Se han removido ${amountToRemove} unidades de ${materialToUpdate?.category} ${materialToUpdate?.name}`,
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

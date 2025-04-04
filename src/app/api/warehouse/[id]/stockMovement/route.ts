import { desc, eq } from "drizzle-orm";
import { JwtPayload } from "jsonwebtoken";
import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";

import { db } from "@/db/drizzle";
import { InsertStockMovement } from "@/types/DTOs/stockMovements/stockMovement";
import { materials, materialStockMovementsView, stockMovements, warehouse } from "@/db/migrations/schema";
import { verifyJWT } from "@/libs/jwt";
import logger from "@/utils/logger";

export async function GET(request: NextRequest, { params }: { params: { id: number } }) {
  const warehouseId = params.id;
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
    logger.info("Listar movimientos de inventario", { method: request.method, url: request.url, user: decoded.userName });

    const { searchParams } = new URL(request.url);
    const stockMovementId = parseInt(searchParams.get("stockMovementId")!);
    const page = parseInt(searchParams.get("page") || "1", 10); // Default to page 1
    const limit = parseInt(searchParams.get("limit") || "10", 10); // Default to 10 items per page

    // ? SI VIENE EL PARAMETRO stockMovementId BUSCA EL MOVIMIENTO EN LA BASE DE DATOS
    if (stockMovementId) {
      const DBStockMovement = await db
        .select()
        .from(materialStockMovementsView)
        .where(eq(materialStockMovementsView.movementId, stockMovementId));
      if (DBStockMovement.length === 0) {
        return NextResponse.json(
          {
            ok: false,
            message: `No existe movimiento de inventario con id:${stockMovementId}`
          },
          {
            status: 404
          }
        );
      } else {
        return new NextResponse(
          JSON.stringify({
            ok: true,
            data: DBStockMovement[0]
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
    }
    if (isNaN(page) || isNaN(limit) || page < 1 || limit < 1) {
      return NextResponse.json(
        {
          ok: false,
          message: "Parámetros de paginacion inválidos. 'page' y 'limit' deben ser mayor a 0."
        },
        {
          status: 400
        }
      );
    }

    const offset = (page - 1) * limit;
    const paginatedData = await db
      .select()
      .from(materialStockMovementsView)
      .where(eq(materialStockMovementsView.warehouseId, warehouseId))
      .orderBy(desc(materialStockMovementsView.movementDate))
      .limit(limit)
      .offset(offset);
    const totalCount = await db.$count(materialStockMovementsView);

    return new NextResponse(
      JSON.stringify({
        ok: true,
        counter: paginatedData.length,
        total: totalCount,
        page,
        limit,
        data: paginatedData
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
      logger.error("Error al listar los movimientos de inventario", {
        error: error.message,
        stack: error.stack,
        route: "/api/material/[warehouseId]",
        method: "GET"
      });
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

export async function POST(request: NextRequest) {
  const { ...stockMovementToCreate }: InsertStockMovement = await request.json();
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
    logger.info("Crear Movimiento de Inventario", { method: request.method, url: request.url, user: decoded.userName, requestBody: request.body });

    // * VALIDA QUE LA CANTIDAD A AÑADIR NO SEA NEGATIVA * //
    if (stockMovementToCreate.quantityChange < 0) {
      return NextResponse.json(
        {
          ok: false,
          message: `La cantidad a añadir debe ser mayor a 0`
        },
        {
          status: 400
        }
      );
    }

    // * BUSCA EL MATERIAL AL QUE SE LE VA A HACER EL MOVIMIENTO DE INVENTARIO * //
    const DBmaterial = await db.select().from(materials).where(eq(materials.id, stockMovementToCreate.materialId));
    if (DBmaterial.length === 0) {
      return NextResponse.json(
        {
          ok: false,
          message: `No existe material con id:${stockMovementToCreate.materialId}`
        },
        {
          status: 404
        }
      );
    }

    // * BUSCA EL ALMACEN AL QUE SE LE VA A HACER EL MOVIMIENTO DE INVENTARIO * //
    const DBWarehouse = await db.select().from(warehouse).where(eq(warehouse.id, stockMovementToCreate.warehouseId));
    if (DBWarehouse.length === 0) {
      return NextResponse.json(
        {
          ok: false,
          message: `No existe almacén con id:${stockMovementToCreate.warehouseId}`
        },
        {
          status: 404
        }
      );
    }

    // * EJECUTA EL MOVIMIENTO EN DEPENDENCIA DE SU TIPO * //
    if (stockMovementToCreate.movementType === "ADDED") {
      await db
        .update(materials)
        .set({ ...DBmaterial[0], stock: DBmaterial[0].stock + stockMovementToCreate.quantityChange })
        .where(eq(materials.id, stockMovementToCreate.materialId));

      // * ACTUALIZA EL VALOR DEL ALMACEN * //
      await db
        .update(warehouse)
        .set({
          ...DBWarehouse[0],
          totalValue: DBWarehouse[0].totalValue + stockMovementToCreate.quantityChange * DBmaterial[0].costPerUnit
        })
        .where(eq(warehouse.id, stockMovementToCreate.warehouseId));
    } else if (stockMovementToCreate.movementType === "REMOVED") {
      if (DBmaterial[0].stock < stockMovementToCreate.quantityChange) {
        return NextResponse.json(
          {
            ok: false,
            message: `No hay suficiente inventario para realizar el movimiento`
          },
          {
            status: 400
          }
        );
      } else {
        await db
          .update(materials)
          .set({ ...DBmaterial[0], stock: DBmaterial[0].stock - stockMovementToCreate.quantityChange })
          .where(eq(materials.id, stockMovementToCreate.materialId));

        // * ACTUALIZA EL VALOR DEL ALMACEN * //
        await db
          .update(warehouse)
          .set({
            ...DBWarehouse[0],
            totalValue: DBWarehouse[0].totalValue - stockMovementToCreate.quantityChange * DBmaterial[0].costPerUnit
          })
          .where(eq(warehouse.id, stockMovementToCreate.warehouseId));
      }
    }

    // * REGISTRA EL MOVIMIENTO DE INVENTARIO * //
    const newStockMovement = await db
      .insert(stockMovements)
      .values({ ...stockMovementToCreate, movementDate: new Date(), userName: decoded.userName, unitMeasure: DBmaterial[0].unitMeasure })
      .returning();

    return new NextResponse(
      JSON.stringify({
        ok: true,
        data: newStockMovement
      }),
      {
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Content-Type": "application/json"
        }
      }
    );
  } catch (error) {
    if (error instanceof Error) {
      logger.error("Error al crear el movimiento de inventario", {
        error: error.message,
        stack: error.stack,
        route: "/api/warehouse/[id]/stockMovement",
        method: "POST"
      });
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

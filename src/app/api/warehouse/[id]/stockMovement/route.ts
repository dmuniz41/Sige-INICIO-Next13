import { desc, eq } from "drizzle-orm";
import { JwtPayload } from "jsonwebtoken";
import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";

import { db } from "@/db/drizzle";
import { stockMovements } from "@/db/migrations/schema";
import { verifyJWT } from "@/libs/jwt";
import logger from "@/utils/logger";

export async function GET(request: NextRequest, { params }: { params: { warehouseId: number } }) {
  const warehouseId = params.warehouseId;
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

    // ? SI VIENE EL PARAMETRO MATERIALID BUSCA EL MATERIAL EN LA BASE DE DATOS
    if (stockMovementId) {
      const DBStockMovement = await db.select().from(stockMovements).where(eq(stockMovements.id, stockMovementId));
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
      .from(stockMovements)
      .where(eq(stockMovements.warehouseId, warehouseId))
      .orderBy(desc(stockMovements.id))
      .limit(limit)
      .offset(offset);
    const totalCount = await db.$count(stockMovements);

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

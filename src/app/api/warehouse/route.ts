import { db } from "@/db/drizzle";
import { eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";
import jwt, { JwtPayload } from "jsonwebtoken";

import { InsertWarehouse } from "@/types/DTOs/warehouse/warehouse";
import { verifyJWT } from "@/libs/jwt";
import { warehouse } from "@/db/migrations/schema";
import logger from "@/utils/logger";

export async function POST(request: NextRequest) {
  const { ...warehouseToCreate }: InsertWarehouse = await request.json();
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
    logger.info("Crear Alamcen", { method: request.method, url: request.url, user: decoded.userName });

    // await connectDB();
    // const BDWarehouse = await Warehouse.findOne({ name: warehouse.name });

    const DBWarehouse = await db.select().from(warehouse).where(eq(warehouse.name, warehouseToCreate.name));

    if (DBWarehouse.length > 0) {
      return NextResponse.json(
        {
          ok: false,
          message: "Ya existe un almacén con ese nombre"
        },
        {
          status: 409
        }
      );
    }

    // const newWarehouse = new Warehouse({
    //   ...warehouse,
    //   totalValue: 0,
    //   key: warehouse.name
    // });

    // await newWarehouse.save();

    const newWarehouse = await db
      .insert(warehouse)
      .values({ ...warehouseToCreate, totalValue: 0 })
      .returning();

    return new NextResponse(
      JSON.stringify({
        ok: true,
        data: newWarehouse
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
      logger.error("Error al crear almacen", {
        error: error.message,
        stack: error.stack,
        route: "/api/warehouse",
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

    const decoded = jwt.decode(accessToken) as JwtPayload;
    logger.info("Listar Almacenes", { method: request.method, url: request.url, user: decoded.userName });

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1", 10); // Default to page 1
    const limit = parseInt(searchParams.get("limit") || "10", 10); // Default to 10 items per page

    // await connectDB();
    // const listOfWarehouses = (await Warehouse.find()).reverse();

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
    const paginatedData = await db.select().from(warehouse).orderBy(warehouse.name).limit(limit).offset(offset);
    const totalCount = await db.$count(warehouse);

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
        }
      }
    );
  } catch (error) {
    if (error instanceof Error) {
      logger.error("Error al listar almacenes", {
        error: error.message,
        stack: error.stack,
        route: "/api/warehouse",
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

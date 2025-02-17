import { db } from "@/db/drizzle";
import { eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";
import jwt, { JwtPayload } from "jsonwebtoken";

import { verifyJWT } from "@/libs/jwt";
import { warehouse } from "@/db/migrations/schema";
import logger from "@/utils/logger";
import { UpdateWarehouse } from "@/types/DTOs/warehouse/warehouse";

export async function GET(request: NextRequest, { params }: { params: { id: number } }) {
  const id = params.id;
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
    logger.info("Obtener almacen por id", { method: request.method, url: request.url, user: decoded.userName });

    const DBWarehouse = await db.select().from(warehouse).where(eq(warehouse.id, id));

    if (DBWarehouse.length === 0) {
      return NextResponse.json(
        {
          ok: false,
          message: `No existe el almacén con el id: ${id}`
        },
        {
          status: 404
        }
      );
    }
    // await connectDB();
    // const listOfWarehouses = (await Warehouse.find()).reverse();

    return new NextResponse(
      JSON.stringify({
        ok: true,
        data: DBWarehouse
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
      logger.error("Error al obtener almacen", {
        error: error.message,
        stack: error.stack,
        route: "/api/warehouse/[id]",
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

export async function PUT(request: NextRequest, { params }: { params: { id: number } }) {
  const id = params.id;
  const { ...warehouseToUpdate }: UpdateWarehouse = await request.json();
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
    logger.info("Actualizar Almacen", { method: request.method, url: request.url, user: decoded.userName });

    const warehouseToUpdateExist = await db.select().from(warehouse).where(eq(warehouse.id, id));

    if (warehouseToUpdateExist.length === 0) {
      return NextResponse.json(
        {
          ok: false,
          message: "El almacen a actualizar no existe"
        },
        {
          status: 404
        }
      );
    }

    const updatedWarehouse = await db.update(warehouse).set(warehouseToUpdate).where(eq(warehouse.id, id)).returning();

    return new NextResponse(
      JSON.stringify({
        ok: true,
        data: updatedWarehouse
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
      logger.error("Error al eliminar almacen", {
        error: error.message,
        stack: error.stack,
        route: "/api/warehouse/[id]",
        method: "DELETE"
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

export async function DELETE(request: NextRequest, { params }: { params: { id: number } }) {
  const id = params.id;
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
    logger.info("Eliminar Almacen", { method: request.method, url: request.url, user: decoded.userName });

    const warehouseToDelete = await db.select().from(warehouse).where(eq(warehouse.id, id));
    if (warehouseToDelete.length === 0) {
      return NextResponse.json(
        {
          ok: true,
          message: "El almacén a borrar no existe"
        },
        {
          status: 404
        }
      );
    }

    const deletedWarehouse = await db.delete(warehouse).where(eq(warehouse.id, id));

    return new NextResponse(
      JSON.stringify({
        ok: true,
        data: deletedWarehouse
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
      logger.error("Error al eliminar almacen", {
        error: error.message,
        stack: error.stack,
        route: "/api/warehouse/[id]",
        method: "DELETE"
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

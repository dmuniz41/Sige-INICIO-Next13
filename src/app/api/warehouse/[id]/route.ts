import { db } from "@/db/drizzle";
import { eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";
import jwt, { JwtPayload } from "jsonwebtoken";

import { UpdateWarehouse } from "@/types/DTOs/warehouse/warehouse";
import { verifyJWT } from "@/libs/jwt";
import { warehouse } from "@/db/migrations/schema";
import getRedisClient from "@/libs/redis";
import logger from "@/utils/logger";

export async function GET(request: NextRequest, { params }: { params: { id: number } }) {
  const id = params.id;
  const accessToken = request.headers.get("accessToken");
  let redisClient;
  const CACHE_EXPIRATION_SECONDS = 10;

  try {
    redisClient = await getRedisClient();
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

    const cacheKey = `warehouse:${id}`;

    // 1. Try to get data from Redis cache
    const cachedData = await redisClient.get(cacheKey);

    if (cachedData) {
      logger.info("Serving Warehouse by id from Redis Cache", {
        cacheKey,
        user: decoded.userName
      });
      return new NextResponse(cachedData, {
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Content-Type": "application/json"
        },
        status: 200
      });
    }

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

    // 3. Store the database result in Redis cache
    await redisClient.set(cacheKey, JSON.stringify(DBWarehouse), { EX: CACHE_EXPIRATION_SECONDS });

    logger.info("Fetched Warehouse by id from DB and cached in Redis", {
      cacheKey,
      user: decoded.userName
    });

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
      logger.error("Error al obtener almacen por id", {
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

  let redisClient;

  try {
    redisClient = await getRedisClient();
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

    // 1. Find all keys that match a pattern
    const keysToDelete = await redisClient.keys("warehouse:*");

    // 2. Delete the found keys
    if (keysToDelete.length > 0) {
      await redisClient.del(keysToDelete);
      logger.info(`Invalidated ${keysToDelete.length} Redis cache keys for warehouse.`);
    } else {
      logger.info("No Redis cache keys found to invalidate for warehouse.");
    }

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
  let redisClient;

  try {
    redisClient = await getRedisClient();
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

    // 1. Find all keys that match a pattern
    const keysToDelete = await redisClient.keys("warehouse:*");

    // 2. Delete the found keys
    if (keysToDelete.length > 0) {
      await redisClient.del(keysToDelete);
      logger.info(`Invalidated ${keysToDelete.length} Redis cache keys for warehouse.`);
    } else {
      logger.info("No Redis cache keys found to invalidate for warehouse.");
    }

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

/**
 * @file This file defines the API routes for managing warehouse data,
 * including creation (POST) and retrieval (GET) operations.
 * It integrates with Drizzle ORM for database interactions,
 * JSON Web Tokens (JWT) for authentication, and Redis for caching.
 */

import { db } from "@/db/drizzle";
import { eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";
import jwt, { JwtPayload } from "jsonwebtoken";

import { InsertWarehouse } from "@/types/DTOs/warehouse/warehouse";
import { verifyJWT } from "@/libs/jwt";
import { warehouse } from "@/db/migrations/schema";
import logger from "@/utils/logger";
import getRedisClient from "@/libs/redis";

/**
 * Handles the POST request to create a new warehouse.
 * Requires an authenticated user with a valid access token.
 * It checks for duplicate warehouse names and invalidates relevant Redis cache keys upon successful creation.
 *
 * @param request The NextRequest object containing the request details.
 * @returns A NextResponse object with the operation's result and status code.
 *
 * @method POST
 * @route /api/warehouse
 * @headers {string} accessToken - The JWT access token for authentication.
 * @body {InsertWarehouse} warehouseToCreate - The data for the new warehouse.
 *
 * @response {200} application/json - Successfully created the warehouse.
 *   {
 *     "ok": true,
 *     "data": [
 *       {
 *         "id": number,
 *         "name": string,
 *         "address": string,
 *         "totalValue": number,
 *         "createdAt": string,
 *         "updatedAt": string
 *       }
 *     ]
 *   }
 * @response {401} application/json - Unauthorized if the access token is missing or invalid.
 *   { "ok": false, "message": "Su sesión ha expirado, por favor autentiquese nuevamente" }
 * @response {409} application/json - Conflict if a warehouse with the given name already exists.
 *   { "ok": false, "message": "Ya existe un almacén con ese nombre" }
 * @response {500} application/json - Internal Server Error if an unexpected error occurs.
 *   { "ok": false, "message": string }
 */
export async function POST(request: NextRequest) {
  const { ...warehouseToCreate }: InsertWarehouse = await request.json();
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
    logger.info("Crear Alamcen", {
      method: request.method,
      url: request.url,
      user: decoded.userName
    });

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

    const newWarehouse = await db
      .insert(warehouse)
      .values({ ...warehouseToCreate, totalValue: 0 })
      .returning();

    // 1. Find all keys that match a pattern
    const keysToDelete = await redisClient.keys("warehouses:*");

    // 2. Delete the found keys
    if (keysToDelete.length > 0) {
      await redisClient.del(keysToDelete);
      logger.info(`Invalidated ${keysToDelete.length} Redis cache keys for warehouses.`);
    } else {
      logger.info("No Redis cache keys found to invalidate for warehouses.");
    }

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

/**
 * Handles the GET request to retrieve a paginated list of warehouses.
 * Supports pagination parameters (page, limit) and an optional name filter.
 * Implements Redis caching to improve performance for frequently requested data.
 *
 * @param request The NextRequest object containing the request details.
 * @returns A NextResponse object with the operation's result and status code.
 *
 * @method GET
 * @route /api/warehouse
 * @headers {string} accessToken - The JWT access token for authentication.
 * @queryParam {number} [page=1] - The page number for pagination.
 * @queryParam {number} [limit=10] - The number of items per page.
 * @queryParam {string} [name=""] - An optional filter to search warehouses by name.
 *
 * @response {200} application/json - Successfully retrieved the list of warehouses.
 *   {
 *     "ok": true,
 *     "counter": number, // Number of items in the current response
 *     "total": number,   // Total number of warehouses in the database
 *     "page": number,    // Current page number
 *     "limit": number,   // Limit per page
 *     "data": [          // Array of warehouse objects
 *       {
 *         "id": number,
 *         "name": string,
 *         "address": string,
 *         "totalValue": number,
 *         "createdAt": string,
 *         "updatedAt": string
 *       },
 *       ...
 *     ]
 *   }
 * @response {401} application/json - Unauthorized if the access token is missing or invalid.
 *   { "ok": false, "message": "Su sesión ha expirado, por favor autentiquese nuevamente" }
 * @response {400} application/json - Bad Request if pagination parameters are invalid.
 *   { "ok": false, "message": "Parámetros de paginacion inválidos. 'page' y 'limit' deben ser mayor a 0." }
 * @response {500} application/json - Internal Server Error if an unexpected error occurs.
 *   { "ok": false, "message": string }
 */
export async function GET(request: NextRequest) {
  const accessToken = request.headers.get("accessToken");
  let redisClient;
  const CACHE_EXPIRATION_SECONDS = 10; // Cache expiration time in seconds

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
    logger.info("Listar Almacenes", {
      method: request.method,
      url: request.url,
      user: decoded.userName
    });

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1", 10); // Default to page 1
    const limit = parseInt(searchParams.get("limit") || "10", 10); // Default to 10 items per page
    const name = searchParams.get("name") ?? "";

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

    const cacheKey = `warehouses:${page}:${limit}:${name}`;

    // 1. Try to get data from Redis cache
    const cachedData = await redisClient.get(cacheKey);

    if (cachedData) {
      logger.info("Serving Warehouses from Redis Cache", {
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

    // Adjust query to include name filtering if 'name' is provided
    const responseData = await db
      .select()
      .from(warehouse)
      .where(name ? eq(warehouse.name, name) : undefined) // Apply name filter if 'name' exists
      .orderBy(warehouse.name)
      .limit(limit)
      .offset(offset);

    // Get total count, potentially with the same filter if 'name' is applied for total count
    const totalCount = await db.$count(warehouse);

    // 3. Store the database result in Redis cache
    await redisClient.set(cacheKey, JSON.stringify(responseData), {
      EX: CACHE_EXPIRATION_SECONDS
    });

    logger.info("Fetched Warehouses from DB and cached in Redis", {
      cacheKey,
      user: decoded.userName
    });

    return new NextResponse(
      JSON.stringify({
        ok: true,
        counter: responseData.length,
        total: totalCount,
        page,
        limit,
        data: responseData
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

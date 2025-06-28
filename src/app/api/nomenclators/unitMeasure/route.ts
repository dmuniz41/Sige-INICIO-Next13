import { and, eq, desc, ilike, isNull } from "drizzle-orm";
import { db } from "@/db/drizzle";
import { NextRequest, NextResponse } from "next/server";
import jwt, { JwtPayload } from "jsonwebtoken";

import { UnitmeasureNomenclator, unitMeasureNomenclators } from "@/db/migrations/schema";
import { verifyJWT } from "@/libs/jwt";
import logger from "@/utils/logger";
import getRedisClient from "@/libs/redis";

export async function POST(request: NextRequest) {
  const { ...requestData }: UnitmeasureNomenclator = await request.json();
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
    logger.info("Crear Nomenclador de Unidad de Medida", {
      method: request.method,
      url: request.url,
      body: request.body,
      user: decoded.userName
    });

    const DBNomenclator = await db
      .select()
      .from(unitMeasureNomenclators)
      .where(
        and(
          isNull(unitMeasureNomenclators.deleted_at), // Ignore deleted nomenclators
          eq(unitMeasureNomenclators.name, requestData.name)
        )
      );

    if (DBNomenclator.length > 0) {
      return NextResponse.json(
        {
          ok: false,
          message: `Ya existe un nomenclador de unidad de medida con el nombre nombre: {${DBNomenclator[0].name}}`
        },
        {
          status: 409
        }
      );
    }

    await db.insert(unitMeasureNomenclators).values({
      name: requestData.name,
      created_at: new Date(),
      updated_at: new Date()
    });

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
  } catch (error) {
    if (error instanceof Error) {
      logger.error("Error al crear nomenclador de unidad de medida", {
        error: error.message,
        stack: error.stack,
        route: "/api/nomenclators/unitMeasure",
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
  let redisClient; // Declare redisClient outside to ensure it's accessible for finally block (if needed)

  try {
    // Get the connected Redis client
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
    logger.info("Listar Nomencladores de Unidades de Medida", {
      method: request.method,
      url: request.url,
      body: request.body,
      user: decoded.userName
    });

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1", 10);
    const limit = parseInt(searchParams.get("limit") || "10", 10);
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

    const cacheKey = `unitMeasures:${page}:${limit}:${name}`;

    // 1. Try to get data from Redis cache
    const cachedData = await redisClient.get(cacheKey);

    if (cachedData) {
      logger.info("Serving Unit Measures from Redis Cache", {
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

    // 2. If not in cache, fetch from database
    const conditions = [];
    conditions.push(isNull(unitMeasureNomenclators.deleted_at));

    if (name) {
      conditions.push(ilike(unitMeasureNomenclators.name, `%${name}%`));
    }

    const whereClause = conditions.length > 0 ? and(...conditions) : undefined;

    const paginatedData = await db
      .select()
      .from(unitMeasureNomenclators)
      .where(whereClause)
      .orderBy(desc(unitMeasureNomenclators.created_at))
      .limit(limit)
      .offset(offset);

    const totalCount = await db.$count(unitMeasureNomenclators);

    const responseData = {
      ok: true,
      total: totalCount,
      totalPages: Math.ceil(totalCount / limit),
      page,
      limit,
      data: paginatedData
    };

    // 3. Store the database result in Redis cache
    const CACHE_EXPIRATION_SECONDS = 300;
    await redisClient.set(
      cacheKey,
      JSON.stringify(responseData),
      { EX: CACHE_EXPIRATION_SECONDS }
    );

    logger.info("Fetched Unit Measures from DB and cached in Redis", {
      cacheKey,
      user: decoded.userName
    });

    return new NextResponse(JSON.stringify(responseData), {
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Content-Type": "application/json"
      },
      status: 200
    });
    
  } catch (error) {
    if (error instanceof Error) {
      logger.error("Error al listar los nomencladores de unidades de medida", {
        error: error.message,
        stack: error.stack,
        route: "/api/nomenclators/unitMeasures",
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
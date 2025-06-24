import { and, eq, desc, ilike, isNull } from "drizzle-orm";
import { db } from "@/db/drizzle";
import { NextRequest, NextResponse } from "next/server";
import jwt, { JwtPayload } from "jsonwebtoken";

import { UnitmeasureNomenclator, unitMeasureNomenclators } from "@/db/migrations/schema";
import { verifyJWT } from "@/libs/jwt";
import logger from "@/utils/logger";

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
    logger.info("Listar Nomencladores de Unidades de Medida", {
      method: request.method,
      url: request.url,
      body: request.body,
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

    // Build dynamic where conditions
    const conditions = [];

    conditions.push(isNull(unitMeasureNomenclators.deleted_at)); // Ignore deleted nomenclators

    if (name) {
      conditions.push(ilike(unitMeasureNomenclators.name, `%${name}%`));
    }

    const whereClause = conditions.length > 0 ? and(...conditions) : undefined;

    const paginatedData = await db
      .select()
      .from(unitMeasureNomenclators)
      .where(whereClause) // Ignore deleted nomenclators
      .orderBy(desc(unitMeasureNomenclators.created_at))
      .limit(limit)
      .offset(offset);
    const totalCount = await db.$count(unitMeasureNomenclators);

    return new NextResponse(
      JSON.stringify({
        ok: true,
        total: totalCount,
        totalPages: Math.ceil(totalCount / limit),
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

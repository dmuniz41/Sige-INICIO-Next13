import { db } from "@/db/drizzle";
import { and, eq, desc, ilike } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";
import jwt, { JwtPayload } from "jsonwebtoken";

import { materialNomenclators, MaterialNomenclators } from "@/db/migrations/schema";
import { verifyJWT } from "@/libs/jwt";
import logger from "@/utils/logger";

export async function POST(request: NextRequest) {
  const { ...requestData }: MaterialNomenclators = await request.json();
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
    logger.info("Crear Nomenclador de Material", { method: request.method, url: request.url, body: request.body, user: decoded.userName });

    const DBNomenclator = await db
      .select()
      .from(materialNomenclators)
      .where(
        and(
          eq(materialNomenclators.material_name, requestData.material_name),
          eq(materialNomenclators.material_category, requestData.material_category)
        )
      );

    if (DBNomenclator.length > 0) {
      return NextResponse.json(
        {
          ok: false,
          message: `Ya existe un nomenclador de material con el nombre nombre: {${DBNomenclator[0].material_category} ${DBNomenclator[0].material_name}}`
        },
        {
          status: 409
        }
      );
    }

    await db.insert(materialNomenclators).values({
      material_category: requestData.material_category,
      material_name: requestData.material_name,
      isDecrease: requestData.isDecrease,
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
      logger.error("Error al listar categorias de material", {
        error: error.message,
        stack: error.stack,
        route: "/api/nomenclators/material",
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
    logger.info("Listar Nomencladores de Materiales", {
      method: request.method,
      url: request.url,
      body: request.body,
      user: decoded.userName
    });

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1", 10); // Default to page 1
    const limit = parseInt(searchParams.get("limit") || "10", 10); // Default to 10 items per page
    const material_category = searchParams.get("material_category") ?? "";
    const material_name = searchParams.get("material_name") ?? null;
    const isDecreaseParam = searchParams.get("isDecrease") ?? null;
    const isNotDecreaseParam = searchParams.get("isNotDecrease") ?? null;

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

    if (material_category) {
      conditions.push(ilike(materialNomenclators.material_category, `%${material_category}%`));
    }

    if (material_name) {
      conditions.push(ilike(materialNomenclators.material_name, `%${material_name}%`));
    }

    if (isDecreaseParam !== null && isNotDecreaseParam === null) {
      const isDecrease = isDecreaseParam === "true";
      conditions.push(eq(materialNomenclators.isDecrease, isDecrease));
    } else if (isNotDecreaseParam !== null && isDecreaseParam === null) {
      const isNotDecrease = isNotDecreaseParam === "true";
      conditions.push(eq(materialNomenclators.isDecrease, !isNotDecrease));
    }

    const whereClause = conditions.length > 0 ? and(...conditions) : undefined;

    const paginatedData = await db
      .select()
      .from(materialNomenclators)
      .where(whereClause)
      .orderBy(desc(materialNomenclators.created_at))
      .limit(limit)
      .offset(offset);
    const totalCount = await db.$count(materialNomenclators);

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
      logger.error("Error al listar categorias de material", {
        error: error.message,
        stack: error.stack,
        route: "/api/nomenclators/material",
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

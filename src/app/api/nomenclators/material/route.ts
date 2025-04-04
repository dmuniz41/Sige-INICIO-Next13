import { db } from "@/db/drizzle";
import { and, eq, desc } from "drizzle-orm";
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

export async function PUT(request: Request) {
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
    logger.info("Actualizar Nomenclador de Material", {
      method: request.method,
      url: request.url,
      body: request.body,
      user: decoded.userName
    });

    const isNomenclatorWithCodeExist = await db.select().from(materialNomenclators).where(eq(materialNomenclators.code, requestData.code));

    if (isNomenclatorWithCodeExist.length === 0) {
      return NextResponse.json(
        {
          ok: false,
          message: "El nomenclador de material a actualizar no existe "
        },
        {
          status: 404
        }
      );
    }

    const isNomenclatorExist = await db
      .select()
      .from(materialNomenclators)
      .where(
        and(
          eq(materialNomenclators.material_category, requestData.material_category),
          eq(materialNomenclators.material_name, requestData.material_name)
        )
      );

    if (isNomenclatorExist.length > 0) {
      return NextResponse.json(
        {
          ok: false,
          message: `Ya existe un nomenclador de material con nombre: ${requestData.material_category} ${requestData.material_name}`
        },
        {
          status: 404
        }
      );
    }

    await db
      .update(materialNomenclators)
      .set({ ...requestData, updated_at: new Date() })
      .where(eq(materialNomenclators.code, requestData.code));

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
        method: "PUT"
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
      .from(materialNomenclators)
      .orderBy(desc(materialNomenclators.created_at))
      .limit(limit)
      .offset(offset);
    const totalCount = await db.$count(materialNomenclators);

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

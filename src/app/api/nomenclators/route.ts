import { and, eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";
import jwt, { JwtPayload } from "jsonwebtoken";

import { CreateNomenclator } from "@/types/DTOs/nomenclators/nomenclators";
import { db } from "@/db/drizzle";
import { nomenclators } from "@/db/migrations/schema";
import { verifyJWT } from "@/libs/jwt";
import logger from "@/utils/logger";

export async function POST(request: NextRequest) {
  const { ...nomenclator }: CreateNomenclator = await request.json();
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
    logger.info("Crear Nomenclador", { method: request.method, url: request.url, user: decoded.userName });

    // await connectDB();
    // let DBNomenclator = await Nomenclator.findOne({ category, code });

    const DBNomenclator = await db
      .select()
      .from(nomenclators)
      .where(and(eq(nomenclators.category, nomenclator.category), eq(nomenclators.value, nomenclator.value)));

    if (DBNomenclator.length > 0) {
      return NextResponse.json(
        {
          ok: false,
          message: "Ya existe un nomenclador en esa categoría con ese código"
        },
        {
          status: 409
        }
      );
    }

    // const newNomenclator = new Nomenclator({
    //   key: newKey,
    //   code,
    //   category
    // });

    // await newNomenclator.save();

    const newNomenclator = await db
      .insert(nomenclators)
      .values({ ...nomenclator })
      .returning();

    return new NextResponse(
      JSON.stringify({
        ok: true,
        data: newNomenclator
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
      logger.error("Error al crear nomenclador", {
        error: error.message,
        stack: error.stack,
        route: "/api/nomenclators",
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
    logger.info("Listar Nomencladores", { method: request.method, url: request.url, user: decoded.userName });

    const { searchParams } = new URL(request.url);
    const categoryCode = searchParams.get("categoryCode");
    const page = parseInt(searchParams.get("page") || "1", 10); // Default to page 1
    const limit = parseInt(searchParams.get("limit") || "10", 10); // Default to 10 items per page

    //? SI EL PARAMETO CATEGORY ES VALIDO, RETORNAR LOS NOMENCLATORES DE ESE CATEGORIA
    if (categoryCode) {
      const DBNomenclators = await db.select().from(nomenclators).where(eq(nomenclators.categoryCode, categoryCode)).orderBy(nomenclators.id);
      return new NextResponse(
        JSON.stringify({
          ok: true,
          total: DBNomenclators.length,
          page,
          limit,
          data: DBNomenclators
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
    const paginatedData = await db.select().from(nomenclators).orderBy(nomenclators.category).limit(limit).offset(offset);
    const totalCount = await db.$count(nomenclators);

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
      logger.error("Error al listar nomencladores", {
        error: error.message,
        stack: error.stack,
        route: "/api/nomenclators",
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

import { NextRequest, NextResponse } from "next/server";
import jwt, { JwtPayload } from "jsonwebtoken";

import { db } from "@/db/drizzle";
import { eq } from "drizzle-orm";
import { materialCategoryNomenclators } from "@/db/migrations/schema";
import { verifyJWT } from "@/libs/jwt";
import logger from "@/utils/logger";

export async function DELETE(request: NextRequest, { params }: { params: { code: string } }) {
  const code = params.code;
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
    logger.info("Eliminar Categoria de Material", { method: request.method, url: request.url, user: decoded.userName });
    
    // await connectDB();
    // const nomenclatorToDelete = await MaterialNomenclator.findById(params.get("id"));

    const nomenclatorToDelete = await db.select().from(materialCategoryNomenclators).where(eq(materialCategoryNomenclators.code, code));

    if (nomenclatorToDelete.length === 0) {
      return NextResponse.json(
        {
          ok: false,
          message: "El nomenclador de categoría de material a borrar no existe"
        },
        {
          status: 404
        }
      );
    }

    // const deletedNomenclator = await MaterialNomenclator.findByIdAndDelete(params.get("id"));
    const deletedMaterialCategoryNomenclator = await db
      .delete(materialCategoryNomenclators)
      .where(eq(materialCategoryNomenclators.code, code));

    return new NextResponse(
      JSON.stringify({
        ok: true,
        data: deletedMaterialCategoryNomenclator
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
      logger.error("Error al eliminar categoria de material", { 
        error: error.message,
        stack: error.stack,
        route: "/api/nomenclators/material/[code]",
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

export async function GET(request: NextRequest, { params }: { params: { code: string } }) {
  const code = params.code;
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
    logger.info("Obtener Categoria de Material por Code", { method: request.method, url: request.url, user: decoded.userName });

    const DBMaterialCategoryNomenclator = await db
      .select()
      .from(materialCategoryNomenclators)
      .where(eq(materialCategoryNomenclators.code, code));

    if (DBMaterialCategoryNomenclator.length === 0) {
      return NextResponse.json(
        {
          ok: false,
          message: "No nomenclador de categoría de material no existe"
        },
        {
          status: 404
        }
      );
    }

    return new NextResponse(
      JSON.stringify({
        ok: true,
        data: DBMaterialCategoryNomenclator[0]
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
      logger.error("Error al obtener categoria de material", {
        error: error.message,
        stack: error.stack,
        route: "/api/nomenclators/material/[code]",
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

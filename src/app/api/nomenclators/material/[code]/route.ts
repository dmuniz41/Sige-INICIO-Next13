import { NextRequest, NextResponse } from "next/server";
import jwt, { JwtPayload } from "jsonwebtoken";

import { db } from "@/db/drizzle";
import { eq } from "drizzle-orm";
import { materialNomenclators } from "@/db/migrations/schema";
import { verifyJWT } from "@/libs/jwt";
import logger from "@/utils/logger";

export async function DELETE(request: NextRequest, { params }: { params: { code: number } }) {
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
    logger.info("Eliminar Categoria de Material", { method: request.method, url: request.url, body: request.body, user: decoded.userName });

    const nomenclatorToDelete = await db.select().from(materialNomenclators).where(eq(materialNomenclators.code, code));

    if (nomenclatorToDelete.length === 0) {
      return NextResponse.json(
        {
          ok: false,
          message: "El nomenclador de material a borrar no existe"
        },
        {
          status: 404
        }
      );
    }

    await db.delete(materialNomenclators).where(eq(materialNomenclators.code, code));

    return new NextResponse(
      JSON.stringify({
        ok: true,
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
      logger.error("Error al eliminar nomenclador de material", {
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

export async function GET(request: NextRequest, { params }: { params: { code: number } }) {
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

    const DBMaterialNomenclator = await db.select().from(materialNomenclators).where(eq(materialNomenclators.code, code));

    if (DBMaterialNomenclator.length === 0) {
      return NextResponse.json(
        {
          ok: false,
          message: "El nomenclador de material no existe"
        },
        {
          status: 404
        }
      );
    }

    return new NextResponse(
      JSON.stringify({
        ok: true,
        data: DBMaterialNomenclator[0]
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
      logger.error("Error al obtener nomenclador de material", {
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

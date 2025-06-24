import { and, eq, desc, ilike, ne, isNull, isNotNull } from "drizzle-orm";
import { db } from "@/db/drizzle";
import { NextRequest, NextResponse } from "next/server";
import jwt, { JwtPayload } from "jsonwebtoken";

import { unitMeasureNomenclators } from "@/db/migrations/schema";
import { UpdateUnitMeasureNomenclator } from "@/types/DTOs/nomenclators/unitMeasures";
import { verifyJWT } from "@/libs/jwt";
import logger from "@/utils/logger";

export async function PUT(request: Request, { params }: { params: { id: number } }) {
  const { ...requestData }: UpdateUnitMeasureNomenclator = await request.json();
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
    logger.info("Actualizar Nomenclador de Unidad de Medida", {
      method: request.method,
      url: request.url,
      body: request.body,
      user: decoded.userName
    });

    // Validate the nomenclator exists
    const isNomenclatorExist = await db.select().from(unitMeasureNomenclators).where(eq(unitMeasureNomenclators.id, params.id));

    if (isNomenclatorExist.length === 0) {
      return NextResponse.json(
        {
          ok: false,
          message: "El nomenclador de unidad de medida a actualizar no existe "
        },
        {
          status: 404
        }
      );
    }

    // Validate the nomenclator with the same name does not exist (excluding current record)
    const isNomenclatorExistWithName = await db
      .select()
      .from(unitMeasureNomenclators)
      .where(
        and(
          isNull(unitMeasureNomenclators.deleted_at), // Ignore deleted nomenclators
          eq(unitMeasureNomenclators.name, requestData.name),
          ne(unitMeasureNomenclators.id, params.id) // Exclude current record
        )
      );

    if (isNomenclatorExistWithName.length > 0) {
      return NextResponse.json(
        {
          ok: false,
          message: "Ya existe un nomenclador de unidad de medida con ese nombre"
        },
        {
          status: 409
        }
      );
    }

    await db
      .update(unitMeasureNomenclators)
      .set({ ...requestData, updated_at: new Date() })
      .where(eq(unitMeasureNomenclators.id, params.id));

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
      logger.error("Error al actualizar nomenclador de unidad de medida", {
        error: error.message,
        stack: error.stack,
        route: "/api/nomenclators/unitMeasure/[id]",
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

export async function DELETE(request: NextRequest, { params }: { params: { id: number } }) {
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
    logger.info("Eliminar Nomenclador de Unidad de Medida", {
      method: request.method,
      url: request.url,
      body: request.body,
      user: decoded.userName
    });

    const nomenclatorToDelete = await db
      .select()
      .from(unitMeasureNomenclators)
      .where(
        and(
          isNull(unitMeasureNomenclators.deleted_at), // Ignore deleted nomenclators
          eq(unitMeasureNomenclators.id, params.id)
        )
      );

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

    await db.update(unitMeasureNomenclators).set({ deleted_at: new Date() }).where(eq(unitMeasureNomenclators.id, params.id));

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
      logger.error("Error al eliminar nomenclador de unidad de medida", {
        error: error.message,
        stack: error.stack,
        route: "/api/nomenclators/unitMeasure/[id]",
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

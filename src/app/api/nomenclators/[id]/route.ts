import {eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";
import jwt, { JwtPayload } from "jsonwebtoken";

import { db } from "@/db/drizzle";
import { nomenclators } from "@/db/migrations/schema";
import { UpdateNomenclator } from "@/types/DTOs/nomenclators/nomenclators";
import { verifyJWT } from "@/libs/jwt";
import logger from "@/utils/logger";

export async function PUT(request: NextRequest, { params }: { params: { id: number } }) {
  const id = params.id;
  const { ...nomenclator }: UpdateNomenclator = await request.json();
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
    logger.info("Actualizar Nomenclador", { method: request.method, url: request.url, user: decoded.userName });
    // await connectDB();
    // const nomenclatorToUpdate = await Nomenclator.findById(id);

    const nomenclatorToUpdate = await db.select().from(nomenclators).where(eq(nomenclators.id, id));

    if (nomenclatorToUpdate.length === 0) {
      return NextResponse.json(
        {
          ok: false,
          message: "El nomenclador a actualizar no existe"
        },
        {
          status: 404
        }
      );
    }

    // const updatedNomenclator = await Nomenclator.findByIdAndUpdate(id, { code, category }, { new: true });

    const updatedNomenclator = await db.update(nomenclators).set(nomenclator).where(eq(nomenclators.id, id)).returning();

    return new NextResponse(
      JSON.stringify({
        ok: true,
        data: updatedNomenclator
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
        route: "/api/nomenclators/[id]",
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
  const id = params.id;
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
    logger.info("Eliminar Nomenclador", { method: request.method, url: request.url, user: decoded.userName });

    // await connectDB();
    // const nomenclatorToDelete = await Nomenclator.findById(params.get("id"));

    const nomenclatorToDelete = await db.select().from(nomenclators).where(eq(nomenclators.id, id));

    if (nomenclatorToDelete.length === 0) {
      return NextResponse.json(
        {
          ok: true,
          message: "El nomenclador a borrar no existe"
        },
        {
          status: 404
        }
      );
    }

    // const deletedNomenclator = await Nomenclator.findByIdAndDelete(params.get("id"));
    const deletedNomenclator = await db.delete(nomenclators).where(eq(nomenclators.id, id));

    return new NextResponse(
      JSON.stringify({
        ok: true,
        data: deletedNomenclator
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
      logger.error("Error al eliminar nomenclador", {
        error: error.message,
        stack: error.stack,
        route: "/api/nomenclators/[id]",
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

import { db } from "@/db/drizzle";
import { eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";
import jwt, { JwtPayload } from "jsonwebtoken";

import { clientNomenclators } from "@/db/migrations/schema";
import { UpdateClientNomenclator } from "@/types/DTOs/nomenclators/client";
import { verifyJWT } from "@/libs/jwt";
import logger from "@/utils/logger";

export async function PUT(request: NextRequest, { params }: { params: { idNumber: number } }) {
  const idNumber = params.idNumber;
  const { ...clientNomenclator }: UpdateClientNomenclator = await request.json();
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
    logger.info("Actualizar Cliente", { method: request.method, url: request.url, user: decoded.userName });
    // await connectDB();
    // const nomenclatorToUpdate = await ClientNomenclator.findById(clientNomenclator._id);

    const nomenclatorToUpdate = await db.select().from(clientNomenclators).where(eq(clientNomenclators.idNumber, idNumber));

    if (nomenclatorToUpdate.length === 0) {
      return NextResponse.json(
        {
          ok: false,
          message: "El nomenclador de cliente a actualizar no existe"
        },
        {
          status: 404
        }
      );
    }

    // const updatedNomenclator = await ClientNomenclator.findByIdAndUpdate(
    //   clientNomenclator._id,
    //   {
    //     ...clientNomenclator
    //   },
    //   { new: true }
    // );

    const updatedNomenclator = await db
      .update(clientNomenclators)
      .set(clientNomenclator)
      .where(eq(clientNomenclators.idNumber, idNumber))
      .returning();

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
      logger.error("Error al actualizar cliente", {
        error: error.message,
        stack: error.stack,
        route: "/api/nomenclators/client/[idNumber]",
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

export async function DELETE(request: NextRequest, { params }: { params: { idNumber: number } }) {
  const idNumber = params.idNumber;
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
    logger.info("Eliminar Cliente", { method: request.method, url: request.url, user: decoded.userName });
    // await connectDB();
    // const nomenclatorToDelete = await ClientNomenclator.findById(params.get("id"));
    const nomenclatorToDelete = await db.select().from(clientNomenclators).where(eq(clientNomenclators.idNumber, idNumber));

    if (nomenclatorToDelete.length === 0) {
      return NextResponse.json(
        {
          ok: false,
          message: "El nomenclador de cliente a borrar no existe"
        },
        {
          status: 404
        }
      );
    }

    // const deletedNomenclator = await ClientNomenclator.findByIdAndDelete(params.get("id"));
    const deletedNomenclator = await db.delete(clientNomenclators).where(eq(clientNomenclators.idNumber, idNumber));

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
      logger.error("Error al eliminar cliente", {
        error: error.message,
        stack: error.stack,
        route: "/api/nomenclators/client/[idNumber]",
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

export async function GET(request: NextRequest, { params }: { params: { idNumber: number } }) {
  const idNumber = params.idNumber;
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
    logger.info("Obtener Cliente por IdNumber", { method: request.method, url: request.url, user: decoded.userName });

    const DBClientNomenclator = await db.select().from(clientNomenclators).where(eq(clientNomenclators.idNumber, idNumber));

    if (DBClientNomenclator.length === 0) {
      return NextResponse.json(
        {
          ok: false,
          message: `No existe el cliente con el numero de cliente: ${idNumber}`
        },
        {
          status: 404
        }
      );
    }

    return new NextResponse(
      JSON.stringify({
        ok: true,
        data: DBClientNomenclator
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
      logger.error("Error al obtener cliente", {
        error: error.message,
        stack: error.stack,
        route: "/api/nomenclators/client/[idNumber]",
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

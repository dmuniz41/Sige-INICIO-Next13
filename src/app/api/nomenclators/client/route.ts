import { db } from "@/db/drizzle";
import { eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";
import jwt, { JwtPayload } from "jsonwebtoken";

import { verifyJWT } from "@/libs/jwt";
import { clientNomenclators } from "@/db/migrations/schema";
import { InsertClientNomenclator } from "@/types/DTOs/nomenclators/client";
import logger from "@/utils/logger";

export async function POST(request: NextRequest) {
  const { ...clientNomenclator }: InsertClientNomenclator = await request.json();
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
    logger.info("Crear Cliente", { method: request.method, url: request.url, user: decoded.userName });

    // await connectDB();
    // const DBNomenclator = await ClientNomenclator.findOne({
    //   name: clientNomenclator.name
    // });

    // ? LOS NUMEROS DE LOS CLIENTES SE CREAN DE FORMA CONSECUTIVA, DE NO EXISTIR CLIENTES EL PRIMER NUMERO SERÁ 1 //
    // const clients = (await ClientNomenclator.find()) as IClientNomenclator[];
    // let newId = 0;
    // if (clients.length == 0) {
    //   newId = 1;
    // } else {
    //   newId = clients.at(-1)?.idNumber! + 1;
    // }

    const DBNomenclator = await db.select().from(clientNomenclators).where(eq(clientNomenclators.name, clientNomenclator.name));

    if (DBNomenclator.length > 0) {
      return NextResponse.json(
        {
          ok: false,
          message: "Ya existe un nomenclador de cliente con ese nombre"
        },
        {
          status: 409
        }
      );
    }

    // const newClientNomenclator = new ClientNomenclator({
    //   ...clientNomenclator,
    //   idNumber: newId,
    //   key: newKey
    // });

    // await newClientNomenclator.save();

    const newClientNomenclator = await db
      .insert(clientNomenclators)
      .values({
        ...clientNomenclator
      })
      .returning();

    return new NextResponse(
      JSON.stringify({
        ok: true,
        data: newClientNomenclator
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
      logger.error("Error al crear cliente", {
        error: error.message,
        stack: error.stack,
        route: "/api/nomenclators/client",
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
    logger.info("Listar Clientes", { method: request.method, url: request.url, user: decoded.userName });

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
    const paginatedData = await db.select().from(clientNomenclators).orderBy(clientNomenclators.name).limit(limit).offset(offset);
    const totalCount = await db.$count(clientNomenclators);
    // await connectDB();
    // const listOfClientNomenclators = (await ClientNomenclator.find()).reverse();

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
      logger.error("Error al listar clientes", {
        error: error.message,
        stack: error.stack,
        route: "/api/nomenclators/client",
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

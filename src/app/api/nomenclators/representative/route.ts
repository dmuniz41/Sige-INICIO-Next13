import { NextRequest, NextResponse } from "next/server";
import { eq } from "drizzle-orm";

import { db } from "@/db/drizzle";
import { InsertRepresentativeNomenclator } from "@/types/DTOs/nomenclators/representative";
import { representativeNomenclators } from "@/db/migrations/schema";
import { verifyJWT } from "@/libs/jwt";
import logger from "@/utils/logger";

export async function POST(request: NextRequest) {
  logger.info("Listar Representantes", { method: request.method, url: request.url });
  
  const { ...representativeNomenclator }: InsertRepresentativeNomenclator = await request.json();
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
    // await connectDB();
    // const DBNomenclator = await RepresentativeNomenclator.findOne({
    //   name: representativeNomenclator.name
    // });

    // // ? LOS NUMEROS DE LOS REPRESENTANTES SE CREAN DE FORMA CONSECUTIVA, DE NO EXISTIR REPRESENTANTES EL PRIMER NUMERO SERÁ 1 //
    // const representatives =
    //   (await RepresentativeNomenclator.find()) as IRepresentativeNomenclator[];
    // let newId = 0;
    // if (representatives.length == 0) {
    //   newId = 1;
    // } else {
    //   newId = representatives.at(-1)?.idNumber! + 1;
    // }

    const DBNomenclator = await db
      .select()
      .from(representativeNomenclators)
      .where(eq(representativeNomenclators.name, representativeNomenclator.name));

    if (DBNomenclator.length > 0) {
      return NextResponse.json(
        {
          ok: false,
          message: "Ya existe un representante con ese nombre"
        },
        {
          status: 409
        }
      );
    }

    // const newRepresentativeNomenclator = new RepresentativeNomenclator({
    //   ...representativeNomenclator,
    //   idNumber: newId,
    //   key: newKey
    // });

    // await newRepresentativeNomenclator.save();

    const newRepresentativeNomenclator = await db
      .insert(representativeNomenclators)
      .values({
        ...representativeNomenclator
      })
      .returning();

    return new NextResponse(
      JSON.stringify({
        ok: true,
        data: newRepresentativeNomenclator
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
      logger.error("Error al crear representante", {
        error: error.message,
        stack: error.stack,
        route: "/api",
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

export async function GET(request: NextRequest) {
  logger.info("Listar Representantes", { method: request.method, url: request.url });

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
    // await connectDB();
    // const listOfRepresentativeNomenclators = (await RepresentativeNomenclator.find()).reverse() as IRepresentativeNomenclator[];

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
      .from(representativeNomenclators)
      .orderBy(representativeNomenclators.name)
      .limit(limit)
      .offset(offset);
    const totalCount = await db.$count(representativeNomenclators);

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
      logger.error("Error al obtener representantes", {
        error: error.message,
        stack: error.stack,
        route: "/api",
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

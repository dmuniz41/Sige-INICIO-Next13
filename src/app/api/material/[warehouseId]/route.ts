import { eq, and, desc } from 'drizzle-orm';
import { JwtPayload } from "jsonwebtoken";
import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";

import { db } from "@/db/drizzle";
import { materials } from "@/db/migrations/schema";
import { UpdateMaterial } from "@/types/DTOs/materials/materials";
import { verifyJWT } from "@/libs/jwt";
import logger from "@/utils/logger";

export async function GET(request: NextRequest, { params }: { params: { warehouseId: number } }) {
  const warehouseId = params.warehouseId; // Id del almacen
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
    logger.info("Listar Materiales", { method: request.method, url: request.url, user: decoded.userName });

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
      .from(materials)
      .where(eq(materials.warehouseId, warehouseId))
      .orderBy(desc(materials.id))
      .limit(limit)
      .offset(offset);
    const totalCount = await db.$count(materials);

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
      logger.error("Error al listar los materiales", {
        error: error.message,
        stack: error.stack,
        route: "/api/material/[warehouseId]",
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

export async function PUT(request: NextRequest, { params }: { params: { warehouseId: number } }) {
  const warehouseId = params.warehouseId; // Id del almacen
  const { ...materialToUpdate }: UpdateMaterial = await request.json();
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
    logger.info("Actualizar Material", { method: request.method, url: request.url, user: decoded.userName });

    const { searchParams } = new URL(request.url);
    const materialId = parseInt(searchParams.get("materialId")!); // Default to page 1

    if (materialId < 1 || isNaN(materialId) || !searchParams.has("materialId")) {
      return NextResponse.json(
        {
          ok: false,
          message: "MaterialId es requerido y no puede ser menor a 1."
        },
        {
          status: 400
        }
      );
    }

    const isMaterialExist = await db.select().from(materials).where(and(eq(materials.id, materialId), eq(materials.warehouseId, warehouseId)));
    if (isMaterialExist.length === 0) {
      return NextResponse.json(
        {
          ok: false,
          message: "El material a actualizar no existe"
        },
        {
          status: 404
        }
      );
    }


    // ? PARA ACTUALIZAR EL STOCK UTILIZE LAS FUNCIONES DE MOVER INVENTARIO
    isMaterialExist[0].name = materialToUpdate.name;
    isMaterialExist[0].category = materialToUpdate.category;
    isMaterialExist[0].description = materialToUpdate.description;
    isMaterialExist[0].modifyDate = new Date(); // Registra la fecha de modificación
    isMaterialExist[0].unitMeasure = materialToUpdate.unitMeasure;
    isMaterialExist[0].costPerUnit = materialToUpdate.costPerUnit;
    isMaterialExist[0].minimumExistence = materialToUpdate.minimumExistence;
    isMaterialExist[0].provider = materialToUpdate.provider;

    // TODO: VERIFICAR QUE EL MATERIAL MODIFICADO COINCIDE CON OTRO EXISTENTE, ACTUALIZAR EL NOMENCLADOR DE FICHAS DE MATERIALES

    const updatedMaterial = await db.update(materials).set(isMaterialExist[0]).where(eq(materials.id, materialId)).returning();

    return new NextResponse(
      JSON.stringify({
        ok: true,
        data: updatedMaterial
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
      logger.error(`Error al actualizar un material`, {
        error: error.message,
        stack: error.stack,
        route: "/api/material/[warehouseId]",
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

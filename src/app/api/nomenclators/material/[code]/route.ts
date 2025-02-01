import { NextRequest, NextResponse } from "next/server";

import { db } from "@/db/drizzle";
import { eq } from "drizzle-orm";
import { materialCategoryNomenclators } from "@/db/migrations/schema";
import { verifyJWT } from "@/libs/jwt";

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
      console.log("🚀 ~ DELETE ~ error:", error);
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

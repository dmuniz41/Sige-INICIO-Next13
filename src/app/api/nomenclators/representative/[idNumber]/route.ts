import { db } from "@/db/drizzle";
import { eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

import { representativeNomenclators } from "@/db/migrations/schema";
import { UpdateRepresentativeNomenclator } from "@/types/DTOs/nomenclators/representative";
import { verifyJWT } from "@/libs/jwt";

export async function PUT(request: NextRequest, { params }: { params: { idNumber: number } }) {
  const idNumber = params.idNumber;
  const { ...representativeNomenclator }: UpdateRepresentativeNomenclator = await request.json();
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
    // const nomenclatorToUpdate = await RepresentativeNomenclator.findById(representativeNomenclator._id);

    const nomenclatorToUpdate = await db.select().from(representativeNomenclators).where(eq(representativeNomenclators.idNumber, idNumber));

    if (nomenclatorToUpdate.length === 0) {
      return NextResponse.json(
        {
          ok: false,
          message: "El representante a actualizar no existe"
        },
        {
          status: 404
        }
      );
    }

    // const updatedNomenclator = await RepresentativeNomenclator.findByIdAndUpdate(
    //   representativeNomenclator._id,
    //   {
    //     ...representativeNomenclator
    //   },
    //   { new: true }
    // );

    const updatedNomenclator = await db
      .update(representativeNomenclators)
      .set(representativeNomenclator)
      .where(eq(representativeNomenclators.idNumber, idNumber))
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
      console.log("🚀 ~ PUT ~ error:", error);
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
    // await connectDB();
    // const nomenclatorToDelete = await RepresentativeNomenclator.findById(params.get("id"));

    const nomenclatorToUpdate = await db.select().from(representativeNomenclators).where(eq(representativeNomenclators.idNumber, idNumber));

    if (nomenclatorToUpdate.length === 0) {
      return NextResponse.json(
        {
          ok: false,
          message: "El representante a eliminar no existe"
        },
        {
          status: 404
        }
      );
    }

    // const deletedNomenclator = await RepresentativeNomenclator.findByIdAndDelete(params.get("id"));

    const deletedNomenclator = await db.delete(representativeNomenclators).where(eq(representativeNomenclators.idNumber, idNumber));

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

    const DBClientNomenclator = await db.select().from(representativeNomenclators).where(eq(representativeNomenclators.idNumber, idNumber));

    if (DBClientNomenclator.length === 0) {
      return NextResponse.json(
        {
          ok: false,
          message: `No existe el representante con el número de representante: ${idNumber}`
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
      console.log("🚀 ~ GET ~ error:", error);
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


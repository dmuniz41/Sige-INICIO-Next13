import { db } from "@/db/drizzle";
import { eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

import { materialCategoryNomenclators, MaterialCategoryNomenclators } from "@/db/migrations/schema";
import { verifyJWT } from "@/libs/jwt";
import { generateAlphanumericCode } from "@/helpers/generateAlphanumericCode";

export async function POST(request: NextRequest) {
  const { ...requestData }: MaterialCategoryNomenclators = await request.json();
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
    // const DBNomenclator = await MaterialNomenclator.findOne({
    //   name: materialNomenclator.name
    // });

    const DBNomenclator = await db
      .select()
      .from(materialCategoryNomenclators)
      .where(eq(materialCategoryNomenclators.value, requestData.value));

    if (DBNomenclator.length > 0) {
      return NextResponse.json(
        {
          ok: false,
          message: `Ya existe un nomenclador de categoria de material con ese nombre: Nombre{${requestData.value}}`
        },
        {
          status: 409
        }
      );
    }

    let code = generateAlphanumericCode("N_MC");

    // const newMaterialNomenclator = new MaterialNomenclator({
    //   ...materialNomenclator,
    //   key: newKey
    // });

    const newMaterialCategoryNomenclator = await db
      .insert(materialCategoryNomenclators)
      .values({
        code,
        category: requestData.category,
        value: requestData.value,
        isDecrease: requestData.isDecrease
      })
      .returning();

    // await newMaterialCategoryNomenclator.save();

    return new NextResponse(
      JSON.stringify({
        ok: true,
        data: newMaterialCategoryNomenclator
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
      console.log("🚀 ~ POST ~ error:", error);
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

export async function PUT(request: Request) {
  const { ...requestData }: MaterialCategoryNomenclators = await request.json();
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
    // const nomenclatorToUpdate = await MaterialNomenclator.findById(materialNomenclator._id);

    const isNomenclatorExist = await db
      .select()
      .from(materialCategoryNomenclators)
      .where(eq(materialCategoryNomenclators.code, requestData.code));

    if (isNomenclatorExist.length === 0) {
      return NextResponse.json(
        {
          ok: false,
          message: "El nomenclador de categoria de material a actualizar no existe "
        },
        {
          status: 404
        }
      );
    }

    //TODO: Revisar esta validacion para evitar que se cree un nuevo nomenclador con el mismo nombre de uno que ya existe
    // const isNewNomenclatorExist = await db
    //   .select()
    //   .from(materialCategoryNomenclators)
    //   .where(eq(materialCategoryNomenclators.value, requestData.value));

    // if (isNewNomenclatorExist.length !== 0) {
    //   return NextResponse.json(
    //     {
    //       ok: false,
    //       message: `Ya existe un nomenclador de categoria de material con ese nombre: Nombre{${isNewNomenclatorExist[0].value}}`
    //     },
    //     {
    //       status: 409
    //     }
    //   );
    // }

    // const updatedNomenclator = await MaterialNomenclator.findByIdAndUpdate(
    //   materialNomenclator._id,
    //   {
    //     ...materialNomenclator
    //   },
    //   { new: true }
    // );

    const updatedData = await db
      .update(materialCategoryNomenclators)
      .set(requestData)
      .where(eq(materialCategoryNomenclators.code, requestData.code))
      .returning();

    return new NextResponse(
      JSON.stringify({
        ok: true,
        data: updatedData
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
    const paginatedData = await db.select().from(materialCategoryNomenclators).limit(limit).offset(offset);
    const totalCount = await db.$count(materialCategoryNomenclators);

    // await connectDB();
    // const listOfMaterialNomenclators = (await MaterialNomenclator.find()).reverse();

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

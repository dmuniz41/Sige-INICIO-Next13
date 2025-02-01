import { db } from "@/db/drizzle";
import { eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

import { connectDB } from "@/libs/mongodb";
import { generateRandomString } from "@/helpers/randomStrings";
import { materialCategoryNomenclators, MaterialCategoryNomenclators } from "@/db/migrations/schema";
import { verifyJWT } from "@/libs/jwt";
import { generateAlphanumericCode } from "@/helpers/generateAlphanumericCode";
// import MaterialNomenclator, { IMaterialNomenclator } from "@/models/nomenclators/materials";

export async function POST(request: Request) {
  const { ...materialCategoryNomenclator }: MaterialCategoryNomenclators = await request.json();
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
      .where(eq(materialCategoryNomenclators.value, materialCategoryNomenclator.value));

    if (DBNomenclator.length > 0) {
      return NextResponse.json(
        {
          ok: false,
          message: `Ya existe un nomenclador de categoria de material con ese nombre: Nombre{${materialCategoryNomenclator.value}}`
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
        category: materialCategoryNomenclator.category,
        value: materialCategoryNomenclator.value,
        isDecrease: materialCategoryNomenclator.isDecrease
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

export async function GET(request: Request) {
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
    // const listOfMaterialNomenclators = (await MaterialNomenclator.find()).reverse();

    const listOfMaterialCategoryNomenclators = await db.select().from(materialCategoryNomenclators);
    return new NextResponse(
      JSON.stringify({
        ok: true,
        counter: listOfMaterialCategoryNomenclators.length,
        data: listOfMaterialCategoryNomenclators
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
import { NextRequest, NextResponse } from "next/server";

import { connectDB } from "@/libs/mongodb";
import { generateRandomString } from "@/helpers/randomStrings";
import { verifyJWT } from "@/libs/jwt";
import MaterialNomenclator, { IMaterialNomenclator } from "@/models/nomenclators/materials";

export async function POST(request: Request) {
  const { ...materialNomenclator }: IMaterialNomenclator = await request.json();
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
    await connectDB();
    const DBNomenclator = await MaterialNomenclator.findOne({
      name: materialNomenclator.name
    });

    if (DBNomenclator) {
      return NextResponse.json(
        {
          ok: false,
          message: "Ya existe un nomenclador de material con ese nombre"
        },
        {
          status: 409
        }
      );
    }

    let newKey = generateRandomString(26);

    const newMaterialNomenclator = new MaterialNomenclator({
      ...materialNomenclator,
      key: newKey
    });

    await newMaterialNomenclator.save();

    return new NextResponse(
      JSON.stringify({
        ok: true,
        newMaterialNomenclator
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
    await connectDB();
    const listOfMaterialNomenclators = (await MaterialNomenclator.find()).reverse();
    return new NextResponse(
      JSON.stringify({
        ok: true,
        counter: listOfMaterialNomenclators.length,
        listOfMaterialNomenclators
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

export async function PUT(request: Request) {
  const { ...materialNomenclator }: IMaterialNomenclator = await request.json();
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
    await connectDB();
    const nomenclatorToUpdate = await MaterialNomenclator.findById(materialNomenclator._id);

    if (!nomenclatorToUpdate) {
      return NextResponse.json(
        {
          ok: false,
          message: "El nomenclador de material a actualizar no existe"
        },
        {
          status: 404
        }
      );
    }

    const updatedNomenclator = await MaterialNomenclator.findByIdAndUpdate(
      materialNomenclator._id,
      {
        ...materialNomenclator
      },
      { new: true }
    );

    return new NextResponse(
      JSON.stringify({
        ok: true,
        updatedNomenclator
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

export async function DELETE(request: NextRequest) {
  const params = request.nextUrl.searchParams;
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
    await connectDB();
    const nomenclatorToDelete = await MaterialNomenclator.findById(params.get("id"));

    if (!nomenclatorToDelete) {
      return NextResponse.json(
        {
          ok: false,
          message: "El nomenclador a borrar no existe"
        },
        {
          status: 404
        }
      );
    }

    const deletedNomenclator = await MaterialNomenclator.findByIdAndDelete(params.get("id"));

    return new NextResponse(
      JSON.stringify({
        ok: true,
        deletedNomenclator
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

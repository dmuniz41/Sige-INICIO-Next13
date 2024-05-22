import { NextRequest, NextResponse } from "next/server";

import { connectDB } from "@/libs/mongodb";
import { generateRandomString } from "@/helpers/randomStrings";
import { verifyJWT } from "@/libs/jwt";
import Nomenclator from "@/models/nomenclator";

export async function POST(request: NextRequest) {
  const { category, code } = await request.json();
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
    let DBNomenclator = await Nomenclator.findOne({ category, code });

    if (DBNomenclator) {
      return NextResponse.json(
        {
          ok: false,
          message: "Ya existe un nomenclador en esa categoría con ese código"
        },
        {
          status: 409
        }
      );
    }

    let newKey = generateRandomString(26);

    const newNomenclator = new Nomenclator({
      key: newKey,
      code,
      category
    });

    await newNomenclator.save();

    return new NextResponse(
      JSON.stringify({
        ok: true,
        newNomenclator
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
    await connectDB();
    const listOfNomenclators = (await Nomenclator.find()).reverse();

    return new NextResponse(
      JSON.stringify({
        ok: true,
        listOfNomenclators
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

export async function PUT(request: NextRequest) {
  const { id, code, category } = await request.json();
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
    const nomenclatorToUpdate = await Nomenclator.findById(id);

    if (!nomenclatorToUpdate) {
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

    const updatedNomenclator = await Nomenclator.findByIdAndUpdate(
      id,
      { code, category },
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
    const nomenclatorToDelete = await Nomenclator.findById(params.get("id"));

    if (!nomenclatorToDelete) {
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

    const deletedNomenclator = await Nomenclator.findByIdAndDelete(params.get("id"));

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
      console.log("🚀 ~ DELETE ~ error:", error)
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

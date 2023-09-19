import { NextResponse } from "next/server";
import { cookies } from "next/headers";

import Nomenclator from "@/models/nomenclator";
import { INomenclator } from "@/models/nomenclator";
import { connectDB } from "@/libs/mongodb";
import { generateRandomString } from "@/helpers/randomStrings";
import { verifyJWT } from "@/libs/jwt";

export async function POST(request: Request) {
  const { category, code } = await request.json();
  const accessToken = request.headers.get("accessToken");
  try {
    if (!accessToken || !verifyJWT(accessToken)) {
      return NextResponse.json(
        {
          ok: false,
          message: "Su sesión ha expirado, por favor autentiquese nuevamente",
        },
        {
          status: 401,
        }
      );
    }
    await connectDB();
    let DBNomenclator = await Nomenclator.findOne({ category, code });

    if (DBNomenclator) {
      return NextResponse.json(
        {
          ok: false,
          msg: "Ya existe un nomenclador con ese ese nombre y tipo",
        },
        {
          status: 409,
        }
      );
    }

    let newKey = generateRandomString(26);

    const newNomenclator = new Nomenclator({
      key: newKey,
      category,
      code,
    });

    await newNomenclator.save();

    return NextResponse.json({
      ok: true,
      message: "Nomenclador creado",
      newNomenclator,
    });
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json(
        {
          ok: false,
          message: error.message,
        },
        {
          status: 400,
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
          message: "Su sesión ha expirado, por favor autentiquese nuevamente",
        },
        {
          status: 401,
        }
      );
    }
    await connectDB();
    const listOfNomenclators = await Nomenclator.find();
    return NextResponse.json({
      ok: true,
      listOfNomenclators,
    });
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json(
        {
          ok: false,
          message: error.message,
        },
        {
          status: 400,
        }
      );
    }
  }
}

export async function PUT(request: Request) {
  const { id, code, category } = await request.json();
  const accessToken = request.headers.get("accessToken");

  try {
    if (!accessToken || !verifyJWT(accessToken)) {
      return NextResponse.json(
        {
          ok: false,
          message: "Su sesión ha expirado, por favor autentiquese nuevamente",
        },
        {
          status: 401,
        }
      );
    }
    await connectDB();
    const nomenclatorToUpdate = await Nomenclator.findById(id);

    if (!nomenclatorToUpdate) {
      return NextResponse.json({
        ok: false,
        message: "El nomenclador a actualizar no existe",
      });
    }

    const updatedNomenclator = await Nomenclator.findByIdAndUpdate(id, { code, category }, { new: true });

    return NextResponse.json({
      ok: true,
      message: "Nomenclador actualizado",
      updatedNomenclator,
    });
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json(
        {
          ok: false,
          message: error.message,
        },
        {
          status: 400,
        }
      );
    }
  }
}

export async function PATCH(request: Request) {
  const { id } = await request.json();
  const accessToken = request.headers.get("accessToken");
  try {
    if (!accessToken || !verifyJWT(accessToken)) {
      return NextResponse.json(
        {
          ok: false,
          message: "Su sesión ha expirado, por favor autentiquese nuevamente",
        },
        {
          status: 401,
        }
      );
    }
    await connectDB();
    const nomenclatorToDelete = await Nomenclator.findById(id);

    if (!nomenclatorToDelete) {
      return NextResponse.json({
        ok: true,
        message: "El nomenclador a borrar no existe",
      });
    }

    const deletedNomenclator = await Nomenclator.findByIdAndDelete(id);

    return NextResponse.json({
      ok: true,
      message: "Nomenclador eliminado",
      deletedNomenclator,
    });
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json(
        {
          ok: false,
          message: error.message,
        },
        {
          status: 400,
        }
      );
    }
  }
}

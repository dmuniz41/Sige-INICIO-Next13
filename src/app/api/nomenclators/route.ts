import { NextResponse } from "next/server";

import Nomenclator from "@/models/nomenclator";
import { INomenclator } from "@/models/nomenclator";
import { connectDB } from "@/libs/mongodb";
import { generateRandomString } from "@/helpers/randomStrings";
import { verifyJWT } from "@/libs/jwt";

export async function POST(request: Request) {
  const { name, tipo } = await request.json();
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
    let DBNomenclator = (await Nomenclator.findOne({ name, tipo })) as INomenclator;
    console.log("🚀 ~ file: route.ts:26 ~ POST ~ DBNomenclator:", DBNomenclator);

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
      name,
      tipo,
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

export async function GET() {
  try {
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
  const { code, description, name } = await request.json();

  try {
    await connectDB();
    const nomenclatorToUpdate = await Nomenclator.findOne({ code });

    if (!nomenclatorToUpdate) {
      return NextResponse.json({
        ok: false,
        message: "El nomenclador a actualizar no existe",
      });
    }

    await Nomenclator.findOneAndUpdate({ code }, { code, name, description }, { new: true });

    return NextResponse.json({
      ok: true,
      message: "Nomenclador actualizado",
      nomenclatorToUpdate,
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
  const { code } = await request.json();

  try {
    await connectDB();
    const nomenclatorToDelete = await Nomenclator.findOne({ code });

    if (!nomenclatorToDelete) {
      return NextResponse.json({
        ok: true,
        message: "El nomenclador a borrar no existe",
      });
    }

    const deletedNomenclator = await Nomenclator.findOneAndDelete({ code });

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

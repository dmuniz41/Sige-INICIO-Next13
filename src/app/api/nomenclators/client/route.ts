import { NextRequest, NextResponse } from "next/server";

import { connectDB } from "@/libs/mongodb";
import { generateRandomString } from "@/helpers/randomStrings";
import { verifyJWT } from "@/libs/jwt";
import ClientNomenclator, { IClientNomenclator } from "@/models/nomenclators/client";

export async function POST(request: Request) {
  const { ...clientNomenclator }: IClientNomenclator = await request.json();
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
    const DBNomenclator = await ClientNomenclator.findOne({
      name: clientNomenclator.name
    });

    // ? LOS NUMEROS DE LOS CLIENTES SE CREAN DE FORMA CONSECUTIVA, DE NO EXISTIR CLIENTES EL PRIMER NUMERO SERÁ 1 //
    const clients = (await ClientNomenclator.find()) as IClientNomenclator[];
    let newId = 0;
    if (clients.length == 0) {
      newId = 1;
    } else {
      newId = clients.at(-1)?.idNumber! + 1;
    }

    if (DBNomenclator) {
      return NextResponse.json(
        {
          ok: false,
          message: "Ya existe un nomenclador de cliente con ese nombre"
        },
        {
          status: 409
        }
      );
    }

    let newKey = generateRandomString(26);

    const newClientNomenclator = new ClientNomenclator({
      ...clientNomenclator,
      idNumber: newId,
      key: newKey
    });

    await newClientNomenclator.save();

    return new NextResponse(
      JSON.stringify({
        ok: true,
        newClientNomenclator
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
    const listOfClientNomenclators = (await ClientNomenclator.find()).reverse();
    return new NextResponse(
      JSON.stringify({
        ok: true,
        counter: listOfClientNomenclators.length,
        listOfClientNomenclators
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
  const { ...clientNomenclator }: IClientNomenclator = await request.json();
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
    const nomenclatorToUpdate = await ClientNomenclator.findById(clientNomenclator._id);

    if (!nomenclatorToUpdate) {
      return NextResponse.json(
        {
          ok: false,
          message: "El nomenclador de cliente a actualizar no existe"
        },
        {
          status: 404
        }
      );
    }

    const updatedNomenclator = await ClientNomenclator.findByIdAndUpdate(
      clientNomenclator._id,
      {
        ...clientNomenclator
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
    const nomenclatorToDelete = await ClientNomenclator.findById(params.get("id"));

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

    const deletedNomenclator = await ClientNomenclator.findByIdAndDelete(params.get("id"));

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

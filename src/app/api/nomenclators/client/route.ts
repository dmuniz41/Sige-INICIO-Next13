import { NextRequest, NextResponse } from "next/server";

import Nomenclator from "@/models/nomenclator";
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
    let DBNomenclator = await ClientNomenclator.findOne({
      $or: [{ name: clientNomenclator.name }, { idNumber: clientNomenclator.idNumber }]
    });

    if (DBNomenclator) {
      return NextResponse.json(
        {
          ok: false,
          message: "Ya existe un nomenclador de cliente con ese nombre o número"
        },
        {
          status: 409
        }
      );
    }

    let newKey = generateRandomString(26);

    const newClientNomenclator = new ClientNomenclator({
      address: clientNomenclator.address,
      email: clientNomenclator.email,
      idNumber: clientNomenclator.idNumber,
      key: newKey,
      name: clientNomenclator.name,
      phoneNumber: clientNomenclator.phoneNumber
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
        }
      }
    );
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json(
        {
          ok: false,
          message: error.message
        },
        {
          status: 400
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
        }
      }
    );
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json(
        {
          ok: false,
          message: error.message
        },
        {
          status: 400
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
      return NextResponse.json({
        ok: false,
        message: "El nomenclador de cliente a actualizar no existe"
      });
    }

    const updatedNomenclator = await ClientNomenclator.findByIdAndUpdate(
      clientNomenclator._id,
      {
        address: clientNomenclator.address,
        email: clientNomenclator.email,
        idNumber: clientNomenclator.idNumber,
        name: clientNomenclator.name,
        phoneNumber: clientNomenclator.phoneNumber
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
        }
      }
    );
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json(
        {
          ok: false,
          message: error.message
        },
        {
          status: 400
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
      return NextResponse.json({
        ok: true,
        message: "El nomenclador a borrar no existe"
      });
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
        }
      }
    );
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json(
        {
          ok: false,
          message: error.message
        },
        {
          status: 400
        }
      );
    }
  }
}

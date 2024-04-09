import { NextRequest, NextResponse } from "next/server";

import { connectDB } from "@/libs/mongodb";
import { generateRandomString } from "@/helpers/randomStrings";
import { verifyJWT } from "@/libs/jwt";
import RepresentativeNomenclator, { IRepresentativeNomenclator } from "@/models/nomenclators/representative";


export async function POST(request: Request) {
  const { ...representativeNomenclator }: IRepresentativeNomenclator = await request.json();
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
    const DBNomenclator = await RepresentativeNomenclator.findOne({
      name: representativeNomenclator.name
    });

    // ? LOS NUMEROS DE LOS REPRESENTANTES SE CREAN DE FORMA CONSECUTIVA, DE NO EXISTIR REPRESENTANTES EL PRIMER NUMERO SERÁ 1 //
    const representatives = (await RepresentativeNomenclator.find()) as IRepresentativeNomenclator[];
    let newId = 0;
    if (representatives.length == 0) {
      newId = 1;
    } else {
      newId = representatives.at(-1)?.idNumber! + 1;
    }

    if (DBNomenclator) {
      return NextResponse.json(
        {
          ok: false,
          message: "Ya existe un nomenclador de representante con ese nombre"
        },
        {
          status: 409
        }
      );
    }

    let newKey = generateRandomString(26);

    const newRepresentativeNomenclator = new RepresentativeNomenclator({
      ...representativeNomenclator,
      idNumber: newId,
      key: newKey,
    });

    await newRepresentativeNomenclator.save();

    return new NextResponse(
      JSON.stringify({
        ok: true,
        newRepresentativeNomenclator
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
      console.log("🚀 ~ POST ~ error:", error)
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
    const listOfRepresentativeNomenclators = (await RepresentativeNomenclator.find()).reverse() as IRepresentativeNomenclator[];
    
    return new NextResponse(
      JSON.stringify({
        ok: true,
        counter: listOfRepresentativeNomenclators.length,
        listOfRepresentativeNomenclators
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
      console.log("🚀 ~ GET ~ error:", error)
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
  const { ...representativeNomenclator }: IRepresentativeNomenclator = await request.json();
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
    const nomenclatorToUpdate = await RepresentativeNomenclator.findById(representativeNomenclator._id);

    if (!nomenclatorToUpdate) {
      return NextResponse.json(
        {
          ok: false,
          message: "El nomenclador de representante a actualizar no existe"
        },
        {
          status: 404
        }
      );
    }

    const updatedNomenclator = await RepresentativeNomenclator.findByIdAndUpdate(
      representativeNomenclator._id,
      {
        ...representativeNomenclator
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
      console.log("🚀 ~ PUT ~ error:", error)
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
    const nomenclatorToDelete = await RepresentativeNomenclator.findById(params.get("id"));

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

    const deletedNomenclator = await RepresentativeNomenclator.findByIdAndDelete(params.get("id"));

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

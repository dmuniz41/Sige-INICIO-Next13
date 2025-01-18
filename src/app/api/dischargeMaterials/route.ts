import { NextRequest, NextResponse } from "next/server";

import { verifyJWT } from "@/libs/jwt";
import { connectDB } from "@/libs/mongodb";
import DischargeMaterials, {
  IDischargeMaterials,
  IDischargeMaterialsList
} from "@/models/dischargeMaterials";
import Offer from "@/models/offer";

export async function GET(request: NextRequest) {
  const url = new URL(request.url);
  const offerId = url.searchParams.get("offerId");

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
    const BDDischargeMaterials = await DischargeMaterials.find({
      offerId: offerId
    });

    return new NextResponse(
      JSON.stringify({
        ok: true,
        dischargeMaterials: BDDischargeMaterials
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

export async function POST(request: NextRequest) {
  const { offerId }: { offerId: string } = await request.json();

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

    const DBDischargeMaterials = await DischargeMaterials.findOne({
      offerId: offerId
    });

    if (DBDischargeMaterials) {
      return NextResponse.json(
        {
          ok: false,
          message: "Ya existe una descarga de materiales para esta oferta"
        },
        {
          status: 409
        }
      );
    }
    const offer = await Offer.findById(offerId);
    const offerMaterialsList = offer?.materialsList;

    //? CONVIERTE EL LISTADO DE MATERIALES DE LA OFFERTA AL TIPO DE LISTADO DE MATERIALES DE DESCARGA DE MATERIALES
    const dischargeMaterialsList: IDischargeMaterialsList[] =
      offerMaterialsList?.map((material: any) => ({
        description: material.description,
        amount: material.amount,
        amountReal: 0,
        difference: 0,
        unitMeasure: material.unitMeasure
      }));

    //? CREA LA NUEVA DESCARGA DE MATERIALES
    const newDischargeMaterials = new DischargeMaterials({
      offerId: offerId,
      updatedAt: new Date(),
      materials: dischargeMaterialsList
    });

    await newDischargeMaterials.save();

    return new NextResponse(
      JSON.stringify({
        ok: true,
        newDischargeMaterials
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

export async function PUT(request: NextRequest) {
  const { ...dischargeMaterials }: IDischargeMaterials = await request.json();

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

    const updatedDischargeMaterials = await DischargeMaterials.findOneAndUpdate(
      { offerId: dischargeMaterials.offerId },
      {
        ...dischargeMaterials,
        updatedAt: new Date()
      },
      { new: true }
    );

    return new NextResponse(
      JSON.stringify({
        ok: true,
        updatedDischargeMaterials
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

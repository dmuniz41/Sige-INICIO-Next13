import { NextRequest, NextResponse } from "next/server";

import { connectDB } from "@/libs/mongodb";
import { verifyJWT } from "@/libs/jwt";
import Project, { IProject } from "@/models/project";
import Offer, { IOffer } from "@/models/offer";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const projectId = searchParams.get("projectId");

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
    const BDProject = await Project.findById<IProject>(projectId);

    if (!BDProject) {
      return NextResponse.json(
        {
          ok: false,
          message: "El proyecto no existe"
        },
        {
          status: 404
        }
      );
    }

    const DBOffer = await Offer.findById<IOffer>(BDProject?.finalOfferId);

    if (!DBOffer) {
      return NextResponse.json(
        {
          ok: false,
          message: "La oferta no existe"
        },
        {
          status: 404
        }
      );
    }

    const materialList = DBOffer?.materialsList ?? [];
    const itemsList = DBOffer.itemsList ?? [];

    const result = materialList.map((material) => {
      const matchingItem = itemsList.find((item) => item.key === material.itemId);
      return { material: material.description, amount: material.amount, unitMeasure: material.unitMeasure, ItemDescription: matchingItem?.description };
    });

    return new NextResponse(
      JSON.stringify({
        ok: true,
        result
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

import { NextRequest, NextResponse } from "next/server";

import { connectDB } from "@/libs/mongodb";
import { verifyJWT } from "@/libs/jwt";
import Offer from "@/models/offer";

export async function GET(request: NextRequest) {
  const accessToken = request.headers.get("accessToken");
  const { pathname } = request.nextUrl;
  const urlParams = pathname.split("/");
  const projectId = urlParams[3];
  console.log("🚀 ~ GET ~ projectId:", projectId)
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
    const BDOffer = await Offer.findOne({projectId: projectId});
    return new NextResponse(
      JSON.stringify({
        ok: true,
        BDOffer,
      }),
      {
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Content-Type": "application/json",
        },
      }
    );
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

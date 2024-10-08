import { NextRequest, NextResponse } from "next/server";

import { connectDB } from "@/libs/mongodb";
import { verifyJWT } from "@/libs/jwt";
import Material from "@/models/material";

export async function GET(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const accessToken = request.headers.get("accessToken");
  const urlParams = pathname.split("/");
  const warehouse = urlParams[3];

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
    const listOfMaterials = (await Material.find({ warehouse })).reverse();

    return new NextResponse(
      JSON.stringify({
        ok: true,
        listOfMaterials
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

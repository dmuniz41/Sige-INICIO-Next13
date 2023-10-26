import { verifyJWT } from "@/libs/jwt";
import { connectDB } from "@/libs/mongodb";
import CostSheet from "@/models/costSheet";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const accessToken = request.headers.get("accessToken");
  const { pathname } = request.nextUrl;
  const urlParams = pathname.split("/");
  const costSheetId = urlParams[3];
  console.log("🚀 ~ file: route.ts:11 ~ GET ~ costSheetTaskName:", costSheetId)
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
    const BDCostSheet = await CostSheet.findById(costSheetId);
    return new NextResponse(
      JSON.stringify({
        ok: true,
        BDCostSheet,
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

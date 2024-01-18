import { verifyJWT } from "@/libs/jwt";
import { connectDB } from "@/libs/mongodb";
import ServiceFee from "@/models/serviceFees";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const accessToken = request.headers.get("accessToken");
  const { pathname } = request.nextUrl;
  const urlParams = pathname.split("/");
  const serviceFeeId = urlParams[3];
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
    const BDServiceFee = await ServiceFee.findById(serviceFeeId);
    return new NextResponse(
      JSON.stringify({
        ok: true,
        BDServiceFee,
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

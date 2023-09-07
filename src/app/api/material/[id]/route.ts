import { verifyJWT } from "@/libs/jwt";
import { connectDB } from "@/libs/mongodb";
import Material from "@/models/material";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const accessToken = request.headers.get("accessToken");
  const { pathname } = request.nextUrl;
  const urlParams = pathname.split("/");
  const warehouse = urlParams[3];
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
    const listOfMaterials = await Material.find({ warehouse });
    return NextResponse.json({
      ok: true,
      listOfMaterials,
    });
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json(
        {
          ok: false,
          message: "Error al listar los materiales",
        },
        {
          status: 400,
        }
      );
    }
  }
}

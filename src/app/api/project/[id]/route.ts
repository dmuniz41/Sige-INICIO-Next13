import { NextRequest, NextResponse } from "next/server";

import { connectDB } from "@/libs/mongodb";
import { verifyJWT } from "@/libs/jwt";
import Project from "@/models/project";

export async function GET(request: NextRequest) {
  const accessToken = request.headers.get("accessToken");
  const { pathname } = request.nextUrl;
  const urlParams = pathname.split("/");
  const projectId = urlParams[3];
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
    const BDProject = await Project.findById(projectId);
    console.log("🚀 ~ GET ~ BDProject:", BDProject)
    
    return new NextResponse(
      JSON.stringify({
        ok: true,
        BDProject,
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
      console.log("🚀 ~ GET ~ error:", error)
      return NextResponse.json(
        {
          ok: false,
          message: error.message,
        },
        {
          status: 500,
        }
      );
    }
  }
}

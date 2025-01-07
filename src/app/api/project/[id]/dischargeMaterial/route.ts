import { NextRequest, NextResponse } from "next/server";
import { useParams } from "next/navigation";

import { connectDB } from "@/libs/mongodb";
import { verifyJWT } from "@/libs/jwt";
import ProjectMaterialsDischarge, {
  IProjectMaterialsDischarge
} from "@/models/projectMaterialsDischarge";
import Project, { IProject } from "@/models/project";

export async function POST(request: NextRequest) {
  const params = useParams();
  const { id } = params;

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
    const BDProjectMaterialDischarge =
      await ProjectMaterialsDischarge.findById<IProjectMaterialsDischarge>(id);

    if (BDProjectMaterialDischarge) {
      return NextResponse.json(
        {
          ok: false,
          message:
            "El elemento de descaraga de materiales ya existe para este proyecto"
        },
        {
          status: 404
        }
      );
    }

    const BDProject = await Project.findById<IProject>(id);

    const newProjectMaterialsDischarge = new ProjectMaterialsDischarge({
      projectId: id,
      projectName: BDProject?.projectName,
      itemsList: [],
      materialsList: [],
      totalValue: 0,
      totalCost: 0
    });

    await newProjectMaterialsDischarge.save();

    return NextResponse.json(
      {
        ok: true,
        newProjectMaterialsDischarge
      },
      {
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Content-Type": "application/json"
        }
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

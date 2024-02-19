import { NextResponse } from "next/server";

import { connectDB } from "@/libs/mongodb";
import { generateRandomString } from "@/helpers/randomStrings";
import { verifyJWT } from "@/libs/jwt";
import Project, { IProject } from "@/models/project";

export async function POST(request: Request) {
  const { ...project }: IProject = await request.json();
  const accessToken = request.headers.get("accessToken");
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
    let DBProject = await Project.findOne({ projectName: project.projectName });

    if (DBProject) {
      return NextResponse.json(
        {
          ok: false,
          message: "Ya existe un proyecto con ese nombre",
        },
        {
          status: 409,
        }
      );
    }

    let newKey = generateRandomString(26);

    const newProject = new Project({
      key: newKey,
      clientNumber: project.clientNumber,
      clientName: project.clientName,
      projectName: project.projectName,
      payMethod: project.payMethod,
      currency: project.currency,
      initDate: project.initDate,
      deliveryDate: project.deliveryDate,
      projectNumber: project.projectNumber,
      itemsList: project.itemsList,
      status: project.status,
      expenses: project.expenses,
      profits: project.profits,
      totalValue: project.totalValue,
    });

    await newProject.save();

    return new NextResponse(
      JSON.stringify({
        ok: true,
        newProject,
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
export async function PUT(request: Request) {
  const { ...project }: IProject = await request.json();
  const accessToken = request.headers.get("accessToken");
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
    let DBProject = await Project.findById(project._id);

    if (!DBProject) {
      return NextResponse.json(
        {
          ok: false,
          message: "El proyecto a actualizar no existe",
        },
        {
          status: 409,
        }
      );
    }

    const updatedProject = await Project.findByIdAndUpdate(
      project._id,
      {
        clientNumber: project.clientNumber,
        clientName: project.clientName,
        projectName: project.projectName,
        payMethod: project.payMethod,
        currency: project.currency,
        initDate: project.initDate,
        deliveryDate: project.deliveryDate,
        projectNumber: project.projectNumber,
        itemsList: project.itemsList,
        status: project.status,
        expenses: project.expenses,
        profits: project.profits,
        totalValue: project.totalValue,
      }
    );
    console.log("🚀 ~ PUT ~ updatedProject:", updatedProject)

    return new NextResponse(
      JSON.stringify({
        ok: true,
        updatedProject,
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
export async function GET(request: Request) {
  const accessToken = request.headers.get("accessToken");
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
    const listOfProjects = (await Project.find()).reverse();
    return new NextResponse(
      JSON.stringify({
        ok: true,
        projectCounter: listOfProjects.length,
        listOfProjects,
      }),
      {
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Content-Type": "application/json",
        },
        status: 200,
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
export async function PATCH(request: Request) {
  const { id } = await request.json();
  const accessToken = request.headers.get("accessToken");

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
    const projectToDelete = await Project.findByIdAndDelete(id);

    if (!projectToDelete) {
      return NextResponse.json({
        ok: true,
        message: "El proyecto a borrar no existe",
      });
    }

    if (projectToDelete) {
      await Project.findByIdAndDelete(id);
    }
    return new NextResponse(
      JSON.stringify({
        ok: true,
        projectToDelete,
      }),
      {
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Content-Type": "application/json",
        },
        status: 200,
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

import { NextRequest, NextResponse } from "next/server";
import moment from "moment";

import { connectDB } from "@/libs/mongodb";
import { generateRandomString } from "@/helpers/randomStrings";
import { verifyJWT } from "@/libs/jwt";
import Offer from "@/models/offer";
import Project, { IProject } from "@/models/project";

export async function POST(request: NextRequest) {
  const { ...project }: IProject = await request.json();
  const accessToken = request.headers.get("accessToken");
  let newProjectNumber = "";
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
    let DBProject = await Project.findOne({
      $or: [{ projectName: project.projectName }, { projectNumber: project.projectNumber }]
    });

    if (DBProject) {
      return NextResponse.json(
        {
          ok: false,
          message:
            "Ya existe un proyecto con ese nombre o número de solicitud.\n (El nombre de los proyectos y número de solicitud deben ser únicos)"
        },
        {
          status: 409
        }
      );
    }

    let newKey = generateRandomString(26);
    const simplifyYear = moment().year() % 100;

    if (project.payMethod === "EFECTIVO") {
      const arrayLength = (await Project.find({ payMethod: "EFECTIVO" })).length;
      newProjectNumber = `${arrayLength + 1}/${simplifyYear}`;
    } else if (project.payMethod !== "EFECTIVO") {
      const arrayLength = (await Project.find({ $nor: [{ payMethod: "EFECTIVO" }] })).length;
      newProjectNumber = `${arrayLength + 1}/${simplifyYear}`;
    }

    const newProject = new Project({
      clientName: project.clientName,
      clientNumber: project.clientNumber,
      currency: project.currency,
      deliveryDate: project.deliveryDate,
      expenses: project.expenses ?? 0,
      finalOfferId: project.finalOfferId ?? "",
      initDate: project.initDate,
      itemsList: project.itemsList,
      key: newKey,
      payMethod: project.payMethod,
      profits: project.profits ?? 0,
      projectName: project.projectName,
      projectNumber: newProjectNumber,
      status: project.status,
      totalValue: project.totalValue ?? 0
    });

    await newProject.save();

    return new NextResponse(
      JSON.stringify({
        ok: true,
        newProject
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
      return NextResponse.json(
        {
          ok: false,
          message: error.message
        },
        {
          status: 400
        }
      );
    }
  }
}

export async function PUT(request: NextRequest) {
  const { ...project }: IProject = await request.json();
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
    let DBProject = await Project.findById(project._id);

    if (!DBProject) {
      return NextResponse.json(
        {
          ok: false,
          message: "El proyecto a actualizar no existe"
        },
        {
          status: 409
        }
      );
    }

    const updatedProject = await Project.findByIdAndUpdate(
      project._id,
      {
        clientName: project.clientName,
        clientNumber: project.clientNumber,
        currency: project.currency,
        deliveryDate: project.deliveryDate,
        expenses: project.expenses ?? 0,
        finalOfferId: project.finalOfferId,
        initDate: project.initDate,
        itemsList: project.itemsList,
        payMethod: project.payMethod,
        profits: project.profits ?? 0,
        projectName: project.projectName,
        status: project.status,
        totalValue: project.totalValue ?? 0
      },
      { new: true }
    );

    return new NextResponse(
      JSON.stringify({
        ok: true,
        updatedProject
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
      return NextResponse.json(
        {
          ok: false,
          message: error.message
        },
        {
          status: 400
        }
      );
    }
  }
}

export async function GET(request: NextRequest) {
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
    const listOfProjects = (await Project.find()).reverse();
    return new NextResponse(
      JSON.stringify({
        ok: true,
        projectCounter: listOfProjects.length,
        listOfProjects
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
      return NextResponse.json(
        {
          ok: false,
          message: error.message
        },
        {
          status: 400
        }
      );
    }
  }
}

export async function PATCH(request: NextRequest) {
  const { id } = await request.json();
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
    const projectToDelete = await Project.findByIdAndDelete(id);

    if (!projectToDelete) {
      return NextResponse.json({
        ok: true,
        message: "El proyecto a borrar no existe"
      });
    }

    if (projectToDelete) {
      await Project.findByIdAndDelete(id);
      const offersToDelete = await Offer.find({ projectId: id });
      offersToDelete.map(async (offer: any) => await Offer.findByIdAndDelete(offer._id));
    }
    return new NextResponse(
      JSON.stringify({
        ok: true,
        projectToDelete
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
      return NextResponse.json(
        {
          ok: false,
          message: error.message
        },
        {
          status: 400
        }
      );
    }
  }
}

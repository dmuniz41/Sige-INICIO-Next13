import { NextRequest, NextResponse } from "next/server";

import { connectDB } from "@/libs/mongodb";
import { generateRandomString } from "@/helpers/randomStrings";
import { verifyJWT } from "@/libs/jwt";
import Worker, { IWorker } from "@/models/worker";

export async function POST(request: NextRequest) {
  const { ...worker }: IWorker = await request.json();
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
    const BDworker = await Worker.findOne({ $or: [{ CI: worker.CI }, { name: worker.name }] });

    if (BDworker) {
      return NextResponse.json(
        {
          ok: false,
          message: "Ya existe un trabajador con ese carnet de identidad o nombre"
        },
        {
          status: 409
        }
      );
    }

    const newKey = generateRandomString(26);

    const newWorker = new Worker({ ...worker, key: newKey });

    await newWorker.save();

    return new NextResponse(
      JSON.stringify({
        ok: true,
        newWorker
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
    const listOfWorkers = (await Worker.find()).reverse();
    return new NextResponse(
      JSON.stringify({
        ok: true,
        listOfWorkers
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

export async function PUT(request: NextRequest) {
  const { ...worker } = await request.json();
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
    const workerToUpdate = await Worker.findById(worker._id);

    if (!workerToUpdate) {
      return NextResponse.json(
        {
          ok: false,
          message: "El trabajador a actualizar no existe"
        },
        {
          status: 409
        }
      );
    }

    const updatedWorker = await Worker.findByIdAndUpdate(worker._id, { ...worker }, { new: true });

    return new NextResponse(
      JSON.stringify({
        ok: true,
        updatedWorker
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
      console.log("🚀 ~ PUT ~ error:", error);
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

export async function DELETE(request: NextRequest) {
  const params = request.nextUrl.searchParams;
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
    const workerToDelete = await Worker.findById(params.get("id"));

    if (!workerToDelete) {
      return NextResponse.json(
        {
          ok: true,
          message: "El trabajador a borrar no existe"
        },
        {
          status: 404
        }
      );
    }

    const deletedWorker = await Worker.findByIdAndDelete(params.get("id"));

    return new NextResponse(
      JSON.stringify({
        ok: true,
        deletedWorker
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
      console.log("🚀 ~ DELETE ~ error:", error);
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

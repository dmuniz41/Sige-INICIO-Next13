import { connectDB } from "@/libs/mongodb";
import { generateRandomString } from "@/helpers/randomStrings";
import { NextRequest, NextResponse } from "next/server";
import { verifyJWT } from "@/libs/jwt";
import ServiceFeeTask, { IServiceFeeTask } from "@/models/serviceFeeTask";
import { updateServiceFeeWhenTask } from "@/helpers/updateServiceFeeWhenTask";
import ServiceFee from "@/models/serviceFees";

export async function POST(request: NextRequest) {
  const { ...serviceFeeTask }: IServiceFeeTask = await request.json();
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

    const BDServiceFeeTask = await ServiceFeeTask.findOne({description: serviceFeeTask.description});

    // * La descripcion de las tareas tienen que ser unicas
    if (BDServiceFeeTask) {
      return NextResponse.json(
        {
          ok: false,
          message: "Ya existe una tarea con ese nombre",
        },
        {
          status: 409,
        }
      );
    }

    const newKey = generateRandomString(26);

    const newServiceFeeTask = new ServiceFeeTask({
      amount: serviceFeeTask.amount,
      category: serviceFeeTask.category,
      description: serviceFeeTask.description,
      // price: serviceFeeTask.price,
      unitMeasure: serviceFeeTask.unitMeasure,
      complexity: serviceFeeTask.complexity,
      key: newKey
    });

    await newServiceFeeTask.save();

    return new NextResponse(
      JSON.stringify({
        ok: true,
        newServiceFeeTask,
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
          message: "Error al crear tarea",
        },
        {
          status: 400,
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
          message: "Su sesión ha expirado, por favor autentiquese nuevamente",
        },
        {
          status: 401,
        }
      );
    }
    await connectDB();
    const listOfTasks = await ServiceFeeTask.find();
    return new NextResponse(
      JSON.stringify({
        ok: true,
        listOfTasks,
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
          message: "Error al obtener las tareas para las tarifas de servicio",
        },
        {
          status: 400,
        }
      );
    }
  }
}

export async function PUT(request: NextRequest) {
  const { ...serviceFeeTask }: IServiceFeeTask = await request.json();
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

    if (!(await ServiceFeeTask.findById({ _id: serviceFeeTask?._id }))) {
      return NextResponse.json(
        {
          ok: false,
          message: "La tarea no existe",
        },
        {
          status: 409,
        }
      );
    }

    const updatedServiceFeeTask = await ServiceFeeTask.findByIdAndUpdate(
      { _id: serviceFeeTask?._id },
      {
        amount: serviceFeeTask.amount,
        category: serviceFeeTask.category,
        description: serviceFeeTask.description,
        // price: serviceFeeTask.price,
        complexity: serviceFeeTask.complexity,
        unitMeasure: serviceFeeTask.unitMeasure
      },
      { new: true }
    );

    await updateServiceFeeWhenTask(updatedServiceFeeTask, await ServiceFee.find());

    return new NextResponse(
      JSON.stringify({
        ok: true,
        updatedServiceFeeTask,
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
          message: "Error al actualizar la tarea",
        },
        {
          status: 400,
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
          message: "Su sesión ha expirado, por favor autentiquese nuevamente",
        },
        {
          status: 401,
        }
      );
    }
    await connectDB();

    if (!(await ServiceFeeTask.findById(params.get("id")))) {
      return NextResponse.json({
        ok: true,
        message: "La tarea a borrar no existe"
      });
    }

    const deletedServiceFeeTask = await ServiceFeeTask.findById(params.get("id"));

    return new NextResponse(
      JSON.stringify({
        ok: true,
        deletedServiceFeeTask,
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
          message: "Error al eliminar la tarea",
        },
        {
          status: 400,
        }
      );
    }
  }
}

import { connectDB } from "@/libs/mongodb";
import Worker from "@/models/worker";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const { name, CI, role, address, phoneNumber, bankAccount } = await request.json();

  try {
    await connectDB();
    const BDworker = await Worker.findOne({ CI });

    if (BDworker) {
      return NextResponse.json(
        {
          ok: false,
          message: "Ya existe un trabajador con ese carnet de identidad",
        },
        {
          status: 409,
        }
      );
    }

    const newWorker = new Worker({
      name,
      CI,
      role,
      address,
      phoneNumber,
      bankAccount,
      key: name,
    });

    await newWorker.save();

    return new NextResponse(
      JSON.stringify({
        ok: true,
        newWorker,
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
          message: "Error al crear el trabajador",
        },
        {
          status: 400,
        }
      );
    }
  }
}

export async function GET() {
  try {
    await connectDB();
    const listOfWorkers = (await Worker.find()).reverse();
    return new NextResponse(
      JSON.stringify({
        ok: true,
        listOfWorkers,
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
          message: "Error al listar los trabajadores",
        },
        {
          status: 400,
        }
      );
    }
  }
}

export async function PUT(request: Request) {
  const { _id, name, CI, role, address, phoneNumber, bankAccount } = await request.json();

  try {
    await connectDB();
    const workerToUpdate = await Worker.findById(_id);


    if (!workerToUpdate) {
      return NextResponse.json(
        {
          ok: false,
          message: "El trabajador a actualizar no existe",
        },
        {
          status: 409,
        }
      );
    }
  

    const updatedWorker =  await Worker.findByIdAndUpdate( _id , { name, CI, role, address, phoneNumber, bankAccount }, { new: true });

    return new NextResponse(
      JSON.stringify({
        ok: true,
        updatedWorker,
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
          message: "Error al actualizar el trabajador (Revise que los datos introducidos son correctos)",
        },
        {
          status: 400,
        }
      );
    }
  }
}

export async function PATCH(request: Request) {
  const { CI } = await request.json();

  try {
    await connectDB();
    const workerToDelete = await Worker.findOne({ CI });

    if (!workerToDelete) {
      return NextResponse.json({
        ok: true,
        message: "El trabajador a borrar no existe",
      });
    }

    const deletedWorker = await Worker.findOneAndDelete({ CI });

    return new NextResponse(
      JSON.stringify({
        ok: true,
        deletedWorker,
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
          message: "Error al eliminar el trabajador",
        },
        {
          status: 400,
        }
      );
    }
  }
}

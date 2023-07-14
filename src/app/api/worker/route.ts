import { connectDB } from "@/libs/mongodb";
import Worker from "@/models/worker";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const { name, CI, role, address, phoneNumber, bankAccount } = await request.json();

  try {
    await connectDB();
    const BDworker = await Worker.findOne({ name });

    if (BDworker) {
      return NextResponse.json(
        {
          ok: false,
          msg: "Ya existe un trabajador con ese nombre",
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

    return NextResponse.json({
      ok: true,
      message: "Trabajador creado",
      newWorker,
    });
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

export async function GET() {
  try {
    await connectDB();
    const listOfWorkers = await Worker.find();
    return NextResponse.json({
      ok: true,
      listOfWorkers,
    });
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
  const { name, CI, role, address, phoneNumber, bankAccount } = await request.json();

  try {
    await connectDB();
    const workerToUpdate = await Worker.findOne({ name });

    if (!workerToUpdate) {
      return NextResponse.json({
        ok: false,
        message: "El trabajador a actualizar no existe",
      });
    }

    await Worker.findOneAndUpdate({ name }, { name, CI, role, address, phoneNumber, bankAccount }, { new: true });

    return NextResponse.json({
      ok: true,
      message: "Trabajador actualizado",
      workerToUpdate,
    });
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
  const { name } = await request.json();

  try {
    await connectDB();
    const workerToDelete = await Worker.findOne({ name });

    if (!workerToDelete) {
      return NextResponse.json({
        ok: true,
        message: "El trabajador a borrar no existe",
      });
    }

    const deletedWorker = await Worker.findOneAndDelete({ name });

    return NextResponse.json({
      ok: true,
      message: "Trabajador eliminado",
      deletedWorker,
    });
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

import { connectDB } from "@/libs/mongodb";
import Warehouse from "@/models/warehouse";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const { name, totalValue = 0, materials = [] } = await request.json();

  try {
    await connectDB();
    const BDWarehouse = await Warehouse.findOne({ name });

    if (BDWarehouse) {
      return NextResponse.json(
        {
          ok: false,
          msg: "Ya existe un almacén con ese nombre",
        },
        {
          status: 409,
        }
      );
    }

    const newWarehouse = new Warehouse({
      name,
      totalValue,
      materials,
      key: name,
    });

    newWarehouse.index();

    await newWarehouse.save();

    return NextResponse.json({
      ok: true,
      message: "Almacén creado creado",
      newWarehouse,
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
    const listOfWarehouses = await Warehouse.find();
    return NextResponse.json({
      ok: true,
      listOfWarehouses,
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

import { NextRequest, NextResponse } from "next/server";

import { connectDB } from "@/libs/mongodb";
import { verifyJWT } from "@/libs/jwt";
import Warehouse, { IWarehouse } from "@/models/warehouse";

export async function POST(request: NextRequest) {
  const { ...warehouse }: IWarehouse = await request.json();
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
    const BDWarehouse = await Warehouse.findOne({ name });

    if (BDWarehouse) {
      return NextResponse.json(
        {
          ok: false,
          message: "Ya existe un almacén con ese nombre",
        },
        {
          status: 409,
        }
      );
    }

    const newWarehouse = new Warehouse({
      ...warehouse,
      key: name,
    });

    await newWarehouse.save();

    return new NextResponse(
      JSON.stringify({
        ok: true,
        newWarehouse,
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
          message: error,
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
    const listOfWarehouses = (await Warehouse.find()).reverse();
    return new NextResponse(
      JSON.stringify({
        ok: true,
        listOfWarehouses,
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
          message: 'Error al listar los almacenes',
        },
        {
          status: 400,
        }
      );
    }
  }
}

export async function PUT(request: NextRequest) {
  const { _id, name} = await request.json();
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
    const warehouseToUpdate = await Warehouse.findById({ _id });

    if (!warehouseToUpdate) {
      return NextResponse.json({
        ok: false,
        message: "El almacen a actualizar no existe",
      },
      {
        status: 409
      }
      );
    }

    const updatedWarehouse = await Warehouse.findByIdAndUpdate({ _id }, { name}, { new: true });

    return new NextResponse(
      JSON.stringify({
        ok: true,
        updatedWarehouse,
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
          message: 'Error al actualizar el almacén (Revise que los datos introducidos son correctos)',
        },
        {
          status: 400,
        }
      );
    }
  }
}

export async function PATCH(request: NextRequest) {
  const { name } = await request.json();
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
    const warehouseToDelete = await Warehouse.findOne({ name });

    if (!warehouseToDelete) {
      return NextResponse.json({
        ok: true,
        message: "El almacén a borrar no existe",
      });
    }

    const deletedWarehouse = await Warehouse.findOneAndDelete({ name });

    return new NextResponse(
      JSON.stringify({
        ok: true,
        deletedWarehouse,
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
          message: 'Error al eliminar el almacén',
        },
        {
          status: 400,
        }
      );
    }
  }
}
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
          message: "Su sesión ha expirado, por favor autentiquese nuevamente"
        },
        {
          status: 401
        }
      );
    }
    await connectDB();
    const BDWarehouse = await Warehouse.findOne({ name: warehouse.name });

    if (BDWarehouse) {
      return NextResponse.json(
        {
          ok: false,
          message: "Ya existe un almacén con ese nombre"
        },
        {
          status: 409
        }
      );
    }

    const newWarehouse = new Warehouse({
      ...warehouse,
      key: warehouse.name
    });

    await newWarehouse.save();

    return new NextResponse(
      JSON.stringify({
        ok: true,
        newWarehouse
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
    const listOfWarehouses = (await Warehouse.find()).reverse();
    return new NextResponse(
      JSON.stringify({
        ok: true,
        listOfWarehouses
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
  const { _id, name } = await request.json();
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
    const warehouseToUpdate = await Warehouse.findById({ _id });

    if (!warehouseToUpdate) {
      return NextResponse.json(
        {
          ok: false,
          message: "El almacen a actualizar no existe"
        },
        {
          status: 404
        }
      );
    }

    const updatedWarehouse = await Warehouse.findByIdAndUpdate({ _id }, { name }, { new: true });

    return new NextResponse(
      JSON.stringify({
        ok: true,
        updatedWarehouse
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
    const warehouseToDelete = await Warehouse.findById(params.get("id"));

    if (!warehouseToDelete) {
      return NextResponse.json(
        {
          ok: true,
          message: "El almacén a borrar no existe"
        },
        {
          status: 404
        }
      );
    }

    const deletedWarehouse = await Warehouse.findByIdAndDelete(params.get("id"));

    return new NextResponse(
      JSON.stringify({
        ok: true,
        deletedWarehouse
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

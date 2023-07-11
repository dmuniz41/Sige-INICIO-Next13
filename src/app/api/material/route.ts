import { connectDB } from "@/libs/mongodb";
import Material from "@/models/material";
import { NextResponse } from "next/server";


export async function POST(request: Request) {
  const { name, category, unitMeasure, costPrice, minimumExistence } = await request.json();

  try {
    await connectDB();
    const BDMaterial = await Material.findOne({ name });

    if (BDMaterial) {
      return NextResponse.json(
        {
          ok: false,
          msg: "Ya existe un material con ese nombre",
        },
        {
          status: 409,
        }
      );
    }

    const newMaterial = new Material({
      name,
      category,
      unitMeasure, 
      costPrice, 
      minimumExistence,
      key: name,
    });

    await newMaterial.save();

    return NextResponse.json({
      ok: true,
      message: "Material creado",
      newMaterial,
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
    const listOfMaterials = await Material.find();
    return NextResponse.json({
      ok: true,
      listOfMaterials,
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
  const { name, category, unitMeasure, costPrice, minimumExistence } = await request.json();

  try {
    await connectDB();
    const materialToUpdate = await Material.findOne({ name });

    if (!materialToUpdate) {
      return NextResponse.json({
        ok: false,
        message: "El material a actualizar no existe",
      });
    }

    await Material.findOneAndUpdate({ name }, { name, category, unitMeasure, costPrice, minimumExistence }, { new: true });

    return NextResponse.json({
      ok: true,
      message: "Material actualizado",
      materialToUpdate,
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
    const materialToDelete = await Material.findOne({ name });

    if (!materialToDelete) {
      return NextResponse.json({
        ok: true,
        message: "El material a borrar no existe",
      });
    }

    const deletedMaterial = await Material.findOneAndDelete({ name });

    return NextResponse.json({
      ok: true,
      message: "Material eliminado",
      deletedMaterial,
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
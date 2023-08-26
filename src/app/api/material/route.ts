import { connectDB } from "@/libs/mongodb";
import moment from "moment";
import { NextResponse } from "next/server";

import Material, { IMaterial } from "@/models/material";
import Operation from "@/models/operation";

// TODO: Hacer que se vean las operaciones de adicion y sustraccion de materiales

export async function POST(request: Request) {
  const { operation, materialName, category, unitMeasure, costPerUnit, minimumExistence = 1, unitsTotal = 0 } = await request.json();

  let date = moment();
  let currentDate = date.format("MMMM Do YYYY, h:mm:ss a");

  try {
    await connectDB();
    let BDMaterial = (await Material.findOne({ materialName, category, costPerUnit })) as IMaterial;

    // * Si ya existe un material con ese código suma la cantidad que se está entrando al total y agrega la nueva operacion a la lista de operaciones del material ya existente*

    if (BDMaterial && operation.tipo === "Añadir") {
      let newTotal = BDMaterial.unitsTotal + operation?.amount;
      let UpdatedMaterial = await Material.findOneAndUpdate(
        { materialName, category, costPerUnit },
        { $push: { operations: operation }, materialName, category, unitMeasure, costPerUnit, minimumExistence, unitsTotal: newTotal },
        { new: true }
      );
      return NextResponse.json(
        {
          ok: true,
          msg: "Material añadido",
          UpdatedMaterial,
        },
        {
          status: 409,
        }
      );
    }
    // * Si ya existe un material con ese código sustrae la cantidad que se está entrando al total  agrega la nueva operacion a la lista de operaciones del material ya existente*

    if (BDMaterial && operation.type === "Sustraer") {
      let newTotal = BDMaterial.unitsTotal - operation?.amount;
      let UpdatedMaterial = await Material.findOneAndUpdate(
        { materialName, category, costPerUnit },
        { materialName, category, unitMeasure, costPerUnit, minimumExistence, unitsTotal: newTotal },
        { new: true }
      );
      return NextResponse.json(
        {
          ok: true,
          msg: "Material sustraído",
          UpdatedMaterial,
        },
        {
          status: 409,
        }
      );
      // * Si no existe un material con ese código crea una nueva entrada en el almacén *
    } else {
      let newOperation = new Operation(operation);

      console.log("Nuevo material");
      const newMaterial = new Material({
        materialName,
        category,
        unitMeasure,
        costPerUnit,
        minimumExistence,
        enterDate: currentDate,
        unitsTotal: operation?.amount,
        key: materialName,
        code: category + materialName + costPerUnit,
      });

      newMaterial.operations.push(newOperation);

      await newMaterial.save();
      return NextResponse.json({
        ok: true,
        message: "Material creado",
        id: newMaterial._id.toString(),
        newMaterial,
      });
    }
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
  const { materialName, category, unitMeasure, costPerUnit, minimumExistence = 1, enterDate, unitsTotal = 0 } = await request.json();

  try {
    await connectDB();
    const materialToUpdate = await Material.findOne({ name });

    if (!materialToUpdate) {
      return NextResponse.json({
        ok: false,
        message: "El material a actualizar no existe",
      });
    }

    await Material.findOneAndUpdate(
      { materialName },
      { materialName, category, unitMeasure, costPerUnit, minimumExistence, enterDate, unitsTotal },
      { new: true }
    );

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
  const { materialName } = await request.json();

  try {
    await connectDB();
    const materialToDelete = await Material.findOne({ materialName });

    if (!materialToDelete) {
      return NextResponse.json({
        ok: true,
        message: "El material a borrar no existe",
      });
    }

    const deletedMaterial = await Material.findOneAndDelete({ materialName });

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

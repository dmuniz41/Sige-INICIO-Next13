import { connectDB } from "@/libs/mongodb";
import moment from "moment";
import { NextResponse } from "next/server";

import Material, { IMaterial } from "@/models/material";
import Operation from "@/models/operation";
import { verifyJWT } from "@/libs/jwt";

export async function POST(request: Request) {
  const { warehouse ,operation, materialName, category, unitMeasure, costPerUnit, minimumExistence = 1 } = await request.json();
  const accessToken = request.headers.get("accessToken");

  let date = moment();
  let currentDate = date.format("MMMM Do YYYY, h:mm:ss a");

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

    if (BDMaterial && operation.tipo === "Sustraer") {
      let newTotal = BDMaterial.unitsTotal - operation?.amount;
      let UpdatedMaterial = await Material.findOneAndUpdate(
        { materialName, category, costPerUnit },
        { $push: { operations: operation }, materialName, category, unitMeasure, costPerUnit, minimumExistence, unitsTotal: newTotal },
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

      const newMaterial = new Material({
        code: category + materialName + costPerUnit,
        materialName,
        category,
        unitMeasure,
        costPerUnit,
        minimumExistence,
        warehouse,
        enterDate: currentDate,
        unitsTotal: operation?.amount,
        key: category + materialName + costPerUnit,
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

export async function GET(request: Request) {
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
  const { minimumExistence = 1, code } = await request.json();
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
    const materialToUpdate = await Material.findOne({ code });

    if (!materialToUpdate) {
      return NextResponse.json({
        ok: false,
        message: "El material a actualizar no existe",
      });
    }

    const updatedMaterial = await Material.findOneAndUpdate({ code }, { minimumExistence }, { new: true });

    return NextResponse.json({
      ok: true,
      message: "Material actualizado",
      updatedMaterial,
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
  const { code } = await request.json();
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
    const materialToDelete = await Material.findOne({ code });

    if (!materialToDelete) {
      return NextResponse.json({
        ok: true,
        message: "El material a borrar no existe",
      });
    }

    const deletedMaterial = await Material.findOneAndDelete({ code });

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

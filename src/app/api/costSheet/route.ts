import { NextResponse } from "next/server";

import { connectDB } from "@/libs/mongodb";
import { generateRandomString } from "@/helpers/randomStrings";
import { verifyJWT } from "@/libs/jwt";
import CostSheet, { ICostSheet } from "@/models/costSheet";
import Nomenclator from "@/models/nomenclator";

export async function POST(request: Request) {
  const {
    administrativeExpenses = [],
    approvedBy = "",
    artisticTalent = 0,
    category = "",
    createdBy = "",
    description = "",
    directSalaries = [],
    financialExpenses = [],
    nomenclatorId,
    otherDirectExpenses = [],
    payMethod = "CONTRACT",
    productionRelatedExpenses = [],
    rawMaterials = [],
    rawMaterialsByClient = 0,
    representationCost = 0,
    taskName = "",
    taxExpenses = [],
    transportationExpenses = [],
    USDValue = 250,
    workersAmount = 0,
  }: ICostSheet = await request.json();

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
    let DBCostSheet = await CostSheet.findOne({ taskName });

    if (DBCostSheet) {
      return NextResponse.json(
        {
          ok: false,
          message: "Ya existe una ficha de costo con ese nombre",
        },
        {
          status: 409,
        }
      );
    }

    //* Calcula el valor de cada subitem en cada seccion de la ficha de costo

    rawMaterials.map((material) => {
      material.value = material.amount * material.price;
    });
    directSalaries.map((task) => {
      task.value = task.amount * task.price;
    });
    otherDirectExpenses.map((otherDirectExpenses) => {
      otherDirectExpenses.value = otherDirectExpenses.amount * otherDirectExpenses.price;
    });
    productionRelatedExpenses.map((productionRelatedExpenses) => {
      productionRelatedExpenses.value = productionRelatedExpenses.amount * productionRelatedExpenses.price;
    });
    administrativeExpenses.map((administrativeExpenses) => {
      administrativeExpenses.value = administrativeExpenses.amount * administrativeExpenses.price;
    });
    transportationExpenses.map((transportationExpenses) => {
      transportationExpenses.value = transportationExpenses.amount * transportationExpenses.price;
    });
    financialExpenses.map((financialExpenses) => {
      financialExpenses.value = financialExpenses.amount * financialExpenses.price;
    });
    taxExpenses.map((taxExpenses) => {
      taxExpenses.value = taxExpenses.amount * taxExpenses.price;
    });

    //* Calcula el valor de cada subtotal en cada seccion de la ficha de costo

    const administrativeExpensesSubtotal: number = administrativeExpenses.reduce((total, currentValue) => total + currentValue.value, 0);
    const directSalariesSubtotal: number = directSalaries.reduce((total, currentValue) => total + currentValue.value, 0);
    const financialExpensesSubtotal: number = financialExpenses.reduce((total, currentValue) => total + currentValue.value, 0);
    const otherDirectExpensesSubtotal: number = otherDirectExpenses.reduce((total, currentValue) => total + currentValue.value, 0);
    const productionRelatedExpensesSubtotal: number = productionRelatedExpenses.reduce((total, currentValue) => total + currentValue.value, 0);
    const rawMaterialsSubtotal: number = rawMaterials.reduce((total, currentValue) => total + currentValue.value, 0);
    const taxExpensesSubtotal: number = taxExpenses.reduce((total, currentValue) => total + currentValue.value, 0);
    const transportationExpensesSubtotal: number = transportationExpenses.reduce((total, currentValue) => total + currentValue.value, 0);

    const costsTotalValue: number = rawMaterialsSubtotal + directSalariesSubtotal + otherDirectExpensesSubtotal + productionRelatedExpensesSubtotal;
    const expensesTotalValue: number = administrativeExpensesSubtotal + transportationExpensesSubtotal + financialExpensesSubtotal + taxExpensesSubtotal;
    const expensesAndCostsTotalValue: number = costsTotalValue + expensesTotalValue;

    const artisticTalentValue: number = expensesAndCostsTotalValue * (artisticTalent / 100);
    const representationCostValue: number = expensesAndCostsTotalValue * (representationCost / 100);

    const creatorPrice: number = expensesAndCostsTotalValue + artisticTalentValue + representationCostValue;

    const salePriceMN: number = creatorPrice + rawMaterialsByClient;
    const salePriceMLC: number = salePriceMN / USDValue;
    
    const newKey = generateRandomString(26);

    const newNomenclator = new Nomenclator({
      key: newKey,
      code: nomenclatorId,
      category: 'Ficha de costo',
    });

    await newNomenclator.save();

    const newCostSheet = new CostSheet({
      administrativeExpenses,
      administrativeExpensesSubtotal,
      approvedBy,
      artisticTalent,
      artisticTalentValue,
      category,
      costsTotalValue,
      createdBy,
      creatorPrice,
      description,
      directSalaries,
      directSalariesSubtotal,
      expensesAndCostsTotalValue,
      expensesTotalValue,
      financialExpenses,
      financialExpensesSubtotal,
      key: newKey,
      nomenclatorId,
      otherDirectExpenses,
      otherDirectExpensesSubtotal,
      payMethod,
      productionRelatedExpenses,
      productionRelatedExpensesSubtotal,
      rawMaterials,
      rawMaterialsByClient,
      rawMaterialsSubtotal,
      representationCost,
      representationCostValue,
      salePrice: salePriceMN,
      salePriceMLC,
      taskName,
      taxExpenses,
      taxExpensesSubtotal,
      transportationExpenses,
      transportationExpensesSubtotal,
      workersAmount,
    });

    await newCostSheet.save();

    return new NextResponse(
      JSON.stringify({
        ok: true,
        newCostSheet,
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
    const listOfCostSheets = (await CostSheet.find()).reverse();
    return new NextResponse(
      JSON.stringify({
        ok: true,
        listOfCostSheets,
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
  const {
    _id = '',
    administrativeExpenses = [],
    approvedBy = "",
    artisticTalent = 0,
    category = '',
    createdBy = "",
    description = "",
    directSalaries = [],
    financialExpenses = [],
    otherDirectExpenses = [],
    payMethod = "CONTRACT",
    productionRelatedExpenses = [],
    rawMaterials = [],
    rawMaterialsByClient = 0,
    representationCost = 0,
    taskName = "",
    taxExpenses = [],
    transportationExpenses = [],
    USDValue = 250,
    workersAmount = 1,
  }: ICostSheet = await request.json();
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
    const costSheetToUpdate = await CostSheet.findById(_id);

    if (!costSheetToUpdate) {
      return NextResponse.json({
        ok: false,
        message: "La ficha de costo a actualizar no existe",
      });
    }

    //* Calcula el valor de cada subitem en cada seccion de la ficha de costo

    rawMaterials.map((material) => {
      material.value = material.amount * material.price;
    });
    directSalaries.map((task) => {
      task.value = task.amount * task.price;
    });
    otherDirectExpenses.map((otherDirectExpenses) => {
      otherDirectExpenses.value = otherDirectExpenses.amount * otherDirectExpenses.price;
    });
    productionRelatedExpenses.map((productionRelatedExpenses) => {
      productionRelatedExpenses.value = productionRelatedExpenses.amount * productionRelatedExpenses.price;
    });
    administrativeExpenses.map((administrativeExpenses) => {
      administrativeExpenses.value = administrativeExpenses.amount * administrativeExpenses.price;
    });
    transportationExpenses.map((transportationExpenses) => {
      transportationExpenses.value = transportationExpenses.amount * transportationExpenses.price;
    });
    financialExpenses.map((financialExpenses) => {
      financialExpenses.value = financialExpenses.amount * financialExpenses.price;
    });
    taxExpenses.map((taxExpenses) => {
      taxExpenses.value = taxExpenses.amount * taxExpenses.price;
    });

    //* Calcula el valor de cada subtotal en cada seccion de la ficha de costo

    const administrativeExpensesSubtotal: number = administrativeExpenses.reduce((total, currentValue) => total + currentValue.value, 0);
    const directSalariesSubtotal: number = directSalaries.reduce((total, currentValue) => total + currentValue.value, 0);
    const financialExpensesSubtotal: number = financialExpenses.reduce((total, currentValue) => total + currentValue.value, 0);
    const otherDirectExpensesSubtotal: number = otherDirectExpenses.reduce((total, currentValue) => total + currentValue.value, 0);
    const productionRelatedExpensesSubtotal: number = productionRelatedExpenses.reduce((total, currentValue) => total + currentValue.value, 0);
    const rawMaterialsSubtotal: number = rawMaterials.reduce((total, currentValue) => total + currentValue.value, 0);
    const taxExpensesSubtotal: number = taxExpenses.reduce((total, currentValue) => total + currentValue.value, 0);
    const transportationExpensesSubtotal: number = transportationExpenses.reduce((total, currentValue) => total + currentValue.value, 0);

    const costsTotalValue: number = rawMaterialsSubtotal + directSalariesSubtotal + otherDirectExpensesSubtotal + productionRelatedExpensesSubtotal;
    const expensesTotalValue: number = administrativeExpensesSubtotal + transportationExpensesSubtotal + financialExpensesSubtotal + taxExpensesSubtotal;
    const expensesAndCostsTotalValue: number = costsTotalValue + expensesTotalValue;

    const artisticTalentValue: number = expensesAndCostsTotalValue * (artisticTalent / 100);
    const representationCostValue: number = expensesAndCostsTotalValue * (representationCost / 100);

    const creatorPrice: number = expensesAndCostsTotalValue + artisticTalentValue + representationCostValue;

    const salePriceMN: number = creatorPrice + rawMaterialsByClient;
    const salePriceMLC: number = salePriceMN / USDValue;

    const updatedCostSheet = await CostSheet.findOneAndUpdate(
      { _id },
      {
        administrativeExpenses,
        administrativeExpensesSubtotal,
        approvedBy,
        artisticTalent,
        artisticTalentValue,
        category,
        costsTotalValue,
        createdBy,
        creatorPrice,
        description,
        directSalaries,
        directSalariesSubtotal,
        expensesAndCostsTotalValue,
        expensesTotalValue,
        financialExpenses,
        financialExpensesSubtotal,
        otherDirectExpenses,
        otherDirectExpensesSubtotal,
        payMethod,
        productionRelatedExpenses,
        productionRelatedExpensesSubtotal,
        rawMaterials,
        rawMaterialsByClient,
        rawMaterialsSubtotal,
        representationCost,
        representationCostValue,
        salePrice: salePriceMN,
        salePriceMLC,
        taskName,
        taxExpenses,
        taxExpensesSubtotal,
        transportationExpenses,
        transportationExpensesSubtotal,
        workersAmount,
      },
      { new: true }
    );

    return new NextResponse(
      JSON.stringify({
        ok: true,
        updatedCostSheet,
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
  const { id } = await request.json();
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
    const costSheetToDelete = await CostSheet.findById(id);

    if (!costSheetToDelete) {
      return NextResponse.json({
        ok: true,
        message: "La ficha de costo a borrar no existe",
      });
    }

    const deletedCostSheet = await CostSheet.findByIdAndDelete(id);

    return new NextResponse(
      JSON.stringify({
        ok: true,
        deletedCostSheet,
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
          message: error.message,
        },
        {
          status: 400,
        }
      );
    }
  }
}

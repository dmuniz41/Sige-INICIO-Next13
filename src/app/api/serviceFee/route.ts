import { generateRandomString } from "@/helpers/randomStrings";
import { verifyJWT } from "@/libs/jwt";
import { connectDB } from "@/libs/mongodb";
import Nomenclator from "@/models/nomenclator";
import ServiceFee, { IServiceFee } from "@/models/serviceFees";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const { ...serviceFee }: IServiceFee = await request.json();

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
    let BDServiceFee = await ServiceFee.findOne({ taskName: serviceFee.taskName });

    if (BDServiceFee) {
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

    serviceFee.rawMaterials.map((material) => {
      material.value = material.amount * material.price;
    });
    // directSalaries.map((task) => {
    //   task.value = task.amount * task.price;
    // });
    // otherDirectExpenses.map((otherDirectExpenses) => {
    //   otherDirectExpenses.value = otherDirectExpenses.amount * otherDirectExpenses.price;
    // });
    // productionRelatedExpenses.map((productionRelatedExpenses) => {
    //   productionRelatedExpenses.value = productionRelatedExpenses.amount * productionRelatedExpenses.price;
    // });
    // administrativeExpenses.map((administrativeExpenses) => {
    //   administrativeExpenses.value = administrativeExpenses.amount * administrativeExpenses.price;
    // });
    // transportationExpenses.map((transportationExpenses) => {
    //   transportationExpenses.value = transportationExpenses.amount * transportationExpenses.price;
    // });
    // financialExpenses.map((financialExpenses) => {
    //   financialExpenses.value = financialExpenses.amount * financialExpenses.price;
    // });
    // taxExpenses.map((taxExpenses) => {
    //   taxExpenses.value = taxExpenses.amount * taxExpenses.price;
    // });

    //* Calcula el valor de cada subtotal en cada seccion de la ficha de costo

    // const administrativeExpensesSubtotal: number = administrativeExpenses.reduce((total, currentValue) => total + currentValue.value, 0);
    // const directSalariesSubtotal: number = directSalaries.reduce((total, currentValue) => total + currentValue.value, 0);
    // const financialExpensesSubtotal: number = financialExpenses.reduce((total, currentValue) => total + currentValue.value, 0);
    // const otherDirectExpensesSubtotal: number = otherDirectExpenses.reduce((total, currentValue) => total + currentValue.value, 0);
    // const productionRelatedExpensesSubtotal: number = productionRelatedExpenses.reduce((total, currentValue) => total + currentValue.value, 0);
    const rawMaterialsSubtotal: number = serviceFee.rawMaterials.reduce((total, currentValue) => total + currentValue.value, 0);
    // const taxExpensesSubtotal: number = taxExpenses.reduce((total, currentValue) => total + currentValue.value, 0);
    // const transportationExpensesSubtotal: number = transportationExpenses.reduce((total, currentValue) => total + currentValue.value, 0);

    // const costsTotalValue: number = rawMaterialsSubtotal + directSalariesSubtotal + otherDirectExpensesSubtotal + productionRelatedExpensesSubtotal;
    // const expensesTotalValue: number = administrativeExpensesSubtotal + transportationExpensesSubtotal + financialExpensesSubtotal + taxExpensesSubtotal;
    // const expensesAndCostsTotalValue: number = costsTotalValue + expensesTotalValue;

    // const artisticTalentValue: number = expensesAndCostsTotalValue * (artisticTalent / 100);
    // const representationCostValue: number = expensesAndCostsTotalValue * (representationCost / 100);

    // const creatorPrice: number = expensesAndCostsTotalValue + artisticTalentValue + representationCostValue;

    // const salePriceMN: number = creatorPrice + rawMaterialsByClient;
    // const salePriceMLC: number = salePriceMN / USDValue;

    const newKey = generateRandomString(26);

    const newNomenclator = new Nomenclator({
      key: newKey,
      code: serviceFee.nomenclatorId,
      category: "Tarifa de Servicio",
    });

    await newNomenclator.save();

    const newServiceFee = new ServiceFee({
      key: newKey,
      rawMaterials: serviceFee.rawMaterials,
      rawMaterialsSubtotal
    });

    await newServiceFee.save();

    return new NextResponse(
      JSON.stringify({
        ok: true,
        newServiceFee,
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

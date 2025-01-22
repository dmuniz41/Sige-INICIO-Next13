import { NextRequest, NextResponse } from "next/server";

import { verifyJWT } from "@/libs/jwt";
import { connectDB } from "@/libs/mongodb";
import ExpensesDischarge, {
  IExpensesDischarge,
  IExpensesDischargeMaterials
} from "@/models/dischargeExpenses";
import Offer from "@/models/offer";

export async function GET(request: NextRequest) {
  const url = new URL(request.url);
  const offerId = url.searchParams.get("offerId");

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
    const BDExpensesDischarge = await ExpensesDischarge.find({
      offerId: offerId
    });

    return new NextResponse(
      JSON.stringify({
        ok: true,
        expensesDischarge: BDExpensesDischarge
      }),
      {
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Content-Type": "application/json"
        },
        status: 200
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

export async function POST(request: NextRequest) {
  const { offerId }: { offerId: string } = await request.json();

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

    const DBExpensesDischarge = await ExpensesDischarge.findOne({
      offerId: offerId
    });

    if (DBExpensesDischarge) {
      return NextResponse.json(
        {
          ok: false,
          message: "Ya existe una descarga de gastos para esta oferta"
        },
        {
          status: 409
        }
      );
    }
    const offer = await Offer.findById(offerId);
    const offerMaterialsList = offer?.materialsList;

    //? CONVIERTE EL LISTADO DE MATERIALES DE LA OFFERTA AL TIPO DE LISTADO DE MATERIALES DE DESCARGA DE MATERIALES
    const expensesDischargeMaterials: IExpensesDischargeMaterials[] = offerMaterialsList?.map(
      (material: any) => ({
        description: material.description,
        amount: material.amount,
        amountReal: 0,
        difference: 0,
        unitMeasure: material.unitMeasure
      })
    );

    //? CREA LA NUEVA DESCARGA DE MATERIALES
    const newExpensesDischarge = new ExpensesDischarge({
      offerId: offerId,
      updatedAt: new Date(),
      materials: expensesDischargeMaterials,
      totalValue: expensesDischargeMaterials.reduce(
        (totalValue, expensesDischargeMaterials) => totalValue + expensesDischargeMaterials.amount,
        0
      ),
      totalCost: 0,
      totalDifference: 0
    });

    await newExpensesDischarge.save();

    return new NextResponse(
      JSON.stringify({
        ok: true,
        newExpensesDischarge
      }),
      {
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Content-Type": "application/json"
        },
        status: 200
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

export async function PUT(request: NextRequest) {
  const { ...expensesDischarge }: IExpensesDischarge = await request.json();

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

    const totalValue = expensesDischarge.materials.reduce(
      (totalValue, expensesDischargeMaterials) => totalValue + expensesDischargeMaterials.amount,
      0
    );
    const totalCost = expensesDischarge.materials.reduce(
      (totalValue, expensesDischargeMaterials) =>
        totalValue + expensesDischargeMaterials.amountReal,
      0
    );

    const updatedExpensesDischarge = await ExpensesDischarge.findOneAndUpdate(
      { offerId: expensesDischarge.offerId },
      {
        ...expensesDischarge,
        totalValue: totalValue,
        totalCost: totalCost,
        totalDifference: totalValue - totalCost
      },
      { new: true }
    );

    return new NextResponse(
      JSON.stringify({
        ok: true,
        updatedExpensesDischarge
      }),
      {
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Content-Type": "application/json"
        },
        status: 200
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

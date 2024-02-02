import { NextResponse } from "next/server";

import { connectDB } from "@/libs/mongodb";
import { generateRandomString } from "@/helpers/randomStrings";
import { IServiceFeeAuxiliary } from "../../../models/serviceFeeAuxiliary";
import { verifyJWT } from "@/libs/jwt";
import ServiceFeeAuxiliary from "@/models/serviceFeeAuxiliary";

export async function POST(request: Request) {
  const { ...serviceFeeAuxiliary }: IServiceFeeAuxiliary = await request.json();
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

    const BDServiceFeeAuxiliary = await ServiceFeeAuxiliary.find();

    // * Solo puede existir una hoja de auxiliares
    if (BDServiceFeeAuxiliary.length > 0) {
      return NextResponse.json(
        {
          ok: false,
          message: "Ya existe una hoja de auxiliares",
        },
        {
          status: 409,
        }
      );
    }

    const newKey = generateRandomString(26);

    const newServiceFeeAuxiliary = new ServiceFeeAuxiliary({
      key: newKey,
      calculationCoefficient: serviceFeeAuxiliary.calculationCoefficient,
      mermaCoefficient: serviceFeeAuxiliary.mermaCoefficient,
      currencyChange: serviceFeeAuxiliary.currencyChange,
      officialCurrencyChangeCoefficient: serviceFeeAuxiliary.officialCurrencyChangeCoefficient,
      informalCurrencyChange: serviceFeeAuxiliary.informalCurrencyChange,
      currency: serviceFeeAuxiliary.currency,
      payMethod: serviceFeeAuxiliary.payMethod,
      administrativeExpensesCoefficients: serviceFeeAuxiliary.administrativeExpensesCoefficients,
      equipmentDepreciationCoefficients: serviceFeeAuxiliary.equipmentDepreciationCoefficients,
      equipmentMaintenanceCoefficients: serviceFeeAuxiliary.equipmentMaintenanceCoefficients,
      transportationExpensesCoefficient: serviceFeeAuxiliary.transportationExpensesCoefficient,
      salesAndDistributionExpensesCoefficient: serviceFeeAuxiliary.salesAndDistributionExpensesCoefficient,
    });

    await newServiceFeeAuxiliary.save();

    return new NextResponse(
      JSON.stringify({
        ok: true,
        newServiceFeeAuxiliary,
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
          message: "Error al crear la hoja de auxiliaries",
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
    const BDserviceFeeAuxiliary = await ServiceFeeAuxiliary.findOne();
    return new NextResponse(
      JSON.stringify({
        ok: true,
        BDserviceFeeAuxiliary
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
          message: "Error al obtener la hoja de auxiliares",
        },
        {
          status: 400,
        }
      );
    }
  }
}

export async function PUT(request: Request) {
  const { ...serviceFeeAuxiliary }: IServiceFeeAuxiliary = await request.json();
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

    if (!(await ServiceFeeAuxiliary.findById({ _id: serviceFeeAuxiliary._id }))) {
      return NextResponse.json(
        {
          ok: false,
          message: "La hoja de auxiliares de tarifas de servicio no existe",
        },
        {
          status: 409,
        }
      );
    }

    const updatedServiceFeeAuxiliary = await ServiceFeeAuxiliary.findByIdAndUpdate(
      { _id: serviceFeeAuxiliary._id },
      {
        calculationCoefficient: serviceFeeAuxiliary.calculationCoefficient,
        mermaCoefficient: serviceFeeAuxiliary.mermaCoefficient,
        currencyChange: serviceFeeAuxiliary.currencyChange,
        officialCurrencyChangeCoefficient: serviceFeeAuxiliary.officialCurrencyChangeCoefficient,
        informalCurrencyChange: serviceFeeAuxiliary.informalCurrencyChange,
        currency: serviceFeeAuxiliary.currency,
        payMethod: serviceFeeAuxiliary.payMethod,
        administrativeExpensesCoefficients: serviceFeeAuxiliary.administrativeExpensesCoefficients,
        equipmentDepreciationCoefficients: serviceFeeAuxiliary.equipmentDepreciationCoefficients,
        equipmentMaintenanceCoefficients: serviceFeeAuxiliary.equipmentMaintenanceCoefficients,
        transportationExpensesCoefficient: serviceFeeAuxiliary.transportationExpensesCoefficient,
        salesAndDistributionExpensesCoefficient: serviceFeeAuxiliary.salesAndDistributionExpensesCoefficient,
      },
      { new: true }
    );

    return new NextResponse(
      JSON.stringify({
        ok: true,
        updatedServiceFeeAuxiliary,
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
          message: "Error al actualizar la hoja de auxiliares para las tarifas de servicio",
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

    if (!(await ServiceFeeAuxiliary.findById(id))) {
      return NextResponse.json({
        ok: true,
        message: "La hoja de auxiliares a borrar no existe",
      });
    }

    const deletedServiceFeeAuxiliary = await ServiceFeeAuxiliary.findByIdAndDelete(id);

    return new NextResponse(
      JSON.stringify({
        ok: true,
        deletedServiceFeeAuxiliary,
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
          message: "Error al eliminar la hoja de auxiliares para tarifas de servicio",
        },
        {
          status: 400,
        }
      );
    }
  }
}

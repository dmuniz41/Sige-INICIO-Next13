import { connectDB } from "@/libs/mongodb";
import { NextResponse } from "next/server";

import { generateRandomString } from "@/helpers/randomStrings";
import { verifyJWT } from "@/libs/jwt";
import Nomenclator, { INomenclator } from "@/models/nomenclator";
import ServiceFee, { IServiceFee } from "@/models/serviceFees";
import ServiceFeeAuxiliary, { IServiceFeeAuxiliary } from "@/models/serviceFeeAuxiliary";

export async function POST(request: Request) {
  const { ...serviceFee }: IServiceFee = await request.json();
  console.log("🚀 ~ POST ~ serviceFee:", serviceFee);

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
          message: "Ya existe una tarifa de servicio con ese nombre",
        },
        {
          status: 409,
        }
      );
    }
    //* Calcula el valor de cada subtotal en cada seccion de la ficha de costo
    const rawMaterialsSubtotal: number = serviceFee?.rawMaterials?.reduce((total, currentValue) => total + currentValue.value, 0);
    const taskListSubtotal: number = serviceFee?.taskList?.reduce((total, currentValue) => total + currentValue.value, 0);
    const equipmentDepreciationSubtotal: number = serviceFee?.equipmentDepreciation?.reduce((total, currentValue) => total + currentValue.value, 0);
    const equipmentMaintenanceSubtotal: number = serviceFee?.equipmentMaintenance?.reduce((total, currentValue) => total + currentValue.value, 0);
    const administrativeExpensesSubtotal: number = serviceFee?.administrativeExpenses?.reduce((total, currentValue) => total + currentValue.value, 0);
    const transportationExpensesSubtotal: number = serviceFee?.transportationExpenses?.reduce((total, currentValue) => total + currentValue.value, 0);
    const hiredPersonalExpensesSubtotal: number = serviceFee?.hiredPersonalExpenses?.reduce((total, currentValue) => total + currentValue.value, 0);

    const expensesTotalValue: number =
      rawMaterialsSubtotal +
      taskListSubtotal +
      equipmentDepreciationSubtotal +
      equipmentMaintenanceSubtotal +
      transportationExpensesSubtotal +
      administrativeExpensesSubtotal +
      hiredPersonalExpensesSubtotal;

    const newKey = generateRandomString(26);

    const BDNomenclator = (await Nomenclator.findOne({ category: "Tarifa de Servicio", code: serviceFee?.nomenclatorId })) as INomenclator;

    // * El precio final se calcula (Suma de el valor de todos los gastos * margen comercial(50%) + el impuesto de la ONAT(25%))
    const comercialMarginValue = expensesTotalValue * serviceFee?.commercialMargin;
    const ONATValue = comercialMarginValue * (serviceFee.ONAT / 100);
    const salePrice = comercialMarginValue + ONATValue;

    if (!BDNomenclator) {
      const newNomenclator = new Nomenclator({
        key: newKey,
        code: serviceFee?.nomenclatorId,
        category: "Tarifa de Servicio",
      });
      await newNomenclator.save();
    }
    const newServiceFee = new ServiceFee({
      category: serviceFee.category,
      nomenclatorId: serviceFee.nomenclatorId,
      key: newKey,
      workersAmount: serviceFee.workersAmount,
      taskName: serviceFee.taskName,
      payMethodCoef: serviceFee.payMethodCoef,
      valuePerUnitMeasure: serviceFee.valuePerUnitMeasure,
      rawMaterials: serviceFee.rawMaterials,
      rawMaterialsSubtotal,
      taskList: serviceFee.taskList,
      taskListSubtotal,
      equipmentDepreciation: serviceFee.equipmentDepreciation,
      equipmentDepreciationSubtotal,
      equipmentMaintenance: serviceFee.equipmentMaintenance,
      equipmentMaintenanceSubtotal,
      administrativeExpenses: serviceFee.administrativeExpenses,
      administrativeExpensesSubtotal,
      transportationExpenses: serviceFee.transportationExpenses,
      transportationExpensesSubtotal,
      hiredPersonalExpenses: serviceFee.hiredPersonalExpenses,
      hiredPersonalExpensesSubtotal,
      expensesTotalValue,
      ONAT: ONATValue,
      commercialMargin: comercialMarginValue,
      artisticTalentValue: salePrice - ONATValue,
      rawMaterialsByClient: serviceFee.rawMaterialsByClient,
      salePrice: salePrice,
      salePriceUSD: salePrice / serviceFee?.currencyChange,
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

export async function PUT(request: Request) {
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
    let BDServiceFee = await ServiceFee.findById(serviceFee._id);

    if (!BDServiceFee) {
      return NextResponse.json(
        {
          ok: false,
          message: "La tarifa de servicio a actualizar no existe",
        },
        {
          status: 409,
        }
      );
    }

    //* Calcula el valor de cada subtotal en cada seccion de la ficha de costo
    const rawMaterialsSubtotal: number = serviceFee.rawMaterials.reduce((total, currentValue) => total + currentValue.value, 0);
    const taskListSubtotal: number = serviceFee.taskList.reduce((total, currentValue) => total + currentValue.value, 0);
    const equipmentDepreciationSubtotal: number = serviceFee.equipmentDepreciation.reduce((total, currentValue) => total + currentValue.value, 0);
    const equipmentMaintenanceSubtotal: number = serviceFee.equipmentMaintenance.reduce((total, currentValue) => total + currentValue.value, 0);
    const administrativeExpensesSubtotal: number = serviceFee.administrativeExpenses.reduce((total, currentValue) => total + currentValue.value, 0);
    const transportationExpensesSubtotal: number = serviceFee.transportationExpenses.reduce((total, currentValue) => total + currentValue.value, 0);
    const hiredPersonalExpensesSubtotal: number = serviceFee.hiredPersonalExpenses.reduce((total, currentValue) => total + currentValue.value, 0);

    const expensesTotalValue: number =
      rawMaterialsSubtotal +
      taskListSubtotal +
      equipmentDepreciationSubtotal +
      equipmentMaintenanceSubtotal +
      transportationExpensesSubtotal +
      administrativeExpensesSubtotal +
      hiredPersonalExpensesSubtotal;

    const BDNomenclator = await Nomenclator.findOne({ category: "Tarifa de Servicio", code: serviceFee.nomenclatorId });

    const BDAuxiliary = (await ServiceFeeAuxiliary.findOne()) as IServiceFeeAuxiliary;

    // * El precio final se calcula (Suma de el valor de todos los gastos * margen comercial(50%) + el impuesto de la ONAT(25%))
    const comercialMarginValue = expensesTotalValue * serviceFee?.commercialMargin;
    const ONATValue = comercialMarginValue * (serviceFee.ONAT / 100);
    const salePrice = comercialMarginValue + ONATValue;

    if (!BDNomenclator) {
      const newKey = generateRandomString(26);
      const newNomenclator = new Nomenclator({
        key: newKey,
        category: "Tarifa de Servicio",
        code: serviceFee.nomenclatorId,
      });
      await newNomenclator.save();
    }

    const updatedServiceFee = await ServiceFee.findByIdAndUpdate(
      serviceFee._id,
      {
        category: serviceFee.category,
        nomenclatorId: serviceFee.nomenclatorId,
        workersAmount: serviceFee.workersAmount,
        taskName: serviceFee.taskName,
        payMethodCoef: serviceFee.payMethodCoef,
        valuePerUnitMeasure: serviceFee.valuePerUnitMeasure,
        rawMaterials: serviceFee.rawMaterials,
        rawMaterialsSubtotal,
        taskList: serviceFee.taskList,
        taskListSubtotal,
        equipmentDepreciation: serviceFee.equipmentDepreciation,
        equipmentDepreciationSubtotal,
        equipmentMaintenance: serviceFee.equipmentMaintenance,
        equipmentMaintenanceSubtotal,
        administrativeExpenses: serviceFee.administrativeExpenses,
        administrativeExpensesSubtotal,
        transportationExpenses: serviceFee.transportationExpenses,
        transportationExpensesSubtotal,
        hiredPersonalExpenses: serviceFee.hiredPersonalExpenses,
        hiredPersonalExpensesSubtotal,
        expensesTotalValue,
        ONAT: ONATValue,
        commercialMargin: comercialMarginValue,
        artisticTalentValue: salePrice - ONATValue,
        rawMaterialsByClient: serviceFee.rawMaterialsByClient,
        salePrice: salePrice,
        salePriceUSD: salePrice / serviceFee?.currencyChange,
      },
      { new: true }
    );

    return new NextResponse(
      JSON.stringify({
        ok: true,
        updatedServiceFee,
      }),
      {
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Content-Type": "application/json",
        },
      }
    );
  } catch (error) {
    console.log("🚀 ~ POST ~ error:", error);
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
    const listOfServiceFees = (await ServiceFee.find()).reverse();
    return new NextResponse(
      JSON.stringify({
        ok: true,
        listOfServiceFees,
      }),
      {
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Content-Type": "application/json",
        },
        status: 200,
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
    const serviceFeeToDelete = await ServiceFee.findByIdAndDelete(id);

    if (!serviceFeeToDelete) {
      return NextResponse.json({
        ok: true,
        message: "La tarifa de servicio  a borrar no existe",
      });
    }
    return new NextResponse(
      JSON.stringify({
        ok: true,
        serviceFeeToDelete,
      }),
      {
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Content-Type": "application/json",
        },
        status: 200,
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

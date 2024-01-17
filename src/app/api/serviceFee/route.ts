import { generateRandomString } from "@/helpers/randomStrings";
import { verifyJWT } from "@/libs/jwt";
import { connectDB } from "@/libs/mongodb";
import Nomenclator from "@/models/nomenclator";
import ServiceFee, { IServiceFee } from "@/models/serviceFees";
import { NextResponse } from "next/server";

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

    //* Calcula el valor de cada subitem en cada seccion de la ficha de costo

    // * El valor de cada material se calcula (Cantidad(m2 o Unidades) * Costo Unitario(Se define por el precio mas alto de ese material en el almacén) * Coeficiente de Merma(Si se considera material gastable))
    serviceFee.rawMaterials.map((material) => {
      material.value = material.amount * material.price;
    });
    // * El valor de cada operacion se calcula (Cantidad * Coeficiente de Complejidad), la descripcion de la tarea se debe entrar previamente como nomenclador
    serviceFee.taskList.map((task) => {
      task.value = task.amount * task.coefficient;
    });
    // * El valor de la depreciacion de cada equipo se calcula (Cantidad * un coeficiente definido para cada equipo(Este coeficiente tiene una formula independiente para cada equipo que se debe definir en la seccion de auxiliares))
    serviceFee.equipmentDepreciation.map((equipment) => {
      equipment.value = equipment.amount * equipment.coefficient;
    });
    // * El valor del mantenimiento de cada equipo se calcula (Cantidad * un coeficiente definido para cada equipo(Este coeficiente tiene una formula independiente para cada equipo que se debe definir en la seccion de auxiliares))
    serviceFee.equipmentMaintenance.map((equipment) => {
      equipment.value = equipment.amount * equipment.coefficient;
    });

    //* Calcula el valor de cada subtotal en cada seccion de la ficha de costo
    const rawMaterialsSubtotal: number = serviceFee.rawMaterials.reduce((total, currentValue) => total + currentValue.value, 0);

    const taskListSubtotal: number = serviceFee.taskList.reduce((total, currentValue) => total + currentValue.value, 0);

    const equipmentDepreciationSubtotal: number = serviceFee.equipmentDepreciation.reduce((total, currentValue) => total + currentValue.value, 0);

    const equipmentMaintenanceSubtotal: number = serviceFee.equipmentMaintenance.reduce((total, currentValue) => total + currentValue.value, 0);

    serviceFee.electricityExpense.value = serviceFee.electricityExpense.amount * serviceFee.electricityExpense.coefficient;

    serviceFee.fuelExpense.value = serviceFee.fuelExpense.amount * serviceFee.fuelExpense.coefficient;

    serviceFee.rawMaterialsTransportationExpenses.value = serviceFee.rawMaterialsTransportationExpenses.amount * serviceFee.rawMaterialsTransportationExpenses.coefficient;
    serviceFee.feedingExpense.value = serviceFee.feedingExpense.amount * serviceFee.feedingExpense.coefficient;

    serviceFee.phoneExpense.value = serviceFee.phoneExpense.amount * serviceFee.phoneExpense.coefficient;

    serviceFee.leaseExpense.value = serviceFee.leaseExpense.amount * serviceFee.leaseExpense.coefficient;

    const administrativeExpensesSubtotal: number =
      serviceFee.electricityExpense.value + serviceFee.fuelExpense.value + serviceFee.feedingExpense.value + serviceFee.phoneExpense.value + serviceFee.leaseExpense.value;

    serviceFee.rawMaterialsTransportationExpenses.value = serviceFee.rawMaterialsTransportationExpenses.amount * serviceFee.rawMaterialsTransportationExpenses.coefficient;

    serviceFee.salesAndDistributionExpenses.value = serviceFee.salesAndDistributionExpenses.amount * serviceFee.salesAndDistributionExpenses.coefficient;

    const transportationExpensesSubtotal: number = serviceFee.rawMaterialsTransportationExpenses.value + serviceFee.salesAndDistributionExpenses.value;

    serviceFee.indirectSalaries.value = serviceFee.indirectSalaries.coef * taskListSubtotal;

    const subcontractExpensesSubtotal: number = serviceFee.subcontractExpenses + serviceFee.indirectSalaries.value;

    const expensesTotalValue: number =
      rawMaterialsSubtotal +
      taskListSubtotal +
      equipmentDepreciationSubtotal +
      equipmentMaintenanceSubtotal +
      transportationExpensesSubtotal +
      administrativeExpensesSubtotal +
      subcontractExpensesSubtotal;

    const newKey = generateRandomString(26);

    const newNomenclator = new Nomenclator({
      key: newKey,
      code: serviceFee.nomenclatorId,
      category: "Tarifa de Servicio",
    });

    await newNomenclator.save();

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
      electricityExpense: serviceFee.electricityExpense,
      fuelExpense: serviceFee.fuelExpense,
      feedingExpense: serviceFee.feedingExpense,
      phoneExpense: serviceFee.phoneExpense,
      leaseExpense: serviceFee.leaseExpense,
      administrativeExpensesSubtotal,
      rawMaterialsTransportationExpenses: serviceFee.rawMaterialsTransportationExpenses,
      salesAndDistributionExpenses: serviceFee.salesAndDistributionExpenses,
      transportationExpensesSubtotal,
      indirectSalaries: serviceFee.indirectSalaries,
      subcontractExpenses: serviceFee.subcontractExpenses,
      subcontractExpensesSubtotal: serviceFee.indirectSalaries.value + serviceFee.subcontractExpenses,
      expensesTotalValue,
      ONAT: serviceFee.ONAT,
      commercialMargin: serviceFee.commercialMargin,
      artisticTalentValue: serviceFee.artisticTalentValue,
      rawMaterialsByClient: serviceFee.rawMaterialsByClient,
      salePrice: expensesTotalValue + serviceFee.ONAT + serviceFee.artisticTalentValue + serviceFee.rawMaterialsByClient,
      salePriceUSD: (expensesTotalValue + serviceFee.ONAT + serviceFee.artisticTalentValue + serviceFee.rawMaterialsByClient) / serviceFee.currencyChange,
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

export async function PUT(request: Request) {
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

    //* Calcula el valor de cada subitem en cada seccion de la ficha de costo

    // * El valor de cada material se calcula (Cantidad(m2 o Unidades) * Costo Unitario(Se define por el precio mas alto de ese material en el almacén) * Coeficiente de Merma(Si se considera material gastable))
    serviceFee.rawMaterials.map((material) => {
      material.value = material.amount * material.price;
    });
    // * El valor de cada operacion se calcula (Cantidad * Coeficiente de Complejidad), la descripcion de la tarea se debe entrar previamente como nomenclador
    serviceFee.taskList.map((task) => {
      task.value = task.amount * task.coefficient;
    });
    // * El valor de la depreciacion de cada equipo se calcula (Cantidad * un coeficiente definido para cada equipo(Este coeficiente tiene una formula independiente para cada equipo que se debe definir en la seccion de auxiliares))
    serviceFee.equipmentDepreciation.map((equipment) => {
      equipment.value = equipment.amount * equipment.coefficient;
    });
    // * El valor del mantenimiento de cada equipo se calcula (Cantidad * un coeficiente definido para cada equipo(Este coeficiente tiene una formula independiente para cada equipo que se debe definir en la seccion de auxiliares))
    serviceFee.equipmentMaintenance.map((equipment) => {
      equipment.value = equipment.amount * equipment.coefficient;
    });

    //* Calcula el valor de cada subtotal en cada seccion de la ficha de costo
    const rawMaterialsSubtotal: number = serviceFee.rawMaterials.reduce((total, currentValue) => total + currentValue.value, 0);

    const taskListSubtotal: number = serviceFee.taskList.reduce((total, currentValue) => total + currentValue.value, 0);

    const equipmentDepreciationSubtotal: number = serviceFee.equipmentDepreciation.reduce((total, currentValue) => total + currentValue.value, 0);

    const equipmentMaintenanceSubtotal: number = serviceFee.equipmentMaintenance.reduce((total, currentValue) => total + currentValue.value, 0);

    serviceFee.electricityExpense.value = serviceFee.electricityExpense.amount * serviceFee.electricityExpense.coefficient;

    serviceFee.fuelExpense.value = serviceFee.fuelExpense.amount * serviceFee.fuelExpense.coefficient;

    serviceFee.rawMaterialsTransportationExpenses.value = serviceFee.rawMaterialsTransportationExpenses.amount * serviceFee.rawMaterialsTransportationExpenses.coefficient;
    serviceFee.feedingExpense.value = serviceFee.feedingExpense.amount * serviceFee.feedingExpense.coefficient;

    serviceFee.phoneExpense.value = serviceFee.phoneExpense.amount * serviceFee.phoneExpense.coefficient;

    serviceFee.leaseExpense.value = serviceFee.leaseExpense.amount * serviceFee.leaseExpense.coefficient;

    const administrativeExpensesSubtotal: number =
      serviceFee.electricityExpense.value + serviceFee.fuelExpense.value + serviceFee.feedingExpense.value + serviceFee.phoneExpense.value + serviceFee.leaseExpense.value;

    serviceFee.rawMaterialsTransportationExpenses.value = serviceFee.rawMaterialsTransportationExpenses.amount * serviceFee.rawMaterialsTransportationExpenses.coefficient;

    serviceFee.salesAndDistributionExpenses.value = serviceFee.salesAndDistributionExpenses.amount * serviceFee.salesAndDistributionExpenses.coefficient;

    const transportationExpensesSubtotal: number = serviceFee.rawMaterialsTransportationExpenses.value + serviceFee.salesAndDistributionExpenses.value;

    serviceFee.indirectSalaries.value = serviceFee.indirectSalaries.coef * taskListSubtotal;

    const subcontractExpensesSubtotal: number = serviceFee.subcontractExpenses + serviceFee.indirectSalaries.value;

    const expensesTotalValue: number =
      rawMaterialsSubtotal +
      taskListSubtotal +
      equipmentDepreciationSubtotal +
      equipmentMaintenanceSubtotal +
      transportationExpensesSubtotal +
      administrativeExpensesSubtotal +
      subcontractExpensesSubtotal;

    const BDNomenclator = await Nomenclator.findOne({ category: "Tarifa de Servicio", code: serviceFee.nomenclatorId });

    if (!BDNomenclator) {
      const newNomenclator = new Nomenclator({
        key: serviceFee.key,
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
        key: serviceFee.key,
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
        electricityExpense: serviceFee.electricityExpense,
        fuelExpense: serviceFee.fuelExpense,
        feedingExpense: serviceFee.feedingExpense,
        phoneExpense: serviceFee.phoneExpense,
        leaseExpense: serviceFee.leaseExpense,
        administrativeExpensesSubtotal,
        rawMaterialsTransportationExpenses: serviceFee.rawMaterialsTransportationExpenses,
        salesAndDistributionExpenses: serviceFee.salesAndDistributionExpenses,
        transportationExpensesSubtotal,
        indirectSalaries: serviceFee.indirectSalaries,
        subcontractExpenses: serviceFee.subcontractExpenses,
        subcontractExpensesSubtotal: serviceFee.indirectSalaries.value + serviceFee.subcontractExpenses,
        expensesTotalValue,
        ONAT: serviceFee.ONAT,
        commercialMargin: serviceFee.commercialMargin,
        artisticTalentValue: serviceFee.artisticTalentValue,
        rawMaterialsByClient: serviceFee.rawMaterialsByClient,
        salePrice: expensesTotalValue + serviceFee.ONAT + serviceFee.artisticTalentValue + serviceFee.rawMaterialsByClient,
        salePriceUSD: (expensesTotalValue + serviceFee.ONAT + serviceFee.artisticTalentValue + serviceFee.rawMaterialsByClient) / serviceFee.currencyChange,
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
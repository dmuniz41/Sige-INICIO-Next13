import { connectDB } from "@/libs/mongodb";
import { NextRequest, NextResponse } from "next/server";

import { generateRandomString } from "@/helpers/randomStrings";
import { IRepresentativeNomenclator } from "../../../models/nomenclators/representative";
import { verifyJWT } from "@/libs/jwt";
import Nomenclator, { INomenclator } from "@/models/nomenclator";
import RepresentativeNomenclator from "@/models/nomenclators/representative";
import ServiceFee, { IServiceFee } from "@/models/serviceFees";
import ServiceFeeAuxiliary from "@/models/serviceFeeAuxiliary";

export async function POST(request: NextRequest) {
  const { ...serviceFee }: IServiceFee = await request.json();

  const representativeNomenclators = await RepresentativeNomenclator.find();
  const serviceFeeAuxiliary = await ServiceFeeAuxiliary.find();

  const artisticTalentCoefficient = serviceFeeAuxiliary[0].artisticTalentPercentage / 100 + 1;
  const ONATCoefficient = serviceFeeAuxiliary[0].ONATTaxPercentage / 100 + 1;

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
    let BDServiceFee = await ServiceFee.findOne({ taskName: serviceFee.taskName });

    if (BDServiceFee) {
      return NextResponse.json(
        {
          ok: false,
          message: "Ya existe una tarifa de servicio con ese nombre"
        },
        {
          status: 409
        }
      );
    }
    // ? CALCULA EL VALOR DE CADA SUBTOTAL EN CADA SECCION DE LA FICHA DE COSTO //
    const rawMaterialsSubtotal: number = serviceFee?.rawMaterials?.reduce((total, currentValue) => total + currentValue.value, 0);
    const taskListSubtotal: number = serviceFee?.taskList?.reduce(
      (total, currentValue) => total + currentValue?.currentComplexity?.value! * currentValue.amount,
      0
    );
    const estimatedTime: number = serviceFee?.taskList?.reduce(
      (total, currentValue) => total + currentValue?.currentComplexity?.time! * currentValue.amount,
      0
    );
    const equipmentDepreciationSubtotal: number = serviceFee?.equipmentDepreciation?.reduce(
      (total, currentValue) => total + currentValue.value,
      0
    );
    const equipmentMaintenanceSubtotal: number = serviceFee?.equipmentMaintenance?.reduce(
      (total, currentValue) => total + currentValue.value,
      0
    );
    const administrativeExpensesSubtotal: number = serviceFee?.administrativeExpenses?.reduce(
      (total, currentValue) => total + currentValue.value,
      0
    );
    const transportationExpensesSubtotal: number = serviceFee?.transportationExpenses?.reduce(
      (total, currentValue) => total + currentValue.value,
      0
    );
    const hiredPersonalExpensesSubtotal: number = serviceFee?.hiredPersonalExpenses?.reduce(
      (total, currentValue) => total + currentValue.value,
      0
    );

    const expensesTotalValue: number =
      rawMaterialsSubtotal +
      taskListSubtotal +
      equipmentDepreciationSubtotal +
      equipmentMaintenanceSubtotal +
      transportationExpensesSubtotal +
      administrativeExpensesSubtotal +
      hiredPersonalExpensesSubtotal;

    const newKey = generateRandomString(26);

    const BDNomenclator = (await Nomenclator.findOne({
      category: "Tarifa de Servicio",
      code: serviceFee?.nomenclatorId
    })) as INomenclator;

    // ! REVISAR: EL PRECIO FINAL SE CALCULA (SUMA DE EL VALOR DE TODOS LOS GASTOS + VALOR DEL MARGEN COMERCIAL + VALOR DEL IMPUESTO DE LA ONAT) //
    const artisticTalentValue = expensesTotalValue * artisticTalentCoefficient;
    // const comercialMarginValue = (expensesTotalValue + artisticTalentValue) * comercialMarginCoefficient;
    const ONATValue = artisticTalentValue * ONATCoefficient;
    // const salePrice = expensesTotalValue + comercialMarginValue + ONATValue + artisticTalentValue;
    const pricePerRepresentative = representativeNomenclators.map((representative: IRepresentativeNomenclator) => {
      if (representative.name === "EFECTIVO") {
        return {
          representativeName: "EFECTIVO",
          price: artisticTalentValue,
          priceUSD: artisticTalentValue / serviceFee?.currencyChange
        };
      } else {
        return {
          representativeName: representative.name,
          price: artisticTalentValue * (representative.percentage / 100) + ONATValue,
          priceUSD: 0
        };
      }
    });
    const salePrice = expensesTotalValue;

    // ? CALCULA EL VALOR DE LOS 3 NIVELES DE COMPLEJIDAD EN DEPENDENCIA DEL COEFICIENTE ASIGNADO //
    // const complexityValues = serviceFee?.complexity?.map((complexity) => {
    //   return {
    //     name: complexity?.name,
    //     coefficient: complexity?.coefficient,
    //     value: salePrice * complexity?.coefficient,
    //     USDValue: (salePrice * complexity?.coefficient) / serviceFee?.currencyChange
    //   };
    // });

    if (!BDNomenclator) {
      const newNomenclator = new Nomenclator({
        key: newKey,
        code: serviceFee?.nomenclatorId,
        category: "Tarifa de Servicio",
        value: salePrice
      });
      await newNomenclator.save();
    }
    const newServiceFee = new ServiceFee({
      ...serviceFee,
      key: newKey,
      rawMaterialsSubtotal,
      taskListSubtotal,
      equipmentDepreciationSubtotal,
      equipmentMaintenanceSubtotal,
      administrativeExpensesSubtotal,
      transportationExpensesSubtotal,
      hiredPersonalExpensesSubtotal,
      // complexity: complexityValues,
      expensesTotalValue,
      // ONAT: serviceFee.ONAT,
      // ONATValue: ONATValue,
      // commercialMarginValue: comercialMarginValue,
      // artisticTalentValue: artisticTalentValue,
      salePrice: salePrice,
      salePriceUSD: salePrice / serviceFee?.currencyChange,
      estimatedTime: estimatedTime,
      pricePerRepresentative
    });

    await newServiceFee.save();

    return new NextResponse(
      JSON.stringify({
        ok: true,
        newServiceFee
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
  const { ...serviceFee }: IServiceFee = await request.json();

  const representativeNomenclators = await RepresentativeNomenclator.find();
  const serviceFeeAuxiliary = await ServiceFeeAuxiliary.find();

  const artisticTalentCoefficient = serviceFeeAuxiliary[0].artisticTalentPercentage / 100 + 1;
  const ONATCoefficient = serviceFeeAuxiliary[0].ONATTaxPercentage / 100 + 1;

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
    let BDServiceFee = await ServiceFee.findById(serviceFee._id);

    if (!BDServiceFee) {
      return NextResponse.json(
        {
          ok: false,
          message: "La tarifa de servicio a actualizar no existe"
        },
        {
          status: 409
        }
      );
    }

    // ? CALCULA EL VALOR DE CADA SUBTOTAL EN CADA SECCION DE LA FICHA DE COSTO //
    const rawMaterialsSubtotal: number = serviceFee.rawMaterials.reduce((total, currentValue) => total + currentValue.value, 0);
    const taskListSubtotal: number = serviceFee.taskList.reduce(
      (total, currentValue) => total + currentValue?.currentComplexity?.value! * currentValue.amount,
      0
    );
    const estimatedTime: number = serviceFee?.taskList?.reduce(
      (total, currentValue) => total + currentValue?.currentComplexity?.time! * currentValue.amount,
      0
    );
    const equipmentDepreciationSubtotal: number = serviceFee.equipmentDepreciation.reduce(
      (total, currentValue) => total + currentValue.value,
      0
    );
    const equipmentMaintenanceSubtotal: number = serviceFee.equipmentMaintenance.reduce(
      (total, currentValue) => total + currentValue.value,
      0
    );
    const administrativeExpensesSubtotal: number = serviceFee.administrativeExpenses.reduce(
      (total, currentValue) => total + currentValue.value,
      0
    );
    const transportationExpensesSubtotal: number = serviceFee.transportationExpenses.reduce(
      (total, currentValue) => total + currentValue.value,
      0
    );
    const hiredPersonalExpensesSubtotal: number = serviceFee.hiredPersonalExpenses.reduce(
      (total, currentValue) => total + currentValue.value,
      0
    );

    const expensesTotalValue: number =
      rawMaterialsSubtotal +
      taskListSubtotal +
      equipmentDepreciationSubtotal +
      equipmentMaintenanceSubtotal +
      transportationExpensesSubtotal +
      administrativeExpensesSubtotal +
      hiredPersonalExpensesSubtotal;

    const BDNomenclator = await Nomenclator.findOne({
      category: "Tarifa de Servicio",
      code: serviceFee.nomenclatorId
    });

    // ! REVISAR: EL PRECIO FINAL SE CALCULA (SUMA DE EL VALOR DE TODOS LOS GASTOS + VALOR DEL MARGEN COMERCIAL + VALOR DEL IMPUESTO DE LA ONAT) //
    const artisticTalentValue = expensesTotalValue * artisticTalentCoefficient;
    // const comercialMarginValue = (expensesTotalValue + artisticTalentValue) * comercialMarginCoefficient;
    const ONATValue = artisticTalentValue * ONATCoefficient;
    // const salePrice = expensesTotalValue + comercialMarginValue + ONATValue + artisticTalentValue;
    const pricePerRepresentative = representativeNomenclators.map((representative: IRepresentativeNomenclator) => {
      if (representative.name === "EFECTIVO") {
        return {
          representativeName: "EFECTIVO",
          price: artisticTalentValue,
          priceUSD: artisticTalentValue / serviceFee?.currencyChange
        };
      } else {
        return {
          representativeName: representative.name,
          price: artisticTalentValue * (representative.percentage / 100) + ONATValue,
          priceUSD: 0
        };
      }
    });
    const salePrice = expensesTotalValue;

    // ? CALCULA EL VALOR DE LOS 3 NIVELES DE COMPLEJIDAD //
    // const complexityValues = serviceFee?.complexity?.map((complexity) => {
    //   return {
    //     name: complexity.name,
    //     coefficient: complexity.coefficient,
    //     value: salePrice * complexity.coefficient,
    //     USDValue: (salePrice * complexity.coefficient) / serviceFee.currencyChange
    //   };
    // });

    // ? SI SE MODIFICA EL VALOR DE UNA TARIFA SE MODIFICA TAMBIEN EL VALOR DEL NOMENCLADOR ASOCIADO //
    if (!BDNomenclator) {
      const newKey = generateRandomString(26);
      const newNomenclator = new Nomenclator({
        key: newKey,
        code: serviceFee.nomenclatorId,
        category: "Tarifa de Servicio",
        value: salePrice
      });
      await newNomenclator.save();
    } else {
      await Nomenclator.findOneAndUpdate(
        { category: "Tarifa de Servicio", code: serviceFee.nomenclatorId },
        {
          category: "Tarifa de Servicio",
          code: serviceFee.nomenclatorId,
          value: salePrice
        },
        { new: true }
      );
    }

    const updatedServiceFee = await ServiceFee.findByIdAndUpdate(
      serviceFee._id,
      {
        ...serviceFee,
        rawMaterialsSubtotal,
        taskListSubtotal,
        equipmentDepreciationSubtotal,
        equipmentMaintenanceSubtotal,
        administrativeExpensesSubtotal,
        transportationExpensesSubtotal,
        hiredPersonalExpensesSubtotal,
        // complexity: complexityValues,
        expensesTotalValue,
        // ONAT: serviceFee.ONAT,
        // ONATValue: ONATValue,
        // commercialMarginValue: comercialMarginValue,
        // artisticTalentValue: artisticTalentValue,
        salePrice: salePrice,
        salePriceUSD: salePrice / serviceFee?.currencyChange,
        estimatedTime: estimatedTime,
        pricePerRepresentative
      },
      { new: true }
    );

    return new NextResponse(
      JSON.stringify({
        ok: true,
        updatedServiceFee
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
      console.log("🚀 ~ PUT ~ error:", error);
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
    const listOfServiceFees = (await ServiceFee.find()).reverse();

    return new NextResponse(
      JSON.stringify({
        ok: true,
        listOfServiceFees
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
    const serviceFeeToDelete = await ServiceFee.findById(params.get("id"));

    const BDNomenclator = await Nomenclator.findOne({
      category: "Tarifa de Servicio",
      code: serviceFeeToDelete.nomenclatorId
    });

    if (!serviceFeeToDelete) {
      return NextResponse.json(
        {
          ok: false,
          message: "La tarifa de servicio a borrar no existe"
        },
        { status: 404 }
      );
    }

    if (BDNomenclator) {
      await Nomenclator.findOneAndDelete({
        category: "Tarifa de Servicio",
        code: serviceFeeToDelete.nomenclatorId
      });
    }

    const deletedServiceFee = await ServiceFee.findByIdAndDelete(params.get("id"));

    return new NextResponse(
      JSON.stringify({
        ok: true,
        deletedServiceFee
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

import { NextResponse } from "next/server";

import { connectDB } from "@/libs/mongodb";
import { generateRandomString } from "./randomStrings";
import { IServiceFeeAuxiliary } from "@/models/serviceFeeAuxiliary";
import Nomenclator from "@/models/nomenclator";
import ServiceFee, { IServiceFee } from "@/models/serviceFees";

// ? Cuando se modifica cualquier valor de la hoja de auxiliares se actualizan todas las fichas de costo y se vuelven a calcular sus precios. Si uno de los coeficientes es eliminado se elimina de todas las fichas de costo y se recalcula el valor de estas ?//

export const updateServiceFeeWhenAuxiliary = async (auxiliary: IServiceFeeAuxiliary, serviceFees: IServiceFee[]) => {
  console.log("🚀 ~ updateServiceFeeWhenAuxiliary ~ auxiliary:", auxiliary);

  const administrativeExpensesNames = auxiliary.administrativeExpensesCoefficients.map((administrativeExpense) => administrativeExpense.name);
  const equipmentDepreciationNames = auxiliary.equipmentDepreciationCoefficients.map((equipmentDepreciation) => equipmentDepreciation.name);
  const equipmentMaintenanceNames = auxiliary.equipmentMaintenanceCoefficients.map((equipmentMaintenance) => equipmentMaintenance.name);
  const transportacionExpensesNames = auxiliary.transportationExpensesCoefficients.map((transportationExpense) => transportationExpense.name);

  serviceFees.forEach((serviceFee, index, serviceFees) => {
    const administrativeExpenses = serviceFees[index].administrativeExpenses;
    const equipmentDepreciation = serviceFees[index].equipmentDepreciation;
    const equipmentMaintenance = serviceFees[index].equipmentMaintenance;
    const transportationExpenses = serviceFees[index].transportationExpenses;

    serviceFee.currencyChange = auxiliary.currencyChange

    administrativeExpenses.forEach((administrativeExpense, index, administrativeExpenses) => {
      if (administrativeExpensesNames.includes(administrativeExpense.description)) {
        const price = auxiliary.administrativeExpensesCoefficients.find((ae) => ae.name === administrativeExpense.description);
        administrativeExpenses[index] = {
          description: administrativeExpense.description,
          unitMeasure: administrativeExpense.unitMeasure,
          amount: administrativeExpense.amount,
          price: price?.value!,
          value: price?.value! * administrativeExpense.amount,
        };
        console.log("🚀 ~ administrativeExpenses.forEach ~ administrativeExpense:", administrativeExpenses[index]);
        return administrativeExpenses[index];
      } else {
        administrativeExpenses.splice(index, 1);
      }
    });

    equipmentDepreciation.forEach((equipmentDepreciation, index, equipmentDepreciations) => {
      if (equipmentDepreciationNames.includes(equipmentDepreciation.description)) {
        const price = auxiliary.equipmentDepreciationCoefficients.find((ed) => ed.name === equipmentDepreciation.description);
        equipmentDepreciations[index] = {
          description: equipmentDepreciation.description,
          unitMeasure: equipmentDepreciation.unitMeasure,
          amount: equipmentDepreciation.amount,
          price: price?.value!,
          value: price?.value! * equipmentDepreciation.amount,
        };
        return equipmentDepreciations[index];
      } else {
        equipmentDepreciations.splice(index, 1);
      }
    });

    equipmentMaintenance.forEach((equipmentMaintenance, index, equipmentMaintenances) => {
      if (equipmentMaintenanceNames.includes(equipmentMaintenance.description)) {
        const price = auxiliary.equipmentMaintenanceCoefficients.find((em) => em.name === equipmentMaintenance.description);
        equipmentMaintenances[index] = {
          description: equipmentMaintenance.description,
          unitMeasure: equipmentMaintenance.unitMeasure,
          amount: equipmentMaintenance.amount,
          price: price?.value!,
          value: price?.value! * equipmentMaintenance.amount,
        };
        return equipmentMaintenances[index];
      } else {
        equipmentMaintenances.splice(index, 1);
      }
    });

    transportationExpenses.forEach((transportationExpense, index, transportationExpenses) => {
      if (transportacionExpensesNames.includes(transportationExpense.description)) {
        const price = auxiliary.transportationExpensesCoefficients.find((te) => te.name === transportationExpense.description);
        transportationExpenses[index] = {
          description: transportationExpense.description,
          unitMeasure: transportationExpense.unitMeasure,
          amount: transportationExpense.amount,
          price: price?.value!,
          value: price?.value! * transportationExpense.amount,
        };
        return transportationExpenses[index];
      } else {
        transportationExpenses.splice(index, 1);
      }
    });
  });


  serviceFees.map(async (serviceFee) => {
    try {
      await connectDB();

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

      // * El precio final se calcula (Suma de el valor de todos los gastos + valor del margen comercial + el valor del impuesto de la ONAT)
      const comercialMarginValue = expensesTotalValue * (serviceFee?.commercialMargin / 100);
      const ONATValue = expensesTotalValue * (serviceFee.ONAT / 100);
      const artisticTalentValue = expensesTotalValue * (serviceFee.artisticTalent / 100);
      const salePrice = expensesTotalValue + comercialMarginValue + ONATValue + artisticTalentValue;

      // * Calcula el valor de los 3 niveles de complejidad en dependencia del coeficiente asignado
      const complexityValues = serviceFee?.complexity?.map((complexity) => {
        return {
          name: complexity.name,
          coefficient: complexity.coefficient,
          value: salePrice * complexity.coefficient,
          USDValue: (salePrice * complexity.coefficient) / serviceFee.currencyChange,
        };
      });

      //* Si se modifica el valor de una tarifa se modifica tambien el valor del nomenclador asociado
      if (!BDNomenclator) {
        const newKey = generateRandomString(26);
        const newNomenclator = new Nomenclator({
          key: newKey,
          code: serviceFee.nomenclatorId,
          category: "Tarifa de Servicio",
          value: salePrice,
        });
        await newNomenclator.save();
      } else {
        await Nomenclator.findOneAndUpdate(
          { category: "Tarifa de Servicio", code: serviceFee.nomenclatorId },
          {
            category: "Tarifa de Servicio",
            code: serviceFee.nomenclatorId,
            value: salePrice,
          },
          { new: true }
        );
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
          complexity: complexityValues,
          expensesTotalValue,
          ONAT: serviceFee.ONAT,
          ONATValue: ONATValue,
          currencyChange: serviceFee.currencyChange,
          commercialMargin: serviceFee.commercialMargin,
          commercialMarginValue: comercialMarginValue,
          artisticTalent: serviceFee.artisticTalent,
          artisticTalentValue: artisticTalentValue,
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
  });
};

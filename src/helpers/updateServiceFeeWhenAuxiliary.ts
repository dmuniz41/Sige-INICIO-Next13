import { NextResponse } from "next/server";

import { connectDB } from "@/libs/mongodb";
import { generateRandomString } from "./randomStrings";
import { IServiceFeeAuxiliary } from "@/models/serviceFeeAuxiliary";
import Nomenclator from "@/models/nomenclator";
import ServiceFee, { IServiceFee } from "@/models/serviceFees";

//? CUANDO SE MODIFICA CUALQUIER VALOR DE LA HOJA DE AUXILIARES SE ACTUALIZAN TODAS LAS TARIFAS DE SERVICIO Y SE VUELVEN A CALCULAR SUS PRECIOS. SI UNO DE LOS COEFICIENTES ES ELIMINADO SE ELIMINA DE TODAS LAS TARIFAS DE SERVICIO Y SE RECALCULA EL VALOR DE ESTAS ?//

export const updateServiceFeeWhenAuxiliary = async (auxiliary: IServiceFeeAuxiliary, serviceFees: IServiceFee[]) => {
  //? ALMACENA LOS NOMBRES DE LOS COEFICIENTES SEPARADOS POR SECCIONES ?//

  const administrativeExpensesNames = auxiliary.administrativeExpensesCoefficients.map(
    (administrativeExpense) => administrativeExpense.name);
  const equipmentDepreciationNames = auxiliary.equipmentDepreciationCoefficients.map((equipmentDepreciation) => equipmentDepreciation.name);
  const equipmentMaintenanceNames = auxiliary.equipmentMaintenanceCoefficients.map((equipmentMaintenance) => equipmentMaintenance.name);
  const transportacionExpensesNames = auxiliary.transportationExpensesCoefficients.map(
    (transportationExpense) => transportationExpense.name);

  //? BUSCA EN CADA SECCION EL/LOS COEFICIENTES QUE SE HAYAN MODIFICADO Y LOS ACTUALIZA ?//

  serviceFees.forEach((serviceFee, index, serviceFees) => {
    const administrativeExpenses = serviceFees[index].administrativeExpenses;
    const equipmentDepreciation = serviceFees[index].equipmentDepreciation;
    const equipmentMaintenance = serviceFees[index].equipmentMaintenance;
    const transportationExpenses = serviceFees[index].transportationExpenses;
    const hiredPersonalExpenses = serviceFees[index].hiredPersonalExpenses;
    const estimatedTime: number = serviceFee?.taskList?.reduce(
      (total, currentValue) => total + currentValue?.currentComplexity?.time! * currentValue.amount,
      0
    );

    serviceFee.currencyChange = auxiliary.currencyChange;

    administrativeExpenses.forEach((administrativeExpense, index, administrativeExpenses) => {
      if (administrativeExpensesNames.includes(administrativeExpense.description)) {
        const price = auxiliary.administrativeExpensesCoefficients.find(
          (ae) => ae.name.trim().toLowerCase() === administrativeExpense.description.trim().toLowerCase()
        );
        administrativeExpenses[index] = {
          description: administrativeExpense.description,
          unitMeasure: administrativeExpense.unitMeasure,
          amount: estimatedTime,
          price: price?.value!,
          value: price?.value! * estimatedTime
        };
        return administrativeExpenses[index];
      } else {
        administrativeExpenses.splice(index, 1);
      }
    });

    equipmentDepreciation.forEach((equipmentDepreciation, index, equipmentDepreciations) => {
      if (equipmentDepreciationNames.includes(equipmentDepreciation.description)) {
        const price = auxiliary.equipmentDepreciationCoefficients.find(
          (ed) => ed.name.trim().toLowerCase() === equipmentDepreciation.description.trim().toLowerCase()
        );
        equipmentDepreciations[index] = {
          description: equipmentDepreciation.description,
          unitMeasure: equipmentDepreciation.unitMeasure,
          amount: equipmentDepreciation.amount,
          price: price?.value!,
          value: price?.value! * equipmentDepreciation.amount
        };
        return equipmentDepreciations[index];
      } else {
        equipmentDepreciations.splice(index, 1);
      }
    });

    equipmentMaintenance.forEach((equipmentMaintenance, index, equipmentMaintenances) => {
      if (equipmentMaintenanceNames.includes(equipmentMaintenance.description)) {
        const price = auxiliary.equipmentMaintenanceCoefficients.find(
          (em) => em.name.trim().toLowerCase() === equipmentMaintenance.description.trim().toLowerCase()
        );
        equipmentMaintenances[index] = {
          description: equipmentMaintenance.description,
          unitMeasure: equipmentMaintenance.unitMeasure,
          amount: equipmentMaintenance.amount,
          price: price?.value!,
          value: price?.value! * equipmentMaintenance.amount
        };
        return equipmentMaintenances[index];
      } else {
        equipmentMaintenances.splice(index, 1);
      }
    });

    transportationExpenses.forEach((transportationExpense, index, transportationExpenses) => {
      if (transportacionExpensesNames.includes(transportationExpense.description)) {
        const price = auxiliary.transportationExpensesCoefficients.find(
          (te) => te.name.trim().toLowerCase() === transportationExpense.description.trim().toLowerCase()
        );
        transportationExpenses[index] = {
          description: transportationExpense.description,
          unitMeasure: transportationExpense.unitMeasure,
          amount: transportationExpense.amount,
          price: price?.value!,
          value: price?.value! * transportationExpense.amount
        };
        return transportationExpenses[index];
      } else {
        transportationExpenses.splice(index, 1);
      }
    });

    hiredPersonalExpenses.forEach((hiredPersonalExpense, index, hiredPersonalExpenses) => {
      if (hiredPersonalExpense.description === "Gasto de salarios indirectos") {
        const price = auxiliary.indirectSalariesCoefficient;
        hiredPersonalExpenses[index] = {
          description: hiredPersonalExpense.description,
          unitMeasure: hiredPersonalExpense.unitMeasure,
          amount: hiredPersonalExpense.amount,
          price: price,
          value: price * hiredPersonalExpense.amount
        };
        return hiredPersonalExpenses[index];
      }
    });
  });

  serviceFees.map(async (serviceFee) => {
    try {
      await connectDB();

      //? CALCULA EL VALOR DE CADA SUBTOTAL EN CADA SECCION DE LA FICHA DE COSTO ?//

      const rawMaterialsSubtotal: number = serviceFee.rawMaterials.reduce((total, currentValue) => total + currentValue.value, 0);
      const taskListSubtotal: number = serviceFee.taskList.reduce(
        (total, currentValue) => total + currentValue.currentComplexity?.value! * currentValue.amount,
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

      //? EL PRECIO FINAL SE CALCULA (SUMA DE EL VALOR DE TODOS LOS GASTOS + VALOR DEL MARGEN COMERCIAL + EL VALOR DEL IMPUESTO DE LA ONAT) ?//

      // const comercialMarginValue = expensesTotalValue * (serviceFee?.commercialMargin / 100);
      // const ONATValue = expensesTotalValue * (serviceFee.ONAT / 100);
      // const artisticTalentValue = expensesTotalValue * (serviceFee.artisticTalent / 100);
      // const salePrice = expensesTotalValue + comercialMarginValue + ONATValue + artisticTalentValue;
      const salePrice = expensesTotalValue;

      //? CALCULA EL VALOR DE LOS 3 NIVELES DE COMPLEJIDAD EN DEPENDENCIA DEL COEFICIENTE ASIGNADO ?//

      // const complexityValues = serviceFee?.complexity?.map((complexity) => {
      //   return {
      //     name: complexity.name,
      //     coefficient: complexity.coefficient,
      //     value: salePrice * complexity.coefficient,
      //     USDValue: (salePrice * complexity.coefficient) / serviceFee.currencyChange
      //   };
      // });

      //? SI SE MODIFICA EL VALOR DE UNA TARIFA SE MODIFICA TAMBIEN EL VALOR DEL NOMENCLADOR ASOCIADO ?//

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
          category: serviceFee.category,
          nomenclatorId: serviceFee.nomenclatorId,
          workersAmount: serviceFee.workersAmount,
          taskName: serviceFee.taskName,
          unitMeasure: serviceFee.unitMeasure,
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
          // complexity: complexityValues,
          expensesTotalValue,
          // ONAT: serviceFee.ONAT,
          // ONATValue: ONATValue,
          currencyChange: serviceFee.currencyChange,
          // commercialMargin: serviceFee.commercialMargin,
          // commercialMarginValue: comercialMarginValue,
          // artisticTalent: serviceFee.artisticTalent,
          // artisticTalentValue: artisticTalentValue,
          salePrice: salePrice,
          salePriceUSD: salePrice / serviceFee?.currencyChange,
          estimatedTime: estimatedTime
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
          }
        }
      );
    } catch (error) {
      console.log("🚀 ~ POST ~ error:", error);
      if (error instanceof Error) {
        return NextResponse.json(
          {
            ok: false,
            message: error.message
          },
          {
            status: 400
          }
        );
      }
    }
  });
};

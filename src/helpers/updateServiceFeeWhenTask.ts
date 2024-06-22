import { NextResponse } from "next/server";

import { connectDB } from "@/libs/mongodb";
import { generateRandomString } from "./randomStrings";
import { IServiceFeeTask } from "@/models/serviceFeeTask";
import Nomenclator from "@/models/nomenclator";
import ServiceFee, { IServiceFee } from "@/models/serviceFees";

//? CUANDO SE MODIFICA EL VALOR DE UNA TAREA SE ACTUALIZA EL VALOR DE TODAS LAS FICHAS DE COSTO DONDE ESTE ESA TAREA ?//

export const updateServiceFeeWhenTask = async (
  task: IServiceFeeTask,
  serviceFees: IServiceFee[]
) => {
  console.log("🚀 ~ task:", task);
  //? BUSCA EN CADA LISTA DE TAREAS DE CADA TARIFA DE SERVICIO SI EXISTE LA TAREA QUE SE PASA POR PARÁMETRO. SI EXISTE, ACTUALIZA EL VALOR DE LA TARIFA DE SERVICIO CON EL NUEVO VALOR DE LA TAREA ?//

  serviceFees.forEach((serviceFee, index, serviceFees) => {
    const taskList = serviceFees[index]?.taskList;
    taskList.forEach((value, index, taskList) => {
      if (
        taskList[index].description.trim().toLowerCase() === task.description.trim().toLowerCase()
      ) {
        const newCurrentComplexity = task.complexity.find((complexity) => {
          return complexity.name === taskList[index].currentComplexity?.name;
        });
        taskList[index] = {
          ...taskList[index],
          _id: task._id,
          amount: value?.amount,
          category: task?.category,
          description: task?.description,
          unitMeasure: task?.unitMeasure,
          complexity: task?.complexity,
          currentComplexity: newCurrentComplexity
        };
        return taskList[index];
      }
    });
  });

  //? RECALCULA EL NUEVO VALOR DE LA TARIFA DE SERVICIO CON LA TAREA ACTUALIZADA Y LA ACTUALIZA EN LA BASE DE DATOS ?//

  serviceFees.map(async (serviceFee) => {
    try {
      await connectDB();

      //? CALCULA EL VALOR DE CADA SUBTOTAL EN CADA SECCION DE LA FICHA DE COSTO ?//

      const rawMaterialsSubtotal: number = serviceFee.rawMaterials.reduce(
        (total, currentValue) => total + currentValue.value,
        0
      );
      const taskListSubtotal: number = serviceFee.taskList.reduce(
        (total, currentValue) =>
          total + currentValue.currentComplexity?.value! * currentValue.amount,
        0
      );
      const estimatedTime: number = serviceFee?.taskList?.reduce(
        (total, currentValue) =>
          total + currentValue?.currentComplexity?.time! * currentValue.amount,
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

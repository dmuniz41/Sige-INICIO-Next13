import { NextResponse } from "next/server";

import { connectDB } from "@/libs/mongodb";
import { generateRandomString } from "./randomStrings";
import { IServiceFeeTask } from "@/models/serviceFeeTask";
import Nomenclator from "@/models/nomenclator";
import RepresentativeNomenclator, { IRepresentativeNomenclator } from "@/models/nomenclators/representative";
import ServiceFee, { IServiceFee } from "@/models/serviceFees";
import ServiceFeeAuxiliary from "@/models/serviceFeeAuxiliary";

// TODO: REFACTORIZAR EL PARA QUE SE EJECUTE TODO EN UN SOLO BUCLE

//? CUANDO SE MODIFICA EL VALOR DE UNA TAREA SE ACTUALIZA EL VALOR DE TODAS LAS FICHAS DE COSTO DONDE ESTE ESA TAREA ?//

export const updateServiceFeeWhenTask = async (task: IServiceFeeTask, serviceFees: IServiceFee[]) => {
  const representativeNomenclators = await RepresentativeNomenclator.find();
  const serviceFeeAuxiliary = await ServiceFeeAuxiliary.find();

  const artisticTalentCoefficient = serviceFeeAuxiliary[0].artisticTalentPercentage / 100;
  const ONATCoefficient = serviceFeeAuxiliary[0].ONATTaxPercentage / 100;

  //? BUSCA EN CADA LISTA DE TAREAS DE CADA TARIFA DE SERVICIO SI EXISTE LA TAREA QUE SE PASA POR PARÁMETRO. SI EXISTE, ACTUALIZA EL VALOR DE LA TARIFA DE SERVICIO CON EL NUEVO VALOR DE LA TAREA ?//
  serviceFees.forEach(async (serviceFee, index, serviceFees) => {

    const taskList = serviceFees[index]?.taskList;
    const administrativeExpenses = serviceFees[index]?.administrativeExpenses;

    //? ITERA SOBRE LA LISTA DE TAREAS PARA ACTUALIZARLAS ?//
    taskList.forEach((value, index, taskList) => {
      if (taskList[index].key === task.key) {
        const newCurrentComplexity = task.complexity.find((complexity) => {
          return complexity.name === taskList[index].currentComplexity?.name;
        });
        taskList[index] = {
          ...taskList[index],
          key: task.key,
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
    const estimatedTime: number = serviceFee?.taskList?.reduce(
      (total, currentValue) => total + currentValue?.currentComplexity?.time! * currentValue.amount,
      0
    );

    //? SI EL TIEMPO TOTAL CAMBIA ACTUALIZA LOS GASTOS DE ADMINISTRATIVOS ?//
    if (estimatedTime != serviceFee.estimatedTime) {
      administrativeExpenses.forEach((value, index, adminExpenses) => {
        adminExpenses[index] = {
          ...adminExpenses[index],
          description: value?.description,
          unitMeasure: value?.unitMeasure,
          amount: estimatedTime,
          price: value?.price,
          value: estimatedTime * value.price
        };
        return adminExpenses[index];
      });
    }
  });

  //? RECALCULA EL NUEVO VALOR DE LA TARIFA DE SERVICIO CON LA TAREA ACTUALIZADA Y LA ACTUALIZA EN LA BASE DE DATOS ?//
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

      // ! REVISAR: EL PRECIO FINAL SE CALCULA (SUMA DE EL VALOR DE TODOS LOS GASTOS + VALOR DEL MARGEN COMERCIAL + VALOR DEL IMPUESTO DE LA ONAT) //
      const artisticTalentValue = expensesTotalValue * artisticTalentCoefficient;
      // const comercialMarginValue = (expensesTotalValue + artisticTalentValue) * comercialMarginCoefficient;
      const ONATValue = artisticTalentValue * ONATCoefficient;
      // const salePrice = expensesTotalValue + comercialMarginValue + ONATValue + artisticTalentValue;
      const pricePerRepresentative = representativeNomenclators.map((representative: IRepresentativeNomenclator) => {
        if (representative.name === "EFECTIVO") {
          return {
            representativeName: "EFECTIVO",
            price: expensesTotalValue + artisticTalentValue,
            priceUSD: (expensesTotalValue + artisticTalentValue) / serviceFee?.currencyChange
          };
        } else {
          return {
            representativeName: representative.name,
            price: expensesTotalValue + artisticTalentValue * (representative.percentage / 100) + ONATValue,
            priceUSD: 0
          };
        }
      });
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

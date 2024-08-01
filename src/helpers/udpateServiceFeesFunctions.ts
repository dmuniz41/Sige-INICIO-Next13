import { NextResponse } from "next/server";

import { connectDB } from "@/libs/mongodb";
import { generateRandomString } from "./randomStrings";
import Nomenclator, { INomenclator } from "@/models/nomenclator";
import RepresentativeNomenclator, { IRepresentativeNomenclator } from "@/models/nomenclators/representative";
import ServiceFee, { IServiceFee } from "@/models/serviceFees";

// ? CUANDO SE MODIFICA EL VALOR DE UN NOMENCLADOR ASOCIADO A UN MATERIAL DEL ALMACEN(CATEGORIA + NOMBRE) SE ACTUALIZAN TODAS LAS FICHAS DE COSTO QUE UTILIZAN ESE MATERIAL Y SE VUELVEN A CALCULAR SUS PRECIOS ?//

export const updateServiceFeesMaterials = async (materialNomenclator: INomenclator, serviceFees: IServiceFee[]) => {
  const artisticTalentCoefficient = 0.5;
  const comercialMarginCoefficient = 0.3;
  const ONATCoefficient = 0.2;

  const representativeNomenclators = await RepresentativeNomenclator.find();

  //? BUSCA EN CADA LISTA DE MATERIAS PRIMAS DE CADA TARIFA DE SERVICIO SI EXISTE EL MATERIAL QUE SE PASA POR PARÁMETRO. SI EXISTE, ACTUALIZA EL VALOR DE LA TARIFA DE SERVICIO CON EL NUEVO VALOR DEL MATERIAL ?//

  // TODO: HACER QUE SI SE ACTUALIZA EL PRECIO DE UN MATERIAL GASTABLE EN EL ALMACEN SE LE APLIQUE EL COEFICIENTE DE MERMA AL NUEVO PRECIO //

  const serviceFeesToUpdate: IServiceFee[] = [];
  serviceFees.forEach((serviceFee, index, serviceFees) => {
    let rawMaterials = serviceFees[index].rawMaterials;
    rawMaterials.forEach((rawMaterial, index, rawMaterials) => {
      if (rawMaterial.description.trim().toLowerCase() === materialNomenclator.code.trim().toLowerCase()) {
        rawMaterials[index] = {
          description: rawMaterial.description,
          unitMeasure: rawMaterial.unitMeasure,
          amount: rawMaterial.amount,
          price: materialNomenclator.value ?? 0,
          value: materialNomenclator.value! * rawMaterial.amount
        };
        return rawMaterials[index];
      }
    });
  });
  serviceFees.map((serviceFee) =>
    serviceFee.rawMaterials.map((rawMaterial) => {
      if (rawMaterial.description.trim().toLowerCase() === materialNomenclator.code.trim().toLowerCase())
        serviceFeesToUpdate.push(serviceFee);
    })
  );

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

      // ? EL PRECIO FINAL SE CALCULA (SUMA DE EL VALOR DE TODOS LOS GASTOS + VALOR DEL MARGEN COMERCIAL + VALOR DEL IMPUESTO DE LA ONAT) //
      const artisticTalentValue = expensesTotalValue * artisticTalentCoefficient;
      // const comercialMarginValue = (expensesTotalValue + artisticTalentValue) * comercialMarginCoefficient;
      const ONATValue = expensesTotalValue * ONATCoefficient;
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
            price: expensesTotalValue + expensesTotalValue * (representative.percentage / 100) + ONATValue + artisticTalentValue,
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

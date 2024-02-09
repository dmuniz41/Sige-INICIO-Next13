import { NextResponse } from "next/server";

import { connectDB } from "@/libs/mongodb";
import { generateRandomString } from "./randomStrings";
import Nomenclator, { INomenclator } from "@/models/nomenclator";
import ServiceFee, { IServiceFee} from "@/models/serviceFees";

// ? Cuando se modifica el valor de un nomenclador asociado a un material del almacen(categoria + nombre) se actualizan todas las fichas de costo que utilizan ese material y se vuelven a calcular sus precios ?//

export const updateServiceFeesMaterials = async (materialNomenclator: INomenclator, serviceFees: IServiceFee[], accessToken: string) => {
  const serviceFeesToUpdate: IServiceFee[] = [];
  serviceFees.forEach((serviceFee, index, serviceFees) => {
    let rawMaterials = serviceFees[index].rawMaterials;
    rawMaterials.forEach((rawMaterial, index, rawMaterials) => {
      if (rawMaterial.description === materialNomenclator.code) {
        rawMaterials[index] = {
          description: rawMaterial.description,
          unitMeasure: rawMaterial.unitMeasure,
          amount: rawMaterial.amount,
          price: materialNomenclator.value ?? 0,
          value: materialNomenclator.value! * rawMaterial.amount,
        };
        return rawMaterials[index];
      }
    });
  });
  serviceFees.map((serviceFee) =>
    serviceFee.rawMaterials.map((rawMaterial) => {
      if (rawMaterial.description === materialNomenclator.code) serviceFeesToUpdate.push(serviceFee);
    })
  );

  serviceFeesToUpdate.map(async (serviceFee) => {
    try {
      await connectDB();
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
          name: complexity?.name,
          coefficient: complexity?.coefficient,
          value: salePrice * complexity?.coefficient,
          USDValue: (salePrice * complexity?.coefficient) / serviceFee?.currencyChange
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
      console.log("🚀 ~ PUT ~ error:", error);
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

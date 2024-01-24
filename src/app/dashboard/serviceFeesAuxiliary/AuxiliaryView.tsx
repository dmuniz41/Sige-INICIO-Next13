"use client";
import { EditAuxiliary } from "./EditAuxiliary";
import { EditSvg } from "@/app/global/EditSvg";
import { IServiceFeeAuxiliary } from "../../../models/serviceFeeAuxiliary";
import { RootState, useAppSelector } from "@/store/store";
import { startLoadServiceFeeAuxiliary, startUpdateServiceFeeAuxiliary } from "@/actions/serviceFeeAuxiliary";
import { useAppDispatch } from "@/hooks/hooks";
import { useSession } from "next-auth/react";
import React, { useEffect, useState } from "react";

export const AuxiliaryView = () => {
  const dispatch = useAppDispatch();
  const [editing, setEditing] = useState(false);
  const { data: sessionData } = useSession();

  const canEdit = sessionData?.user.role.includes("Editar Tarifas de Servicio");

  useEffect(() => {
    dispatch(startLoadServiceFeeAuxiliary());
  }, [dispatch]);

  const { serviceFeeAuxiliary }: { serviceFeeAuxiliary: IServiceFeeAuxiliary[] } = useAppSelector((state: RootState) => state?.serviceFee);

  const handleEdit = () => {
    setEditing(true);
  };

  const onCreate = (values: any) => {
    dispatch(
      startUpdateServiceFeeAuxiliary({
        _id: serviceFeeAuxiliary[0]?._id,
        calculationCoefficient: values.calculationCoefficient,
        currency: serviceFeeAuxiliary[0]?.currency,
        currencyChange: serviceFeeAuxiliary[0]?.currencyChange,
        informalCurrencyChange: values.informalCurrencyChange,
        key: serviceFeeAuxiliary[0]?.key,
        mermaCoefficient: values.mermaCoefficient,
        officialCurrencyChangeCoefficient: values.officialCurrencyChangeCoefficient,
        payMethod: values.payMethod,
        administrativeExpensesCoefficients: {
          electricityExpense: values.electricityExpense,
          fuelExpense: values.fuelExpense,
          feedingExpense: values.feedingExpense,
          phoneExpense: values.phoneExpense,
          leaseExpense: values.leaseExpense,
        },
        equipmentDepreciationCoefficients: {
          plotter: values.plotterDepreciation,
          router: values.routerDepreciation,
          bendingMachine: values.bendingMachine,
          manualTools: values.manualTools,
        },
        equipmentMaintenanceCoefficients: {
          plotter: values.plotterMaintenance,
          router: values.routerMaintenance,
        },
        transportationExpensesCoefficient: values.transportationExpensesCoefficient,
        salesAndDistributionExpensesCoefficient: values.salesAndDistributionExpensesCoefficient,
      })
    );
    setEditing(false);
  };

  return (
    <>
      {!editing ? (
        <section className="grid w-full gap-4">
          <article className="flex h-16 w-full bg-white-100 rounded-md shadow-md  items-center pl-4 gap-3 animate-fade animate-once animate-duration-200">
            <button
              disabled={!canEdit}
              onClick={handleEdit}
              className={`${
                true ? "bg-success-500 cursor-pointer hover:bg-success-600 ease-in-out duration-300" : "bg-success-200"
              } w-[6rem] h-[2.5rem] flex items-center p-1 text-base font-bold text-white-100  justify-center gap-2 rounded-md `}
            >
              <EditSvg />
              Editar
            </button>
          </article>
          <article className=" flex flex-col items-start gap-3 max-w-[25%] bg-background_light p-4 rounded-md shadow-lg animate-fade animate-once animate-duration-200">
            <div className="flex gap-1">
              <label className="font-bold text-md">Cambio de Moneda: </label>
              <label>{serviceFeeAuxiliary[0]?.currencyChange}</label>
            </div>
            <div className="grid gap-1">
              <label className="font-bold text-md">Coeficientes de Representación:</label>
              <ul>
                {serviceFeeAuxiliary[0]?.payMethod.map((payMethod) => (
                  <li key={payMethod.representative} className="flex w-20 gap-1">
                    <label className="font-bold ">{payMethod.representative}: </label>
                    <label>{payMethod.coefficientValue}</label>
                  </li>
                ))}
              </ul>
            </div>
            <div className="flex gap-2">
              <label className="font-bold text-md">Monedas: </label>
              {serviceFeeAuxiliary[0]?.currency.map((currency) => (
                <label key={currency}>{currency}</label>
              ))}
            </div>
            <div className="flex gap-2">
              <label className="font-bold text-md">Coeficiente de Cálculo: </label>
              <label>{serviceFeeAuxiliary[0]?.calculationCoefficient}</label>
            </div>
            <div className="flex gap-2">
              <label className="font-bold text-md">Coef de Cambio Monetario Oficial: </label>
              <label>{serviceFeeAuxiliary[0]?.officialCurrencyChangeCoefficient}</label>
            </div>
            <div className="flex gap-2">
              <label className="font-bold text-md">Cambio Informal: </label>
              <label>{serviceFeeAuxiliary[0]?.informalCurrencyChange}</label>
            </div>
            <div className="flex gap-2">
              <label className="font-bold text-md">Coeficiente de Merma: </label>
              <label>{serviceFeeAuxiliary[0]?.mermaCoefficient}</label>
            </div>
            <label className="font-bold text-md">Coeficientes de Gastos Administrativos:</label>
            <ul>
              <li key="fuel" className="flex gap-1">
                <label className="font-bold ">Combustible: </label>
                <label>{serviceFeeAuxiliary[0]?.administrativeExpensesCoefficients.fuelExpense}</label>
              </li>
              <li key="electricity" className="flex gap-1">
                <label className="font-bold ">Electricidad: </label>
                <label>{serviceFeeAuxiliary[0]?.administrativeExpensesCoefficients.electricityExpense}</label>
              </li>
              <li key="lease" className="flex gap-1">
                <label className="font-bold ">Arrendamiento: </label>
                <label>{serviceFeeAuxiliary[0]?.administrativeExpensesCoefficients.leaseExpense}</label>
              </li>
              <li key="feeding" className="flex gap-1">
                <label className="font-bold ">Alimentación: </label>
                <label>{serviceFeeAuxiliary[0]?.administrativeExpensesCoefficients.feedingExpense}</label>
              </li>
              <li key="phone" className="flex gap-1">
                <label className="font-bold ">Telefonía: </label>
                <label>{serviceFeeAuxiliary[0]?.administrativeExpensesCoefficients.phoneExpense}</label>
              </li>
            </ul>
            <label className="font-bold text-md">Coeficientes de Depreciación de equipos:</label>
            <ul>
              <li key="plotterDepreciation" className="flex gap-1">
                <label className="font-bold ">Plotter de Impresión y Corte: </label>
                <label>{serviceFeeAuxiliary[0]?.equipmentDepreciationCoefficients.plotter}</label>
              </li>
              <li key="routerDepreciation" className="flex gap-1">
                <label className="font-bold ">Router: </label>
                <label>{serviceFeeAuxiliary[0]?.equipmentDepreciationCoefficients.router}</label>
              </li>
              <li key="bendingMachine" className="flex gap-1">
                <label className="font-bold ">Dobladora: </label>
                <label>{serviceFeeAuxiliary[0]?.equipmentDepreciationCoefficients.bendingMachine}</label>
              </li>
              <li key="manualTools" className="flex gap-1">
                <label className="font-bold ">Herramientas Manuales: </label>
                <label>{serviceFeeAuxiliary[0]?.equipmentDepreciationCoefficients.manualTools}</label>
              </li>
            </ul>
            <label className="font-bold text-md">Coeficientes de Mantenimiento de equipos:</label>
            <ul>
              <li key="plotterMaintenance" className="flex gap-1">
                <label className="font-bold ">Plotter de Impresión y Corte: </label>
                <label>{serviceFeeAuxiliary[0]?.equipmentMaintenanceCoefficients.plotter}</label>
              </li>
              <li key="routerMaintenance" className="flex gap-1">
                <label className="font-bold ">Router: </label>
                <label>{serviceFeeAuxiliary[0]?.equipmentMaintenanceCoefficients.router}</label>
              </li>
            </ul>
            <label className="font-bold text-md">Coeficientes de gastos de transportación:</label>
            <ul>
              <li key="transportationExpensesCoefficient" className="flex gap-1">
                <label className="font-bold ">Transportación: </label>
                <label>{serviceFeeAuxiliary[0]?.transportationExpensesCoefficient}</label>
              </li>
              <li key="salesAndDistributionExpensesCoefficient" className="flex gap-1">
                <label className="font-bold ">Distribución y venta: </label>
                <label>{serviceFeeAuxiliary[0]?.salesAndDistributionExpensesCoefficient}</label>
              </li>
            </ul>
          </article>
        </section>
      ) : (
        <article className="flex flex-col max-w-[50%] bg-white-100 rounded-md shadow-md mb-4 items-center pl-4 pr-4 pt-4 gap-4 animate-fade animate-once animate-duration-200">
          <EditAuxiliary defaultValues={serviceFeeAuxiliary} onCreate={onCreate} />
        </article>
      )}
    </>
  );
};

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

  const { serviceFeeAuxiliary }: { serviceFeeAuxiliary: IServiceFeeAuxiliary } = useAppSelector((state: RootState) => state?.serviceFee);

  const handleEdit = () => {
    setEditing(true);
  };

  const onCreate = (values: any) => {
    dispatch(
      startUpdateServiceFeeAuxiliary({
        _id: serviceFeeAuxiliary?._id,
        calculationCoefficient: values.calculationCoefficient,
        currency: serviceFeeAuxiliary?.currency,
        currencyChange: serviceFeeAuxiliary?.currencyChange,
        informalCurrencyChange: values.informalCurrencyChange,
        key: serviceFeeAuxiliary?.key,
        mermaCoefficient: values.mermaCoefficient,
        officialCurrencyChangeCoefficient: values.officialCurrencyChangeCoefficient,
        payMethod: values.payMethod,
        administrativeExpensesCoefficients: values.administrativeExpenses,
        equipmentDepreciationCoefficients: values. equipmentDepreciation,
        equipmentMaintenanceCoefficients: values. equipmentMaintenance,
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
              className="toolbar-primary-icon-btn"
            >
              <EditSvg />
              Editar
            </button>
          </article>
          <article className=" flex flex-col items-start gap-3 max-w-[25%] bg-background_light p-4 rounded-md shadow-lg animate-fade animate-once animate-duration-200">
            <div className="flex gap-1">
              <label className="font-bold text-md">Cambio de Moneda: </label>
              <label>{serviceFeeAuxiliary?.currencyChange}</label>
            </div>
            <div className="grid gap-1">
              <label className="font-bold text-md">Coeficientes de Representación:</label>
              <ul>
                {serviceFeeAuxiliary?.payMethod?.map((payMethod) => (
                  <li key={payMethod.representative} className="flex w-20 gap-1">
                    <label className="font-bold ">{payMethod.representative}: </label>
                    <label>{payMethod.coefficientValue}</label>
                  </li>
                ))}
              </ul>
            </div>
            <div className="flex gap-2">
              <label className="font-bold text-md">Monedas: </label>
              {serviceFeeAuxiliary?.currency?.map((currency) => (
                <label key={currency}>{currency}</label>
              ))}
            </div>
            <div className="flex gap-2">
              <label className="font-bold text-md">Coeficiente de Cálculo: </label>
              <label>{serviceFeeAuxiliary?.calculationCoefficient}</label>
            </div>
            <div className="flex gap-2">
              <label className="font-bold text-md">Coef de Cambio Monetario Oficial: </label>
              <label>{serviceFeeAuxiliary?.officialCurrencyChangeCoefficient}</label>
            </div>
            <div className="flex gap-2">
              <label className="font-bold text-md">Cambio Informal: </label>
              <label>{serviceFeeAuxiliary?.informalCurrencyChange}</label>
            </div>
            <div className="flex gap-2">
              <label className="font-bold text-md">Coeficiente de Merma: </label>
              <label>{serviceFeeAuxiliary?.mermaCoefficient}</label>
            </div>
            <label className="font-bold text-md">Coeficientes de Gastos Administrativos:</label>
            <ul>
              {serviceFeeAuxiliary.administrativeExpensesCoefficients?.map((administrativeExpense) => (
                <li key={administrativeExpense.name} className="flex gap-1">
                  <label className="font-bold ">{administrativeExpense.name}: </label>
                  <label>{administrativeExpense.value.toFixed(2)}</label>
                </li>
              ))}
            </ul>
            <label className="font-bold text-md">Coeficientes de Depreciación de equipos:</label>
            <ul>
              {serviceFeeAuxiliary.equipmentDepreciationCoefficients?.map((equipmentDepreciation) => (
                <li key={equipmentDepreciation.name} className="flex gap-1">
                  <label className="font-bold ">{equipmentDepreciation.name}: </label>
                  <label>{equipmentDepreciation.value.toFixed(2)}</label>
                </li>
              ))}
            </ul>
            <label className="font-bold text-md">Coeficientes de Mantenimiento de equipos:</label>
            <ul>
              {serviceFeeAuxiliary.equipmentMaintenanceCoefficients?.map((equipmentMaintenance) => (
                <li key={equipmentMaintenance.name} className="flex gap-1">
                  <label className="font-bold ">{equipmentMaintenance.name}: </label>
                  <label>{equipmentMaintenance.value.toFixed(2)}</label>
                </li>
              ))}
            </ul>
            <label className="font-bold text-md">Coeficientes de gastos de transportación:</label>
            <ul>
              <li key="transportationExpensesCoefficient" className="flex gap-1">
                <label className="font-bold ">Transportación: </label>
                <label>{serviceFeeAuxiliary?.transportationExpensesCoefficient}</label>
              </li>
              <li key="salesAndDistributionExpensesCoefficient" className="flex gap-1">
                <label className="font-bold ">Distribución y venta: </label>
                <label>{serviceFeeAuxiliary?.salesAndDistributionExpensesCoefficient}</label>
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

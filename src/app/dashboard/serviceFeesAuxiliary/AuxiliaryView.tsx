"use client";
import { EditSvg } from "@/app/global/EditSvg";
import { IServiceFeeAuxiliary } from "../../../models/serviceFeeAuxiliary";
import { RootState, useAppSelector } from "@/store/store";
import { startLoadServiceFeeAuxiliary, startUpdateServiceFeeAuxiliary } from "@/actions/serviceFeeAuxiliary";
import { useAppDispatch } from "@/hooks/hooks";
import React, { useEffect, useState } from "react";
import { EditAuxiliary } from "./EditAuxiliary";

export const AuxiliaryView = () => {
  const dispatch = useAppDispatch();
  const [editing, setEditing] = useState(false);

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
      })
    );
    setEditing(false);
  };

  return (
    <>
      {!editing ? (
        <>
          <article className="flex h-16 w-full bg-white-100 rounded-md shadow-md mb-4 items-center pl-4 gap-3 animate-fade animate-once animate-duration-200">
            <button
              // disabled={!canCreate}
              onClick={handleEdit}
              className={`${
                true ? "bg-success-500 cursor-pointer hover:bg-success-600 ease-in-out duration-300" : "bg-success-200"
              } w-[6rem] h-[2.5rem] flex items-center p-1 text-base font-bold text-white-100  justify-center gap-2 rounded-md `}
            >
              <EditSvg />
              Editar
            </button>
          </article>
          <article className="flex flex-col items-start gap-4 max-w-[20%] bg-background_light p-4 rounded-md shadow-lg animate-fade animate-once animate-duration-200">
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
          </article>
        </>
      ) : (
        <article className="flex flex-col max-w-[50%] bg-white-100 rounded-md shadow-md mb-4 items-center pl-4 pr-4 pt-4 gap-4 animate-fade animate-once animate-duration-200">
          <EditAuxiliary defaultValues={serviceFeeAuxiliary} onCreate={onCreate} />
        </article>
      )}
    </>
  );
};

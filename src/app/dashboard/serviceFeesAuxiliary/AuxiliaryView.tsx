"use client";
import { startLoadServiceFeeAuxiliary, startUpdateServiceFeeAuxiliary } from "@/actions/serviceFeeAuxiliary";
import { EditSvg } from "@/app/global/EditSvg";
import { useAppDispatch } from "@/hooks/hooks";
import { RootState, useAppSelector } from "@/store/store";
import React, { useEffect } from "react";
import { IServiceFeeAuxiliary } from "../../../models/serviceFeeAuxiliary";

export const AuxiliaryView = () => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(startLoadServiceFeeAuxiliary());
  }, [dispatch]);

  const { serviceFeeAuxiliary }: { serviceFeeAuxiliary: IServiceFeeAuxiliary[] } = useAppSelector((state: RootState) => state?.serviceFee);

  const handleEdit = () => {
    dispatch(
      startUpdateServiceFeeAuxiliary({
        _id: "65a2bbae4482ff3642599480",
        key: "Vu8VpC5nhZ2yxUsur2vIcYE9Wa",
        currency: ["USD", "CUP"],
        calculationCoefficient: 1.5,
        officialCurrencyChangeCoefficient: 1,
        informalCurrencyChange: 1,
        currencyChange: 250,
        mermaCoefficient: 1.2,
        payMethod: [
          {
            representative: "FCBC",
            coefficientValue: 1.53,
            _id: "65a2bbae4482ff3642599481",
          },
          {
            representative: "ACCS",
            coefficientValue: 1.49,
            _id: "65a2bbae4482ff3642599482",
          },
          {
            representative: "CNOE",
            coefficientValue: 1.33,
            _id: "65a2bbae4482ff3642599483",
          },
          {
            representative: "GENSESIS",
            coefficientValue: 1.5,
            _id: "65a2bbae4482ff3642599484",
          },
          {
            representative: "Efectvo",
            coefficientValue: 1,
            _id: "65a2bbae4482ff3642599485",
          },
        ],
      })
    );
  };

  return (
    <>
      <article className="flex h-16 w-full bg-white-100 rounded-md shadow-md mb-4 items-center pl-4 gap-4">
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
      <article className="flex flex-col items-start gap-4 w-[30%] bg-background_light p-4 rounded-md shadow-lg">
        <div className="flex gap-1">
          <label className="font-bold text-md">Cambio de Moneda: </label>
          <label>{serviceFeeAuxiliary[0]?.currencyChange}</label>
        </div>
        <label className="font-bold text-md">Coeficientes de Representación:</label>
        <ul>
          {serviceFeeAuxiliary[0]?.payMethod.map((payMethod) => (
            <li key={payMethod.representative} className="flex w-20 gap-1">
              <label className="font-bold ">{payMethod.representative}: </label>
              <label>{payMethod.coefficientValue}</label>
            </li>
          ))}
        </ul>
        <div className="flex gap-2">
          <label className="font-bold text-md">Monedas: </label>
          {serviceFeeAuxiliary[0]?.currency.map((currency)=>(
            <label key={currency}>{currency}</label>
          ))
          }
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
  );
};

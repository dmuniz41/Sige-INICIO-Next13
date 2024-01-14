'use client'
import { startLoadServiceFeeAuxiliary } from "@/actions/serviceFeeAuxiliary";
import { EditSvg } from "@/app/global/EditSvg";
import { PlusSvg } from "@/app/global/PlusSvg";
import { useAppDispatch } from "@/hooks/hooks";
import React, { useEffect } from "react";

export const AuxiliaryView = () => {
  const dispatch = useAppDispatch()

  useEffect(() => {
    dispatch(startLoadServiceFeeAuxiliary());
  }, [dispatch]);

  return (
    <>
      <div className="flex h-16 w-full bg-white-100 rounded-md shadow-md mb-4 items-center pl-4 gap-4">
          <button
            // disabled={!canCreate}
            // onClick={() => router.push("/dashboard/costSheets/createCostSheet")}
            className={`${
              true ? "bg-success-500 cursor-pointer hover:bg-success-600 ease-in-out duration-300" : "bg-success-200"
            } w-[6rem] h-[2.5rem] flex items-center p-1 text-base font-bold text-white-100  justify-center gap-2 rounded-md `}
          >
            <EditSvg />
            Editar
          </button>
      </div>
      <article className="flex flex-col items-start gap-4 w-[30%] h-[99%] bg-background_light p-4 rounded-md shadow-lg">
        <div className="flex gap-1">
          <label className="font-bold text-md">Cambio de Moneda: </label>
          <label>####</label>
        </div>
        <label className="font-bold text-md">Coeficientes de Representación:</label>
        <ul>
          <li className="flex w-20 gap-1">
            <label className="font-bold ">Efectivo: </label>
            <label>####</label>
          </li>
          <li className="flex w-20 gap-1">
            <label className="font-bold ">FCBC: </label>
            <label>####</label>
          </li>
          <li className="flex w-20 gap-1">
            <label className="font-bold ">ACCS: </label>
            <label>####</label>
          </li>
          <li className="flex w-20 gap-1">
            <label className="font-bold ">CNOE: </label>
            <label>####</label>
          </li>
          <li className="flex w-20 gap-1">
            <label className="font-bold ">GENESIS: </label>
            <label>####</label>
          </li>
        </ul>
        <div className="flex gap-2">
          <label className="font-bold text-md">Monedas: </label>
          <label>USD, CUP</label>
        </div>
        <div className="flex gap-2">
          <label className="font-bold text-md">Coeficiente de Cálculo: </label>
          <label>####</label>
        </div>
        <div className="flex gap-2">
          <label className="font-bold text-md">Coeficiente de Cambio Monetario Oficial: </label>
          <label>####</label>
        </div>
        <div className="flex gap-2">
          <label className="font-bold text-md">Cambio Informal: </label>
          <label>####</label>
        </div>
        <div className="flex gap-2">
          <label className="font-bold text-md">Coeficiente de Merma: </label>
          <label>####</label>
        </div>
      </article>
    </>
  );
};

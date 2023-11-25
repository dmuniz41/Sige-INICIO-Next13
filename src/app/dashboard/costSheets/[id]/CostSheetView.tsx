"use client";

import { RootState, useAppSelector } from "@/store/store";
import React, { useEffect, useMemo, useState } from "react";
import { CSViewTable } from "./CSViewTable";
import { ICostSheet } from "@/models/costSheet";
import { useAppDispatch } from "@/hooks/hooks";
import { loadSelectedCostSheet } from "@/actions/costSheet";
import { usePathname } from "next/navigation";
import { ICostSheetSubitem } from "../../../../models/costSheet";

export const CostSheetView = () => {
  const url = usePathname().split("/");
  const selectedCostSheetId: string = url[3];
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(loadSelectedCostSheet(selectedCostSheetId));
  }, [dispatch, selectedCostSheetId]);

  const { selectedCostSheet }: { selectedCostSheet: ICostSheet } = useAppSelector((state: RootState) => state?.costSheet);
  let rawMaterials: ICostSheetSubitem[] = useMemo(() => selectedCostSheet.rawMaterials, [selectedCostSheet]);
  let directSalaries: ICostSheetSubitem[] = useMemo(() => selectedCostSheet.directSalaries, [selectedCostSheet]);
  let otherDirectExpenses: ICostSheetSubitem[] = useMemo(() => selectedCostSheet.otherDirectExpenses, [selectedCostSheet]);
  let productionRelatedExpenses: ICostSheetSubitem[] = useMemo(() => selectedCostSheet.productionRelatedExpenses, [selectedCostSheet]);
  let administrativeExpenses: ICostSheetSubitem[] = useMemo(() => selectedCostSheet.administrativeExpenses, [selectedCostSheet]);
  let transportationExpenses: ICostSheetSubitem[] = useMemo(() => selectedCostSheet.transportationExpenses, [selectedCostSheet]);
  let financialExpenses: ICostSheetSubitem[] = useMemo(() => selectedCostSheet.financialExpenses, [selectedCostSheet]);
  let taxExpenses: ICostSheetSubitem[] = useMemo(() => selectedCostSheet.taxExpenses, [selectedCostSheet]);

  return (
    <article className="flex gap-1 flex-col w-full overflow-none rounded-md shadow-md p-2">
      <section className="w-full flex flex-row p-2 ">
        <h2 className="font-bold text-xl mr-auto w-[30%] flex">
          Ficha de Costo: <span className="ml-2 font-normal">{selectedCostSheet.taskName}</span>
        </h2>
        <div className="w-[30%] flex flex-col">
          <label className="font-bold">
            Creador: <span className="font-normal">INICIO</span>
          </label>
          <label className="font-bold">
            Cantidad de trabajadores: <span className="font-normal">{selectedCostSheet.workersAmount}</span>
          </label>
          <label className="font-bold">
            Cliente: <span className="font-normal">{`Aqui va el cliente`}</span>
          </label>
        </div>
        <label className="font-bold mr-2">Descripción:</label>
        <p className="w-[40%]">{`Aqui va la descripcion del producto`}</p>
      </section>
      <section className="flex flex-col w-full ">
        <CSViewTable subtotal={selectedCostSheet.rawMaterialsSubtotal} label="Gasto Material" data={rawMaterials} />
        <CSViewTable subtotal={selectedCostSheet.directSalariesSubtotal} label="Salarios Directos" data={directSalaries} />
        <CSViewTable subtotal={selectedCostSheet.otherDirectExpensesSubtotal} label="Otros Gastos Directos" data={otherDirectExpenses} />
        <CSViewTable subtotal={selectedCostSheet.productionRelatedExpensesSubtotal} label="Gastos Asociados a la Producción" data={productionRelatedExpenses} />
        <CSViewTable subtotal={selectedCostSheet.administrativeExpensesSubtotal} label="Gastos Generales y de Administración" data={administrativeExpenses} />
        <CSViewTable subtotal={selectedCostSheet.transportationExpensesSubtotal} label="Gastos de Distribución y Ventas" data={transportationExpenses} />
        <CSViewTable subtotal={selectedCostSheet.financialExpensesSubtotal} label="Gastos Financieros" data={financialExpenses} />
        <CSViewTable subtotal={selectedCostSheet.taxExpensesSubtotal} label="Gastos Tributarios" data={taxExpenses} />
      </section>
      <section className="w-[30%] flex flex-col p-2">
          <label className="font-bold">
            Importe Total de Costos: <span className="font-normal">{selectedCostSheet.costsTotalValue}</span>
          </label>
          <label className="font-bold">
            Importe Total de Gastos: <span className="font-normal">{selectedCostSheet.expensesTotalValue}</span>
          </label>
          <label className="font-bold">
            Importe Total de Costos y Gastos: <span className="font-normal">{selectedCostSheet.expensesAndCostsTotalValue}</span>
          </label>
        </section>  
    </article>
  );
};

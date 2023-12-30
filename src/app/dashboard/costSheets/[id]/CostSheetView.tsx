"use client";

import { RootState, useAppSelector } from "@/store/store";
import React, { useEffect, useMemo } from "react";
import { useAppDispatch } from "@/hooks/hooks";
import { usePathname } from "next/navigation";
import { PDFDownloadLink } from "@react-pdf/renderer";

import { CSViewTable } from "./CSViewTable";
import { ICostSheet } from "@/models/costSheet";
import { loadSelectedCostSheet } from "@/actions/costSheet";
import { ICostSheetSubitem } from "../../../../models/costSheet";
import { PDFSvg } from "@/app/global/PDFSvg";
import CostSheetPDFReport from "@/helpers/CostSheetPDFReport";
import { useRouter } from "next/navigation";
import { Tooltip } from "antd";
import { EditSvg } from "@/app/global/EditSvg";

export const CostSheetView = () => {
  const url = usePathname().split("/");
  const selectedCostSheetId: string = url[3];
  const dispatch = useAppDispatch();
  const router = useRouter();

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

  const fields: any = [
    {
      title: "Descripción",
      custom: true,
      component: (item: any) => `${item.description}`,
      width: "40",
    },
    {
      title: "U/M",
      custom: true,
      component: (item: any) => `${item.unitMeasure}`,
      width: "20",
    },
    {
      title: "Cant",
      custom: true,
      component: (item: any) => `${item.amount}`,
      width: "10",
    },
    {
      title: "Precio CUP",
      custom: true,
      component: (item: any) => `${item.price}`,
      width: "15",
    },
    {
      title: "Importe CUP",
      custom: true,
      component: (item: any) => `${item.value}`,
      width: "15",
    },
  ];
  const PDFReportData: ICostSheet = selectedCostSheet;

  const handleEdit = (): void => {
    router.push(`/dashboard/costSheets/editCostSheet`);
  };

  return (
    <>
      <article>
        <div className="flex h-16 w-full bg-white-100 rounded-md shadow-md mb-4 items-center pl-4 gap-4">
          <div className="flex gap-2">
            <Tooltip placement="top" title={"Editar"} arrow={{ pointAtCenter: true }}>
            <button
              className=
              "bg-success-500 cursor-pointer hover:bg-success-600 ease-in-out duration-300 w-[6rem] h-[2.5rem] flex items-center p-1 text-base font-bold text-white-100  justify-center gap-2 rounded-md"
                onClick={handleEdit}
            >
                <EditSvg />
                Editar
            </button>
            </Tooltip>
            <PDFDownloadLink
              document={<CostSheetPDFReport fields={fields} data={PDFReportData} title={`Ficha de costo ${selectedCostSheet.taskName}`} />}
              fileName={`Ficha de costo ${selectedCostSheet.taskName}`}
            >
              {({ blob, url, loading, error }) => (
                <button disabled={loading} className="cursor-pointer hover:bg-white-600 ease-in-out duration-300 rounded-full w-[2.5rem] h-[2.5rem] flex justify-center items-center">
                  <PDFSvg />
                </button>
              )}
            </PDFDownloadLink>
          </div>
        </div>
      </article>

      <article className="flex gap-1 flex-col w-full overflow-none rounded-md shadow-md p-2">
        <div className="flex pr-20">
          <h2 className="font-bold mr-auto w-[100%] flex pl-2">
            Tarea a ejecutar: <span className="ml-2 font-normal flex-1">{selectedCostSheet.taskName}</span>
          </h2>
        </div>
        <section className="w-full flex flex-row p-2 ">
          <label className="font-bold mr-2 ">Descripción:</label>
          <p className="w-[50%]">{selectedCostSheet.description}</p>
          <div className="w-[15%] flex flex-col pl-10">
            <label className="font-bold">
              Creador: <span className="font-normal">INICIO</span>
            </label>
            <label className="font-bold">
              Cantidad de trabajadores: <span className="font-normal">{selectedCostSheet.workersAmount}</span>
            </label>
          </div>
          <div className="flex flex-1 flex-col pl-10">
          <label className="font-bold">
              Nomenclador: <span className="font-normal">{selectedCostSheet.nomenclatorId}</span>
            </label>
          <label className="font-bold">
              Categoría: <span className="font-normal">{selectedCostSheet.category}</span>
            </label>
          </div>
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
        <section className="w-full flex flex-row gap-5 p-2">
          <div className="flex flex-col w-[40%]">
            <label className="font-bold">
              Importe Total de Costos: <span className="font-normal">${(selectedCostSheet.costsTotalValue * 1).toFixed(2)}</span>
            </label>
            <label className="font-bold">
              Importe Total de Gastos: <span className="font-normal">${(selectedCostSheet.expensesTotalValue * 1).toFixed(2)}</span>
            </label>
            <label className="font-bold">
              Importe Total de Costos y Gastos: <span className="font-normal">${(selectedCostSheet.expensesAndCostsTotalValue * 1).toFixed(2)}</span>
            </label>
          </div>
          <div className="flex flex-col w-[40%]">
            <label className="font-bold">
              Talento Artístico ({selectedCostSheet.artisticTalent}%): <span className="font-normal">${(selectedCostSheet.artisticTalentValue * 1).toFixed(2)}</span>
            </label>
            <label className="font-bold">
              Utilidad ({selectedCostSheet.representationCost}%): <span className="font-normal">${(selectedCostSheet.representationCostValue * 1).toFixed(2)}</span>
            </label>
            <label className="font-bold">
              Precio del Creador: <span className="font-normal">${(selectedCostSheet.creatorPrice * 1).toFixed(2)}</span>
            </label>
          </div>
          <div className="flex flex-col w-[40%]">
            <label className="font-bold">
              Materias Primas y Materiales Aportados por el Cliente: <span className="font-normal">${(selectedCostSheet.rawMaterialsByClient * 1).toFixed(2)}</span>
            </label>
            <label className="font-bold">
              Precio de Venta (MN): <span className="font-normal">${(selectedCostSheet.salePrice * 1).toFixed(2)}</span>
            </label>
            <label className="font-bold">
              Precio de Venta (MLC): <span className="font-normal">${(selectedCostSheet.salePriceMLC * 1).toFixed(2)}</span>
            </label>
          </div>
        </section>
      </article>
    </>
  );
};

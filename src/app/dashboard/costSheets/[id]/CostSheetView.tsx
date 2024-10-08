"use client";

import { RootState, useAppSelector } from "@/store/store";
import React, { useEffect, useMemo } from "react";
import { useAppDispatch } from "@/hooks/hooks";
import { usePathname } from "next/navigation";
import { useRouter } from "next/navigation";
import { Tooltip } from "antd";
import dynamic from "next/dynamic";

import { CSViewTable } from "./CSViewTable";
import { ICostSheet } from "@/models/costSheet";
import { loadSelectedCostSheet } from "@/actions/costSheet";
import { ICostSheetSubitem } from "../../../../models/costSheet";
import { PDFSvg } from "@/app/global/PDFSvg";
import { EditSvg } from "@/app/global/EditSvg";

const PDFDownloadLink = dynamic(
  () => import("@react-pdf/renderer").then((mod) => mod.PDFDownloadLink),
  {
    ssr: false,
    loading: () => <p>Loading...</p>
  }
);

export const CostSheetView = () => {
  const url = usePathname().split("/");
  const selectedCostSheetId: string = url[3];
  const dispatch = useAppDispatch();
  const router = useRouter();

  useEffect(() => {
    dispatch(loadSelectedCostSheet(selectedCostSheetId));
  }, [dispatch, selectedCostSheetId]);

  const { selectedCostSheet }: { selectedCostSheet: ICostSheet } = useAppSelector(
    (state: RootState) => state?.costSheet
  );
  let rawMaterials: ICostSheetSubitem[] = useMemo(
    () => selectedCostSheet.rawMaterials,
    [selectedCostSheet]
  );
  let directSalaries: ICostSheetSubitem[] = useMemo(
    () => selectedCostSheet.directSalaries,
    [selectedCostSheet]
  );
  let otherDirectExpenses: ICostSheetSubitem[] = useMemo(
    () => selectedCostSheet.otherDirectExpenses,
    [selectedCostSheet]
  );
  let productionRelatedExpenses: ICostSheetSubitem[] = useMemo(
    () => selectedCostSheet.productionRelatedExpenses,
    [selectedCostSheet]
  );
  let administrativeExpenses: ICostSheetSubitem[] = useMemo(
    () => selectedCostSheet.administrativeExpenses,
    [selectedCostSheet]
  );
  let transportationExpenses: ICostSheetSubitem[] = useMemo(
    () => selectedCostSheet.transportationExpenses,
    [selectedCostSheet]
  );
  let financialExpenses: ICostSheetSubitem[] = useMemo(
    () => selectedCostSheet.financialExpenses,
    [selectedCostSheet]
  );
  let taxExpenses: ICostSheetSubitem[] = useMemo(
    () => selectedCostSheet.taxExpenses,
    [selectedCostSheet]
  );

  const fields: any = [
    {
      title: "Descripción",
      custom: true,
      component: (item: any) => `${item.description}`,
      width: "40"
    },
    {
      title: "U/M",
      custom: true,
      component: (item: any) => `${item.unitMeasure}`,
      width: "20"
    },
    {
      title: "Cant",
      custom: true,
      component: (item: any) => `${item.amount}`,
      width: "10"
    },
    {
      title: "Precio CUP",
      custom: true,
      component: (item: any) => `$ ${item.price.toFixed(2)}`,
      width: "15"
    },
    {
      title: "Importe CUP",
      custom: true,
      component: (item: any) => `$ ${item.value.toFixed(2)}`,
      width: "15"
    }
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
              <button className="toolbar-primary-icon-btn" onClick={handleEdit}>
                <EditSvg />
                Editar
              </button>
            </Tooltip>
            {/* <PDFDownloadLink document={<CostSheetPDFReport fields={fields} data={PDFReportData} title={`Ficha de costo`} />} fileName={`Ficha de costo ${selectedCostSheet.taskName}`}>
              {({ blob, url, loading, error }) => (
                <button disabled={loading} className="cursor-pointer hover:bg-white-600 ease-in-out duration-300 rounded-full w-[2.5rem] h-[2.5rem] flex justify-center items-center">
                  <PDFSvg />
                </button>
              )}
            </PDFDownloadLink> */}
          </div>
        </div>
      </article>

      <article className="flex gap-1 flex-col w-full overflow-none rounded-md shadow-md p-2">
        {/* <div className="flex pr-20">
          <h2 className="font-semibold mr-auto w-[100%] flex pl-2">
            Tarea a ejecutar: <span className="ml-2 font-normal flex-1">{selectedCostSheet.taskName}</span>
          </h2>
        </div> */}
        <section className="w-full flex flex-row p-2 ">
          <label className="font-semibold mr-2 ">Descripción del servicio:</label>
          <p className="w-[40%]">{selectedCostSheet.description}</p>
          <div className="w-[15%] flex flex-col pl-10">
            <label className="font-semibold">
              Creador: <span className="font-normal">INICIO</span>
            </label>
            <label className="font-semibold">
              Cantidad de trabajadores:{" "}
              <span className="font-normal">{selectedCostSheet.workersAmount}</span>
            </label>
          </div>
          <div className="flex flex-1 flex-col pl-10">
            <label className="font-semibold">
              Nomenclador: <span className="font-normal">{selectedCostSheet.nomenclatorId}</span>
            </label>
            <label className="font-semibold">
              Categoría: <span className="font-normal">{selectedCostSheet.category}</span>
            </label>
          </div>
          <div className="flex flex-1 flex-col pl-10">
            <label className="font-semibold">
              Precio/UM:{" "}
              <span className="font-normal">{selectedCostSheet.valuePerUnitMeasure}</span>
            </label>
            <label className="font-semibold">
              Cliente: <span className="font-normal">Cliente</span>
            </label>
          </div>
        </section>
        <section className="flex flex-col w-full ">
          <CSViewTable
            subtotal={selectedCostSheet.rawMaterialsSubtotal}
            label="Gasto Material"
            data={rawMaterials}
          />
          <CSViewTable
            subtotal={selectedCostSheet.directSalariesSubtotal}
            label="Salarios Directos"
            data={directSalaries}
          />
          <CSViewTable
            subtotal={selectedCostSheet.otherDirectExpensesSubtotal}
            label="Otros Gastos Directos"
            data={otherDirectExpenses}
          />
          <CSViewTable
            subtotal={selectedCostSheet.productionRelatedExpensesSubtotal}
            label="Gastos Asociados a la Producción"
            data={productionRelatedExpenses}
          />
          <div className="flex w-full h-10 items-center border-solid border-[1px] mt-1 ">
            <div className="flex flex-1 justify-end pr-4">
              <label className="font-semibold">Importe Total de Costos:</label>
            </div>
            <div className="flex border-l-[1px] border-solid w-[8.7%] h-full items-center justify-center bg-background_light">
              <span className="font-semibold">
                ${(selectedCostSheet.costsTotalValue * 1).toFixed(2)}
              </span>
            </div>
          </div>
          <CSViewTable
            subtotal={selectedCostSheet.administrativeExpensesSubtotal}
            label="Gastos Generales y de Administración"
            data={administrativeExpenses}
          />
          <CSViewTable
            subtotal={selectedCostSheet.transportationExpensesSubtotal}
            label="Gastos de Distribución y Ventas"
            data={transportationExpenses}
          />
          <CSViewTable
            subtotal={selectedCostSheet.financialExpensesSubtotal}
            label="Gastos Financieros"
            data={financialExpenses}
          />
          <CSViewTable
            subtotal={selectedCostSheet.taxExpensesSubtotal}
            label="Gastos Tributarios"
            data={taxExpenses}
          />
          <div className="flex w-full h-10 items-center border-solid border-[1px] mt-1 ">
            <div className="flex flex-1 justify-end pr-4">
              <label className="font-semibold">Importe Total de Gastos:</label>
            </div>
            <div className="flex border-l-[1px] border-solid w-[8.7%] h-full items-center justify-center bg-background_light">
              <span className="font-semibold">
                ${(selectedCostSheet.expensesTotalValue * 1).toFixed(2)}
              </span>
            </div>
          </div>
          <div className="flex w-full h-10 items-center border-solid border-[1px] mt-1 ">
            <div className="flex flex-1 justify-end pr-4">
              <label className="font-semibold">Importe Total de Costos y Gastos:</label>
            </div>
            <div className="flex border-l-[1px] border-solid w-[8.7%] h-full items-center justify-center bg-background_light">
              <span className="font-semibold">
                ${(selectedCostSheet.expensesAndCostsTotalValue * 1).toFixed(2)}
              </span>
            </div>
          </div>
        </section>
        <section className="w-full flex flex-row gap-5 p-2">
          <div className="flex flex-col w-[40%]">
            <label className="font-semibold">
              Talento Artístico ({selectedCostSheet.artisticTalent}%):{" "}
              <span className="font-normal">
                ${(selectedCostSheet.artisticTalentValue * 1).toFixed(2)}
              </span>
            </label>
            <label className="font-semibold">
              Utilidad ({selectedCostSheet.representationCost}%):{" "}
              <span className="font-normal">
                ${(selectedCostSheet.representationCostValue * 1).toFixed(2)}
              </span>
            </label>
            <label className="font-semibold">
              Precio del Creador:{" "}
              <span className="font-normal">
                ${(selectedCostSheet.creatorPrice * 1).toFixed(2)}
              </span>
            </label>
          </div>
          <div className="flex flex-col w-[40%]">
            <label className="font-semibold">
              Materias Primas y Materiales Aportados por el Cliente:{" "}
              <span className="font-normal">
                ${(selectedCostSheet.rawMaterialsByClient * 1).toFixed(2)}
              </span>
            </label>
            <label className="font-semibold">
              Precio de Venta (MN):{" "}
              <span className="font-normal">${(selectedCostSheet.salePrice * 1).toFixed(2)}</span>
            </label>
            <label className="font-semibold">
              Precio de Venta (MLC):{" "}
              <span className="font-normal">
                ${(selectedCostSheet.salePriceMLC * 1).toFixed(2)}
              </span>
            </label>
          </div>
        </section>
      </article>
    </>
  );
};

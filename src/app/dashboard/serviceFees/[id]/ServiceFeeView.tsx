"use client";

import { RootState, useAppSelector } from "@/store/store";
import { Tooltip } from "antd";
import { useAppDispatch } from "@/hooks/hooks";
import { usePathname } from "next/navigation";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import React, { useEffect, useMemo } from "react";

import { EditSvg } from "@/app/global/EditSvg";
import { IServiceFee, IServiceFeeSubItem } from "@/models/serviceFees";
import { loadSelectedServiceFee } from "@/actions/serviceFee";
import { PDFSvg } from "@/app/global/PDFSvg";
import { ServiceFeeViewSection } from "./ServiceFeeViewSection";
import CostSheetPDFReport from "@/helpers/CostSheetPDFReport";

const PDFDownloadLink = dynamic(() => import("@react-pdf/renderer").then((mod) => mod.PDFDownloadLink), {
  ssr: false,
  loading: () => <p>Loading...</p>,
});

export const ServiceFeeView = () => {
  const url = usePathname().split("/");
  const selectedServiceFeeId: string = url[3];
  const dispatch = useAppDispatch();
  const router = useRouter();

  useEffect(() => {
    dispatch(loadSelectedServiceFee(selectedServiceFeeId));
  }, [dispatch, selectedServiceFeeId]);

  const { selectedServiceFee }: { selectedServiceFee: IServiceFee } = useAppSelector((state: RootState) => state?.serviceFee);
  let rawMaterials: IServiceFeeSubItem[] = useMemo(() => selectedServiceFee.rawMaterials, [selectedServiceFee]);
  let taskList: IServiceFeeSubItem[] = useMemo(() => selectedServiceFee.taskList, [selectedServiceFee]);
  let equipmentDepreciation: IServiceFeeSubItem[] = useMemo(() => selectedServiceFee.equipmentDepreciation, [selectedServiceFee]);
  let equipmentMaintenance: IServiceFeeSubItem[] = useMemo(() => selectedServiceFee.equipmentMaintenance, [selectedServiceFee]);
  let administrativeExpenses: IServiceFeeSubItem[] = selectedServiceFee.administrativeExpenses;
  let transportationExpenses: IServiceFeeSubItem[] = selectedServiceFee.transportationExpenses
  let hiredPersonalExpenses: IServiceFeeSubItem[] = selectedServiceFee.hiredPersonalExpenses

  // const fields: any = [
  //   {
  //     title: "Descripción",
  //     custom: true,
  //     component: (item: any) => `${item.description}`,
  //     width: "40",
  //   },
  //   {
  //     title: "U/M",
  //     custom: true,
  //     component: (item: any) => `${item.unitMeasure}`,
  //     width: "20",
  //   },
  //   {
  //     title: "Cant",
  //     custom: true,
  //     component: (item: any) => `${item.amount}`,
  //     width: "10",
  //   },
  //   {
  //     title: "Precio CUP",
  //     custom: true,
  //     component: (item: any) => `$ ${item.price.toFixed(2)}`,
  //     width: "15",
  //   },
  //   {
  //     title: "Importe CUP",
  //     custom: true,
  //     component: (item: any) => `$ ${item.value.toFixed(2)}`,
  //     width: "15",
  //   },
  // ];
  // const PDFReportData: ICostSheet = selectedCostSheet;

  const handleEdit = (): void => {
    router.push(`/dashboard/serviceFees/editServiceFee`);
  };

  return (
    <>
      <article>
        <div className="flex h-16 w-full bg-white-100 rounded-md shadow-md mb-4 items-center pl-4 gap-4">
          <div className="flex gap-2">
            <Tooltip placement="top" title={"Editar"} arrow={{ pointAtCenter: true }}>
              <button
                className="bg-success-500 cursor-pointer hover:bg-success-600 ease-in-out duration-300 w-[6rem] h-[2.5rem] flex items-center p-1 text-base font-bold text-white-100  justify-center gap-2 rounded-md"
                onClick={handleEdit}
              >
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

      <section className="flex gap-1 flex-col w-full overflow-none rounded-md shadow-md p-2">
        <article className="w-full flex flex-row p-2 ">
          <label className="font-bold mr-2 ">Descripción del servicio:</label>
          <p className="w-[40%]">{selectedServiceFee.taskName}</p>
          <div className="w-[15%] flex flex-col pl-10">
            <label className="font-bold">
              Creador: <span className="font-normal">INICIO</span>
            </label>
            <label className="font-bold">
              Cantidad de trabajadores: <span className="font-normal">{selectedServiceFee.workersAmount}</span>
            </label>
          </div>
          <div className="flex flex-1 flex-col pl-10">
            <label className="font-bold">
              Nomenclador: <span className="font-normal">{selectedServiceFee.nomenclatorId}</span>
            </label>
            <label className="font-bold">
              Categoría: <span className="font-normal">{selectedServiceFee.category}</span>
            </label>
          </div>
          <div className="flex flex-1 flex-col pl-10">
            <label className="font-bold">
              Precio/UM: <span className="font-normal">{selectedServiceFee.valuePerUnitMeasure}</span>
            </label>
            <label className="font-bold">
              Cliente: <span className="font-normal">Cliente</span>
            </label>
          </div>
        </article>
        <article className=" flex flex-1 flex-col">
          <ServiceFeeViewSection name="Materias Primas" data={rawMaterials} subtotal={selectedServiceFee?.rawMaterialsSubtotal} />
          <ServiceFeeViewSection name="Actividades a Ejecutar" data={taskList} subtotal={selectedServiceFee?.taskListSubtotal} />
          <ServiceFeeViewSection name="Depreciación de Equipos" data={equipmentDepreciation} subtotal={selectedServiceFee?.equipmentDepreciationSubtotal} />
          <ServiceFeeViewSection name="Mantenimiento de Equipos" data={equipmentMaintenance} subtotal={selectedServiceFee?.equipmentMaintenanceSubtotal} />
          <ServiceFeeViewSection name="Gastos Administrativos" data={administrativeExpenses} subtotal={selectedServiceFee?.administrativeExpensesSubtotal} />
          <ServiceFeeViewSection name="Gastos de Transporte" data={transportationExpenses} subtotal={selectedServiceFee?.transportationExpensesSubtotal} />
          <ServiceFeeViewSection name="Gastos de Personal Contratado" data={hiredPersonalExpenses} subtotal={selectedServiceFee?.hiredPersonalExpensesSubtotal} />
        </article>
        <article className="flex ml-[210px]  pl-4 items-center h-[39px] flex-grow bg-background_light border-solid border-[1px] border-border_light rounded-lg">
            <div className="flex w-[90%] justify-end pr-4 font-bold">
              <h2>IMPORTE TOTAL DE GASTOS: </h2>
            </div>
            <div className="flex w-[9.5%] pl-2">$ {selectedServiceFee?.expensesTotalValue?.toFixed(2)}</div>
        </article>
        <article className="flex ml-[210px]  pl-4 items-center h-[39px] flex-grow bg-background_light border-solid border-[1px] border-border_light rounded-lg">
            <div className="flex w-[90%] justify-end pr-4 font-bold">
              <h2>TALENTO ARTISTICO (UTILIDAD): </h2>
            </div>
            <div className="flex w-[9.5%] pl-2">$ {selectedServiceFee?.artisticTalentValue?.toFixed(2)}</div>
        </article>
        <article className="flex ml-[210px]  pl-4 items-center h-[39px] flex-grow bg-background_light border-solid border-[1px] border-border_light rounded-lg">
            <div className="flex w-[90%] justify-end pr-4 font-bold">
              <h2>PRECIO ARTISTICO: </h2>
            </div>
            <div className="flex w-[9.5%] pl-2">$ ####</div>
        </article>
        <article className="flex ml-[210px]  pl-4 items-center h-[39px] flex-grow bg-background_light border-solid border-[1px] border-border_light rounded-lg">
            <div className="flex w-[90%] justify-end pr-4 font-bold">
              <h2>ONAT (0%): </h2>
            </div>
            <div className="flex w-[9.5%] pl-2">$ ####</div>
        </article>
        <article className="flex ml-[210px]  pl-4 items-center h-[39px] flex-grow bg-background_light border-solid border-[1px] border-border_light rounded-lg">
            <div className="flex w-[90%] justify-end pr-4 font-bold">
              <h2>MARGEN COMERCIAL APLICADO (0%): </h2>
            </div>
            <div className="flex w-[9.5%] pl-2">$ ####</div>
        </article>
        <article className="flex ml-[210px]  pl-4 items-center h-[39px] flex-grow bg-background_light border-solid border-[1px] border-border_light rounded-lg">
            <div className="flex w-[90%] justify-end pr-4 font-bold">
              <h2>PRECIO DE VENTA (MN): </h2>
            </div>
            <div className="flex w-[9.5%] pl-2">$ ####</div>
        </article>
        <article className="flex ml-[210px]  pl-4 items-center h-[39px] flex-grow bg-background_light border-solid border-[1px] border-border_light rounded-lg">
            <div className="flex w-[90%] justify-end pr-4 font-bold">
              <h2>PRECIO DE VENTA (USD): </h2>
            </div>
            <div className="flex w-[9.5%] pl-2">$ ####</div>
        </article>
        <article className="flex ml-[210px]  pl-4 items-center h-[39px] flex-grow bg-background_light border-solid border-[1px] border-border_light rounded-lg">
            <div className="flex w-[90%] justify-end pr-4 font-bold">
              <h2>MATERIAS PRIMAS Y MATERIALES APORTADOS POR EL CLIENTE: </h2>
            </div>
            <div className="flex w-[9.5%] pl-2">$ {selectedServiceFee?.rawMaterialsByClient.toFixed(2)}</div>
        </article>
        <article className="flex ml-[210px]  pl-4 items-center h-[39px] flex-grow bg-background_light border-solid border-[1px] border-border_light rounded-lg">
            <div className="flex w-[90%] justify-end pr-4 font-bold">
              <h2>PRECIO DE VENTA MAYORISTA MAXIMO: </h2>
            </div>
            <div className="flex w-[9.5%] pl-2">$ ####</div>
        </article>
      </section>
    </>
  );
};

"use client";

import { RootState, useAppSelector } from "@/store/store";
import { Tag } from "antd";
import { useAppDispatch } from "@/hooks/hooks";
import { usePathname } from "next/navigation";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import React, { useEffect } from "react";

import { EditSvg } from "@/app/global/EditSvg";
import CostSheetPDFReport from "@/helpers/CostSheetPDFReport";
import { changeProjectStatus, loadSelectedProject } from "@/actions/project";
import { IProject } from "@/models/project";
import { ProjectViewTable } from "./ProjectViewTable";
import { ReportMoneySvg } from "@/app/global/ReportMoneySvg";

// const PDFDownloadLink = dynamic(() => import("@react-pdf/renderer").then((mod) => mod.PDFDownloadLink), {
//   ssr: false,
//   loading: () => <p>Loading...</p>,
// });

export const ProjectView = () => {
  const url = usePathname().split("/");
  const selectedProjectId: string = url[3];
  const dispatch = useAppDispatch();
  const router = useRouter();

  useEffect(() => {
    dispatch(loadSelectedProject(selectedProjectId));
  }, [dispatch, selectedProjectId]);

  const { selectedProject }: { selectedProject: IProject } = useAppSelector((state: RootState) => state?.project);

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
    router.push(`/dashboard/project/editProject`);
  };
  const handleRequestOffer = (): void => {
    dispatch(changeProjectStatus(selectedProject, "Pendiente de Oferta"))
    router.push(`/dashboard/project`);
  };

  return (
    <>
      <article>
        <div className="flex h-16 w-full bg-white-100 rounded-md shadow-md mb-4 items-center pl-4 gap-4">
          <div className="flex gap-2">
            <button className="toolbar-primary-icon-btn" onClick={handleEdit}>
              <EditSvg />
              Editar
            </button>
            <button className="toolbar-secondary-icon-btn" onClick={handleRequestOffer}>
              <ReportMoneySvg />
              Solicitar Oferta
            </button>
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
        <h1 className="pl-2 text-xl font-bold">SOLICITUD DE SERVICIO</h1>
        <article className="w-full flex justify-between p-2 ">
          <article className="grid">
            <div className="flex gap-1">
              <span className="font-bold mr-2 ">No. de Cliente:</span>
              <p>{selectedProject.clientNumber}</p>
            </div>
            <div className="flex gap-1">
              <span className="font-bold mr-2 ">Nombre del Cliente:</span>
              <p>{selectedProject.clientName}</p>
            </div>
            <div className="flex gap-1">
              <span className="font-bold mr-2 ">Proyecto:</span>
              <p>{selectedProject.projectName}</p>
            </div>
            <div className="flex gap-1">
              <span className="font-bold mr-2 ">Cobrado por:</span>
              <p>{selectedProject.payMethod}</p>
            </div>
          </article>
          <article className="grid">
            <div className="flex gap-1">
              <span className="font-bold mr-2 ">Fecha:</span>
              <p>{selectedProject.initDate?.toLocaleString()}</p>
            </div>
            <div className="flex gap-1">
              <span className="font-bold mr-2 ">No. de Solicitud:</span>
              <p>{selectedProject.projectNumber}</p>
            </div>

            <div className="flex gap-1">
              <span className="font-bold mr-2 ">Moneda:</span>
              <p>{selectedProject.currency}</p>
            </div>
          </article>
        </article>

        {/* TABLA DE ITEMS */}
        <article className="flex max-w-[50%] pl-2">
          <ProjectViewTable data={selectedProject.itemsList} />
        </article>

        <article className="w-full flex justify-between p-2">
          <article>
            {/* <div className="flex gap-1">
              <span className="font-bold mr-2 ">Solicitado por:</span>
              <p></p>
            </div>
            <div className="flex gap-1">
              <span className="font-bold mr-2 ">Recibido por:</span>
              <p></p>
            </div> */}
            <div className="flex gap-1">
              <span className="font-bold mr-2 ">Gastos:</span>
              <p>${selectedProject.expenses === undefined ? 0 : selectedProject.expenses}</p>
            </div>
            <div className="flex gap-1">
              <span className="font-bold mr-2 ">Ganancias:</span>
              <p>${selectedProject.profits === undefined ? 0 : selectedProject.profits}</p>
            </div>
            <div className="flex gap-1">
              <span className="font-bold mr-2 ">Estado:</span>
              {selectedProject.status === "Terminado" ? (
                <Tag className="font-bold" color="#34b042">
                  {selectedProject.status.toUpperCase()}
                </Tag>
              ) : selectedProject.status === "Cobrado" ? (
                <Tag className="font-bold" color="#34395e">
                  {selectedProject.status.toUpperCase()}
                </Tag>
              ) : selectedProject.status === "Cerrado" ? (
                <Tag className="font-bold" color="#ff6600">
                  {selectedProject.status.toUpperCase()}
                </Tag>
              ) : selectedProject.status === "Solicitud" ? (
                <Tag className="font-bold" color="#1677ff">
                  {selectedProject.status.toUpperCase()}
                </Tag>
              ) : selectedProject.status === "Pendiente de Oferta" ? (
                <Tag className="font-bold" color="#ffa426">
                  {selectedProject.status.toUpperCase()}
                </Tag>
              ) : (
                <></>
              )}
            </div>
          </article>
          <article>
            <div className="flex gap-1">
              <span className="font-bold mr-2 ">Teléfono: ________________________</span>
              <p></p>
            </div>
          </article>
        </article>
      </section>
    </>
  );
};

"use client";

import { RootState, useAppSelector } from "@/store/store";
import { Tag } from "antd";
import { useAppDispatch } from "@/hooks/hooks";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import React, { useEffect } from "react";

import { clearOffer, startLoadSelectedProject } from "@/actions/project";
import { EditSvg } from "@/app/global/EditSvg";
import { IItem, IProject } from "@/models/project";
import { PDFSvg } from "@/app/global/PDFSvg";
import { ReportMoneySvg } from "@/app/global/ReportMoneySvg";
import ProjectPDFReport from "@/helpers/ProjectPDFReport";
import Table, { ColumnsType } from "antd/es/table";

const PDFDownloadLink = dynamic(
  () => import("@react-pdf/renderer").then((mod) => mod.PDFDownloadLink),
  {
    ssr: false,
    loading: () => <p>Loading...</p>
  }
);

export const ProjectView = (props: { projectId: string }) => {
  const { projectId } = props;
  const dispatch = useAppDispatch();
  const router = useRouter();

  useEffect(() => {
    dispatch(startLoadSelectedProject(projectId));
  }, [dispatch, projectId]);

  const { selectedProject }: { selectedProject: IProject } = useAppSelector(
    (state: RootState) => state?.project
  );

  const itemsList = selectedProject.itemsList

  const handleEdit = (): void => {
    router.push(`/dashboard/project/editProject`);
  };

  // ? SETEA UNA PLANTILLA PARA LA OFERTA DONDE LOS ITEM SE AUTOGENERAN CON LOS ITEMS DEL PROYECTO //
  const handleCreateOffer = (): void => {
    dispatch(clearOffer(itemsList));
    router.push(`/dashboard/project/${projectId}/offer/createOffer`);
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
            {selectedProject.status === "Pendiente de Oferta" && (
              <button className="toolbar-secondary-icon-btn" onClick={handleCreateOffer}>
                <ReportMoneySvg />
                Crear Oferta
              </button>
            )}
            <PDFDownloadLink
              className=" flex w-[2.5rem] h-[2.5rem]"
              document={<ProjectPDFReport data={selectedProject} itemsList={itemsList} />}
              fileName={`${selectedProject?.projectName}`}
            >
              {({ blob, url, loading, error }) =>
                loading ? (
                  <button
                    disabled
                    className={`opacity-20 pt-2 pl-2" flex justify-center items-center w-[2.5rem] h-[2.5rem] text-xl rounded-full`}
                  >
                    <PDFSvg />
                  </button>
                ) : (
                  <button className={"toolbar-auxiliary-icon"}>
                    <PDFSvg />
                  </button>
                )
              }
            </PDFDownloadLink>
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
          <ProjectViewTable data={selectedProject?.itemsList} />
        </article>

        <article className="w-full flex justify-between p-2">
          <article className="grid gap-1">
            <div className="flex gap-1">
              <span className="font-bold mr-2 ">Precio:</span>
              <p>
                $
                {selectedProject.expenses === undefined
                  ? 0
                  : selectedProject?.totalValue?.toLocaleString("DE")}
              </p>
            </div>
            <div className="flex gap-1">
              <span className="font-bold mr-2 ">Gastos:</span>
              <p>${selectedProject.expenses === undefined ? 0 : selectedProject?.expenses}</p>
            </div>
            <div className="flex gap-1">
              <span className="font-bold mr-2 ">Ganancias:</span>
              <p>${selectedProject.profits === undefined ? 0 : selectedProject?.profits}</p>
            </div>
            <div className="flex gap-1">
              <span className="font-bold mr-2 ">Estado:</span>
              {selectedProject.status === "Cerrado" ? (
                <Tag className="font-bold" color="#34b042">
                  {selectedProject.status.toUpperCase()}
                </Tag>
              ) : selectedProject.status === "Cobrado" ? (
                <Tag className="font-bold" color="#a2c9ff">
                  {selectedProject.status.toUpperCase()}
                </Tag>
              ) : selectedProject.status === "Terminado" ? (
                <Tag className="font-bold" color="#34395e">
                  {selectedProject.status.toUpperCase()}
                </Tag>
              ) : selectedProject.status === "Contratado" ? (
                <Tag className="font-bold" color="#c6c013">
                  {selectedProject.status.toUpperCase()}
                </Tag>
              ) : selectedProject.status === "Calculado" ? (
                <Tag className="font-bold" color="#ff6600">
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
        </article>
      </section>
    </>
  );
};

const ProjectViewTable = (props: any) => {
  const { data } = props;

  const columns: ColumnsType<IItem> = [
    {
      title: <span className="font-bold">No.</span>,
      width: "1%",
      align: "center",
      render: (text, record, index) => index + 1
    },
    {
      title: <span className="font-bold">Descripción del servicio</span>,
      dataIndex: "description",
      key: "description",
      width: "55%"
    }
  ];

  return (
    <Table
      size="small"
      columns={columns}
      dataSource={data}
      className="border-solid w-full"
      pagination={false}
      bordered
    />
  );
};

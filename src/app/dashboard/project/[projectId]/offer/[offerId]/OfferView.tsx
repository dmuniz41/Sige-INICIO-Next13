"use client";
import { LoadingOutlined } from "@ant-design/icons";
import { Spin, Tooltip } from "antd";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import React, { useEffect, useState } from "react";

import { CheckSvg } from "@/app/global/CheckSvg";
import { CircleCheckSvg } from "@/app/global/CircleCheckSvg";
import { clientNomenclatorsStartLoading } from "@/actions/nomenclators/client";
import { EditSvg } from "@/app/global/EditSvg";
import { IClientNomenclator } from "@/models/nomenclators/client";
import { IOffer } from "@/models/offer";
import { IProject } from "@/models/project";
import { Item } from "./Item";
import { ListSvg } from "@/app/global/ListSvg";
import { loadSelectedOffer } from "@/actions/offer";
import { MaterialsListModal } from "./MaterialsTable";
import { PDFSvg } from "@/app/global/PDFSvg";
import { RootState, useAppSelector } from "@/store/store";
import { setFinalOfferId } from "@/actions/project";
import { useAppDispatch } from "@/hooks/hooks";
import { IRepresentativeNomenclator } from "@/models/nomenclators/representative";
import OfferPDFReport from "@/helpers/OfferPDFReport";

const PDFDownloadLink = dynamic(
  () => import("@react-pdf/renderer").then((mod) => mod.PDFDownloadLink),
  {
    ssr: false,
    loading: () => <Spin indicator={<LoadingOutlined style={{ fontSize: 24 }} spin />} />
  }
);

export const OfferView = (props: { offerId: string; projectId: string }) => {
  const [materialsTableModal, setMaterialsTableModal] = useState(false);
  const { offerId, projectId } = props;
  const dispatch = useAppDispatch();
  const router = useRouter();

  const handleEdit = (): void => {
    router.push(`/dashboard/project/${projectId}/offer/${offerId}/editOffer`);
  };

  useEffect(() => {
    dispatch(loadSelectedOffer(offerId));
    dispatch(clientNomenclatorsStartLoading());
  }, [dispatch, offerId]);

  const { selectedOffer }: { selectedOffer: IOffer } = useAppSelector(
    (state: RootState) => state?.offer
  );

  const { selectedProject }: { selectedProject: IProject } = useAppSelector(
    (state: RootState) => state?.project
  );

  const { clientNomenclators }: { clientNomenclators: IClientNomenclator[] } = useAppSelector(
    (state: RootState) => state?.nomenclator
  );

  const {
    representativeNomenclators
  }: { representativeNomenclators: IRepresentativeNomenclator[] } = useAppSelector(
    (state: RootState) => state?.nomenclator
  );

  const clientInfo = clientNomenclators.find(
    (clientNomenclator) => clientNomenclator.name === selectedProject?.clientName
  );

  const representativeInfo = representativeNomenclators.find(
    (representativeNomenclator) =>
      representativeNomenclator.name === selectedOffer?.representativeName
  );

  const setOfferAsFinal = () => {
    dispatch(setFinalOfferId(selectedProject, selectedOffer));
    router.push(`/dashboard/project/${projectId}/offer`);
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
          </div>
          <div className="flex gap-1">
            <Tooltip
              placement="top"
              title={"Listado de Materiales"}
              arrow={{ pointAtCenter: true }}
            >
              <button
                className="toolbar-auxiliary-icon"
                onClick={() => setMaterialsTableModal(true)}
              >
                <ListSvg />
              </button>
            </Tooltip>
            <PDFDownloadLink
              className=" flex w-[2.5rem] h-[2.5rem]"
              document={
                <OfferPDFReport
                  clientInfo={clientInfo}
                  representativeInfo={representativeInfo}
                  data={selectedOffer?.itemsList}
                  title={selectedOffer?.projectName}
                  totalValue={selectedOffer?.value}
                />
              }
              fileName={`Oferta ${selectedOffer?.projectName}  `}
            >
              {({ blob, url, loading, error }) => (
                <button className={"toolbar-auxiliary-icon"}>
                  <PDFSvg />
                </button>
              )}
            </PDFDownloadLink>
            {!selectedOffer?.isFinalOffer ? (
              <Tooltip placement="top" title={"Marcar como final"} arrow={{ pointAtCenter: true }}>
                <button className="toolbar-auxiliary-icon" onClick={setOfferAsFinal}>
                  <CheckSvg />
                </button>
              </Tooltip>
            ) : (
              <></>
            )}
          </div>
        </div>
      </article>
      <section className="flex gap-1 flex-col w-full overflow-none rounded-md shadow-md p-4">
        <h1 className="flex gap-4 text-xl font-bold mb-2">
          {`${selectedOffer?.projectName} (${selectedOffer?.version})`}
          {selectedOffer?.isFinalOffer ? (
            <div className="text-success-500 flex items-center">
              <CircleCheckSvg />
            </div>
          ) : (
            <></>
          )}
        </h1>
        <div className="flex gap-1 mb-2">
          <h2 className="font-semibold">Representación: </h2>
          <span>{selectedOffer?.representativeName}</span>
        </div>
        {selectedOffer?.itemsList?.map((item, index) => (
          <div key={index}>
            <Item number={index + 1} item={item} />
          </div>
        ))}
        <article className="flex items-center justify-end h-[39px] flex-grow bg-white-100 border-solid border border-border_light rounded-lg">
          <div className="flex font-bold">
            <h2>VALOR TOTAL : </h2>
          </div>
          <div className="flex px-4 font-bold">
            ${" "}
            {selectedOffer?.value?.toLocaleString("DE", {
              maximumFractionDigits: 2,
              minimumFractionDigits: 2
            })}
          </div>
        </article>
      </section>
      <MaterialsListModal
        open={materialsTableModal}
        onCancel={() => setMaterialsTableModal(false)}
        values={{ values: selectedOffer?.materialsList!, name: selectedOffer?.projectName }}
      />
    </>
  );
};

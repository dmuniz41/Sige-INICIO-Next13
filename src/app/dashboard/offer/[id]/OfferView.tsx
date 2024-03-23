"use client";
import React, { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";

import { EditSvg } from "@/app/global/EditSvg";
import { useAppDispatch } from "@/hooks/hooks";
import { loadSelectedOffer } from "@/actions/offer";
import { IOffer } from "@/models/offer";
import { RootState, useAppSelector } from "@/store/store";
import { Item } from "./Item";
import { MaterialsListModal } from "./MaterialsTable";
import { Tooltip } from "antd";
import { ListSvg } from "@/app/global/ListSvg";

export const OfferView = () => {
  const url = usePathname().split("/");
  const dispatch = useAppDispatch();
  const projectId: string = url[3];
  const router = useRouter();
  const [materialsTableModal, setMaterialsTableModal] = useState(false);

  const handleEdit = (): void => {
    router.push(`/dashboard/offer/editOffer`);
  };

  useEffect(() => {
    dispatch(loadSelectedOffer(projectId));
  }, [dispatch, projectId]);

  const { selectedOffer }: { selectedOffer: IOffer } = useAppSelector(
    (state: RootState) => state?.offer
  );

  return (
    <>
      <article>
        <div className="flex h-16 w-full bg-white-100 rounded-md shadow-md mb-4 items-center pl-4 gap-4">
          <div className="flex gap-2">
            <button className="toolbar-primary-icon-btn" onClick={handleEdit}>
              <EditSvg />
              Editar
            </button>
            {/* <PDFDownloadLink document={<CostSheetPDFReport fields={fields} data={PDFReportData} title={`Ficha de costo`} />} fileName={`Ficha de costo ${selectedCostSheet.taskName}`}>
              {({ blob, url, loading, error }) => (
                <button disabled={loading} className="cursor-pointer hover:bg-white-600 ease-in-out duration-300 rounded-full w-[2.5rem] h-[2.5rem] flex justify-center items-center">
                  <PDFSvg />
                </button>
              )}
            </PDFDownloadLink> */}
          </div>
          <Tooltip
            placement="top"
            title={"Historial de Operaciones"}
            arrow={{ pointAtCenter: true }}
          >
            <button
              className="toolbar-secondary-icon-btn"
              onClick={() => setMaterialsTableModal(true)}
            >
              <ListSvg />
              Materiales
            </button>
          </Tooltip>
        </div>
      </article>
      <section className="flex gap-1 flex-col w-full overflow-none rounded-md shadow-md p-4">
        <h1 className="pl-2 text-xl font-bold mb-2">{selectedOffer?.projectName}</h1>
        {selectedOffer?.itemsList?.map((item, index) => (
          <div key={item.description}>
            <Item number={index + 1} item={item} />
          </div>
        ))}
        <article className="flex items-center justify-end h-[39px] flex-grow bg-white-100 border-solid border border-border_light rounded-lg">
          <div className="flex w-[90%] justify-end pr-4 font-bold">
            <h2>VALOR TOTAL: </h2>
          </div>
          <div className="flex w-[100px] py-4">$ {selectedOffer?.value?.toLocaleString("DE")}</div>
        </article>
      </section>
      <MaterialsListModal
        open={materialsTableModal}
        onCancel={() => setMaterialsTableModal(false)}
        values={selectedOffer?.materialsList}
      />
    </>
  );
};

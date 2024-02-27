"use client";
import React, { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";

import { EditSvg } from "@/app/global/EditSvg";
import { useAppDispatch } from "@/hooks/hooks";
import { loadSelectedOffer } from "@/actions/offer";
import { IOffer } from "@/models/offer";
import { RootState, useAppSelector } from "@/store/store";

export const OfferView = () => {
  const url = usePathname().split("/");
  const dispatch = useAppDispatch();
  const projectId: string = url[3];
  const router = useRouter();

  const handleEdit = (): void => {
    router.push(`/dashboard/offer/editOffer`);
  };

  useEffect(() => {
    dispatch(loadSelectedOffer(projectId));
  }, [dispatch, projectId]);


  const { selectedOffer }: { selectedOffer: IOffer } = useAppSelector((state: RootState) => state?.offer);

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
        </div>
      </article>

      <section className="flex gap-1 flex-col w-full overflow-none rounded-md shadow-md p-2">
        <h1 className="pl-2 text-xl font-bold">{selectedOffer.projectName}</h1>
      </section>
    </>
  );
};

"use client";

import React from "react";
import { useRouter } from "next/navigation";

import { EditSvg } from "@/app/global/EditSvg";
import { useAppDispatch } from "@/hooks/hooks";
import { deleteItem, startAddOffer } from "@/actions/offer";
import { IOffer, IOfferItem } from "@/models/offer";
import { RootState, useAppSelector } from "@/store/store";
import { Item } from "../[id]/Item";
import { Tooltip } from "antd";
import { PlusSvg } from "@/app/global/PlusSvg";
import { IProject } from "@/models/project";
import { DeleteSvg } from "@/app/global/DeleteSvg";

export const EditOfferForm = () => {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const currentDate = new Date();

  const { selectedOffer, offers }: { selectedOffer: IOffer; offers: IOffer[] } = useAppSelector(
    (state: RootState) => state?.offer
  );
  const { selectedProject }: { selectedProject: IProject } = useAppSelector(
    (state: RootState) => state?.project
  );

  const handleEdit = (item: IOfferItem) => {
    console.log("🚀 ~ handleEdit ~ item:", item);
  };
  const handleDeleteItem = (item: IOfferItem) => {
    dispatch(deleteItem(item))
  };

  const handleEditOffer = () => {
    dispatch(
      startAddOffer({
        ...selectedOffer,
        projectName: `${selectedProject.projectName} v${offers.length + 1}`,
        value: selectedOffer?.itemsList
          ?.map((item) => item.value)
          .reduce((total, current) => total + current, 0)
      })
    );
    router.push(`/dashboard/offer`);
  };

  return (
    <>
      <section className="flex gap-4 flex-col w-full overflow-none rounded-md shadow-md p-4">
        <div className="grid gap-2">
          <h1 className="pl-2 text-xl font-bold mb-2">{selectedOffer?.projectName}</h1>
          {selectedOffer?.itemsList?.map((item, index) => (
            <div className="flex gap-4 items-center" key={item.description}>
              <Item number={index + 1} item={item} />
              <div className="flex gap-1">
                <Tooltip placement="top" title={"Editar"} arrow={{ pointAtCenter: true }}>
                  <button onClick={() => handleEdit(item)} className="table-see-action-btn">
                    <EditSvg width={20} height={20} />
                  </button>
                </Tooltip>
                <Tooltip placement="top" title={"Eliminar"} arrow={{ pointAtCenter: true }}>
                  <button
                    onClick={() => handleDeleteItem(item)}
                    className="table-delete-action-btn"
                  >
                    <DeleteSvg width={20} height={20} />
                  </button>
                </Tooltip>
              </div>
            </div>
          ))}
        </div>
        <button
          className="toolbar-primary-icon-btn"
          onClick={() => {
            router.push("/dashboard/offer/editOffer/createItem");
          }}
        >
          <PlusSvg width={20} height={20} />
          Añadir Item
        </button>
      </section>
      <button
        type="submit"
        className="mt-4 select-none rounded-lg bg-success-500 py-3 px-6 text-center align-middle text-sm font-bold uppercase text-white-100 shadow-md shadow-success-500/20 transition-all hover:shadow-lg hover:shadow-success-500/40 focus:opacity-[0.85] focus:shadow-none active:opacity-[0.85] active:shadow-none disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none "
        onClick={handleEditOffer}
      >
        Editar
      </button>
    </>
  );
};

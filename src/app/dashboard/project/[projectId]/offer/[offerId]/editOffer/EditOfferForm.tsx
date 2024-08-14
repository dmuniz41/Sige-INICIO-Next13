"use client";
import { Form, SelectProps, Tooltip } from "antd";
import { useRouter } from "next/navigation";
import React, { useEffect, useMemo, useState } from "react";
import Swal from "sweetalert2";

import { deleteItem, editItem, selectedItem, startAddOffer } from "@/actions/offer";
import { DeleteSvg } from "@/app/global/DeleteSvg";
import { EditSvg } from "@/app/global/EditSvg";
import { IOffer, IOfferItem } from "@/models/offer";
import { IRepresentativeNomenclator } from "@/models/nomenclators/representative";
import { Item } from "../Item";
import { PlusSvg } from "@/app/global/PlusSvg";
import { representativeNomenclatorsStartLoading } from "@/actions/nomenclators/representative";
import { RootState, useAppSelector } from "@/store/store";
import { startLoadServiceFeeAuxiliary } from "@/actions/serviceFeeAuxiliary";
import { useAppDispatch } from "@/hooks/hooks";

export const EditOfferForm = (props: { projectId: string; offerId: string }) => {
  const [form] = Form.useForm();
  const { projectId, offerId } = props;
  const dispatch = useAppDispatch();
  const router = useRouter();

  useEffect(() => {
    dispatch(startLoadServiceFeeAuxiliary());
    dispatch(representativeNomenclatorsStartLoading());
  }, [dispatch]);

  const {
    selectedOffer,
    offers,
    itemUpdated,
    isItemUpdated
  }: {
    selectedOffer: IOffer;
    offers: IOffer[];
    selectedItem: IOfferItem;
    itemUpdated: IOfferItem;
    isItemUpdated: boolean;
  } = useAppSelector((state: RootState) => state?.offer);

  const [representativeName] = useState(selectedOffer?.representativeName);

  const totalValue = useMemo(
    () =>
      selectedOffer?.itemsList
        ?.reduce((totalValue, item) => item.value + totalValue, 0)
        .toLocaleString("DE", {
          maximumFractionDigits: 2,
          minimumFractionDigits: 2
        }),
    [selectedOffer]
  );

  if (isItemUpdated) {
    selectedOffer.itemsList.map((item, index, itemList) => {
      if (item.key === itemUpdated.key) {
        itemList[index] = itemUpdated;
        dispatch(editItem({ key: "", description: "", activities: [], value: 0 }, false));
      }
      return itemList[index];
    });
  }

  const handleEdit = (item: IOfferItem) => {
    dispatch(selectedItem(item));
    router.push(`/dashboard/project/${projectId}/offer/${offerId}/editOffer/editItem`);
  };

  const handleDeleteItem = (item: IOfferItem) => {
    Swal.fire({
      title: "Eliminar Item",
      text: "Desea eliminar el item seleccionado",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      cancelButtonText: "Cancelar",
      confirmButtonText: "Eliminar"
    }).then((result) => {
      if (result.isConfirmed) {
        dispatch(deleteItem(item));
      }
    });
  };

  const onFinishFailed = (errorInfo: any) => {
    console.log("Failed:", errorInfo);
  };

  return (
    <>
      <Form
        form={form}
        name="createOfferForm"
        labelCol={{ span: 0 }}
        wrapperCol={{ span: 0 }}
        className="w-full flex flex-col"
        initialValues={{ remember: true }}
        onFinishFailed={onFinishFailed}
        autoComplete="off"
        requiredMark={"optional"}
        size="middle"
        fields={[
          {
            name: "representativeName",
            value: representativeName
          }
        ]}
      >
        <section className="flex gap-4 flex-col w-full overflow-none rounded-md shadow-md p-4">
          <div className="grid gap-2">
            <h1 className="text-xl font-semibold mb-2">{selectedOffer?.projectName}</h1>
            {selectedOffer?.itemsList?.map((item, index) => (
              <article className="flex gap-2 items-center" key={index}>
                <Item number={index + 1} item={item} />
                <div className="grid gap-1">
                  <Tooltip placement="top" title={"Editar"} arrow={{ pointAtCenter: true }}>
                    <button onClick={() => handleEdit(item)} className="table-see-action-btn">
                      <EditSvg width={20} height={20} />
                    </button>
                  </Tooltip>
                  <Tooltip placement="top" title={"Eliminar"} arrow={{ pointAtCenter: true }}>
                    <button onClick={() => handleDeleteItem(item)} className="table-delete-action-btn">
                      <DeleteSvg width={20} height={20} />
                    </button>
                  </Tooltip>
                </div>
              </article>
            ))}
          </div>
          <button
            className="add-item-form-btn"
            onClick={() => {
              router.push(`/dashboard/project/${projectId}/offer/${offerId}/editOffer/createItem`);
            }}
          >
            <PlusSvg width={20} height={20} />
            Añadir Item
          </button>
          <article className="flex items-center justify-end h-[39px] flex-grow bg-white-100 border-solid border border-border_light rounded-lg">
            <div className="flex font-semibold">
              <h2>VALOR TOTAL : </h2>
            </div>
            <div className="flex px-4">$ {totalValue}</div>
          </article>
        </section>
        <Form.Item>
          <button
            type="submit"
            className="mt-4 select-none rounded-lg bg-success-500 py-3 px-6 text-center align-middle text-sm font-semibold uppercase text-white-100 shadow-md shadow-success-500/20 transition-all hover:shadow-lg hover:shadow-success-500/40 focus:opacity-[0.85] focus:shadow-none active:opacity-[0.85] active:shadow-none disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none "
            onClick={() => {
              form
                .validateFields()
                .then(() => {
                  dispatch(
                    startAddOffer({
                      ...selectedOffer,
                      version: `v${offers.length + 1}`,
                      value: selectedOffer?.itemsList?.map((item) => item.value).reduce((total, current) => total + current, 0)
                    })
                  );
                  router.push(`/dashboard/project/${projectId}/offer`);
                })
                .catch((error) => {
                  console.log("Validate Failed:", error);
                });
            }}
          >
            Editar
          </button>
        </Form.Item>
      </Form>
    </>
  );
};

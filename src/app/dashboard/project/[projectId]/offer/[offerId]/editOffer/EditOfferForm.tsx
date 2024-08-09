"use client";
import { useRouter } from "next/navigation";
import React, { useEffect, useMemo, useState } from "react";
import Swal from "sweetalert2";

import { deleteItem, editItem, selectedItem, startAddOffer } from "@/actions/offer";
import { DeleteSvg } from "@/app/global/DeleteSvg";
import { EditSvg } from "@/app/global/EditSvg";
import { Form, Select, SelectProps, Tooltip } from "antd";
import { IOffer, IOfferItem } from "@/models/offer";
import { IProject } from "@/models/project";
import { IRepresentativeNomenclator } from "@/models/nomenclators/representative";
import { PlusSvg } from "@/app/global/PlusSvg";
import { representativeNomenclatorsStartLoading } from "@/actions/nomenclators/representative";
import { RootState, useAppSelector } from "@/store/store";
import { startLoadServiceFeeAuxiliary } from "@/actions/serviceFeeAuxiliary";
import { useAppDispatch } from "@/hooks/hooks";
import { Item } from "../Item";

export const EditOfferForm = (props: { projectId: string; offerId: string }) => {
  const [form] = Form.useForm();
  const [representativePercentage, setRepresentativePercentage] = useState(0);
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

  const { selectedProject }: { selectedProject: IProject } = useAppSelector((state: RootState) => state?.project);

  const [representativeName, setRepresentativeName] = useState(selectedOffer?.representativeName);

  const { representativeNomenclators }: { representativeNomenclators: IRepresentativeNomenclator[] } = useAppSelector(
    (state: RootState) => state?.nomenclator
  );

  const representativeOptions: SelectProps["options"] = representativeNomenclators?.map((representative) => {
    return {
      label: `${representative.name}`,
      value: `${representative.name}`
    };
  });

  const totalValue = useMemo(
    () =>
      (
        selectedOffer?.itemsList?.reduce((totalValue, item) => item.value + totalValue, 0) *
        (representativePercentage / 100 + 1)
      ).toLocaleString("DE", {
        maximumFractionDigits: 2,
        minimumFractionDigits: 2
      }),
    [selectedOffer, representativePercentage]
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
            <Form.Item
              className="mb-3 w-[30%]"
              label={<span className="font-semibold text-md">Representación</span>}
              name="representativeName"
              rules={[{ required: true, message: "Campo requerido" }]}
            >
              <Select
                allowClear
                options={representativeOptions}
                onSelect={(value) => {
                  setRepresentativePercentage(
                    representativeNomenclators.find((representative) => representative.name === value)?.percentage ?? 1
                  );
                  setRepresentativeName(form.getFieldValue("representativeName"));
                }}
                showSearch
                optionFilterProp="children"
                filterOption={(input: any, option: any) => (option?.label ?? "").toLowerCase().includes(input)}
                filterSort={(optionA: any, optionB: any) =>
                  (optionA?.label ?? "").toLowerCase().localeCompare((optionB?.label ?? "").toLowerCase())
                }
              />
            </Form.Item>
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
                .then((values) => {
                  dispatch(
                    startAddOffer({
                      ...selectedOffer,
                      representativeName: values?.representativeName,
                      representationPercentage: representativeNomenclators?.find(
                        (representative) => representative?.name === values?.representativeName
                      )?.percentage,
                      projectName: `${selectedProject?.projectName}`,
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

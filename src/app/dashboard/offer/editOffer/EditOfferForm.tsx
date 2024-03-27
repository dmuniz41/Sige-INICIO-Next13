"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";

import { EditSvg } from "@/app/global/EditSvg";
import { useAppDispatch } from "@/hooks/hooks";
import { deleteItem, editItem, selectedItem, startAddOffer } from "@/actions/offer";
import { IOffer, IOfferItem } from "@/models/offer";
import { RootState, useAppSelector } from "@/store/store";
import { Item } from "../[id]/Item";
import { Form, Select, SelectProps, Tooltip } from "antd";
import { PlusSvg } from "@/app/global/PlusSvg";
import { IProject } from "@/models/project";
import { DeleteSvg } from "@/app/global/DeleteSvg";
import { IRepresentationCoefficients, IServiceFeeAuxiliary } from "@/models/serviceFeeAuxiliary";
import { startLoadServiceFeeAuxiliary } from "@/actions/serviceFeeAuxiliary";

export const EditOfferForm = () => {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const [form] = Form.useForm();
  const representatives: IRepresentationCoefficients[] | undefined = [];

  useEffect(() => {
    dispatch(startLoadServiceFeeAuxiliary());
  }, [dispatch]);

  const {
    selectedOffer,
    offers,
    itemUpdated,
    isItemUpdated
  }: { selectedOffer: IOffer; offers: IOffer[]; itemUpdated: IOfferItem; isItemUpdated: boolean } =
    useAppSelector((state: RootState) => state?.offer);

  const { selectedProject }: { selectedProject: IProject } = useAppSelector(
    (state: RootState) => state?.project
  );

  const { serviceFeeAuxiliary }: { serviceFeeAuxiliary: IServiceFeeAuxiliary } = useAppSelector(
    (state: RootState) => state?.serviceFee
  );

  serviceFeeAuxiliary?.payMethod?.map((payMethod) => representatives.push(payMethod));

  const representativeOptions: SelectProps["options"] = representatives.map((payMethod) => {
    return {
      label: `${payMethod.representative}`,
      value: `${payMethod.representative}`
    };
  });

  if (isItemUpdated) {
    selectedOffer.itemsList.forEach((item, index, itemList) => {
      if (item.description === itemUpdated.description) {
        itemList[index] = itemUpdated;
        dispatch(editItem({ _id: "", description: "", activities: [], value: 0 }, false));
      }
      return itemList[index];
    });
  }

  const handleEdit = (item: IOfferItem) => {
    dispatch(selectedItem(item));
    router.push("/dashboard/offer/editOffer/editItem");
  };

  const handleDeleteItem = (item: IOfferItem) => {
    dispatch(deleteItem(item));
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
            name: "representationCoef",
            value: selectedOffer?.representationCoef?.representative
          }
        ]}
      >
        <section className="flex gap-4 flex-col w-full overflow-none rounded-md shadow-md p-4">
          <div className="grid gap-2">
            <h1 className="text-xl font-bold mb-2">{selectedOffer?.projectName}</h1>
            <Form.Item
              className="mb-3 w-[30%]"
              label={<span className="font-bold text-md">Representación</span>}
              name="representationCoef"
              rules={[{ required: true, message: "Campo requerido" }]}
            >
              <Select
                allowClear
                options={representativeOptions}
                showSearch
                optionFilterProp="children"
                filterOption={(input: any, option: any) =>
                  (option?.label ?? "").toLowerCase().includes(input)
                }
                filterSort={(optionA: any, optionB: any) =>
                  (optionA?.label ?? "")
                    .toLowerCase()
                    .localeCompare((optionB?.label ?? "").toLowerCase())
                }
              />
            </Form.Item>
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
            className="add-item-form-btn"
            onClick={() => {
              router.push("/dashboard/offer/editOffer/createItem");
            }}
          >
            <PlusSvg width={20} height={20} />
            Añadir Item
          </button>
        </section>
        <Form.Item>
          <button
            type="submit"
            className="mt-4 select-none rounded-lg bg-success-500 py-3 px-6 text-center align-middle text-sm font-bold uppercase text-white-100 shadow-md shadow-success-500/20 transition-all hover:shadow-lg hover:shadow-success-500/40 focus:opacity-[0.85] focus:shadow-none active:opacity-[0.85] active:shadow-none disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none "
            onClick={() => {
              form
                .validateFields()
                .then((values) => {
                  dispatch(
                    startAddOffer({
                      ...selectedOffer,
                      representationCoef: serviceFeeAuxiliary?.payMethod?.find(
                        (value) => value.representative === values.representationCoef
                      ),
                      projectName: `${selectedProject.projectName} v${offers.length + 1}`,
                      value: selectedOffer?.itemsList
                        ?.map((item) => item.value)
                        .reduce((total, current) => total + current, 0)
                    })
                  );
                  router.push(`/dashboard/offer`);
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

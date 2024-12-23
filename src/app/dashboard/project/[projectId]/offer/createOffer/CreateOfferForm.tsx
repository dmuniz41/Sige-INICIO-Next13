"use client";
import { Form, Tooltip } from "antd";
import { useRouter } from "next/navigation";
import React, { useEffect, useMemo } from "react";
import Swal from "sweetalert2";

import { changeProjectStatus } from "@/actions/project";
import { IOffer, IOfferItem } from "@/models/offer";
import { IProject } from "@/models/project";
import { Item } from "../[offerId]/Item";
import { NoDataSvg } from "@/app/global/NoDataSvg";
import { PlusSvg } from "@/app/global/PlusSvg";
import { representativeNomenclatorsStartLoading } from "@/actions/nomenclators/representative";
import { RootState, useAppSelector } from "@/store/store";
import { deleteItem, editItem, loadSelectedOffer, selectedItem, startAddOffer, startUpdateOffer } from "@/actions/offer";
import { startLoadServiceFeeAuxiliary } from "@/actions/serviceFeeAuxiliary";
import { useAppDispatch } from "@/hooks/hooks";
import { EditSvg } from "@/app/global/EditSvg";
import { DeleteSvg } from "@/app/global/DeleteSvg";

export const CreateOfferForm = (props: { projectId: string }) => {
  const [form] = Form.useForm();
  const { projectId } = props;
  const dispatch = useAppDispatch();
  const router = useRouter();

  useEffect(() => {
    dispatch(startLoadServiceFeeAuxiliary());
    dispatch(representativeNomenclatorsStartLoading());
  }, [dispatch]);

  const { selectedProject }: { selectedProject: IProject } = useAppSelector((state: RootState) => state?.project);

  const {
    selectedOffer,
    itemUpdated,
    isItemUpdated
  }: { selectedOffer: IOffer; offers: IOffer[]; itemUpdated: IOfferItem; isItemUpdated: boolean } = useAppSelector(
    (state: RootState) => state?.offer
  );

  const totalValue = useMemo(() => {
    return selectedOffer?.itemsList?.reduce((totalValue, item) => item.value + totalValue, 0);
  }, [selectedOffer]);

  const onFinishFailed = (errorInfo: any) => {
    console.log("Failed:", errorInfo);
  };

  if (isItemUpdated) {
    selectedOffer.itemsList.map((item, index, itemList) => {
      if (item.key === itemUpdated.key) {
        itemList[index] = itemUpdated;
        console.log(JSON.stringify({offerId: selectedOffer._id}))
        dispatch(editItem({offerId: selectedOffer._id, key: "", description: "", activities: [], value: 0}, false));
      }
      return itemList[index];
    });
  }

  const handleEdit = (item: IOfferItem) => {
    dispatch(selectedItem(item));
    router.push(`/dashboard/project/${projectId}/offer/createOffer/editItem`);
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

  return (
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
    >
      <div className="font-semibold mb-2">
        <h1>
          Nombre: <span className="font-normal">{selectedProject.projectName}</span>
        </h1>
      </div>
      <section className=" flex w-full gap-2 mb-4 ">
        {selectedOffer?.itemsList?.length == 0 ? (
          <article className="flex flex-col w-full justify-center items-center border border-border_light py-4 rounded-md">
            <div className="grid">
              <div className="grid place-content-center">
                <NoDataSvg width={100} height={100} />
              </div>
              <span className="font-semibold mb-4">No hay items disponibles</span>
              <button
                className="toolbar-secondary-icon-btn"
                onClick={() => {
                  router.push(`/dashboard/project/${projectId}/offer/createOffer/createItem`);
                }}
              >
                <PlusSvg width={20} height={20} />
                Añadir Item
              </button>
            </div>
          </article>
        ) : (
          <div className="flex flex-col w-full gap-2">
            <article className="grid grow gap-2">
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
            </article>
            <button
              className="add-item-form-btn"
              onClick={() => {
                router.push(`/dashboard/project/${projectId}/offer/createOffer/createItem`);
              }}
            >
              <PlusSvg width={20} height={20} />
              Añadir Item
            </button>
            <article className="flex items-center justify-end h-[39px] flex-grow bg-white-100 border-solid border border-border_light rounded-lg">
              <div className="flex font-semibold">
                <h2>VALOR TOTAL : </h2>
              </div>
              <div className="flex px-4">
                ${" "}
                {totalValue?.toLocaleString("DE", {
                  maximumFractionDigits: 2,
                  minimumFractionDigits: 2
                })}
              </div>
            </article>
          </div>
        )}
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
                  startUpdateOffer({
                    name: selectedOffer?.projectName,
                    itemsList: selectedOffer?.itemsList,
                    projectName: selectedOffer?.projectName,
                    projectId: selectedOffer?.projectId,
                    representativeName: selectedOffer?.representativeName,
                    value: selectedOffer?.itemsList?.map((item) => item.value).reduce((total, current) => total + current, 0),
                    version: selectedOffer.version
                  })
                );
                router.push(`/dashboard/project/${projectId}/offer`);
                form.resetFields();
              })
              .catch((error) => {
                console.log("Validate Failed:", error);
              });
          }}
        >
          Crear
        </button>
      </Form.Item>
    </Form>
  );
};

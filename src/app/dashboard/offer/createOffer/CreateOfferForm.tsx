"use client";
import { Form } from "antd";
import { useRouter } from "next/navigation";
import React from "react";

import { changeProjectStatus, clearOffer } from "@/actions/project";
import { IOffer } from "@/models/offer";
import { IProject } from "@/models/project";
import { Item } from "../[id]/Item";
import { NoDataSvg } from "@/app/global/NoDataSvg";
import { PlusSvg } from "@/app/global/PlusSvg";
import { RootState, useAppSelector } from "@/store/store";
import { startAddOffer } from "@/actions/offer";
import { useAppDispatch } from "@/hooks/hooks";

export const CreateOfferForm = () => {
  const dispatch = useAppDispatch();
  const [form] = Form.useForm();
  const router = useRouter();

  const { selectedProject }: { selectedProject: IProject } = useAppSelector((state: RootState) => state?.project);
  const { selectedOffer }: { selectedOffer: IOffer } = useAppSelector((state: RootState) => state?.offer);

  const onFinishFailed = (errorInfo: any) => {
    console.log("Failed:", errorInfo);
  };

  return (
    <Form
      form={form}
      name="createOfferForm"
      labelCol={{ span: 0 }}
      wrapperCol={{ span: 0 }}
      className="w-full flex flex-col gap-0"
      initialValues={{ remember: true }}
      onFinishFailed={onFinishFailed}
      autoComplete="off"
      requiredMark={"optional"}
      size="middle"
    >
      <div className="font-black mb-2">
        <h1>NOMBRE: {selectedProject.projectName}</h1>
      </div>
      <section className=" flex w-full gap-2 mb-4 ">
        {selectedOffer?.itemsList?.length == 0 ? (
          <article className="flex justify-center border border-border_light grow py-4 rounded-md">
            <div className="grid">
              <div className="grid place-content-center">
                <NoDataSvg width={100} height={100} />
              </div>
              <span className="font-bold mb-4">No hay items disponibles</span>
              <button
                className="toolbar-primary-icon-btn"
                onClick={() => {
                  router.push("/dashboard/offer/createOffer/createItem");
                }}
              >
                <PlusSvg width={20} height={20} />
                Añadir Item
              </button>
            </div>
          </article>
        ) : (
          <div className="grid grow gap-2">
            <article className="grid grow gap-2">
              {selectedOffer?.itemsList?.map((item, index) => (
                <article key={index}>
                  <Item number={index + 1} item={item} />
                </article>
              ))}
            </article>
            <button
              className="toolbar-primary-icon-btn"
              onClick={() => {
                router.push("/dashboard/offer/createOffer/createItem");
              }}
            >
              <PlusSvg width={20} height={20} />
              Añadir Item
            </button>
            <article className={`${selectedOffer?.itemsList?.length == 0 && "hidden"} flex items-center h-[39px] flex-grow bg-white-100 border-solid border border-border_light rounded-md`}>
              <div className="flex w-[90%] justify-end  font-bold">
                <h2>VALOR: </h2>
              </div>
              <div className="flex px-2 ">
                ${" "}
                {selectedOffer?.itemsList
                  ?.map((item) => item.value)
                  ?.reduce((total, current) => total + current, 0)
                  ?.toLocaleString("DE")}
              </div>
            </article>
          </div>
        )}
        <article className="flex flex-col border border-border_light w-[500px] rounded-md">
          <div className="w-full border-b p-2 font-bold border-border_light flex justify-center items-center bg-background_light">
            <span>DESCRIPCIÓN DEL PROYECTO</span>
          </div>
          <ul className=" flex flex-col">
            {selectedProject?.itemsList?.map((item, index) => (
              <li key={index} className=" flex w-full items-center gap-2 border-b border-border_light">
                <div className=" flex grow justify-center font-bold border-r  border-border_light items-center h-full">
                  <p>{index + 1}</p>
                </div>
                <div className="flex w-[90%]">
                  <p className="w-fit">{item.description}</p>
                </div>
              </li>
            ))}
          </ul>
        </article>
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
                    name: selectedProject?.projectName,
                    itemsList: selectedOffer?.itemsList,
                    projectName: selectedProject?.projectName,
                    projectId: selectedProject?._id,
                    value: selectedOffer?.itemsList?.map((item) => item.value).reduce((total, current) => total + current, 0),
                  })
                );
                dispatch(changeProjectStatus(selectedProject, "Terminado"));
                dispatch(clearOffer());
                form.resetFields();
                router.push(`/dashboard/project/${selectedProject._id}`);
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

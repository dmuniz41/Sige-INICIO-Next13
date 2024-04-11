"use client";
import { Form, Select, SelectProps } from "antd";
import { useRouter } from "next/navigation";
import React, { useEffect, useMemo, useState } from "react";

import { changeProjectStatus, clearOffer } from "@/actions/project";
import { IOffer } from "@/models/offer";
import { IProject } from "@/models/project";
import { IRepresentativeNomenclator } from "@/models/nomenclators/representative";
import { Item } from "../[id]/Item";
import { NoDataSvg } from "@/app/global/NoDataSvg";
import { PlusSvg } from "@/app/global/PlusSvg";
import { representativeNomenclatorsStartLoading } from "@/actions/nomenclators/representative";
import { RootState, useAppSelector } from "@/store/store";
import { startAddOffer } from "@/actions/offer";
import { startLoadServiceFeeAuxiliary } from "@/actions/serviceFeeAuxiliary";
import { useAppDispatch } from "@/hooks/hooks";

export const CreateOfferForm = () => {
  const dispatch = useAppDispatch();
  const [form] = Form.useForm();
  const router = useRouter();
  const [representativePercentage, setRepresentativePercentage] = useState(0);
  const [representativeName, setRepresentativeName] = useState("");

  useEffect(() => {
    dispatch(startLoadServiceFeeAuxiliary());
    dispatch(representativeNomenclatorsStartLoading());
  }, [dispatch]);

  const { selectedProject }: { selectedProject: IProject } = useAppSelector(
    (state: RootState) => state?.project
  );
  const { selectedOffer }: { selectedOffer: IOffer } = useAppSelector(
    (state: RootState) => state?.offer
  );

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

  const {
    representativeNomenclators
  }: { representativeNomenclators: IRepresentativeNomenclator[] } = useAppSelector(
    (state: RootState) => state?.nomenclator
  );

  const representativeOptions: SelectProps["options"] = representativeNomenclators?.map(
    (representative) => {
      return {
        label: `${representative?.name}`,
        value: `${representative?.name}`
      };
    }
  );

  const onFinishFailed = (errorInfo: any) => {
    console.log("Failed:", errorInfo);
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
      <div className="font-bold mb-2">
        <h1>Nombre: {selectedProject.projectName}</h1>
      </div>
      <Form.Item
        className="mb-3 w-[30%]"
        label={<span className="font-bold text-md">Representación</span>}
        name="representative"
        rules={[{ required: true, message: "Campo requerido" }]}
      >
        <Select
          allowClear
          options={representativeOptions}
          showSearch
          onSelect={(value) => {
            setRepresentativePercentage(
              representativeNomenclators.find((representative) => representative.name === value)
                ?.percentage ?? 1
            );
          }}
          optionFilterProp="children"
          filterOption={(input: any, option: any) =>
            (option?.label ?? "").toLowerCase().includes(input)
          }
          filterSort={(optionA: any, optionB: any) =>
            (optionA?.label ?? "").toLowerCase().localeCompare((optionB?.label ?? "").toLowerCase())
          }
        />
      </Form.Item>
      <section className=" flex w-full gap-2 mb-4 ">
        {selectedOffer?.itemsList?.length == 0 ? (
          <article className="flex flex-col w-[60%] justify-center items-center border border-border_light py-4 rounded-md">
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
          <div className="flex flex-col w-[80%] gap-2">
            <article className="grid grow gap-2">
              {selectedOffer?.itemsList?.map((item, index) => (
                <article key={index}>
                  <Item number={index + 1} item={item} />
                </article>
              ))}
            </article>
            <button
              className="add-item-form-btn"
              onClick={() => {
                router.push("/dashboard/offer/createOffer/createItem");
              }}
            >
              <PlusSvg width={20} height={20} />
              Añadir Item
            </button>
            <article
              className={`${selectedOffer?.itemsList?.length == 0 && "hidden"} flex items-center h-[39px] flex-grow bg-white-100 border-solid border border-border_light rounded-md`}
            >
              <div className="flex w-[90%] justify-end  font-bold">
                <h2>VALOR TOTAL: </h2>
              </div>
              <div className="flex px-4">{totalValue}</div>
            </article>
          </div>
        )}
        <article className="flex flex-col border border-border_light w-[40%]  rounded-md">
          <div className="w-full border-b p-2 font-bold border-border_light flex justify-center items-center bg-background_light">
            <span>DESCRIPCIÓN DEL PROYECTO</span>
          </div>
          <ul className=" flex flex-col">
            {selectedProject?.itemsList?.map((item, index) => (
              <li
                key={index}
                className=" flex w-full items-center gap-2 border-b border-border_light"
              >
                <div className=" flex w-10 justify-center font-bold border-r border-border_light items-center h-full">
                  <p>{index + 1}</p>
                </div>
                <div className="flex bg-red flex-1">
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
                    representativeName: values?.representative,
                    representationPercentage: representativeNomenclators.find(
                      (representative) => representative.name === values.representative
                    )?.percentage,
                    value: selectedOffer?.itemsList
                      ?.map((item) => item.value)
                      .reduce((total, current) => total + current, 0)
                  })
                );
                dispatch(changeProjectStatus(selectedProject, "Calculado"));
                dispatch(clearOffer());
                router.push(`/dashboard/project`);
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

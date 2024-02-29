"use client";
import { Button, DatePicker, Form, Input, InputNumber, Select, SelectProps } from "antd";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

import { useAppDispatch } from "@/hooks/hooks";
import { nomenclatorsStartLoading } from "@/actions/nomenclator";
import { startAddProject } from "@/actions/project";
import { IRepresentationCoefficients, IServiceFeeAuxiliary } from "@/models/serviceFeeAuxiliary";
import { RootState, useAppSelector } from "@/store/store";
import { startLoadServiceFeeAuxiliary } from "@/actions/serviceFeeAuxiliary";
import { MinusCircleOutlined, PlusOutlined } from "@ant-design/icons";
import { INomenclator } from "@/models/nomenclator";
import { Item } from "../[id]/Item";
import { IOfferItem } from "@/models/offer";
import { IProject } from "@/models/project";
import { PointSvg } from "@/app/global/PointSvg";
import { NoDataSvg } from "@/app/global/NoDataSvg";
import { PlusSvg } from "@/app/global/PlusSvg";

export const CreateOfferForm = () => {
  const dispatch = useAppDispatch();
  const [form] = Form.useForm();
  const router = useRouter();
  const [listOfItems, setListOfItems] = useState<IOfferItem[]>([
    // {
    //   description: "Cartel luminico exterior con fondo y laterales de pvc 10mm con frente acrilico 5mm vinilo impreso transparente impreso y fondeado. Iluminacion interior led. Dim 2.40 * 0.70 m",
    //   activities: [
    //     {
    //       amount: 1.68,
    //       description: "Caja de luz con fondo y laterales en pvc 10mm y laterales en pvc 3mm con frente acrilico 5mm vinilo impreso y fondeado. Iluminacioninterior led",
    //       unitMeasure: "m2",
    //       price: 61175.52,
    //       value: 102774.87,
    //     },
    //     {
    //       amount: 1,
    //       description: "Uso de andamios 2 niveles",
    //       unitMeasure: "u",
    //       price: 5488.11,
    //       value: 5488.1,
    //     },
    //     {
    //       amount: 1,
    //       description: "Instalacion electrica cajas de luz fijo media",
    //       unitMeasure: "u",
    //       price: 12848.94,
    //       value: 3,
    //     },
    //   ],
    //   value: 102774.87,
    // },
    // {
    //   description: "Cartel luminico exterior con fondo y laterales de pvc 10mm con frente acrilico 5mm vinilo impreso transparente impreso y fondeado. Iluminacion interior led. Dim 2.40 * 0.70 m",
    //   activities: [
    //     {
    //       amount: 1.68,
    //       description: "Caja de luz con fondo y laterales en pvc 10mm y laterales en pvc 3mm con frente acrilico 5mm vinilo impreso y fondeado. Iluminacioninterior led",
    //       unitMeasure: "m2",
    //       price: 61175.52,
    //       value: 102774.87,
    //     },
    //     {
    //       amount: 1,
    //       description: "Uso de andamios 2 niveles",
    //       unitMeasure: "u",
    //       price: 5488.11,
    //       value: 5488.1,
    //     },
    //     {
    //       amount: 1,
    //       description: "Instalacion electrica cajas de luz fijo media",
    //       unitMeasure: "u",
    //       price: 12848.94,
    //       value: 3,
    //     },
    //   ],
    //   value: 102774.87,
    // },
    // {
    //   description: "Cartel luminico exterior con fondo y laterales de pvc 10mm con frente acrilico 5mm vinilo impreso transparente impreso y fondeado. Iluminacion interior led. Dim 2.40 * 0.70 m",
    //   activities: [
    //     {
    //       amount: 1.68,
    //       description: "Caja de luz con fondo y laterales en pvc 10mm y laterales en pvc 3mm con frente acrilico 5mm vinilo impreso y fondeado. Iluminacioninterior led",
    //       unitMeasure: "m2",
    //       price: 61175.52,
    //       value: 102774.87,
    //     },
    //     {
    //       amount: 1,
    //       description: "Uso de andamios 2 niveles",
    //       unitMeasure: "u",
    //       price: 5488.11,
    //       value: 5488.1,
    //     },
    //     {
    //       amount: 1,
    //       description: "Instalacion electrica cajas de luz fijo media",
    //       unitMeasure: "u",
    //       price: 12848.94,
    //       value: 3,
    //     },
    //   ],
    //   value: 102774.87,
    // },
  ]);

  useEffect(() => {
    dispatch(nomenclatorsStartLoading());
  }, [dispatch]);

  const { selectedProject }: { selectedProject: IProject } = useAppSelector((state: RootState) => state?.project);

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
      <section className=" flex w-full gap-2 mb-4 ">
        {listOfItems.length == 0 ? (
          <article className="flex justify-center border border-border_light grow py-4 rounded-md">
            <div className="grid">
              <div className="grid place-content-center">
                <NoDataSvg width={100} height={100} />
              </div>
              <span className="font-bold mb-4">No hay items disponibles</span>
              <button className="toolbar-primary-icon-btn" onClick={()=>{router.push('/dashboard/offer/createOffer/createItem')}}>
                <PlusSvg width={20} height={20} />
                Añadir Item
              </button>
            </div>
          </article>
        ) : (
          <article className="grid grow gap-2">
            {listOfItems.map((item, index) => (
              <article key={index}>
                <Item number={index + 1} item={item} />
              </article>
            ))}
          </article>
        )}
        <article className="flex flex-col border border-border_light w-[500px] rounded-md">
          <div className="w-full border-b p-2 font-bold border-border_light flex justify-center items-center bg-background_light">
            <span>LISTA DE ITEMS</span>
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
    </Form>
  );
};

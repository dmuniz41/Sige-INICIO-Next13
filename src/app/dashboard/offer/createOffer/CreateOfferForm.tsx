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

export const CreateOfferForm = () => {
  const dispatch = useAppDispatch();
  const [form] = Form.useForm();
  const router = useRouter();
  const [listOfItems, setListOfItems] = useState<IOfferItem[]>([
    {
      description: "Cartel luminico exterior con fondo y laterales de pvc 10mm con frente acrilico 5mm vinilo impreso transparente impreso y fondeado. Iluminacion interior led. Dim 2.40 * 0.70 m",
      activities: [
        {
          amount: 1.68,
          description: "Caja de luz con fondo y laterales en pvc 10mm y laterales en pvc 3mm con frente acrilico 5mm vinilo impreso y fondeado. Iluminacioninterior led",
          unitMeasure: "m2",
          price: 61175.52,
          value: 102774.87,
        },
        {
          amount: 1,
          description: "Uso de andamios 2 niveles",
          unitMeasure: "u",
          price: 5488.11,
          value: 5488.1,
        },
        {
          amount: 1,
          description: "Instalacion electrica cajas de luz fijo media",
          unitMeasure: "u",
          price: 12848.94,
          value: 3,
        },
      ],
      value: 102774.87,
    },

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
      <section className=" flex gap-2 mb-4 ">
        <article className="grid gap-2">
          {listOfItems.map((item, index) => (
            <article key={index}>
              <Item number={index + 1} item={item} />
            </article>
          ))}
        </article>

        <article className="flex flex-col border border-border_light w-[500px]">
          <div className="w-full border-b p-2 font-bold border-border_light flex justify-center items-center bg-background_light">
            <span>LISTA DE ITEMS</span>
          </div>
          <ul className=" flex flex-col">
            {selectedProject?.itemsList?.map((item, index) => (
              <li key={index} className=" flex w-full items-center gap-2 border-b border-border_light">
                <div className=" flex grow justify-center font-bold border-r  border-border_light items-center h-full">
                  <p>{index + 1}</p>
                </div>
                <div className="flex w-[380px]">
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

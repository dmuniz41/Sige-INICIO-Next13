"use client";
import { Form, Input } from "antd";
import { useRouter } from "next/navigation";
import React, { useState } from "react";

import { useAppDispatch } from "@/hooks/hooks";
import TextArea from "antd/es/input/TextArea";
import { FormSection } from "@/app/dashboard/serviceFees/createServiceFee/CreateServiceFeeForm";
import { IActivity } from "@/models/offer";
import { AddActivityModal } from "./AddActivity";

export const CreateItemForm = () => {
  const dispatch = useAppDispatch();
  const [form] = Form.useForm();
  const router = useRouter();

  const [itemValue, setItemValue] = useState<number>();
  const [activitiesValues, setActivitiesValues] = useState<IActivity[]>([]);
  const [addActivitiesModal, setAddActivitiesModal] = useState(false);
  
  const onFinishFailed = (errorInfo: any) => {
    console.log("Failed:", errorInfo);
  };
  
  const onAddActivity = (values: IActivity) => {
    console.log("🚀 ~ onAddActivity ~ values:", values.value)
    setActivitiesValues([values, ...activitiesValues]);
    form.setFieldValue("activities", [...activitiesValues, values]);
    setAddActivitiesModal(false);
    setItemValue(values.value)
    console.log("🚀 ~ CreateItemForm ~ itemValue:", itemValue)
    setItemValue(activitiesValues.map((activity) => activity.value).reduce((ac, cv) => ac! + cv, 0));
  };

  return (
    <Form
      form={form}
      name="createItemForm"
      labelCol={{ span: 0 }}
      wrapperCol={{ span: 0 }}
      className="w-full flex flex-col gap-0"
      initialValues={{ remember: true }}
      onFinishFailed={onFinishFailed}
      autoComplete="off"
      requiredMark={"optional"}
      size="middle"
    >
      <section className=" flex-col">
        <Form.Item className="mb-3 w-[35%]" name="description" label={<span className="font-bold text-md">Descripción</span>} rules={[{ required: true, message: "Campo requerido" }]}>
          <TextArea rows={4} />
        </Form.Item>

        <FormSection
          sectionName="LISTA DE ACTIVIDADES"
          values={activitiesValues}
          formName="activities"
          valuesSetter={setActivitiesValues}
          modalSetter={setAddActivitiesModal}
          buttonText="Añadir Actividad"
          form={form}
        />
      </section>

      <article className="flex pl-4 items-center h-[39px] flex-grow bg-white-100 border-solid border-[1px] border-border_light rounded-lg">
        <div className="flex w-[90%] justify-end pr-4 font-bold">
          <h2>VALOR: </h2>
        </div>
        <div className="flex w-[150px] pl-2">$ {itemValue}</div>
      </article>

      <Form.Item>
        <button
          type="submit"
          className="mt-4 select-none rounded-lg bg-success-500 py-3 px-6 text-center align-middle text-sm font-bold uppercase text-white-100 shadow-md shadow-success-500/20 transition-all hover:shadow-lg hover:shadow-success-500/40 focus:opacity-[0.85] focus:shadow-none active:opacity-[0.85] active:shadow-none disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none "
          onClick={() => {
            form
              .validateFields()
              .then((values) => {
                console.log("🚀 ~ .then ~ values:", values);
                form.resetFields();
                // router.push("/dashboard/offer/createOffer");
              })
              .catch((error) => {
                console.log("Validate Failed:", error);
              });
          }}
        >
          Crear
        </button>
      </Form.Item>

      <AddActivityModal open={addActivitiesModal} onCancel={() => setAddActivitiesModal(false)} onCreate={onAddActivity} />
    </Form>
  );
};

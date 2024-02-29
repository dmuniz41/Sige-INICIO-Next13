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

  const [activitiesValues, setActivitiesValues] = useState<IActivity[]>([]);
  const [addActivitiesModal, setAddActivitiesModal] = useState(false);

  const onFinishFailed = (errorInfo: any) => {
    console.log("Failed:", errorInfo);
  };

  const onAddActivity = (values: IActivity) => {
    console.log("🚀 ~ onAddActivity ~ values:", values)
    setActivitiesValues([values, ...activitiesValues]);
    form.setFieldValue("activities", [...activitiesValues, values]);
    setAddActivitiesModal(false);
    return {};
  };
    console.log("🚀 ~ onAddActivity ~ activitiesValues:", activitiesValues)

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
      <section className=" flex-col mb-4">
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

      <AddActivityModal open={addActivitiesModal} onCancel={() => setAddActivitiesModal(false)} onCreate={onAddActivity} />
    </Form>
  );
};

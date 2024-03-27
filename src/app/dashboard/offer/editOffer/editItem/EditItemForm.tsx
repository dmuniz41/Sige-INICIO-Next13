"use client";
import { Form } from "antd";
import { useRouter } from "next/navigation";
import React, { useMemo, useState } from "react";

import { FormSection } from "@/app/dashboard/serviceFees/createServiceFee/CreateServiceFeeForm";
import { IActivity, IOffer, IOfferItem } from "@/models/offer";
import { editItem, setCurrentItem } from "@/actions/offer";
import { useAppDispatch } from "@/hooks/hooks";
import TextArea from "antd/es/input/TextArea";
import { AddActivityModal } from "../../createOffer/createItem/AddActivity";
import { RootState, useAppSelector } from "@/store/store";

export const EditItemForm = () => {
  const dispatch = useAppDispatch();
  const [form] = Form.useForm();
  const router = useRouter();

  const { selectedItem }: { selectedItem: IOfferItem } = useAppSelector(
    (state: RootState) => state?.offer
  );

  const [activitiesValues, setActivitiesValues] = useState<IActivity[]>(selectedItem.activities);
  const [description, setDescription] = useState(selectedItem?.description);
  const [addActivitiesModal, setAddActivitiesModal] = useState(false);
  const activities = useMemo(() => activitiesValues, [activitiesValues]);

  const onFinishFailed = (errorInfo: any) => {
    console.log("Failed:", errorInfo);
  };

  const onAddActivity = (values: IActivity) => {
    console.log("🚀 ~ onAddActivity ~ values:", values);
    setActivitiesValues([values, ...activitiesValues]);
    form.setFieldValue("activities", [values, ...activitiesValues]);
    setAddActivitiesModal(false);
  };

  return (
    <Form
      form={form}
      name="editItemForm"
      labelCol={{ span: 0 }}
      wrapperCol={{ span: 0 }}
      className="w-full flex flex-col gap-0"
      onFinishFailed={onFinishFailed}
      autoComplete="off"
      requiredMark={"optional"}
      fields={[
        {
          name: "description",
          value: description
        },
        {
          name: "activities",
          value: activities
        }
      ]}
      size="middle"
    >
      <section className=" flex-col">
        <Form.Item
          className="mb-3 w-[35%]"
          name="description"
          label={<span className="font-bold text-md">Descripción</span>}
          rules={[{ required: true, message: "Campo requerido" }]}
        >
          <TextArea rows={4} onChange={(value) => setDescription(String(value.target.value))} />
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

      <article
        className={`flex pl-4 items-center h-[39px] flex-grow bg-white-100 border-solid border border-border_light rounded-md ${activitiesValues.length == 0 && `hidden`}`}
      >
        <div className="flex w-[90%] justify-end pr-4 font-bold">
          <h2>VALOR: </h2>
        </div>
        <div className="flex w-[150px] pl-2">
          ${" "}
          {activitiesValues
            .map((activity) => activity.value)
            .reduce((total, current) => total + current, 0)
            .toLocaleString("DE")}
        </div>
      </article>

      <Form.Item>
        <button
          type="submit"
          className="mt-4 select-none rounded-lg bg-success-500 py-3 px-6 text-center align-middle text-sm font-bold uppercase text-white-100 shadow-md shadow-success-500/20 transition-all hover:shadow-lg hover:shadow-success-500/40 focus:opacity-[0.85] focus:shadow-none active:opacity-[0.85] active:shadow-none disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none "
          onClick={() => {
            form
              .validateFields()
              .then((values) => {
                dispatch(
                  editItem(
                    {
                      ...values,
                      value: activitiesValues
                        .map((activity) => activity.value)
                        .reduce((total, current) => total + current, 0)
                    },
                    true
                  )
                );

                form.resetFields();
                router.push("/dashboard/offer/editOffer");
              })
              .catch((error) => {
                console.log("Validate Failed:", error);
              });
          }}
        >
          Editar
        </button>
      </Form.Item>

      <AddActivityModal
        open={addActivitiesModal}
        onCancel={() => setAddActivitiesModal(false)}
        onCreate={onAddActivity}
      />
    </Form>
  );
};

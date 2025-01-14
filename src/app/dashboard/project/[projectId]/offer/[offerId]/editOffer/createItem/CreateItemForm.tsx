"use client";
import { Form } from "antd";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import TextArea from "antd/es/input/TextArea";

import { AddActivityModal } from "../../../createOffer/createItem/AddActivity";
import { editActivityList, selectedActivity, setCurrentItem } from "@/actions/offer";
import { EditActivityModal } from "../editItem/EditActivity";
import { IActivity, IOfferItem } from "@/models/offer";
import { ItemTableSection } from "../../../createOffer/ItemTableSection";
import { useAppDispatch } from "@/hooks/hooks";
import { RootState, useAppSelector } from "@/store/store";

export const CreateItemForm = (props: { projectId: string; offerId: string }) => {
  const [form] = Form.useForm();
  const { projectId, offerId } = props;
  const dispatch = useAppDispatch();
  const router = useRouter();

  const [activitiesValues, setActivitiesValues] = useState<IActivity[]>([]);
  const [addActivitiesModal, setAddActivitiesModal] = useState(false);
  const [editActivityModal, setEditActivityModal] = useState(false);
  const [rowToEdit, setRowToEdit] = useState<IActivity>();

  const { selectedItem }: { selectedItem: IOfferItem } = useAppSelector((state: RootState) => state?.offer);

  const onFinishFailed = (errorInfo: any) => {
    console.log("Failed:", errorInfo);
  };

  const onAddActivity = (values: IActivity) => {
    setActivitiesValues([values, ...activitiesValues]);
    form.setFieldValue("activities", [values, ...activitiesValues]);
    setAddActivitiesModal(false);
  };

  const onEditActivity = (values: IActivity) => {
    const newActivityList: IActivity[] = [];
    activitiesValues.map((value: IActivity) => {
      if (value.description === values.description) {
        newActivityList.push({
          ...value,
          amount: values.amount,
          description: values.description,
          price: values.price,
          listOfMeasures: values.listOfMeasures ?? [],
          unitMeasure: values.unitMeasure,
          value: values.value,
          itemId: values.itemId
        });
      } else {
        newActivityList.push(value);
      }
    });
    dispatch(editActivityList(newActivityList));
    setActivitiesValues(newActivityList);
    setEditActivityModal(false);
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
      <section className="flex-col">
        <Form.Item
          className="mb-3 w-[35%]"
          name="description"
          label={<span className="font-semibold text-md">Descripción</span>}
          rules={[
            { required: true, message: "Campo requerido" }
            // TODO: REVISAR ESTE VALIDADOR
            // {
            //   message: "Ya existe un item con esa descripción",
            //   validator: (_, value: string) => {
            //     if (
            //       !selectedOffer?.itemsList.some(
            //         (item) =>
            //           item?.description?.trim().toLowerCase() === value?.trim().toLowerCase()
            //       )
            //     ) {
            //       return Promise.resolve();
            //     } else {
            //       return Promise.reject("Ya existe un item con esa descripción");
            //     }
            //   }
            // }
          ]}
        >
          <TextArea rows={4} />
        </Form.Item>
        <div className="flex w-full">
          <ItemTableSection
            sectionName="LISTA DE ACTIVIDADES"
            values={activitiesValues}
            formName="activities"
            valuesSetter={setActivitiesValues}
            addModalSetter={setAddActivitiesModal}
            editModalSetter={setEditActivityModal}
            valueToEditSetter={setRowToEdit}
            dispatch={dispatch}
            actionToDispatch={selectedActivity}
            buttonText="Añadir Actividad"
            form={form}
          />
        </div>
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
                  setCurrentItem({
                    ...values,
                    key: selectedItem.key,
                    activities: activitiesValues,
                    value: activitiesValues.map((activity) => activity.value).reduce((total, current) => total + current, 0)
                  })
                );
                form.resetFields();
                router.push(`/dashboard/project/${projectId}/offer/${offerId}}/editOffer`);
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

      <EditActivityModal
        open={editActivityModal}
        onCancel={() => {
          setEditActivityModal(false);
          form.setFieldValue("description", "");
        }}
        onCreate={onEditActivity}
        defaultValues={rowToEdit!}
      />
    </Form>
  );
};

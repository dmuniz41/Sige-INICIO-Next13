"use client";
import { Form } from "antd";
import { useRouter } from "next/navigation";
import React, { useState } from "react";

import { AddActivityModal } from "../../../createOffer/createItem/AddActivity";
import { editActivityList, editItem, selectedActivity } from "@/actions/offer";
import { EditActivityModal } from "./EditActivity";
import { IActivity, IOffer, IOfferItem } from "@/models/offer";
import { ItemTableSection } from "../../../createOffer/ItemTableSection";
import { RootState, useAppSelector } from "@/store/store";
import { useAppDispatch } from "@/hooks/hooks";
import TextArea from "antd/es/input/TextArea";

export const EditItemForm = (props: { projectId: string; offerId: string }) => {
  const [form] = Form.useForm();
  const { projectId, offerId } = props;
  const dispatch = useAppDispatch();
  const router = useRouter();

  const { selectedItem, selectedOffer }: { selectedItem: IOfferItem; selectedOffer: IOffer } =
    useAppSelector((state: RootState) => state?.offer);

  const [activitiesValues, setActivitiesValues] = useState<IActivity[]>(selectedItem.activities);
  const [addActivitiesModal, setAddActivitiesModal] = useState(false);
  const [description, setDescription] = useState(selectedItem?.description);
  const [editActivityModal, setEditActivityModal] = useState(false);
  const [rowToEdit, setRowToEdit] = useState<IActivity>();

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
    // TODO: CAMBIAR EL CRITERIO DE COMPARACION PARA QUE NO SEA POR DESCRIPCION
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
        }
      ]}
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
            sectionName="ACTIVIDADES"
            values={activitiesValues}
            valuesSetter={setActivitiesValues}
            addModalSetter={setAddActivitiesModal}
            editModalSetter={setEditActivityModal}
            valueToEditSetter={setRowToEdit}
            buttonText="Añadir Actividad"
            dispatch={dispatch}
            actionToDispatch={selectedActivity}
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
                  editItem(
                    {
                      ...values,
                      key: selectedItem.key,
                      description: values.description,
                      activities: activitiesValues,
                      value: activitiesValues
                        .map((activity) => activity.value)
                        .reduce((total, current) => total + current, 0)
                    },
                    true
                  )
                );
                form.resetFields();
                if (selectedOffer?._id === "") {
                  router.push(`/dashboard/project/${projectId}/offer/createOffer`);
                } else {
                  router.push(`/dashboard/project/${projectId}/offer/${offerId}/editOffer`);
                }
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

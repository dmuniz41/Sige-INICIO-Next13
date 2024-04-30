"use client";
import { Form, Tooltip } from "antd";
import { useRouter } from "next/navigation";
import React, { useMemo, useState } from "react";

import { AddActivityModal } from "./AddActivity";
import { IActivity } from "@/models/offer";
import { setCurrentItem } from "@/actions/offer";
import { useAppDispatch } from "@/hooks/hooks";
import TextArea from "antd/es/input/TextArea";
import Table, { ColumnsType } from "antd/es/table";
import { DeleteSvg } from "@/app/global/DeleteSvg";
import { PlusSvg } from "@/app/global/PlusSvg";

export const CreateItemForm = (props: { projectId: string }) => {
  const { projectId } = props;
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
    form.setFieldValue("activities", [values, ...activitiesValues]);
    setAddActivitiesModal(false);
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
        <Form.Item
          className="mb-3 w-[35%]"
          name="description"
          label={<span className="font-bold text-md">Descripción</span>}
          rules={[{ required: true, message: "Campo requerido" }]}
        >
          <TextArea rows={4} />
        </Form.Item>
        <div className="flex w-full">
          <TableFormSection
            sectionName="LISTA DE ACTIVIDADES"
            values={activitiesValues}
            formName="activities"
            valuesSetter={setActivitiesValues}
            addModalSetter={setAddActivitiesModal}
            buttonText="Añadir Actividad"
            form={form}
          />  
        </div>
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
                  setCurrentItem({
                    ...values,
                    activities: activitiesValues,
                    value: activitiesValues
                      .map((activity) => activity.value)
                      .reduce((total, current) => total + current, 0)
                  })
                );
                form.resetFields();
                router.push(`/dashboard/project/${projectId}/offer/createOffer`);
              })
              .catch((error) => {
                console.log("Validate Failed:", error);
              });
          }}
        >
          Crear
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

const TableFormSection = (props: any) => {
  const {
    sectionName,
    values,
    valuesSetter,
    addModalSetter,
    // editModalSetter,
    // valueToEditSetter,
    buttonText
  } = props;

  const subtotal = useMemo(() => values?.map((value: IActivity) => value.value), [values]);

  const handleDelete = (record: IActivity) => {
    valuesSetter(values.filter((value: IActivity) => value.description !== record.description));
  };
  // const handleEdit = (record: IServiceFeeSubItem) => {
  //   valueToEditSetter(record);
  //   editModalSetter(true);
  // };

  const columns: ColumnsType<IActivity> = [
    {
      title: <span className="font-bold">Descripción</span>,
      dataIndex: "description",
      key: "description",
      width: "50%",
      render: (_, { ...record }) => (
        <span className="flex gap-1">
          {record.description}
          <span className="flex gap-2">{`${record.listOfMeasures.map((e) => e.description)}`}</span>
        </span>
      )
    },
    {
      title: <span className="font-bold">Cantidad</span>,
      dataIndex: "amount",
      key: "amount",
      width: "15%",
      render: (value) => (
        <span>
          {value?.toLocaleString("DE", { maximumFractionDigits: 2, minimumFractionDigits: 2 })}
        </span>
      )
    },
    {
      title: <span className="font-bold">Unidad de Medida</span>,
      dataIndex: "unitMeasure",
      key: "unitMeasure",
      width: "10%"
    },
    {
      title: <span className="font-bold">Precio</span>,
      dataIndex: "price",
      key: "price",
      width: "15%",
      render: (value) => (
        <span>
          $ {value?.toLocaleString("DE", { maximumFractionDigits: 2, minimumFractionDigits: 2 })}
        </span>
      )
    },
    {
      title: <span className="font-bold">Importe</span>,
      dataIndex: "value",
      key: "value",
      width: "15%",
      render: (value) => (
        <span>
          $ {value?.toLocaleString("DE", { maximumFractionDigits: 2, minimumFractionDigits: 2 })}
        </span>
      )
    },
    {
      title: <span className="font-bold">Acciones</span>,
      key: "actions",
      width: "5%",
      render: (_, { ...record }) => (
        <div className="flex gap-1 justify-center">
          {/* <Tooltip placement="top" title={"Editar"} arrow={{ pointAtCenter: true }}>
            <button onClick={() => handleEdit(record)} className="table-see-action-btn">
              <EditSvg width={18} height={18} />
            </button>
          </Tooltip> */}
          <Tooltip placement="top" title={"Eliminar"} arrow={{ pointAtCenter: true }}>
            <button onClick={() => handleDelete(record)} className="table-delete-action-btn">
              <DeleteSvg width={17} height={17} />
            </button>
          </Tooltip>
        </div>
      )
    }
  ];

  return (
    <section className=" flex w-full rounded-md p-2 border border-border_light shadow-sm">
      <div className="flex w-[15%] h-full p-2 text-center items-center justify-center bg-[#fafafa] rounded-l-md">
        <span className="text-base font-bold">{sectionName?.toUpperCase()}</span>
      </div>
      <div className="grid pl-2 w-full gap-2">
        <Table
          size="small"
          columns={columns}
          dataSource={values}
          className="shadow-sm"
          sortDirections={["ascend"]}
          pagination={false}
          bordered
          footer={() => (
            <footer className="flex w-full">
              <div className="font-bold grow flex w-[90%]">
                <span>Valor: </span>
              </div>
              <div className="flex flex-1 pl-1 justify-start font-bold">
                <span>
                  ${" "}
                  {subtotal
                    ?.reduce((total: number, current: number) => total + current, 0)
                    ?.toLocaleString("DE", {
                      maximumFractionDigits: 2,
                      minimumFractionDigits: 2
                    })}
                </span>
              </div>
            </footer>
          )}
        />
        <button
          className="add-item-form-btn"
          onClick={() => {
            addModalSetter(true);
          }}
        >
          <PlusSvg width={20} height={20} />
          {buttonText}
        </button>
      </div>
    </section>
  );
};

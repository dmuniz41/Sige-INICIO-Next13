"use client";
import { Button, DatePicker, Form, Input, InputNumber, Select, SelectProps } from "antd";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import moment, { Moment } from "moment";

import { useAppDispatch } from "@/hooks/hooks";
import { nomenclatorsStartLoading } from "@/actions/nomenclator";
import { startUpdateProject } from "@/actions/project";
import { IRepresentationCoefficients, IServiceFeeAuxiliary } from "@/models/serviceFeeAuxiliary";
import { RootState, useAppSelector } from "@/store/store";
import { startLoadServiceFeeAuxiliary } from "@/actions/serviceFeeAuxiliary";
import { MinusCircleOutlined, PlusOutlined } from "@ant-design/icons";
import { INomenclator } from "@/models/nomenclator";
import { IProject } from "@/models/project";
import { AddItemModal } from "../createProject/AddItem";
import { FormSection } from "../createProject/CreateProjectForm";
import { IClientNomenclator } from "@/models/nomenclators/client";
import { clientNomenclatorsStartLoading } from "@/actions/nomenclators/client";

export const EditProjectForm = () => {
  const dispatch = useAppDispatch();
  const [form] = Form.useForm();
  const router = useRouter();
  const payMethodNomenclator: IRepresentationCoefficients[] | undefined = [];
  const clientNamesNomenclators: string[] | undefined = [];
  const currencyNomenclators: string[] | undefined = [];
  const [itemsValues, setItemsValues]: any = useState([]);
  const [addItemModal, setAddItemModal] = useState(false);

  const { serviceFeeAuxiliary }: { serviceFeeAuxiliary: IServiceFeeAuxiliary } = useAppSelector(
    (state: RootState) => state?.serviceFee
  );
  const { nomenclators }: { nomenclators: INomenclator[] } = useAppSelector(
    (state: RootState) => state?.nomenclator
  );
  const { selectedProject }: { selectedProject: IProject } = useAppSelector(
    (state: RootState) => state.project
  );
  const { clientNomenclators }: { clientNomenclators: IClientNomenclator[] } = useAppSelector(
    (state: RootState) => state?.nomenclator
  );

  useEffect(() => {
    dispatch(nomenclatorsStartLoading());
    dispatch(clientNomenclatorsStartLoading())
    dispatch(startLoadServiceFeeAuxiliary());
    setItemsValues(selectedProject.itemsList);
  }, [dispatch, selectedProject]);

  serviceFeeAuxiliary?.payMethod?.map((payMethod) => payMethodNomenclator.push(payMethod));
  nomenclators.map((nomenclator: INomenclator) => {
    if (nomenclator.category === "Moneda") currencyNomenclators.push(nomenclator.code);
  });

  const clientNameOptions: SelectProps["options"] = clientNomenclators.map((client) => {
    return {
      label: `${client.name}`,
      value: `${client.name}`
    };
  });


  const currencyOptions: SelectProps["options"] = currencyNomenclators.map((currency) => {
    return {
      label: `${currency}`,
      value: `${currency}`
    };
  });

  const onFinishFailed = (errorInfo: any) => {
    console.log("Failed:", errorInfo);
  };

  const onAddItem = (values: any) => {
    setItemsValues([...itemsValues, values]);
    form.setFieldValue("itemsList", [values, ...itemsValues]);
    setAddItemModal(false);
  };
  return (
    <Form
      form={form}
      name="editProjectForm"
      labelCol={{ span: 0 }}
      wrapperCol={{ span: 0 }}
      className="w-full flex flex-col gap-0"
      onFinishFailed={onFinishFailed}
      autoComplete="off"
      requiredMark={"optional"}
      size="middle"
      fields={[
        {
          name: "clientNumber",
          value: selectedProject.clientNumber
        },
        {
          name: "projectNumber",
          value: selectedProject.projectNumber
        },
        {
          name: "clientName",
          value: selectedProject.clientName
        },
        {
          name: "projectName",
          value: selectedProject.projectName
        },
        {
          name: "payMethod",
          value: selectedProject.payMethod
        },
        {
          name: "currency",
          value: selectedProject.currency
        },
        {
          name: "itemList",
          value: itemsValues
        }
      ]}
    >
      <section className=" flex-col mb-4">
        <article className="grid gap-4">
          <div className="grid w-[50%]">
            <Form.Item
              className="mb-3"
              name="clientNumber"
              label={<span className="font-bold text-md">No. de Cliente</span>}
              rules={[{ required: true, message: "Campo requerido" }]}
            >
              <InputNumber />
            </Form.Item>
            <Form.Item
              className="mb-3"
              label={<span className="font-bold text-md">Nombre del Cliente</span>}
              name="clientName"
              rules={[{ required: true, message: "Campo requerido" }]}
            >
              <Select
                allowClear
                options={clientNameOptions}
                showSearch
                optionFilterProp="children"
                filterOption={(input: any, option: any) =>
                  (option?.label ?? "").toLowerCase().includes(input)
                }
                filterSort={(optionA: any, optionB: any) =>
                  (optionA?.label ?? "")
                    .toLowerCase()
                    .localeCompare((optionB?.label ?? "").toLowerCase())
                }
              />
            </Form.Item>
            <Form.Item
              className="mb-3"
              label={<span className="font-bold text-md">Proyecto</span>}
              name="projectName"
              rules={[{ required: true, message: "Campo requerido" }]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              className="mb-3"
              label={<span className="font-bold text-md">Moneda </span>}
              name="currency"
              rules={[{ required: true, message: "Campo requerido" }]}
            >
              <Select
                allowClear
                options={currencyOptions}
                showSearch
                optionFilterProp="children"
                filterOption={(input: any, option: any) =>
                  (option?.label ?? "").toLowerCase().includes(input)
                }
                filterSort={(optionA: any, optionB: any) =>
                  (optionA?.label ?? "")
                    .toLowerCase()
                    .localeCompare((optionB?.label ?? "").toLowerCase())
                }
              />
            </Form.Item>
          </div>
        </article>
        <FormSection
          sectionName="Servicios"
          values={itemsValues}
          formName="itemList"
          valuesSetter={setItemsValues}
          modalSetter={setAddItemModal}
          buttonText="Añadir Servicio"
          form={form}
        />
      </section>
      <Form.Item>
        <button
          type="submit"
          className="mt-4 select-none rounded-lg bg-success-500 py-3 px-6 text-center align-middle text-sm font-bold uppercase text-white-100 shadow-md shadow-success-500/20 transition-all hover:shadow-lg hover:shadow-success-500/40 focus:opacity-[0.85] focus:shadow-none active:opacity-[0.85] active:shadow-none disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none "
          onClick={() => {
            form
              .validateFields()
              .then((values) => {
                console.log("🚀 ~ .then ~ values:", values);
                dispatch(
                  startUpdateProject({
                    ...values,
                    _id: selectedProject._id,
                    itemsList: itemsValues
                  })
                );
                form.resetFields();
                router.push(`/dashboard/project/${selectedProject._id}`);
              })
              .catch((error) => {
                console.log("Validate Failed:", error);
              });
          }}
        >
          Editar
        </button>
      </Form.Item>
      <AddItemModal
        open={addItemModal}
        onCancel={() => setAddItemModal(false)}
        onCreate={onAddItem}
        listLength={itemsValues.length}
      />
    </Form>
  );
};

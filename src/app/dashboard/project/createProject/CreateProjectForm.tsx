"use client";
import { Button, DatePicker, Form, Input, Select, SelectProps } from "antd";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

import { useAppDispatch } from "@/hooks/hooks";
import { nomenclatorsStartLoading } from "@/actions/nomenclator";
import { startAddProject } from "@/actions/project";
import { IRepresentationCoefficients, IServiceFeeAuxiliary } from "@/models/serviceFeeAuxiliary";
import { RootState, useAppSelector } from "@/store/store";
import { startLoadServiceFeeAuxiliary } from "@/actions/serviceFeeAuxiliary";
import { MinusCircleOutlined, PlusOutlined } from "@ant-design/icons";
import { AddItemModal } from "./AddItem";
import { INomenclator } from "@/models/nomenclator";
import { IClientNomenclator } from "@/models/nomenclators/client";
import { clientNomenclatorsStartLoading } from "@/actions/nomenclators/client";
import TextArea from "antd/es/input/TextArea";

export const CreateProjectForm = () => {
  const dispatch = useAppDispatch();
  const [form] = Form.useForm();
  const router = useRouter();
  const payMethodNomenclator: IRepresentationCoefficients[] | undefined = [];
  const currencyNomenclators: string[] | undefined = [];
  const [itemsValues, setItemsValues]: any = useState([]);
  const [addItemModal, setAddItemModal] = useState(false);
  const [clientNumber, setClientNumber] = useState(0);

  useEffect(() => {
    dispatch(nomenclatorsStartLoading());
    dispatch(clientNomenclatorsStartLoading());
    dispatch(startLoadServiceFeeAuxiliary());
  }, [dispatch]);

  const { serviceFeeAuxiliary }: { serviceFeeAuxiliary: IServiceFeeAuxiliary } = useAppSelector(
    (state: RootState) => state?.serviceFee
  );
  const { nomenclators }: { nomenclators: INomenclator[] } = useAppSelector(
    (state: RootState) => state?.nomenclator
  );
  const { clientNomenclators }: { clientNomenclators: IClientNomenclator[] } = useAppSelector(
    (state: RootState) => state?.nomenclator
  );

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
    form.setFieldValue("itemsList", [...itemsValues, values]);
    setAddItemModal(false);
  };
  return (
    <Form
      form={form}
      name="createProjectForm"
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
        <article className="grid gap-4">
          <div className="grid w-[50%]">
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
                onSelect={(value) => {
                  clientNomenclators.map((client) => {
                    client.name === value && setClientNumber(client.idNumber);
                  });
                }}
              />
            </Form.Item>
            <Form.Item
              className="mb-3"
              label={<span className="font-bold text-md">Proyecto</span>}
              name="projectName"
              rules={[{ required: true, message: "Campo requerido" }]}
            >
              <TextArea rows={3} />
            </Form.Item>

            <Form.Item
              className="mb-3"
              label={<span className="font-bold text-md">Fecha de creación</span>}
              name="initDate"
              rules={[{ required: true, message: "Campo requerido" }]}
            >
              <DatePicker />
            </Form.Item>
            <Form.Item
              className="mb-3"
              label={
                <span className="font-bold text-md">Fecha en la que se necesita el servicio</span>
              }
              name="deliveryDate"
              rules={[{ required: true, message: "Campo requerido" }]}
            >
              <DatePicker />
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
          formName="itemsList"
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
                dispatch(
                  startAddProject({
                    ...values,
                    clientNumber: clientNumber,
                    status: "Pendiente de Oferta",
                    expenses: 0,
                    profits: 0,
                    initDate: values.initDate.format("MM/DD/YYYY"),
                    deliveryDate: values.deliveryDate.format("MM/DD/YYYY")
                  })
                );
                router.push("/dashboard/project");
              })
              .catch((error) => {
                console.log("Validate Failed:", error);
              });
          }}
        >
          Crear
        </button>
      </Form.Item>
      <AddItemModal
        open={addItemModal}
        onCancel={() => setAddItemModal(false)}
        onCreate={onAddItem}
        listLength={itemsValues?.length}
      />
    </Form>
  );
};

export const FormSection = (props: any) => {
  const { sectionName, values, formName, valuesSetter, modalSetter, buttonText, form } = props;
  return (
    <section className=" flex full bg-white-100 items-center rounded-md shadow-[0px_0px_5px_0px_#00000024] ">
      <div className="flex w-[15%] min-h-[100px] h-full p-2 text-center items-center justify-center">
        <span className="text-base font-bold">{sectionName.toUpperCase()}</span>
      </div>
      <div className="flex pl-2 w-full flex-col">
        {values?.length == 0 ? (
          <div></div>
        ) : (
          <div className="flex w-full pr-9 gap-1 pt-4 font-bold">
            <div className="w-[50px]">
              <span>No.</span>
            </div>
            <div className="">
              <span>Descripción del servicio</span>
            </div>
          </div>
        )}
        <Form.List name={formName}>
          {(fields, { add, remove }) => (
            <div className="flex flex-col pr-4 flex-1 pt-6">
              {fields.map(({ key, name, ...restField }) => (
                <div key={key} className="w-full">
                  <div className="flex items-center flex-row mb-0 h-9  gap-1">
                    <Form.Item
                      className=""
                      {...restField}
                      name={[name, "idNumber"]}
                      rules={[{ required: true }]}
                    >
                      <Input
                        disabled
                        placeholder="No."
                        className=" w-[50px] disabled:bg-white-100  disabled:text-white-900"
                      />
                    </Form.Item>
                    <Form.Item
                      className="grow"
                      {...restField}
                      name={[name, "description"]}
                      rules={[{ required: true }]}
                    >
                      <Input
                        disabled
                        placeholder="Descripción"
                        className="w-full disabled:bg-white-100  disabled:text-white-900"
                      />
                    </Form.Item>
                    <MinusCircleOutlined
                      className="mb-auto"
                      onClick={() => {
                        remove(name);
                        valuesSetter(form.getFieldValue(`${formName}`));
                      }}
                    />
                  </div>
                </div>
              ))}
              <Form.Item className="justify-center w-full">
                <Button
                  className="flex flex-row justify-center items-center"
                  block
                  type="dashed"
                  onClick={() => modalSetter(true)}
                  icon={<PlusOutlined />}
                >
                  {buttonText}
                </Button>
              </Form.Item>
            </div>
          )}
        </Form.List>
      </div>
    </section>
  );
};

"use client";
import { Button, Form, Input, InputNumber } from "antd";
import { IServiceFeeAuxiliary } from "../../../models/serviceFeeAuxiliary";
import { MinusCircleOutlined, PlusOutlined } from "@ant-design/icons";
import { startLoadServiceFeeAuxiliary } from "@/actions/serviceFeeAuxiliary";
import { useAppDispatch } from "@/hooks/hooks";
import React, { useEffect } from "react";

export const EditAuxiliary = ({ onCreate, defaultValues }: any) => {
  const dispatch = useAppDispatch();
  const [form] = Form.useForm();

  useEffect(() => {
    dispatch(startLoadServiceFeeAuxiliary());
  }, [dispatch]);

  const onFinishFailed = (errorInfo: any) => {
    console.log("Failed:", errorInfo);
  };

  return (
    <Form
      form={form}
      name="editServiceFee"
      labelCol={{ span: 0 }}
      wrapperCol={{ span: 0 }}
      className="w-full flex flex-col gap-0"
      initialValues={{ remember: true }}
      onFinishFailed={onFinishFailed}
      autoComplete="off"
      requiredMark={"optional"}
      size="middle"
      fields={[
        {
          name: "calculationCoefficient",
          value: defaultValues?.calculationCoefficient,
        },
        {
          name: "officialCurrencyChangeCoefficient",
          value: defaultValues?.officialCurrencyChangeCoefficient,
        },
        {
          name: "informalCurrencyChange",
          value: defaultValues?.informalCurrencyChange,
        },
        {
          name: "mermaCoefficient",
          value: defaultValues?.mermaCoefficient,
        },
        {
          name: "payMethod",
          value: defaultValues?.payMethod,
        },
        {
          name: "administrativeExpenses",
          value: defaultValues?.administrativeExpensesCoefficients,
        },
        {
          name: "equipmentDepreciation",
          value: defaultValues?.equipmentDepreciationCoefficients,
        },
        {
          name: "equipmentMaintenance",
          value: defaultValues?.equipmentMaintenanceCoefficients,
        },
        {
          name: "transportationExpenses",
          value: defaultValues?.transportationExpensesCoefficients,
        },
        {
          name: "currencyChange",
          value: defaultValues?.currencyChange,
        },

      ]}
    >
      <section className=" flex-col">
        <div className="flex gap-2 pr-[13rem]">
          <Form.Item
            className="mb-3 flex-1"
            label={<span className="font-bold text-md">Cambio USD</span>}
            name="currencyChange"
            rules={[{ required: true, message: "Campo requerido" }]}
          >
            <InputNumber />
          </Form.Item>
        </div>
        <div className="flex gap-2 pr-[13rem]">
          <Form.Item
            className="mb-3 flex-1"
            label={<span className="font-bold text-md">Coeficiente de Cálculo</span>}
            name="calculationCoefficient"
            rules={[{ required: true, message: "Campo requerido" }]}
          >
            <InputNumber />
          </Form.Item>
        </div>
        <div className="flex gap-2 pr-[13rem]">
          <Form.Item
            className="mb-3 flex-1"
            label={<span className="font-bold text-md">Coef. de Cambio Informal</span>}
            name="officialCurrencyChangeCoefficient"
            rules={[{ required: true, message: "Campo requerido" }]}
          >
            <InputNumber />
          </Form.Item>
        </div>
        <div className="flex gap-2 pr-[13rem]">
          <Form.Item className="mb-3 flex-1" label={<span className="font-bold text-md">Cambio Informal</span>} name="informalCurrencyChange" rules={[{ required: true, message: "Campo requerido" }]}>
            <InputNumber />
          </Form.Item>
        </div>
        <div className="flex gap-2 pr-[13rem]">
          <Form.Item className="mb-3 flex-1" label={<span className="font-bold text-md">Coeficiente de Merma</span>} name="mermaCoefficient" rules={[{ required: true, message: "Campo requerido" }]}>
            <InputNumber />
          </Form.Item>
        </div>
        {/* Listado de métodos de pago */}
        <label className="font-bold text-md">Métodos de pago: </label>
        <Form.List name="payMethod">
          {(fields, { add, remove }) => (
            <div className="flex flex-col w-full mt-5">
              {fields.map(({ key, name, ...restField }) => (
                <div key={key} className="w-full">
                  <div className="flex items-center flex-row mb-0 h-9  gap-1">
                    <Form.Item className="w-[70%]" {...restField} name={[name, "representative"]} rules={[{ required: true, message: "Campo requerido" }]}>
                      <Input placeholder="Descripción" className="w-full" />
                    </Form.Item>
                    <Form.Item {...restField} name={[name, "coefficientValue"]} rules={[{ required: true, message: "Campo requerido" }]}>
                      <InputNumber placeholder="Coeficiente" />
                    </Form.Item>
                    <MinusCircleOutlined className="mb-auto" onClick={() => remove(name)} />
                  </div>
                </div>
              ))}
              <Form.Item className="mb-2">
                <Button className="flex flex-row justify-center items-center" type="dashed" onClick={() => add()} block icon={<PlusOutlined />}>
                  Añadir método de pago
                </Button>
              </Form.Item>
            </div>
          )}
        </Form.List>
        {/* Listado de Coeficientes de Gastos Administrativos */}
        <label className="font-bold text-md">Coeficientes de Gastos Administrativos: </label>
        <Form.List name="administrativeExpenses">
          {(fields, { add, remove }) => (
            <div className="flex flex-col w-full mt-5">
              {fields.map(({ key, name, ...restField }) => (
                <div key={key} className="w-full">
                  <div className="flex items-center flex-row mb-0 h-9  gap-1">
                    <Form.Item className="w-[70%]" {...restField} name={[name, "name"]} rules={[{ required: true, message: "Campo requerido" }]}>
                      <Input placeholder="Descripción" className="w-full" />
                    </Form.Item>
                    <Form.Item {...restField} name={[name, "value"]} rules={[{ required: true, message: "Campo requerido" }]}>
                      <InputNumber placeholder="Coeficiente" />
                    </Form.Item>
                    <MinusCircleOutlined className="mb-auto" onClick={() => remove(name)} />
                  </div>
                </div>
              ))}
              <Form.Item className="mb-2">
                <Button className="flex flex-row justify-center items-center" type="dashed" onClick={() => add()} block icon={<PlusOutlined />}>
                  Añadir gasto administrativo
                </Button>
              </Form.Item>
            </div>
          )}
        </Form.List>
        {/* Listado de Coeficientes de Depreciacion de Equipos */}
        <label className="font-bold text-md">Coeficientes de Depreciación de Equipos: </label>
        <Form.List name="equipmentDepreciation">
          {(fields, { add, remove }) => (
            <div className="flex flex-col w-full mt-5">
              {fields.map(({ key, name, ...restField }) => (
                <div key={key} className="w-full">
                  <div className="flex items-center flex-row mb-0 h-9  gap-1">
                    <Form.Item className="w-[70%]" {...restField} name={[name, "name"]} rules={[{ required: true, message: "Campo requerido" }]}>
                      <Input placeholder="Descripción" className="w-full" />
                    </Form.Item>
                    <Form.Item {...restField} name={[name, "value"]} rules={[{ required: true, message: "Campo requerido" }]}>
                      <InputNumber placeholder="Coeficiente" />
                    </Form.Item>
                    <MinusCircleOutlined className="mb-auto" onClick={() => remove(name)} />
                  </div>
                </div>
              ))}
              <Form.Item className="mb-2">
                <Button className="flex flex-row justify-center items-center" type="dashed" onClick={() => add()} block icon={<PlusOutlined />}>
                  Añadir Coeficiente de Depreciación
                </Button>
              </Form.Item>
            </div>
          )}
        </Form.List>
        {/* Listado de Coeficientes de Mantenimiento de Equipos */}
          <label className="font-bold text-md">Coeficientes de Mantenimiento de Equipos: </label>
          <Form.List name="equipmentMaintenance">
          {(fields, { add, remove }) => (
            <div className="flex flex-col w-full mt-5">
              {fields.map(({ key, name, ...restField }) => (
                <div key={key} className="w-full">
                  <div className="flex items-center flex-row mb-0 h-9  gap-1">
                    <Form.Item className="w-[70%]" {...restField} name={[name, "name"]} rules={[{ required: true, message: "Campo requerido" }]}>
                      <Input placeholder="Descripción" className="w-full" />
                    </Form.Item>
                    <Form.Item {...restField} name={[name, "value"]} rules={[{ required: true, message: "Campo requerido" }]}>
                      <InputNumber placeholder="Coeficiente" />
                    </Form.Item>
                    <MinusCircleOutlined className="mb-auto" onClick={() => remove(name)} />
                  </div>
                </div>
              ))}
              <Form.Item className="mb-2">
                <Button className="flex flex-row justify-center items-center" type="dashed" onClick={() => add()} block icon={<PlusOutlined />}>
                  Añadir Coeficiente de Mantenimiento
                </Button>
              </Form.Item>
            </div>
          )}
        </Form.List>
        {/* Listado de Coeficientes de Gastos de Transportacion */}
          <label className="font-bold text-md">Coeficientes de Gastos de Transportacion: </label>
          <Form.List name="transportationExpenses">
          {(fields, { add, remove }) => (
            <div className="flex flex-col w-full mt-5">
              {fields.map(({ key, name, ...restField }) => (
                <div key={key} className="w-full">
                  <div className="flex items-center flex-row mb-0 h-9  gap-1">
                    <Form.Item className="w-[70%]" {...restField} name={[name, "name"]} rules={[{ required: true, message: "Campo requerido" }]}>
                      <Input placeholder="Descripción" className="w-full" />
                    </Form.Item>
                    <Form.Item {...restField} name={[name, "value"]} rules={[{ required: true, message: "Campo requerido" }]}>
                      <InputNumber placeholder="Coeficiente" />
                    </Form.Item>
                    <MinusCircleOutlined className="mb-auto" onClick={() => remove(name)} />
                  </div>
                </div>
              ))}
              <Form.Item className="mb-2">
                <Button className="flex flex-row justify-center items-center" type="dashed" onClick={() => add()} block icon={<PlusOutlined />}>
                  Añadir Gasto de Transportación
                </Button>
              </Form.Item>
            </div>
          )}
        </Form.List>
      </section>
      <Form.Item>
        <button
          type="submit"
          className="mt-4 select-none rounded-lg bg-success-500 py-3 px-6 text-center align-middle text-sm font-bold uppercase text-white-100 shadow-md shadow-success-500/20 transition-all hover:shadow-lg hover:shadow-success-500/40 focus:opacity-[0.85] focus:shadow-none active:opacity-[0.85] active:shadow-none disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none "
          onClick={() => {
            form
              .validateFields()
              .then((values: IServiceFeeAuxiliary) => {
                onCreate(values);
                form.resetFields();
              })
              .catch((error) => {
                console.log("Validate Failed:", error);
              });
          }}
        >
          Editar
        </button>
      </Form.Item>
    </Form>
  );
};

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
          value: defaultValues[0]?.calculationCoefficient,
        },
        {
          name: "officialCurrencyChangeCoefficient",
          value: defaultValues[0]?.officialCurrencyChangeCoefficient,
        },
        {
          name: "informalCurrencyChange",
          value: defaultValues[0]?.informalCurrencyChange,
        },
        {
          name: "mermaCoefficient",
          value: defaultValues[0]?.mermaCoefficient,
        },
        {
          name: "payMethod",
          value: defaultValues[0]?.payMethod,
        },
        {
          name: "fuelExpense",
          value: defaultValues[0]?.administrativeExpensesCoefficients.fuelExpense,
        },
        {
          name: "electricityExpense",
          value: defaultValues[0]?.administrativeExpensesCoefficients.electricityExpense,
        },
        {
          name: "leaseExpense",
          value: defaultValues[0]?.administrativeExpensesCoefficients.leaseExpense,
        },
        {
          name: "feedingExpense",
          value: defaultValues[0]?.administrativeExpensesCoefficients.feedingExpense,
        },
        {
          name: "phoneExpense",
          value: defaultValues[0]?.administrativeExpensesCoefficients.phoneExpense,
        },
        {
          name: "plotterDepreciation",
          value: defaultValues[0]?.equipmentDepreciationCoefficients.plotter,
        },
        {
          name: "routerDepreciation",
          value: defaultValues[0]?.equipmentDepreciationCoefficients.router,
        },
        {
          name: "bendingMachine",
          value: defaultValues[0]?.equipmentDepreciationCoefficients.bendingMachine,
        },
        {
          name: "manualTools",
          value: defaultValues[0]?.equipmentDepreciationCoefficients.manualTools,
        },
        {
          name: "plotterMaintenance",
          value: defaultValues[0]?.equipmentMaintenanceCoefficients.plotter,
        },
        {
          name: "routerMaintenance",
          value: defaultValues[0]?.equipmentMaintenanceCoefficients.router,
        },
      ]}
    >
      <section className=" flex-col">
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
                    <Form.Item className="w-[70%]" {...restField} name={[name, "representative"]} rules={[{ required: true, message: "Introduzca el método de pago" }]}>
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
        <section className="grid gap-3">
          <label className="font-bold text-md">Coeficientes de Gastos Administrativos: </label>
          <article>
            <div className="flex gap-2 pr-[13rem]">
              <Form.Item
                className="mb-3 flex-1"
                label={<span className=" w-[6rem] text-start font-bold text-md">Combustible</span>}
                name="fuelExpense"
                rules={[{ required: true, message: "Campo requerido" }]}
              >
                <InputNumber />
              </Form.Item>
            </div>
            <div className="flex gap-2 pr-[13rem]">
              <Form.Item
                className="mb-3 flex-1"
                label={<span className=" w-[6rem] text-start font-bold text-md">Electricidad</span>}
                name="electricityExpense"
                rules={[{ required: true, message: "Campo requerido" }]}
              >
                <InputNumber />
              </Form.Item>
            </div>
            <div className="flex gap-2 pr-[13rem]">
              <Form.Item
                className="mb-3 flex-1"
                label={<span className=" w-[6rem] text-start font-bold text-md">Arrendamiento</span>}
                name="leaseExpense"
                rules={[{ required: true, message: "Campo requerido" }]}
              >
                <InputNumber />
              </Form.Item>
            </div>
            <div className="flex gap-2 pr-[13rem]">
              <Form.Item
                className="mb-3 flex-1"
                label={<span className=" w-[6rem] text-start font-bold text-md">Alimentación</span>}
                name="feedingExpense"
                rules={[{ required: true, message: "Campo requerido" }]}
              >
                <InputNumber />
              </Form.Item>
            </div>
            <div className="flex gap-2 pr-[13rem]">
              <Form.Item
                className="mb-3 flex-1"
                label={<span className=" w-[6rem] text-start font-bold text-md">Teléfono</span>}
                name="phoneExpense"
                rules={[{ required: true, message: "Campo requerido" }]}
              >
                <InputNumber />
              </Form.Item>
            </div>
          </article>
        </section>
        <section className="grid gap-3">
          <label className="font-bold text-md">Coeficientes de Depreciación de Equipos: </label>
          <article>
            <div className="flex gap-2  pr-[13rem]">
              <Form.Item
                className="mb-3 flex-1"
                label={<span className=" font-bold text-md">Plotter de Impresión y Corte</span>}
                name="plotterDepreciation"
                rules={[{ required: true, message: "Campo requerido" }]}
              >
                <InputNumber />
              </Form.Item>
            </div>
            <div className="flex gap-2 pr-[13rem]">
              <Form.Item className="mb-3 flex-1" label={<span className=" font-bold text-md">Router</span>} name="routerDepreciation" rules={[{ required: true, message: "Campo requerido" }]}>
                <InputNumber />
              </Form.Item>
            </div>
            <div className="flex gap-2 pr-[13rem]">
              <Form.Item className="mb-3 flex-1" label={<span className=" font-bold text-md">Dobladora</span>} name="bendingMachine" rules={[{ required: true, message: "Campo requerido" }]}>
                <InputNumber />
              </Form.Item>
            </div>
            <div className="flex gap-2 pr-[13rem]">
              <Form.Item className="mb-3 flex-1" label={<span className=" font-bold text-md">Herramientas Manuales</span>} name="manualTools" rules={[{ required: true, message: "Campo requerido" }]}>
                <InputNumber />
              </Form.Item>
            </div>
          </article>
        </section>
        <section className="grid gap-3">
          <label className="font-bold text-md">Coeficientes de Mantenimiento de Equipos: </label>
          <article>
            <div className="flex gap-2 pr-[13rem]">
              <Form.Item
                className="mb-3 flex-1"
                label={<span className=" font-bold text-md">Plotter de Impresión y Corte</span>}
                name="plotterMaintenance"
                rules={[{ required: true, message: "Campo requerido" }]}
              >
                <InputNumber />
              </Form.Item>
            </div>
            <div className="flex gap-2 pr-[13rem]">
              <Form.Item className="mb-3 flex-1" label={<span className=" font-bold text-md">Router</span>} name="routerMaintenance" rules={[{ required: true, message: "Campo requerido" }]}>
                <InputNumber />
              </Form.Item>
            </div>
          </article>
        </section>

        <section className="grid gap-3">
          <label className="font-bold text-md">Coeficientes de Mantenimiento de Equipos: </label>
          <article>
            <div className="flex gap-2 pr-[13rem]">
              <Form.Item
                className="mb-3 flex-1"
                label={<span className=" font-bold text-md">Plotter de Impresión y Corte</span>}
                name="plotterMaintenance"
                rules={[{ required: true, message: "Campo requerido" }]}
              >
                <InputNumber />
              </Form.Item>
            </div>
            <div className="flex gap-2 pr-[13rem]">
              <Form.Item className="mb-3 flex-1" label={<span className=" font-bold text-md">Router</span>} name="routerMaintenance" rules={[{ required: true, message: "Campo requerido" }]}>
                <InputNumber />
              </Form.Item>
            </div>
          </article>
        </section>
        <section className="grid gap-3">
          <label className="font-bold text-md">Coeficientes de Gastos de Transportación: </label>
          <article>
            <div className="flex gap-2 pr-[13rem]">
              <Form.Item
                className="mb-3 flex-1"
                label={<span className=" font-bold text-md">Transportación</span>}
                name="transportationExpensesCoefficient"
                rules={[{ required: true, message: "Campo requerido" }]}
              >
                <InputNumber />
              </Form.Item>
            </div>
            <div className="flex gap-2 pr-[13rem]">
              <Form.Item
                className="mb-3 flex-1"
                label={<span className=" font-bold text-md">Distribución y Venta</span>}
                name="salesAndDistributionExpensesCoefficient"
                rules={[{ required: true, message: "Campo requerido" }]}
              >
                <InputNumber />
              </Form.Item>
            </div>
          </article>
        </section>
      </section>

      <Form.Item>
        <button
          type="submit"
          className="bg-success-500 cursor-pointer hover:bg-success-600 ease-in-out duration-300 w-[5rem] h-[2rem] flex items-center p-1 text-sm font-bold text-white-100  justify-center gap-2 rounded-md "
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

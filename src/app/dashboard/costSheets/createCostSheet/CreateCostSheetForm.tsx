"use client";

import { Form, Input, InputNumber, Select, SelectProps } from "antd";
import React from "react";
import { CSFormSection } from "./CSFormSection";
import { useAppDispatch } from "@/hooks/hooks";
import { startAddCostSheet } from "@/actions/costSheet";
import { useRouter } from "next/navigation";
import { ICostSheet } from "@/models/costSheet";

const onFinishFailed = (errorInfo: any) => {
  console.log("Failed:", errorInfo);
};

const payMethod: SelectProps["options"] = [
  {
    label: `Efectivo`,
    value: `CASH`,
  },
  {
    label: `Contrato`,
    value: `CONTRACT`,
  },
];

export const CreateCostSheetForm = () => {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const [form] = Form.useForm();

  return (
    <Form
      form={form}
      name="createCostSheetForm"
      labelCol={{ span: 0 }}
      wrapperCol={{ span: 0 }}
      className="w-full flex flex-col gap-0"
      initialValues={{ remember: true }}
      onFinishFailed={onFinishFailed}
      autoComplete="off"
      requiredMark={"optional"}
      size="middle"
    >
      <section className="w-full flex-col gap-2 justify-start">
        <Form.Item className="mb-3 " label={<span className="font-bold text-md">Tarea a ejecutar</span>} name="taskName" rules={[{ required: true, message: "Campo requerido" }]}>
          <Input className="w-[30rem]" />
        </Form.Item>
        <div className="flex w-full gap-2 justify-start">
          <Form.Item className="mb-3 " label={<span className="font-bold text-md">Cantidad de empleados</span>} name="workersAmount" rules={[{ required: true, message: "Campo requerido" }]}>
            <InputNumber className="w-[5rem]" />
          </Form.Item>
          <Form.Item className="mb-3 " label={<span className="font-bold text-md">Talento artístico</span>} name="artisticTalent" rules={[{ required: true, message: "Campo requerido" }]}>
            <InputNumber className="w-[5rem] " />
          </Form.Item>
          <Form.Item className="mb-3 " label={<span className="font-bold text-md">Utilidad</span>} name="representationCost" rules={[{ required: true, message: "Campo requerido" }]}>
            <InputNumber className="w-[5rem] " />
          </Form.Item>
          <Form.Item
            className="mb-3 "
            label={<span className="font-bold text-md">Materias primas aportadas por el cliente</span>}
            name="rawMaterialsByClient"
            rules={[{ required: true, message: "Campo requerido" }]}
          >
            <InputNumber className="w-[5rem] " />
          </Form.Item>
        </div>
        <div className="flex w-full gap-2 justify-start">
          <Form.Item className="mb-3 " label={<span className="font-bold text-md">Elaborado por</span>} name="cratedBy" rules={[{ required: true, message: "Campo requerido" }]}>
            <Input className="w-[15rem]" />
          </Form.Item>
          <Form.Item className="mb-3 " label={<span className="font-bold text-md">Aprobado por</span>} name="approvedBy" rules={[{ required: true, message: "Campo requerido" }]}>
            <Input className="w-[15rem]" />
          </Form.Item>
          <Form.Item className="mb-3 " name="payMethod" label={<span className="font-bold text-md">Método de pago</span>} rules={[{ required: true, message: "Campo requerido" }]}>
            <Select allowClear style={{ width: "10rem" }} options={payMethod} />
          </Form.Item>
        </div>
      </section>

      <CSFormSection label="Materias primas fundamentales " name="rawMaterials" />
      <CSFormSection label="Salarios directos" name="directSalaries" />
      <CSFormSection label="Otros gastos directos" name="otherDirectExpenses" />
      <CSFormSection label="Gastos asociados a la producción" name="productionRelatedExpenses" />

      <CSFormSection label="Gastos generales y de administración" name="administrativeExpenses" />
      <CSFormSection label="Gastos de distribución y ventas" name="transportationExpenses" />
      <CSFormSection label="Gastos financieros" name="financialExpenses" />
      <CSFormSection label="Gastos tributarios" name="taxExpenses" />

      <Form.Item>
        <button
          type="submit"
          className="bg-success-500 cursor-pointer hover:bg-success-600 ease-in-out duration-300 w-[5rem] h-[2rem] flex items-center p-1 text-sm font-bold text-white-100  justify-center gap-2 rounded-md "
          onClick={() => {
            form
              .validateFields()
              .then((values: ICostSheet) => {
                dispatch(
                  startAddCostSheet(
                    values.taskName,
                    values.payMethod,
                    values.createdBy,
                    values.approvedBy,
                    250,
                    values.workersAmount,
                    values.rawMaterials,
                    values.directSalaries,
                    values.otherDirectExpenses,
                    values.productionRelatedExpenses,
                    values.administrativeExpenses,
                    values.transportationExpenses,
                    values.financialExpenses,
                    values.taxExpenses,
                    values.artisticTalent,
                    values.representationCost,
                    values.rawMaterialsByClient
                  )
                );
                router.push("/dashboard/costSheets");
                form.resetFields();
              })
              .catch((error) => {
                console.log("Validate Failed:", error);
              });
          }}
        >
          Crear
        </button>
      </Form.Item>
    </Form>
  );
};

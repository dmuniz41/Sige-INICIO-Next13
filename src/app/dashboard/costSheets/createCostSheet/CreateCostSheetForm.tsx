"use client";
import { ICostSheet } from "@/models/costSheet";
import { MinusCircleOutlined, PlusOutlined } from "@ant-design/icons";
import { Button, Space, Form, Input, InputNumber } from "antd";
import React from "react";
import { CSFormSection } from "./CSFormSection";

const onFinish = (values: any) => {
  console.log("Success:", values);
};

const onFinishFailed = (errorInfo: any) => {
  console.log("Failed:", errorInfo);
};

export const CreateCostSheetForm = () => {
  return (
    <Form
      name="createCostSheetForm"
      labelCol={{ span: 0 }}
      wrapperCol={{ span: 0 }}
      className="w-full flex flex-col gap-0"
      initialValues={{ remember: true }}
      onFinish={onFinish}
      onFinishFailed={onFinishFailed}
      autoComplete="off"
      requiredMark={"optional"}
      size="middle"
    >
      <Form.Item className="mb-1" label={<span className="font-bold text-md">Tarea a ejecutar</span>} name="taskName" rules={[{ required: true, message: "Introduzca el nombre de la tarea" }]}>
        <Input />
      </Form.Item>
      <Form.Item
        className="mb-1"
        label={<span className="font-bold text-md">Cantidad de empleados</span>}
        name="workersAmount"
        rules={[{ required: true, message: "Introduzca el nombre de la tarea" }]}
      >
        <InputNumber className="w-full" />
      </Form.Item>
      
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
        >
          Crear
        </button>
      </Form.Item>
    </Form>
  );
};

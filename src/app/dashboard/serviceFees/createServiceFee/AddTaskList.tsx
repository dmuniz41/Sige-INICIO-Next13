"use client";

import { Form, Input, InputNumber, Modal, Select, SelectProps } from "antd";
import { IServiceFeeSubItem } from "@/models/serviceFees";
import { useState } from "react";

interface CollectionCreateFormProps {
  open: boolean;
  onCreate: (values: IServiceFeeSubItem) => void;
  onCancel: () => void;
}

export const AddTaskListModal: React.FC<CollectionCreateFormProps> = ({ open, onCreate, onCancel }) => {
  const [complexityCoefficient, setComplexityCoefficient] = useState(0);
  const [taskValue, setTaskValue] = useState(0);

  const complexityOptions: SelectProps["options"] = [
    {
      label: `Alta`,
      value: 3,
    },
    {
      label: `Media`,
      value: 2,
    },
    {
      label: `Baja`,
      value: 1,
    },
  ];

  const [form] = Form.useForm();
  return (
    <Modal
      className="flex flex-col"
      title={
        <div className="flex w-full justify-center">
          <span className="font-black text-lg">Nueva Actividad</span>
        </div>
      }
      style={{ textAlign: "left" }}
      centered
      open={open}
      destroyOnClose
      onCancel={onCancel}
      okType="default"
      okText="Crear"
      cancelText="Cancelar"
      footer={[
        <div key="footer" className="flex gap-2 w-full justify-end">
          <button
            key="2"
            className="bg-danger-500 cursor-pointer hover:bg-danger-600 ease-in-out duration-300 w-[5rem] h-[2rem] flex items-center p-1 text-sm font-bold text-white-100  justify-center gap-2 rounded-md"
            onClick={onCancel}
          >
            Cancelar
          </button>
          <button
            key="1"
            className="bg-success-500 cursor-pointer hover:bg-success-600 ease-in-out duration-300 w-[5rem] h-[2rem] flex items-center p-1 text-sm font-bold text-white-100  justify-center gap-2 rounded-md "
            onClick={() => {
              form
                .validateFields()
                .then((values) => {
                  onCreate({ ...values, value: taskValue });
                  form.resetFields();
                  setComplexityCoefficient(0);
                  setTaskValue(0);
                })
                .catch((error) => {
                  console.log("Validate Failed:", error);
                });
            }}
          >
            Crear
          </button>
        </div>,
      ]}
    >
      <Form form={form} layout="horizontal" name="addRawMaterial" size="middle">
        <Form.Item name="description" label="Descripción" rules={[{ required: true, message: "Campo requerido" }]}>
          <Input
            onChange={() => {
              form.setFieldsValue({
                price: 10,
              });
            }}
          />
        </Form.Item>
        <Form.Item name="unitMeasure" label="Unidad de Medida" rules={[{ required: true, message: "Campo requerido" }]}>
          <Input />
        </Form.Item>
        <div className="flex gap-2">
          <Form.Item name="complexity" label="Complejidad" className="w-[15rem]" rules={[{ required: true, message: "Campo requerido" }]}>
            <Select
              allowClear
              options={complexityOptions}
              onChange={() => {
                let values = form.getFieldsValue();
                setComplexityCoefficient(values.complexity);
                setTaskValue(values.amount * values.price * values.complexity);
              }}
              showSearch
              optionFilterProp="children"
              filterOption={(input: any, option: any) => (option?.label ?? "").toLowerCase().includes(input)}
              filterSort={(optionA: any, optionB: any) => (optionA?.label ?? "").toLowerCase().localeCompare((optionB?.label ?? "").toLowerCase())}
            />
          </Form.Item>
          <div className="mt-1">
            <span>: {complexityCoefficient?.toFixed(2)}</span>
          </div>
        </div>
        <Form.Item name="amount" label="Cantidad" className="w-[10rem]" rules={[{ required: true, message: "Campo requerido" }]}>
          <InputNumber
            onChange={() => {
              let values = form.getFieldsValue();
              setTaskValue(values.amount * values.price * values.complexity);
            }}
          />
        </Form.Item>
        <Form.Item name="price" label="Precio" className="w-[10rem]" rules={[{ required: true, message: "Campo requerido" }]}>
          <InputNumber />
        </Form.Item>
        <div className=" flex gap-2 pl-2">
          <span className="font-bold">Importe:</span>
          <span>${!taskValue ? 0 : taskValue?.toFixed(2)}</span>
        </div>
      </Form>
    </Modal>
  );
};

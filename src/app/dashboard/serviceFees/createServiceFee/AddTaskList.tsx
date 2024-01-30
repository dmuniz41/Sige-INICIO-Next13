"use client";

import { Form, Input, InputNumber, Modal, Select, SelectProps } from "antd";
import { IServiceFeeSubItem } from "@/models/serviceFees";
import { useState } from "react";
import { RootState, useAppSelector } from "@/store/store";
import { IServiceFeeTask } from "@/models/serviceFeeTask";

interface CollectionCreateFormProps {
  open: boolean;
  onCreate: (values: IServiceFeeSubItem) => void;
  onCancel: () => void;
}

export const AddTaskListModal: React.FC<CollectionCreateFormProps> = ({ open, onCreate, onCancel }) => {
  const [complexityCoefficient, setComplexityCoefficient] = useState(0);
  const [taskValue, setTaskValue] = useState(0);
  const [unitMeasure, setUnitMeasure] = useState("");
  const [price, setPrice] = useState(0);
  const [complexityCoefficients, setComplexityCoefficients] = useState([
    { name: "Alta", coefficient: 0 },
    { name: "Media", coefficient: 0 },
    { name: "Baja", coefficient: 0 },
  ]);

  const { serviceFeeTasks }: { serviceFeeTasks: IServiceFeeTask[] } = useAppSelector((state: RootState) => state?.serviceFee);
  console.log("🚀 ~ serviceFeeTasks:", serviceFeeTasks);

  const tasks: SelectProps["options"] = serviceFeeTasks.map((serviceFeeTask) => {
    return {
      label: `${serviceFeeTask.description}`,
      value: `${serviceFeeTask.description}`,
    };
  });

  const complexityOptions: SelectProps["options"] = [
    {
      label: `Alta`,
      value: complexityCoefficients[0]?.coefficient,
    },
    {
      label: `Media`,
      value: complexityCoefficients[1]?.coefficient,
    },
    {
      label: `Baja`,
      value: complexityCoefficients[2]?.coefficient,
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
                .then((values: any) => {
                  onCreate({ ...values, unitMeasure: unitMeasure, price: price, value: taskValue });
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
      <Form form={form} layout="horizontal" name="addRawMaterial" size="middle" fields={[{name: 'amount', value: 1}]}>
        <Form.Item name="description" label="Descripción" rules={[{ required: true, message: "Campo requerido" }]}>
          <Select
            allowClear
            options={tasks}
            onSelect={() => {
              let selectedTask: string = form.getFieldValue("description") ?? "";
              let complexityCoef: number = form.getFieldValue("complexity") ?? 1;
              let task = serviceFeeTasks.find((serviceFeeTask) => serviceFeeTask.description === selectedTask);
              setComplexityCoefficients(task?.complexityLevels!);
              setUnitMeasure(task?.unitMeasure!);
              setPrice(task?.price!);
              setTaskValue(task?.amount! * task?.price! * complexityCoef);
            }}
            showSearch
            optionFilterProp="children"
            filterOption={(input: any, option: any) => (option?.label ?? "").toLowerCase().includes(input)}
            filterSort={(optionA: any, optionB: any) => (optionA?.label ?? "").toLowerCase().localeCompare((optionB?.label ?? "").toLowerCase())}
          />
        </Form.Item>

        <div className="flex gap-2">
          <Form.Item name="complexity" label="Complejidad" className="w-[15rem]" rules={[{ required: true, message: "Campo requerido" }]}>
            <Select
              allowClear
              options={complexityOptions}
              onChange={() => {
                let values = form.getFieldsValue();
                setComplexityCoefficient(values.complexity);
                setTaskValue(values.amount * price * values.complexity);
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
              setTaskValue(values.amount * price * values.complexity);
            }}
          />
        </Form.Item>
        <div className=" flex gap-2 pl-2">
          <span className="font-bold">Unidad de Medida:</span>
          <span>{!unitMeasure ? 0 : unitMeasure}</span>
        </div>
        <div className=" flex gap-2 pl-2">
          <span className="font-bold">Precio:</span>
          <span>${!price ? 0 : price?.toFixed(2)}</span>
        </div>
        <div className=" flex gap-2 pl-2">
          <span className="font-bold">Importe:</span>
          <span>${!taskValue ? 0 : taskValue?.toFixed(2)}</span>
        </div>
      </Form>
    </Modal>
  );
};

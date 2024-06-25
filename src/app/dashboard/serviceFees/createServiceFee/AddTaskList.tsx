"use client";

import { Form, InputNumber, Modal, Radio, Select, SelectProps } from "antd";
import { useState } from "react";

import { IServiceFeeSubItem } from "@/models/serviceFees";
import { RootState, useAppSelector } from "@/store/store";
import { IServiceFeeTask, IServiceFeeTaskComplexity } from "@/models/serviceFeeTask";

interface CollectionCreateFormProps {
  open: boolean;
  onCreate: (values: any) => void;
  onCancel: () => void;
}

export const AddTaskListModal: React.FC<CollectionCreateFormProps> = ({ open, onCreate, onCancel }) => {
  const [taskValue, setTaskValue] = useState(0);
  const [unitMeasure, setUnitMeasure] = useState("");
  const [price, setPrice] = useState(0);
  const [currentTask, setCurrentTask] = useState<IServiceFeeTask>();
  const [currentComplexity, setCurrentComplexity] = useState<IServiceFeeTaskComplexity>();

  const { serviceFeeTasks }: { serviceFeeTasks: IServiceFeeTask[] } = useAppSelector((state: RootState) => state?.serviceFee);

  const tasks: SelectProps["options"] = serviceFeeTasks.map((serviceFeeTask) => {
    return {
      label: `${serviceFeeTask.description}`,
      value: `${serviceFeeTask.description}`
    };
  });
  const [form] = Form.useForm();
  return (
    <Modal
      className="flex flex-col"
      title={
        <div className="flex w-full justify-center">
          <span className="font-bold text-lg">Nueva Actividad</span>
        </div>
      }
      style={{ textAlign: "left" }}
      cancelText="Cancelar"
      centered
      destroyOnClose
      okText="Crear"
      okType="default"
      onCancel={onCancel}
      open={open}
      width={"1000px"}
      footer={[
        <div key="footer" className="flex gap-2 w-full justify-end">
          <button key="2" className="modal-btn-danger" onClick={onCancel}>
            Cancelar
          </button>
          <button
            key="1"
            className="modal-btn-primary"
            onClick={() => {
              form
                .validateFields()
                .then((values: any) => {
                  onCreate({
                    ...values,
                    category: currentTask?.category,
                    key: currentTask?.key,
                    unitMeasure: unitMeasure,
                    price: price,
                    value: taskValue,
                    currentComplexity: currentComplexity
                  });
                  form.resetFields();
                  setTaskValue(0);
                  setPrice(0);
                })
                .catch((error) => {
                  console.log("Validate Failed:", error);
                });
            }}
          >
            Añadir
          </button>
        </div>
      ]}
    >
      <Form form={form} layout="horizontal" name="addRawMaterial" size="middle">
        <Form.Item name="description" label="Descripción" rules={[{ required: true, message: "Campo requerido" }]}>
          <Select
            allowClear
            options={tasks}
            onSelect={() => {
              let selectedTask: string = form.getFieldValue("description") ?? "";
              // let complexityCoef: number = form.getFieldValue("complexity") ?? 1;
              let task = serviceFeeTasks.find((serviceFeeTask) => serviceFeeTask.description === selectedTask);
              setUnitMeasure(task?.unitMeasure!);
              setCurrentTask(task);
              // setPrice(task?.price!);
              // setTaskValue(task?.amount! * task?.price! * complexityCoef);
            }}
            showSearch
            optionFilterProp="children"
            filterOption={(input: any, option: any) => (option?.label ?? "").toLowerCase().includes(input)}
            filterSort={(optionA: any, optionB: any) =>
              (optionA?.label ?? "").toLowerCase().localeCompare((optionB?.label ?? "").toLowerCase())
            }
          />
        </Form.Item>
        <Radio.Group
          className="flex mb-4"
          buttonStyle="solid"
          onChange={(value) => {
            value.target.value === "Alta"
              ? currentTask?.complexity.find(
                  (complexity) => complexity.name === "Alta" && (setPrice(complexity.value), setCurrentComplexity(complexity))
                )
              : value.target.value === "Media"
                ? currentTask?.complexity.find(
                    (complexity) => complexity.name === "Media" && (setPrice(complexity.value), setCurrentComplexity(complexity))
                  )
                : currentTask?.complexity.find(
                    (complexity) => complexity.name === "Baja" && (setPrice(complexity.value), setCurrentComplexity(complexity))
                  );
          }}
        >
          <Radio.Button value="Alta">Alta</Radio.Button>
          <Radio.Button value="Media">Media</Radio.Button>
          <Radio.Button value="Baja">Baja</Radio.Button>
        </Radio.Group>
        <Form.Item name="amount" label="Cantidad" className="w-[10rem]" rules={[{ required: true, message: "Campo requerido" }]}>
          <InputNumber
            min={0}
            onChange={(value: number | null) => {
              setTaskValue(value! * price);
            }}
          />
        </Form.Item>
        <div className=" flex gap-2 pl-2 mb-4">
          <span className="font-bold">Unidad de Medida:</span>
          <span>{!unitMeasure ? "" : unitMeasure}</span>
        </div>
        <div className=" flex gap-2 pl-2 mb-4">
          <span className="font-bold">Precio:</span>
          <span>${!price ? 0 : price?.toFixed(2)}</span>
        </div>
        <div className=" flex gap-2 pl-2 mb-4">
          <span className="font-bold">Importe:</span>
          <span>${!taskValue ? 0 : taskValue?.toFixed(2)}</span>
        </div>
      </Form>
    </Modal>
  );
};

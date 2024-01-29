"use client";

import {  Form, Input, InputNumber, Modal, Select, SelectProps, Tag } from "antd";
import { INomenclator } from "@/models/nomenclator";
import { IServiceFeeTask } from "@/models/serviceFeeTask";
import { RootState, useAppSelector } from "@/store/store";

interface CollectionCreateFormProps {
  open: boolean;
  onCreate: (values: IServiceFeeTask) => void;
  onCancel: () => void;
}

export const CreateServiceFeeTaskForm: React.FC<CollectionCreateFormProps> = ({ open, onCreate, onCancel }) => {
  const { nomenclators }: any = useAppSelector((state: RootState) => state?.nomenclator);
  const categories: string[] | undefined = [];
  const unitMeasures: string[] | undefined = [];

  nomenclators.map((nomenclator: INomenclator) => {
    if (nomenclator.category === "Categoría de tareas") categories.push(nomenclator.code);
    if (nomenclator.category === "Unidad de medida") unitMeasures.push(nomenclator.code);
  });

  const categoryOptions: SelectProps["options"] = categories.map((category) => {
    return {
      label: `${category}`,
      value: `${category}`,
    };
  });

  const unitMeasureOptions: SelectProps["options"] = unitMeasures.map((UM) => {
    return {
      label: `${UM}`,
      value: `${UM}`,
    };
  });

  const [form] = Form.useForm();
  return (
    <Modal
      className="flex flex-col"
      title={
        <div className="flex w-full justify-center">
          <span className="font-black text-lg">Nueva Tarea</span>
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
                  onCreate({
                    ...values,
                    complexityLevels: [
                      {
                        name: "Alta",
                        coefficient: values.high,
                      },
                      {
                        name: "Media",
                        coefficient: values.medium,
                      },
                      {
                        name: "Baja",
                        coefficient: values.low,
                      },
                    ],
                  });
                  form.resetFields();
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
      <Form form={form} layout="horizontal" name="createUserForm" size="middle">
        <Form.Item name="category" label="Categoría" rules={[{ required: true, message: "Campo requerido" }]}>
          <Select allowClear style={{ width: "100%" }} options={categoryOptions} />
        </Form.Item>
        <Form.Item name="description" label="Descripción" rules={[{ required: true, message: "Campo requerido" }]}>
          <Input />
        </Form.Item>
        <Form.Item name="unitMeasure" label="Unidad de Medida" rules={[{ required: true, message: "Campo requerido" }]}>
          <Select allowClear style={{ width: "100%" }} options={unitMeasureOptions} />
        </Form.Item>
        <Form.Item name="amount" label="Cantidad" rules={[{ required: true, message: "Campo requerido" }]}>
          <InputNumber />
        </Form.Item>
        <Form.Item name="price" label="Precio" rules={[{ required: true, message: "Campo requerido" }]}>
          <InputNumber />
        </Form.Item>
        <section className="grid">
          <span className=" mb-2 font-bold">Coeficientes de Complejidad</span>
          <Form.Item name="high" label={<Tag color="red">Alta</Tag>} rules={[{ required: true, message: "Campo requerido" }]}>
            <InputNumber />
          </Form.Item>
          <Form.Item name="medium" label={<Tag color="orange">Media</Tag>} rules={[{ required: true, message: "Campo requerido" }]}>
            <InputNumber />
          </Form.Item>
          <Form.Item name="low" label={<Tag color="green">Baja</Tag>} rules={[{ required: true, message: "Campo requerido" }]}>
            <InputNumber />
          </Form.Item>
        </section>
      </Form>
    </Modal>
  );
};

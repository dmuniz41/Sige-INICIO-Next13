"use client";

import { Form, Input, InputNumber, Modal, Select, SelectProps } from "antd";

interface Values {
  _id: string;
  code: string;
  key: string;
  materialName: string;
  enterDate: string;
  category: string;
  costPerUnit: number;
  unitsTotal: number;
  minimumExistence: number;
  unitMeasure: string;
}
interface CollectionCreateFormProps {
  open: boolean;
  onCreate: (values: Values) => void;
  onCancel: () => void;
  defaultValues?: Values;
}

export const MinusMaterialForm: React.FC<CollectionCreateFormProps> = ({ open, onCreate, onCancel, defaultValues }) => {
  const [form] = Form.useForm();
  return (
    <Modal
      className="flex flex-col"
      title={
        <div className="flex w-full justify-center">
          <span className="font-black text-lg">Sustraer Material</span>
        </div>
      }
      centered
      open={open}
      style={{ textAlign: "left" }}
      destroyOnClose
      onOk={() => {
        form
          .validateFields()
          .then((values) => {
            onCreate(values);
            form.resetFields();
          })
          .catch((error) => {
            console.log("Validate Failed:", error);
          });
      }}
      onCancel={onCancel}
      okType="default"
      okText="Editar"
      cancelText="Cancelar"
    >
      <Form
        form={form}
        layout="vertical"
        name="editWarehouseForm"
        size="middle"
        fields={[
          {
            name: "category",
            value: defaultValues?.category,
          },
          {
            name: "materialName",
            value: defaultValues?.materialName,
          },
          {
            name: "costPerUnit",
            value: defaultValues?.costPerUnit,
          },
          {
            name: "unitMeasure",
            value: defaultValues?.unitMeasure,
          },
          {
            name: "minimumExistence",
            value: defaultValues?.minimumExistence,
          },
        ]}
      >
        <Form.Item name="category" label="Categoría">
          <Select allowClear style={{ width: "100%" }} disabled />
        </Form.Item>
        <Form.Item name="materialName" label="Nombre del material" >
          <Input disabled />
        </Form.Item>
        <Form.Item name="costPerUnit" label="Costo por unidad de medida">
          <InputNumber className="w-full" disabled />
        </Form.Item>
        <Form.Item name="unitMeasure" label="Unidad de medida">
          <Select allowClear style={{ width: "100%" }} disabled />
        </Form.Item>
        <Form.Item name="unitsTotal" label="Cantidad a sustraer">
          <InputNumber className="w-full" />
        </Form.Item>
        <Form.Item name="minimumExistence" label="Existencias mínimas">
          <InputNumber className="w-full" disabled />
        </Form.Item>
      </Form>
    </Modal>
  );
};

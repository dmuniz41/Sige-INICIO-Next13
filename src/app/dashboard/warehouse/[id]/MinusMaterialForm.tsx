"use client";

import { Form, Input, InputNumber, Modal, Select } from "antd";

interface Values {
  _id: string;
  category: string;
  code: string;
  costPerUnit: number;
  description: string;
  enterDate: string;
  key: string;
  materialName: string;
  minimumExistence: number;
  provider: string;
  unitMeasure: string;
  unitsTotal: number;
}
interface CollectionCreateFormProps {
  open: boolean;
  onCreate: (values: Values) => void;
  onCancel: () => void;
  defaultValues?: Values;
}

export const MinusMaterialForm: React.FC<CollectionCreateFormProps> = ({
  open,
  onCreate,
  onCancel,
  defaultValues
}) => {
  const [form] = Form.useForm();
  return (
    <Modal
      className="flex flex-col"
      title={
        <div className="flex w-full justify-center">
          <span className="font-bold text-lg">Sustraer Material</span>
        </div>
      }
      centered
      open={open}
      style={{ textAlign: "left" }}
      destroyOnClose
      onCancel={onCancel}
      okType="default"
      okText="Sustraer"
      cancelText="Cancelar"
      footer={[
        <div key="footer" className="flex gap-2 w-full justify-end">
          <button key="2" className="modal-btn-danger" onClick={onCancel}>
            Cancelar
          </button>
          <button
            key="1"
            className="modal-btn-primary "
            onClick={() => {
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
          >
            Sustraer
          </button>
        </div>
      ]}
    >
      <Form
        form={form}
        layout="vertical"
        name="editWarehouseForm"
        size="middle"
        fields={[
          {
            name: "category",
            value: defaultValues?.category
          },
          {
            name: "materialName",
            value: defaultValues?.materialName
          },
          {
            name: "description",
            value: defaultValues?.description
          },
          {
            name: "costPerUnit",
            value: defaultValues?.costPerUnit
          },
          {
            name: "unitMeasure",
            value: defaultValues?.unitMeasure
          },
          {
            name: "minimumExistence",
            value: defaultValues?.minimumExistence
          },
          {
            name: "provider",
            value: defaultValues?.provider
          }
        ]}
      >
        <Form.Item name="category" label="Categoría">
          <Select allowClear style={{ width: "100%" }} disabled />
        </Form.Item>
        <Form.Item name="materialName" label="Nombre del material">
          <Input disabled />
        </Form.Item>
        <Form.Item name="description" label="Descripción">
          <Input disabled />
        </Form.Item>
        <Form.Item name="costPerUnit" label="Costo por unidad de medida">
          <InputNumber min={0} className="w-full" disabled />
        </Form.Item>
        <Form.Item name="unitMeasure" label="Unidad de medida">
          <Select allowClear style={{ width: "100%" }} disabled />
        </Form.Item>
        <Form.Item name="unitsTotal" label="Cantidad a sustraer">
          <InputNumber min={0} className="w-full" />
        </Form.Item>
        <Form.Item name="minimumExistence" label="Existencias mínimas">
          <InputNumber min={0} className="w-full" disabled />
        </Form.Item>
        <Form.Item name="provider" label="Proveedor">
          <Select allowClear style={{ width: "100%" }} disabled />
        </Form.Item>
      </Form>
    </Modal>
  );
};

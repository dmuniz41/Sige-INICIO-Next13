"use client";

import { Form, Input, InputNumber, Modal } from "antd";

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

export const EditMinimumExistencesForm: React.FC<CollectionCreateFormProps> = ({ open, onCreate, onCancel, defaultValues }) => {
  const [form] = Form.useForm();
  return (
    <Modal
      className="flex flex-col"
      title={
        <div className="flex w-full justify-center">
          <span className="font-black text-lg">Editar Existencias Mínimas</span>
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
            name: "minimumExistence",
            value: defaultValues?.minimumExistence,
          },
          {
            name: "code",
            value: defaultValues?.code,
          },
        ]}
      >
        <Form.Item name="code" label="Código">
          <Input disabled />
        </Form.Item>
        <Form.Item name="minimumExistence" label="Existencias mínimas">
          <InputNumber className="w-full"/>
        </Form.Item>
      </Form>
    </Modal>
  );
};

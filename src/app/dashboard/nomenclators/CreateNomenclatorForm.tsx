"use client";

import { Form, Input, Modal, Select, SelectProps } from "antd";
interface Values {
  code: string;
  category: string;
}
interface CollectionCreateFormProps {
  open: boolean;
  onCreate: (values: Values) => void;
  onCancel: () => void;
}

const category: SelectProps["options"] = [
  {
    label: "Area de usuario",
    value: "Area de usuario",
  },
  {
    label: "Cargo de trabajador",
    value: "Cargo de trabajador",
  },
  {
    label: "Categoría de material",
    value: "Categoría de material",
  },
  {
    label: "Unidad de medida",
    value: "Unidad de medida",
  },
];
export const CreateNomenclatorForm: React.FC<CollectionCreateFormProps> = ({ open, onCreate, onCancel }) => {
  const [form] = Form.useForm();
  return (
    <Modal
      className="flex flex-col"
      title={
        <div className="flex w-full justify-center">
          <span className="font-black text-lg">Nuevo Nomenclador</span>
        </div>
      }
      style={{ textAlign: "left" }}
      centered
      open={open}
      destroyOnClose
      onOk={() => {
        form
          .validateFields()
          .then((values) => {
            onCreate(values);
            console.log("🚀 ~ file: CreateNomenclatorForm.tsx:51 ~ .then ~ values:", values)
            form.resetFields();
          })
          .catch((error) => {
            console.log("Validate Failed:", error);
          });
      }}
      onCancel={onCancel}
      okType="default"
      okText="Crear"
      cancelText="Cancelar"
    >
      <Form form={form} layout="vertical" name="createUserForm" size="middle">
        <Form.Item name="category" label="Categoría" rules={[{ required: true, message: "Campo requerido" }]}>
          <Select allowClear style={{ width: "100%" }} options={category} />
        </Form.Item>
        <Form.Item name="code" label="Código" rules={[{ required: true, message: "Campo requerido" }]}>
          <Input />
        </Form.Item>
      </Form>
    </Modal>
  );
};

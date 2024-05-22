"use client";

import { Button, Form, Input, Modal, Select, SelectProps } from "antd";
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
  {
    label: "Proveedor",
    value: "Proveedor",
  },
  {
    label: "Categoría de tarifas",
    value: "Categoría de tarifas",
  },
  {
    label: "Categoría de tarea",
    value: "Categoría de tarea",
  },
  {
    label: "Moneda",
    value: "Moneda",
  },
];
export const CreateNomenclatorForm: React.FC<CollectionCreateFormProps> = ({ open, onCreate, onCancel }) => {
  const [form] = Form.useForm();
  return (
    <Modal
      className="flex flex-col"
      title={
        <div className="flex w-full justify-center">
          <span className="font-bold text-lg">Nuevo Nomenclador</span>
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
            className="modal-btn-danger "
            onClick={onCancel}
          >
            Cancelar
          </button>
          <button
            key="1"
            className="modal-btn-primary  "
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
            Crear
          </button>
        </div>,
      ]}
    >
      <Form form={form} layout="vertical" name="createNomenclatorForm" size="middle">
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

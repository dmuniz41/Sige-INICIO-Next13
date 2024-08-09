"use client";

import { INomenclator } from "@/models/nomenclator";
import { Form, Input, Modal, Select, SelectProps } from "antd";

interface CollectionCreateFormProps {
  open: boolean;
  onCreate: (values: INomenclator) => void;
  onCancel: () => void;
  defaultValues?: INomenclator;
}

const category: SelectProps["options"] = [
  {
    label: "Area de usuario",
    value: "Area de usuario"
  },
  {
    label: "Cargo de trabajador",
    value: "Cargo de trabajador"
  },
  {
    label: "Categoría de material",
    value: "Categoría de material"
  },
  {
    label: "Unidad de medida",
    value: "Unidad de medida"
  }
];

export const EditNomenclatorForm: React.FC<CollectionCreateFormProps> = ({
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
          <span className="font-semibold text-lg">Editar Nomenclador</span>
        </div>
      }
      centered
      open={open}
      style={{ textAlign: "left" }}
      destroyOnClose
      onCancel={onCancel}
      okType="default"
      okText="Editar"
      cancelText="Cancelar"
      footer={[
        <div key="footer" className="flex gap-2 w-full justify-end">
          <button
            key="2"
            className="bg-danger-500 cursor-pointer hover:bg-danger-600 ease-in-out duration-300 w-[5rem] h-[2rem] flex items-center p-1 text-sm font-semibold text-white-100  justify-center gap-2 rounded-md"
            onClick={onCancel}
          >
            Cancelar
          </button>
          <button
            key="1"
            className="bg-success-500 cursor-pointer hover:bg-success-600 ease-in-out duration-300 w-[5rem] h-[2rem] flex items-center p-1 text-sm font-semibold text-white-100  justify-center gap-2 rounded-md "
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
            Editar
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
            name: "code",
            value: defaultValues?.code
          }
        ]}
      >
        <Form.Item
          name="category"
          label="Categoría"
          rules={[{ required: true, message: "Campo requerido" }]}
        >
          <Select disabled allowClear style={{ width: "100%" }} options={category} />
        </Form.Item>
        <Form.Item
          name="code"
          label="Código"
          rules={[{ required: true, message: "Campo requerido" }]}
        >
          <Input />
        </Form.Item>
      </Form>
    </Modal>
  );
};

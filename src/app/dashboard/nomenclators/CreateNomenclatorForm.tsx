"use client";

import { useNomenclator } from "@/hooks/nomenclators/useNomenclator";
import { Form, Input, Modal, Select, SelectProps } from "antd";
interface CollectionCreateFormProps {
  open: boolean;
  onCancel: () => void;
}

const category: SelectProps["options"] = [
  {
    label: "Area de usuario",
    value: "N_AU"
  },
  {
    label: "Cargo de trabajador",
    value: "N_CT"
  },
  {
    label: "Unidad de medida",
    value: "N_UM"
  },
  {
    label: "Proveedor",
    value: "N_PRO"
  },
  {
    label: "Categoría de tarifas",
    value: "N_CTA"
  },
  {
    label: "Categoría de tareas",
    value: "N_CTE"
  },
  {
    label: "Moneda",
    value: "N_MO"
  }
];

export const CreateNomenclatorForm: React.FC<CollectionCreateFormProps> = ({ open, onCancel }) => {
  const [form] = Form.useForm();

  const { useCreateNomenclator } = useNomenclator();
  const mutation = useCreateNomenclator();

  return (
    <Modal
      className="flex flex-col"
      title={
        <div className="flex w-full justify-center">
          <span className="font-semibold text-lg">Nuevo Nomenclador</span>
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
          <button key="2" className="modal-btn-danger " onClick={onCancel}>
            Cancelar
          </button>
          <button
            key="1"
            className="modal-btn-primary  "
            onClick={() => {
              form
                .validateFields()
                .then((values) => {
                  const selectedCategory = category.find((item) => item.value === values.category);
                  const payload = {
                    ...values,
                    categoryCode: values.category,
                    category: selectedCategory?.label || ""
                  };

                  mutation.mutate(payload);
                  form.resetFields();
                  onCancel();
                })
                .catch((error) => {
                  console.log("Validate Failed:", error);
                });
            }}
          >
            Crear
          </button>
        </div>
      ]}
    >
      <Form form={form} layout="vertical" name="createNomenclatorForm" size="middle">
        <Form.Item name="category" label="Categoría" rules={[{ required: true, message: "Campo requerido" }]}>
          <Select allowClear style={{ width: "100%" }} options={category} />
        </Form.Item>
        <Form.Item name="value" label="Valor" rules={[{ required: true, message: "Campo requerido" }]}>
          <Input />
        </Form.Item>
      </Form>
    </Modal>
  );
};

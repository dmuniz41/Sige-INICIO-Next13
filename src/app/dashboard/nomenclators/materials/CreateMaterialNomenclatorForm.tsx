"use client";

import { MaterialCategoryNomenclators } from "@/db/migrations/schema";
import { useMaterialCategoryNomenclator } from "@/hooks/nomenclators/materialCategory/useMaterialCategoryNomenclator";
import { Checkbox, Form, Input, Modal } from "antd";
import { useState } from "react";

interface CollectionCreateFormProps {
  open: boolean;
  onCancel: () => void;
}

export const CreateMaterialNomenclatorForm: React.FC<CollectionCreateFormProps> = ({ open, onCancel }) => {
  const [form] = Form.useForm();

  const { useCreateMaterialCategoryNomenclator } = useMaterialCategoryNomenclator();
  const mutation = useCreateMaterialCategoryNomenclator();

  const [isDecrease, setIsDecrease] = useState<boolean>(false);
  return (
    <Modal
      className="flex flex-col"
      title={
        <div className="flex w-full justify-center">
          <span className="font-semibold text-lg">Nueva Categoría de Material</span>
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
      width={"600px"}
      footer={[
        <div key="footer" className="flex gap-2 w-full ...values, justify-end">
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
                  mutation.mutate({
                    code: "",
                    category: "N_MC",
                    value: values.value,
                    isDecrease: isDecrease
                  });
                  setIsDecrease(false);
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
      <Form form={form} layout="vertical" name="createMaterialNomenclator" size="middle">
        <Form.Item name="value" label="Nombre" rules={[{ required: true, message: "Campo requerido" }]}>
          <Input />
        </Form.Item>
        <Form.Item name="isDecrease">
          <Checkbox checked={isDecrease} onChange={(e) => setIsDecrease(e.target.checked)}>
            Gastable
          </Checkbox>
        </Form.Item>
      </Form>
    </Modal>
  );
};

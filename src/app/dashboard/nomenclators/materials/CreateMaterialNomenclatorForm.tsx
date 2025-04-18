"use client";

import { CancelSvg } from "@/app/global/CancelSvg";
import { PlusSvg } from "@/app/global/PlusSvg";
import { MaterialNomenclators } from "@/db/migrations/schema";
import { useMaterialNomenclator } from "@/hooks/nomenclators/material/useMaterialNomenclator";
import { Checkbox, Form, Input, Modal } from "antd";
import { useState } from "react";

interface CollectionCreateFormProps {
  open: boolean;
  onCancel: () => void;
}

export const CreateMaterialNomenclatorForm: React.FC<CollectionCreateFormProps> = ({ open, onCancel }) => {
  const [form] = Form.useForm();
  const [isDecrease, setIsDecrease] = useState<boolean>(false);

  const { useCreateMaterialNomenclator } = useMaterialNomenclator();
  const mutation = useCreateMaterialNomenclator();


  return (
    <Modal
      className="flex flex-col"
      title={
        <div className="flex w-full justify-center">
          <span className="text-xl font-bold">Nuevo Nomenclador de Material</span>
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
          <button key="2" className="filter-modal-btn-danger" onClick={onCancel}>
            <CancelSvg /> Cancelar
          </button>
          <button
            key="1"
            className="filter-modal-btn-primary"
            onClick={() => {
              form
                .validateFields()
                .then((values) => {
                  mutation.mutate({
                    material_category: values.material_category,
                    material_name: values.material_name,
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
            <PlusSvg />
            Crear
          </button>
        </div>
      ]}
    >
      <Form form={form} layout="vertical" name="createMaterialNomenclator" size="large">
        <Form.Item
          name="material_category"
          label={<span className="text-lg font-bold">Categoría: </span>}
          rules={[{ required: true, message: "Campo requerido" }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name="material_name"
          label={<span className="text-lg font-bold">Nombre: </span>}
          rules={[{ required: true, message: "Campo requerido" }]}
        >
          <Input />
        </Form.Item>
        <Form.Item name="isDecrease">
          <Checkbox className="custom-checkbox" checked={isDecrease} onChange={(e) => setIsDecrease(e.target.checked)}>
            <span className="text-lg font-bold">Gastable</span>
          </Checkbox>
        </Form.Item>
      </Form>
    </Modal>
  );
};

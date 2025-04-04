"use client";
import { Checkbox, Form, Input, Modal } from "antd";
import { useEffect } from "react";

import { useMaterialNomenclator } from "@/hooks/nomenclators/material/useMaterialNomenclator";
import { MaterialNomenclators } from "@/db/migrations/schema";

interface CollectionCreateFormProps {
  open: boolean;
  onCancel: () => void;
  initialValues: MaterialNomenclators;
}

export const EditMaterialNomenclatorForm: React.FC<CollectionCreateFormProps> = ({ open, onCancel, initialValues }) => {
  const [form] = Form.useForm();

  const { useUpdateMaterialNomenclator } = useMaterialNomenclator();
  const mutation = useUpdateMaterialNomenclator();

  useEffect(() => {
    if (open) {
      form.resetFields();
      form.setFieldsValue({
        material_category: initialValues?.material_category,
        material_name: initialValues?.material_name,
        isDecrease: initialValues?.isDecrease
      });
    }
  }, [open, initialValues, form]);

  return (
    <Modal
      className="flex flex-col"
      title={
        <div className="flex w-full justify-center">
          <span className="font-semibold text-lg">Editar Nomenclador de Material</span>
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
        <div key="footer" className="flex gap-2 w-full justify-end">
          <button key="2" className="modal-btn-danger" onClick={onCancel}>
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
                    code: initialValues.code,
                    material_category: initialValues.material_category,
                    material_name: values.material_name,
                    isDecrease: values.isDecrease ?? false
                  });
                  form.resetFields();
                  onCancel();
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
      <Form form={form} layout="vertical" name="editMaterialNomenclator" size="middle">
        <Form.Item name="material_category" label="Categoría de material" rules={[{ required: true, message: "Campo requerido" }]}>
          <Input />
        </Form.Item>
        <Form.Item name="material_name" label="Nombre de material" rules={[{ required: true, message: "Campo requerido" }]}>
          <Input />
        </Form.Item>
        <Form.Item name="isDecrease" valuePropName="checked">
          <Checkbox>Gastable</Checkbox>
        </Form.Item>
      </Form>
    </Modal>
  );
};

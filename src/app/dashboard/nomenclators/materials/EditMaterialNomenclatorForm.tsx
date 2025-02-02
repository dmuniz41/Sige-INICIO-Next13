"use client";
import { Checkbox, Form, Input, Modal } from "antd";
import { useEffect } from "react";

import { useMaterialCategoryNomenclator } from "@/hooks/nomenclators/materialCategory/useMaterialCategoryNomenclator";
import { MaterialCategoryNomenclators } from "@/db/migrations/schema";

interface CollectionCreateFormProps {
  open: boolean;
  onCancel: () => void;
  initialValues: MaterialCategoryNomenclators;
}

export const EditMaterialNomenclatorForm: React.FC<CollectionCreateFormProps> = ({ open, onCancel, initialValues }) => {
  const [form] = Form.useForm();
  const { useUpdateMaterialCategoryNomenclator } = useMaterialCategoryNomenclator();

  const mutation = useUpdateMaterialCategoryNomenclator();

  useEffect(() => {
    if (open) {
      form.resetFields();
      form.setFieldsValue({
        value: initialValues?.value,
        isDecrease: initialValues?.isDecrease
      });
    }
  }, [open, initialValues, form]);

  return (
    <Modal
      className="flex flex-col"
      title={
        <div className="flex w-full justify-center">
          <span className="font-semibold text-lg">Editar Categoría de Material</span>
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
                    category: initialValues.category,
                    value: values.value,
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
        <Form.Item name="value" label="Nombre" rules={[{ required: true, message: "Campo requerido" }]}>
          <Input />
        </Form.Item>
        <Form.Item
          name="isDecrease"
          valuePropName="checked"
        >
          <Checkbox>Gastable</Checkbox>
        </Form.Item>
      </Form>
    </Modal>
  );
};

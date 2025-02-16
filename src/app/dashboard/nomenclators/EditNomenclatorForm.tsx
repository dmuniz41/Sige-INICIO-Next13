"use client";

import { useNomenclator } from "@/hooks/nomenclators/useNomenclator";
import { UpdateNomenclator } from "@/types/DTOs/nomenclators/nomenclators";
import { Form, Input, Modal } from "antd";
import { useEffect } from "react";

interface CollectionCreateFormProps {
  open: boolean;
  onCancel: () => void;
  initialValues: UpdateNomenclator;
}

export const EditNomenclatorForm: React.FC<CollectionCreateFormProps> = ({ open, onCancel, initialValues }) => {
  const [form] = Form.useForm();

  const { useUpdateNomenclator } = useNomenclator();
  const mutation = useUpdateNomenclator();

  useEffect(() => {
    if (open) {
      form.resetFields();
      form.setFieldsValue({
        ...initialValues
      });
    }
  }, [open, initialValues, form]);

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
                  mutation.mutate({
                    ...values,
                    id: initialValues.id,
                    category: initialValues.category,
                    categoryCode: initialValues.categoryCode
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
      <Form form={form} layout="vertical" name="editNomenclatorForm" size="middle">
        {/* <Form.Item name="category" label="Categoría" rules={[{ required: true, message: "Campo requerido" }]}>
          <Select disabled allowClear style={{ width: "100%" }} options={category} />
        </Form.Item> */}
        <Form.Item name="value" label="Valor" rules={[{ required: true, message: "Campo requerido" }]}>
          <Input />
        </Form.Item>
      </Form>
    </Modal>
  );
};

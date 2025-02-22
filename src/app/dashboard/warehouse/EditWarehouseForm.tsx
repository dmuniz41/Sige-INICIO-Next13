"use client";
import { Form, Input, Modal } from "antd";
import { useEffect } from "react";

import { useWarehouse } from "@/hooks/warehouse/useWarehouse";
import { Warehouse } from "@/db/migrations/schema";

interface CollectionCreateFormProps {
  open: boolean;
  onCancel: () => void;
  initialValues: Warehouse;
}

export const EditWarehouseForm: React.FC<CollectionCreateFormProps> = ({ open, onCancel, initialValues }) => {
  const [form] = Form.useForm();

  const { useUpdateWarehouse } = useWarehouse();
  const mutation = useUpdateWarehouse();

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
          <span className="font-semibold text-lg">Actualizar Almacén</span>
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
          <button key="2" className="modal-btn-danger" onClick={onCancel}>
            Cancelar
          </button>
          <button
            key="1"
            className="modal-btn-primary "
            onClick={() => {
              form
                .validateFields()
                .then((values) => {
                  mutation.mutate({ values: values, id: initialValues.id });
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
      <Form form={form} layout="vertical" name="editWarehouseForm" size="middle">
        <Form.Item name="name" label="Nombre de Almacén" rules={[{ required: true, message: "Campo requerido" }]}>
          <Input />
        </Form.Item>
      </Form>
    </Modal>
  );
};

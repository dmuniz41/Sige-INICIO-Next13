"use client";
import { ClientNomenclator } from "@/db/migrations/schema";
import { useClient } from "@/hooks/nomenclators/clients/useClient";
import { Form, Input, InputNumber, Modal } from "antd";
import { useEffect } from "react";
interface CollectionCreateFormProps {
  open: boolean;
  onCancel: () => void;
  initialValues: ClientNomenclator;
}

export const EditClientNomenclatorForm: React.FC<CollectionCreateFormProps> = ({ open, onCancel, initialValues }) => {
  const [form] = Form.useForm();

  const { useUpdateClient } = useClient();
  const mutation = useUpdateClient();

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
          <span className="font-semibold text-lg">Editar Cliente</span>
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
                  mutation.mutate({ ...values, idnumber: initialValues.idNumber });
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
      <Form form={form} layout="vertical" name="editClientNomenclator" size="middle">
        <Form.Item name="name" label="Nombre" rules={[{ required: true, message: "Campo requerido" }]}>
          <Input />
        </Form.Item>
        <Form.Item name="contact" label="Persona de contacto" rules={[{ required: true, message: "Campo requerido" }]}>
          <Input />
        </Form.Item>
        <Form.Item name="address" label="Domicilio Legal" rules={[{ required: false }]}>
          <Input />
        </Form.Item>
        <Form.Item name="email" label="Correo Electrónico" rules={[{ required: false }]}>
          <Input />
        </Form.Item>
        <Form.Item name="phoneNumber" label="Teléfono" rules={[{ required: false }]}>
          <InputNumber min={0} className="w-[50%]" />
        </Form.Item>
      </Form>
    </Modal>
  );
};

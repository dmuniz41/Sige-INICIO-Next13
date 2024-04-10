"use client";

import { IClientNomenclator } from "@/models/nomenclators/client";
import { Form, Input, Modal } from "antd";

interface CollectionCreateFormProps {
  open: boolean;
  onCreate: (values: IClientNomenclator) => void;
  onCancel: () => void;
}

export const CreateClientNomenclatorForm: React.FC<CollectionCreateFormProps> = ({
  open,
  onCreate,
  onCancel
}) => {
  const [form] = Form.useForm();
  return (
    <Modal
      className="flex flex-col"
      title={
        <div className="flex w-full justify-center">
          <span className="font-bold text-lg">Nuevo Cliente</span>
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
        </div>
      ]}
    >
      <Form form={form} layout="vertical" name="createClientNomenclator" size="middle">
        <Form.Item
          name="name"
          label="Nombre"
          rules={[{ required: true, message: "Campo requerido" }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name="contactPerson"
          label="Persona de contacto"
          rules={[{ required: true, message: "Campo requerido" }]}
        >
          <Input />
        </Form.Item>
        <Form.Item name="address" label="Domicilio Legal" rules={[{ required: false }]}>
          <Input />
        </Form.Item>
        <Form.Item name="email" label="Correo Electrónico" rules={[{ required: false }]}>
          <Input />
        </Form.Item>
        <Form.Item name="phoneNumber" label="Teléfono" rules={[{ required: false }]}>
          <Input />
        </Form.Item>
      </Form>
    </Modal>
  );
};

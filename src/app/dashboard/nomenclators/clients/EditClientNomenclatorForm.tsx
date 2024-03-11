"use client";

import { IClientNomenclator } from "@/models/nomenclators/client";
import { Button, Form, Input, Modal, Select, SelectProps } from "antd";
interface Values {
  code: string;
  category: string;
}
interface CollectionCreateFormProps {
  open: boolean;
  onCreate: (values: IClientNomenclator) => void;
  onCancel: () => void;
  defaultValues: IClientNomenclator
}

export const EditClientNomenclatorForm: React.FC<CollectionCreateFormProps> = ({
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
            Editar
          </button>
        </div>
      ]}
    >
      <Form
        form={form}
        layout="vertical"
        name="editClientNomenclator"
        size="middle"
        fields={[
          {
            name: "name",
            value: defaultValues?.name
          },
          {
            name: "address",
            value: defaultValues?.address
          },
          {
            name: "email",
            value: defaultValues?.email
          },
          {
            name: "idNumber",
            value: defaultValues?.idNumber
          },
          {
            name: "phoneNumber",
            value: defaultValues?.phoneNumber
          }
        ]}
      >
        <Form.Item
          name="name"
          label="Nombre del Cliente"
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
        <Form.Item
          name="idNumber"
          label="Número de Cliente"
          rules={[{ required: true, message: "Campo requerido" }]}
        >
          <Input />
        </Form.Item>
        <Form.Item name="phoneNumber" label="Teléfono" rules={[{ required: false }]}>
          <Input />
        </Form.Item>
      </Form>
    </Modal>
  );
};

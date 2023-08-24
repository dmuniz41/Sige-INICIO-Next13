"use client";

import { Form, Input, Modal, Select } from "antd";
import { useState } from "react";

const ROLES = ["ADMINISTRADOR", "COMMERCIAL", "CHOFER", "MONTADOR", "IMPRESIÓN", "ROUTER"];

interface Values {
  key: string;
  name: string;
  CI: number;
  role: string[];
  address: string;
  phoneNumber: number;
  bankAccount: number;
}
interface CollectionCreateFormProps {
  open: boolean;
  onCreate: (values: Values) => void;
  onCancel: () => void;
}

export const CreateWorkerForm: React.FC<CollectionCreateFormProps> = ({ open, onCreate, onCancel }) => {
  const [selectedRoles, setSelectedRoles] = useState<string[]>([]);

  const filteredRoles = ROLES.filter((o) => !selectedRoles.includes(o));
  const [form] = Form.useForm();
  return (
    <Modal
      className="flex flex-col font-black"
      title="Nuevo Trabajador"
      centered
      open={open}
      style={{ textAlign: "center" }}
      destroyOnClose
      onOk={() => {
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
      onCancel={onCancel}
      okType="default"
      okText="Crear"
      cancelText="Cancelar"
    >
      <Form form={form} layout="vertical" name="createUserForm" size="middle">
        <Form.Item name="name" label="Nombre" rules={[{ required: true, message: "Campo requerido" }]}>
          <Input />
        </Form.Item>
        <Form.Item name="CI" label="Carnet de Identidad" rules={[{ required: true, message: "Campo requerido" }]}>
          <Input />
        </Form.Item>
        <Form.Item name="role" label="Cargos" rules={[{ required: true, message: "Campo requerido" }]}>
          <Select
            mode="multiple"
            value={selectedRoles}
            onChange={setSelectedRoles}
            style={{ width: "100%" }}
            options={filteredRoles.map((item) => ({
              value: item,
              label: item,
            }))}
          />
        </Form.Item>
        <Form.Item name="address" label="Dirección" rules={[{ required: true, message: "Campo requerido" }]}>
          <Input />
        </Form.Item>
        <Form.Item name="phoneNumber" label="Teléfono" rules={[{ required: true, min: 7, message: "Campo requerido" }]}>
          <Input />
        </Form.Item>
        <Form.Item name="bankAccount" label="Cuenta Bancaria" rules={[{ required: true, message: "Campo requerido" }]}>
          <Input />
        </Form.Item>
      </Form>
    </Modal>
  );
};

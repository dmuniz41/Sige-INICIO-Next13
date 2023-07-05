"use client";

import { ConfigProvider, Form, Input, Modal, Select } from "antd";
import { useState } from "react";

const PRIVILEGES = ["ADMIN", "COMMERCIAL", "USER", "HR", "PROJECT", "WAREHOUSE", "OFFICE"];

interface Values {
  user: string;
  userName: string;
  lastName: string;
  password: string;
  privileges: string[];
  area: string;
}
interface CollectionCreateFormProps {
  open: boolean;
  onCreate: (values: Values) => void;
  onCancel: () => void;
}

const validateMessages = {
  required: "Campo requerido",
  min: "Debe tener al menos 6 caractéres",
};

export const CreateUserForm: React.FC<CollectionCreateFormProps> = ({ open, onCreate, onCancel }) => {
  const [selectedPrivileges, setSelectedPrivileges] = useState<string[]>(["ADMIN"]);

  const filteredPrivileges = PRIVILEGES.filter((privilege) => !selectedPrivileges.includes(privilege));
  const [form] = Form.useForm();
  return (
    <Modal
      className="flex flex-col"
      title="Nuevo Usuario"
      centered
      open={open}
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
      <ConfigProvider form={{ validateMessages }}>
        <Form form={form} layout="vertical" name="createUserForm" size="large">
          <Form.Item name="user" label="Usuario" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="userName" label="Nombre" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="lastName" label="Apellidos" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="password" label="Contraseña" rules={[{ required: true, min: 7 }]}>
            <Input type="password" />
          </Form.Item>
          <Form.Item
            name="confirmPassword"
            label="Confirmar Contraseña"
            dependencies={["password"]}
            hasFeedback
            rules={[
              { min: 7, required: true, message: "Las contraseñas deben ser iguales" },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue("password") === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(new Error("Las contraseñas deben ser iguales"));
                },
              }),
            ]}
          >
            <Input type="password" />
          </Form.Item>
          <Form.Item name="privileges" label="Privilegios" rules={[{ required: true }]}>
            <Select
              mode="multiple"
              placeholder="Privilegios"
              value={selectedPrivileges}
              onChange={(p: string[]) => {
                setSelectedPrivileges(p as string[]);
              }}
              options={filteredPrivileges.map((item) => ({
                value: item,
                label: item,
              }))}
            />
          </Form.Item>
          <Form.Item name="area" label="Área" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
        </Form>
      </ConfigProvider>
    </Modal>
  );
};

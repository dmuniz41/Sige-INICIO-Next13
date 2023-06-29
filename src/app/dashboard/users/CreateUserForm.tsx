"use client";

import { Form, Input, Modal, Select } from "antd";
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

// const PrivilegesSelect: React.FC = () => {
//   const [selectedPrivileges, setSelectedPrivileges] = useState<string[]>(['ADMIN']);

//   const filteredPrivileges = PRIVILEGES.filter((privilege) => !selectedPrivileges.includes(privilege));

//   return (
//     <Select
//       mode="multiple"
//       placeholder="Privilegios"
//       value={selectedPrivileges}
//       onChange={(p: string[]) => {
//         console.log(p);
//         setSelectedPrivileges(p as string[])
//       }}
//       options={filteredPrivileges.map((item) => ({
//         value: item,
//         label: item,
//       }))}
//     />
//   );
// };

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
          .catch((info) => {
            console.log("Validate Failed:", info);
          });
      }}
      onCancel={onCancel}
      okType="default"
      okText="Crear"
      cancelText="Cancelar"
    >
      <Form form={form} layout="vertical" name="createUserForm">
        <Form.Item name="user" label="Usuario" rules={[{ required: true, message: "Por favor introduzca el usuario" }]}>
          <Input />
        </Form.Item>
        <Form.Item name="userName" label="Nombre" rules={[{ required: true, message: "Por favor introduzca el nombre" }]}>
          <Input />
        </Form.Item>
        <Form.Item name="lastName" label="Apellidos" rules={[{ required: true, message: "Por favor introduzca los apellidos" }]}>
          <Input />
        </Form.Item>
        <Form.Item name="password" label="Contraseña" rules={[{ required: true, message: "Por favor introduzca la contraseña" }]}>
          <Input type="password" />
        </Form.Item>
        <Form.Item name="confirmPassword" label="Confirmar Contraseña" rules={[{ required: true, message: "Por favor introduzca la contraseña" }]}>
          <Input type="password" />
        </Form.Item>
        <Form.Item name="privileges" label="Privilegios" rules={[{ required: true, message: "Seleccione un privilegio" }]}>
          <Select
            mode="multiple"
            placeholder="Privilegios"
            value={selectedPrivileges}
            onChange={(p: string[]) => {
              console.log(p);
              setSelectedPrivileges(p as string[]);
            }}
            options={filteredPrivileges.map((item) => ({
              value: item,
              label: item,
            }))}
          />
        </Form.Item>
        <Form.Item name="area" label="Área" rules={[{ required: true, message: "Por favor introduzca el área" }]}>
          <Input />
        </Form.Item>
      </Form>
    </Modal>
  );
};

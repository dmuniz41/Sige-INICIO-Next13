"use client";

import { Form, Input, Modal, Select, SelectProps } from "antd";

interface Values {
  user: string;
  userName: string;
  lastName: string;
  password?: string;
  privileges: string[];
  area: string;
}
interface CollectionCreateFormProps {
  open: boolean;
  onCreate: (values: Values) => void;
  onCancel: () => void;
  defaultValues?: Values;
}
const options: SelectProps["options"] = [
  {
    label: "ADMIN",
    value: "ADMIN",
  },
  {
    label: "COMMERCIAL",
    value: "COMMERCIAL",
  },
  {
    label: "HR",
    value: "HR",
  },
  {
    label: "PROJECT",
    value: "PROJECT",
  },
  {
    label: "WAREHOUSE",
    value: "WAREHOUSE",
  },
  {
    label: "OFFICE",
    value: "OFFICE",
  },
];

export const EditUserForm: React.FC<CollectionCreateFormProps> = ({ open, onCreate, onCancel, defaultValues }) => {

  const handleChange = (value: string[]) => {
    console.log(`selected ${value}`);
  };

  const [form] = Form.useForm();
  return (
    <Modal
      className="flex flex-col font-black"
      title="Editar Usuario"
      centered
      open={open}
      style={{textAlign: "center"}}
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
      okText="Editar"
      cancelText="Cancelar"
    >
      <Form
        form={form}
        layout="vertical"
        name="editUserForm"
        size="middle"
        fields={[
          {
            name: "user",
            value: defaultValues?.user,
          },
          {
            name: "userName",
            value: defaultValues?.userName,
          },
          {
            name: "lastName",
            value: defaultValues?.lastName,
          },
          {
            name: "privileges",
            value: defaultValues?.privileges,
          },
          {
            name: "area",
            value: defaultValues?.area,
          },
        ]}
      >
        <Form.Item name="user" label="Usuario" rules={[{ required: true, message: "Campo requerido" }]}>
          <Input />
        </Form.Item>
        <Form.Item name="userName" label="Nombre" rules={[{ required: true, message: "Campo requerido" }]}>
          <Input />
        </Form.Item>
        <Form.Item name="lastName" label="Apellidos" rules={[{ required: true, message: "Campo requerido" }]}>
          <Input />
        </Form.Item>
        <Form.Item name="password" label="Contraseña" hasFeedback rules={[{ required: true, min: 7, message: "Campo requerido" }]}>
          <Input type="password" />
        </Form.Item>
        <Form.Item
          name="Contraseña"
          label="Confirmar Contraseña"
          dependencies={["password"]}
          hasFeedback
          rules={[
            { min: 7, required: true, message: "Campo requerido" },
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

        <Form.Item name="privileges" label="Privilegios" rules={[{ required: true, message: "Campo requerido" }]}>
          <Select mode="multiple" allowClear style={{ width: "100%" }} onChange={handleChange} options={options} />
        </Form.Item>
        <Form.Item name="area" label="Área" rules={[{ required: true, message: "Campo requerido" }]}>
          <Input />
        </Form.Item>
      </Form>
    </Modal>
  );
};

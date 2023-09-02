"use client";

import { Form, Input, Modal, Select, SelectProps } from "antd";

interface Values {
  _id: string,
  CI: number,
  name: string,
  address: string,
  bankAccount: number,
  phoneNumber: number,
  role: string[]
}
interface CollectionCreateFormProps {
  open: boolean;
  onCreate: (values: Values) => void;
  onCancel: () => void;
  defaultValues?: Values;
}
const options: SelectProps["options"] = [
  {
    label: "ADMINISTRADOR",
    value: "ADMINISTRADOR",
  },
  {
    label: "COMMERCIAL",
    value: "COMMERCIAL",
  },
  {
    label: "CHOFER",
    value: "CHOFER",
  },
  {
    label: "MONTADOR",
    value: "MONTADOR",
  },
  {
    label: "IMPRESION",
    value: "IMPRESION",
  },
  {
    label: "ROUTER",
    value: "ROUTER",
  },
];

export const EditWorkerForm: React.FC<CollectionCreateFormProps> = ({ open, onCreate, onCancel, defaultValues }) => {

  const [form] = Form.useForm();
  return (
    <Modal
      className="flex flex-col font-black"
      title="Editar Trabajador"
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
            name: "CI",
            value: defaultValues?.CI,
          },
          {
            name: "address",
            value: defaultValues?.address,
          },
          {
            name: "name",
            value: defaultValues?.name,
          },
          {
            name: "bankAccount",
            value: defaultValues?.bankAccount,
          },
          {
            name: "phoneNumber",
            value: defaultValues?.phoneNumber,
          },
          {
            name: "role",
            value: defaultValues?.role,
          },
        ]}
      >
        <Form.Item name="CI" label="Carnet de identidad" rules={[{ required: true, message: "Campo requerido" }]}>
          <Input />
        </Form.Item>
        <Form.Item name="name" label="Nombre" rules={[{ required: true, message: "Campo requerido" }]}>
          <Input />
        </Form.Item>
        <Form.Item name="address" label="Dirección" rules={[{ required: true, message: "Campo requerido" }]}>
          <Input />
        </Form.Item>
        <Form.Item name="bankAccount" label="Cuenta Bancaria"  rules={[{ required: true,  message: "La cuenta bancaria debe tener 16 numeros" }]}>
          <Input />
        </Form.Item>
        <Form.Item name="phoneNumber" label="Teléfono"  rules={[{ required: true, message: "El telefono debe tener al menos 7 numeros" }]}>
          <Input />
        </Form.Item>
        <Form.Item name="role" label="Cargos" rules={[{ required: true, message: "Campo requerido" }]}>
          <Select mode="multiple" allowClear style={{ width: "100%" }} options={options} />
        </Form.Item>
      </Form>
    </Modal>
  );
};

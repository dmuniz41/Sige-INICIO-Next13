"use client";

import { InfoCircleOutlined } from "@ant-design/icons";
import { Form, Input, InputNumber, Modal, Select, SelectProps } from "antd";

interface Values {
  _id: string;
  CI: number;
  name: string;
  address: string;
  bankAccount: number;
  phoneNumber: number;
  role: string[];
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
      className="flex flex-col"
      title={<div className="flex w-full justify-center"><span className="font-black text-lg">Editar Trabajador</span></div>}
      centered
      open={open}
      style={{ textAlign: "left" }}
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
        <Form.Item name="name" label="Nombre y Apellidos" rules={[{ required: true, message: "Campo requerido" }]}>
          <Input />
        </Form.Item>
        <Form.Item
          messageVariables={{ CI: "Carnet de identidad" }}
          name="CI"
          label="Carnet de Identidad"
          rules={[{ required: true, message: "${CI} debe tener 11 números" }]}
          tooltip={{ title: "El carnet debe tener 11 números", icon: <InfoCircleOutlined /> }}
        >
          <InputNumber className="w-full" />
        </Form.Item>
        <Form.Item name="role" label="Cargos" rules={[{ required: true, message: "Campo requerido" }]}>
          <Select mode="multiple" allowClear style={{ width: "100%" }} options={options} />
        </Form.Item>
        <Form.Item name="address" label="Dirección" rules={[{ required: true, message: "Campo requerido" }]}>
          <Input />
        </Form.Item>
        <Form.Item
          messageVariables={{ phoneNumber: "Telefono" }}
          name="phoneNumber"
          label="Teléfono"
          rules={[{ required: true, message: "${phoneNumber} debe tener 8 números" }]}
          tooltip={{ title: "El telefono debe tener 8 números", icon: <InfoCircleOutlined /> }}
        >
          <InputNumber className="w-full"/>
        </Form.Item>
        <Form.Item
          messageVariables={{ bankAccount: "Cuenta bancaria" }}
          name="bankAccount"
          label="Cuenta Bancaria"
          rules={[{ required: true, message: "${bankAccount} debe tener 16 números" }]}
          tooltip={{ title: "La cuenta bancaria debe tener 16 números", icon: <InfoCircleOutlined /> }}
        >
          <InputNumber className="w-full" />
        </Form.Item>
      </Form>
    </Modal>
  );
};

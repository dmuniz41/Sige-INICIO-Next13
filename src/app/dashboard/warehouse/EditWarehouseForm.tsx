"use client";

import { Form, Input, Modal, Select, SelectProps } from "antd";

interface Values {
  name: string;
}
interface CollectionCreateFormProps {
  open: boolean;
  onCreate: (values: Values) => void;
  onCancel: () => void;
  defaultValues?: Values;
}

export const EditWarehouseForm: React.FC<CollectionCreateFormProps> = ({ open, onCreate, onCancel, defaultValues }) => {

  const [form] = Form.useForm();
  return (
    <Modal
      className="flex flex-col font-black"
      title="Editar Almacén"
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
        name="editWarehouseForm"
        size="middle"
        fields={[
          {
            name: "name",
            value: defaultValues?.name,
          },
          
        ]}
      >
        <Form.Item name="name" label="Nombre de Almacén" rules={[{ required: true, message: "Campo requerido" }]}>
          <Input />
        </Form.Item>

      </Form>
    </Modal>
  );
};

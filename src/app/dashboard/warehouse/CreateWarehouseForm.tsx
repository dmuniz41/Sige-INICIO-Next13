"use client";

import { Form, Input, Modal } from "antd";
interface Values {
  name: string;
}
interface CollectionCreateFormProps {
  open: boolean;
  onCreate: (values: Values) => void;
  onCancel: () => void;
}
export const CreateWarehouseForm: React.FC<CollectionCreateFormProps> = ({ open, onCreate, onCancel }) => {
  const [form] = Form.useForm();
  return (
    <Modal
      className="flex flex-col"
      title={<div className="flex w-full justify-center"><span className="font-black text-lg">Nuevo Almacén</span></div>}
      style={{ textAlign: "left" }}
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
      <Form form={form} layout="vertical" name="createUserForm" size="middle">
        <Form.Item name="name" label="Nombre de Almacén" rules={[{ required: true, message: "Campo requerido" }]}>
          <Input />
        </Form.Item>
      </Form>
    </Modal>
  );
};

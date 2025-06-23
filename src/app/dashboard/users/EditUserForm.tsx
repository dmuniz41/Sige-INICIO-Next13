"use client";
import { Form, Input, Modal, Select, Spin } from "antd";
import Title from "antd/es/typography/Title";

import { User } from "@/db/migrations/schema";
import { useUser } from "@/hooks/users/useUsers";
import { CancelActionModalBtn } from "@/app/global/CancelActionModalBtn";
import { SaveActionModalBtn } from "@/app/global/SaveActionModalBtn";
import { LoadingOutlined } from "@ant-design/icons";

interface CollectionCreateFormProps {
  open: boolean;
  onCancel: () => void;
  defaultValues: User;
}

export const EditUserForm: React.FC<CollectionCreateFormProps> = ({ open, onCancel, defaultValues }) => {
  const [form] = Form.useForm();
  const { useUpdateUser } = useUser();
  const { mutateAsync: updateUser, isPending } = useUpdateUser();

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      await updateUser({
        id: defaultValues?.id,
        values: {
          name: values.name,
          lastName: values.lastName,
          userName: values.userName,
          privileges: defaultValues?.privileges,
          password: defaultValues?.password,
          area: defaultValues?.area
        },
        accessToken: ""
      });
      onCancel();
    } catch (error: any) {
      console.log("Validate Failed:", error);
    }
  };

  const handleCancel = () => {
    console.log("Cancelar");
    form.resetFields();
    onCancel();
  };

  return (
    <Modal
      className="flex flex-col"
      title={
        <div className="grid w-full">
          <Title level={4}>Editar Usuario</Title>
          <div className="flex h-[1px] bg-gray-500 my-2"></div>
        </div>
      }
      style={{ textAlign: "left" }}
      centered
      open={open}
      destroyOnClose
      onCancel={onCancel}
      footer={[
        <div key="footer" className="flex gap-2 w-full justify-end">
          <CancelActionModalBtn onClick={handleCancel} />
          <SaveActionModalBtn onClick={handleSubmit} />
        </div>
      ]}
    >
      <Spin
        spinning={isPending}
        indicator={<LoadingOutlined style={{ fontSize: 80 }} spin />}
        size="large"
        fullscreen
        tip={<span className="text-xl font-bold">Cargando ...</span>}
      />
      <Form
        form={form}
        layout="vertical"
        name="editUserForm"
        size="large"
        fields={[
          {
            name: "name",
            value: defaultValues?.name
          },
          {
            name: "userName",
            value: defaultValues?.userName
          },
          {
            name: "lastName",
            value: defaultValues?.lastName
          },
          {
            name: "area",
            value: defaultValues?.area
          }
        ]}
      >
        <Form.Item name="name" label={<Title level={5}>Nombre</Title>} rules={[{ required: true, message: "Campo requerido" }]}>
          <Input />
        </Form.Item>
        <Form.Item name="lastName" label={<Title level={5}>Apellidos</Title>} rules={[{ required: true, message: "Campo requerido" }]}>
          <Input />
        </Form.Item>
        <Form.Item name="userName" label={<Title level={5}>Usuario</Title>} rules={[{ required: true, message: "Campo requerido" }]}>
          <Input />
        </Form.Item>
        <Form.Item name="area" label={<Title level={5}>Área</Title>} rules={[{ required: false, message: "Campo requerido" }]}>
          <Select mode="multiple" allowClear style={{ width: "100%" }} options={[]} />
        </Form.Item>
      </Form>
    </Modal>
  );
};

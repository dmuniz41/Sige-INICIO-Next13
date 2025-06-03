"use client";

import { CancelActionModalBtn } from "@/app/global/CancelActionModalBtn";
import { SaveActionModalBtn } from "@/app/global/SaveActionModalBtn";
import { useUser } from "@/hooks/users/useUsers";
import { EyeInvisibleOutlined, EyeTwoTone, LoadingOutlined } from "@ant-design/icons";
import { Form, Input, Modal, Select, SelectProps, Spin } from "antd";
import Title from "antd/es/typography/Title";

interface CollectionCreateFormProps {
  open: boolean;
  onCancel: () => void;
}

export const CreateUserForm: React.FC<CollectionCreateFormProps> = ({ open, onCancel }) => {
  const [form] = Form.useForm();
  const { useCreateUser } = useUser();
  const { mutateAsync: createUser, isPending } = useCreateUser();

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      await createUser(values);
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

  const privileges: SelectProps["options"] = [
    {
      label: "ADMINISTRADOR",
      value: "ADMIN"
    },
    {
      label: "COMERCIAL",
      value: "COMMERCIAL"
    },
    {
      label: "RECURSOS HUMANOS",
      value: "HR"
    },
    {
      label: "PROYECTOS",
      value: "PROJECT"
    },
    {
      label: "ALMACEN",
      value: "WAREHOUSE"
    },
    {
      label: "OFICINA",
      value: "OFFICE"
    },
    {
      label: "Crear Nomenclador",
      value: "Crear Nomenclador"
    },
    {
      label: "Editar Nomenclador",
      value: "Editar Nomenclador"
    },
    {
      label: "Eliminar Nomenclador",
      value: "Eliminar Nomenclador"
    },
    {
      label: "Listar Nomencladores",
      value: "Listar Nomencladores"
    },
    {
      label: "Crear Trabajador",
      value: "Crear Trabajador"
    },
    {
      label: "Editar Trabajador",
      value: "Editar Trabajador"
    },
    {
      label: "Eliminar Trabajador",
      value: "Eliminar Trabajador"
    },
    {
      label: "Listar Trabajadores",
      value: "Listar Trabajadores"
    },
    {
      label: "Crear Usuario",
      value: "Crear Usuario"
    },
    {
      label: "Editar Usuario",
      value: "Editar Usuario"
    },
    {
      label: "Eliminar Usuario",
      value: "Eliminar Usuario"
    },
    {
      label: "Listar Usuarios",
      value: "Listar Usuarios"
    },
    {
      label: "Crear Almacén",
      value: "Crear Almacén"
    },
    {
      label: "Editar Almacén",
      value: "Editar Almacén"
    },
    {
      label: "Eliminar Almacén",
      value: "Eliminar Almacén"
    },
    {
      label: "Listar Almacenes",
      value: "Listar Almacenes"
    },
    {
      label: "Listar Materiales",
      value: "Listar Materiales"
    },
    {
      label: "Añadir Material",
      value: "Añadir Material"
    },
    {
      label: "Sustraer Material",
      value: "Sustraer Material"
    },
    {
      label: "Nuevo Material",
      value: "Nuevo Material"
    },
    {
      label: "Editar Existencias Mínimas",
      value: "Editar Existencias Mínimas"
    },
    {
      label: "Eliminar Material",
      value: "Eliminar Material"
    }
  ];

  return (
    <Modal
      className="flex flex-col"
      title={
        <div className="grid w-full">
          <Title level={4}>Nuevo Usuario</Title>
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
        name="createUserForm"
        size="large"
        fields={[
          {
            name: "privileges",
            value: [""]
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
        <Form.Item
          name="password"
          label={<Title level={5}>Contraseña</Title>}
          hasFeedback
          rules={[{ required: true, min: 7, message: "Campo requerido" }]}
        >
          <Input.Password iconRender={(visible) => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)} />
        </Form.Item>
        <Form.Item
          name="Contraseña"
          label={<Title level={5}>Confirmar Contraseña</Title>}
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
              }
            })
          ]}
        >
          <Input.Password iconRender={(visible) => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)} />
        </Form.Item>
        <Form.Item
          className="hidden"
          name="privileges"
          label={<Title level={5}>Roles</Title>}
          rules={[{ required: true, message: "Campo requerido" }]}
        >
          <Select mode="multiple" allowClear style={{ width: "100%" }} options={[privileges]} />
        </Form.Item>
        <Form.Item name="area" label={<Title level={5}>Área</Title>} rules={[{ required: false, message: "Campo requerido" }]}>
          <Select mode="multiple" allowClear style={{ width: "100%" }} options={[]} />
        </Form.Item>
      </Form>
    </Modal>
  );
};

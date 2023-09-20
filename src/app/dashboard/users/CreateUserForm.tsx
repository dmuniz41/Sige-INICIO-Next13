"use client";

import { useAppDispatch } from "@/hooks/hooks";
import { INomenclator } from "@/models/nomenclator";
import { RootState, useAppSelector } from "@/store/store";
import { Form, Input, Modal, Select, SelectProps } from "antd";
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

export const CreateUserForm: React.FC<CollectionCreateFormProps> = ({ open, onCreate, onCancel }) => {
  const { nomenclators }: any = useAppSelector((state: RootState) => state?.nomenclator);
  const userArea: string[] | undefined = [];
  nomenclators.map((nomenclator: INomenclator) => {
    if (nomenclator.category === "Area de usuario") {
      userArea.push(nomenclator.code);
    }
  });
  const privileges: SelectProps["options"] = [
    {
      label: "ADMINISTRADOR",
      value: "ADMIN",
    },
    {
      label: "COMERCIAL",
      value: "COMMERCIAL",
    },
    {
      label: "RECURSOS HUMANOS",
      value: "HR",
    },
    {
      label: "PROYECTOS",
      value: "PROJECT",
    },
    {
      label: "ALMACEN",
      value: "WAREHOUSE",
    },
    {
      label: "OFICINA",
      value: "OFFICE",
    },
  ];

  const areas: SelectProps["options"] = userArea.map((area) => {
    return {
      label: `${area}`,
      value: `${area}`,
    };
  });

  const [form] = Form.useForm();
  return (
    <Modal
      className="flex flex-col"
      title={
        <div className="flex w-full justify-center">
          <span className="font-black text-lg">Nuevo Usuario</span>
        </div>
      }
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
          <Select mode="multiple" allowClear style={{ width: "100%" }} options={privileges} />
        </Form.Item>
        <Form.Item name="area" label="Área" rules={[{ required: true, message: "Campo requerido" }]}>
          <Select mode="multiple" allowClear style={{ width: "100%" }} options={areas} />
        </Form.Item>
      </Form>
    </Modal>
  );
};

"use client";
import { Form, Input, Modal, Select, SelectProps } from "antd";

import { INomenclator } from "@/models/nomenclator";
import { RootState, useAppSelector } from "@/store/store";
import { User } from "@/db/migrations/schema";

interface CollectionCreateFormProps {
  open: boolean;
  onCreate: (values: User) => void;
  onCancel: () => void;
  defaultValues?: User;
}

export const EditUserForm: React.FC<CollectionCreateFormProps> = ({ open, onCreate, onCancel, defaultValues }) => {
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

  const areas: SelectProps["options"] = userArea.map((area) => {
    return {
      label: `${area}`,
      value: `${area}`
    };
  });

  const [form] = Form.useForm();
  return (
    <Modal
      className="flex flex-col"
      title={
        <div className="flex w-full justify-center">
          <span className="font-semibold text-lg">Editar Usuario</span>
        </div>
      }
      centered
      open={open}
      style={{ textAlign: "left" }}
      destroyOnClose
      onCancel={onCancel}
      okType="default"
      okText="Editar"
      cancelText="Cancelar"
      footer={[
        <div key="footer" className="flex gap-2 w-full justify-end">
          <button key="2" className="modal-btn-danger" onClick={onCancel}>
            Cancelar
          </button>
          <button
            key="1"
            className="modal-btn-primary "
            onClick={() => {
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
          >
            Editar
          </button>
        </div>
      ]}
    >
      <Form
        form={form}
        layout="vertical"
        name="editUserForm"
        size="middle"
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
            name: "privileges",
            value: defaultValues?.privileges
          },
          {
            name: "area",
            value: defaultValues?.area
          }
        ]}
      >
        <Form.Item name="userName" label="Usuario" rules={[{ required: true, message: "Campo requerido" }]}>
          <Input />
        </Form.Item>
        <Form.Item name="name" label="Nombre" rules={[{ required: true, message: "Campo requerido" }]}>
          <Input />
        </Form.Item>
        <Form.Item name="lastName" label="Apellidos" rules={[{ required: true, message: "Campo requerido" }]}>
          <Input />
        </Form.Item>
        <Form.Item className="hidden" name="privileges" label="Privilegios" rules={[{ required: true, message: "Campo requerido" }]}>
          <Select mode="multiple" allowClear style={{ width: "100%" }} options={privileges} />
        </Form.Item>
        <Form.Item name="area" label="Área" rules={[{ required: true, message: "Campo requerido" }]}>
          <Select mode="multiple" allowClear style={{ width: "100%" }} options={areas} />
        </Form.Item>
      </Form>
    </Modal>
  );
};

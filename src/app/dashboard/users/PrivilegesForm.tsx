"use client";
import { Form, Input, Modal, Select, SelectProps } from "antd";

import { INomenclator } from "@/models/nomenclator";
import { IUser } from "@/models/user";
import { RootState, useAppSelector } from "@/store/store";

interface CollectionCreateFormProps {
  open: boolean;
  onCreate: (values: IUser) => void;
  onCancel: () => void;
  defaultValues?: IUser;
}

export const PrivilegesForm: React.FC<CollectionCreateFormProps> = ({
  open,
  onCreate,
  onCancel,
  defaultValues
}) => {
  const { nomenclators }: any = useAppSelector((state: RootState) => state?.nomenclator);
  const userArea: string[] | undefined = [];
  
  nomenclators.map((nomenclator: INomenclator) => {
    if (nomenclator.category === "Area de usuario") {
      userArea.push(nomenclator.code);
    }
  });

  const securityPrivileges: SelectProps["options"] = [
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
    }
  ];
  const nomenclatorPrivileges: SelectProps["options"] = [
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
    }
  ];
  const humanResourcesPrivileges: SelectProps["options"] = [
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
    }
  ];
  const warehousePrivileges: SelectProps["options"] = [
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
      label: "Listar Almacén",
      value: "Listar Almacén"
    }
  ];
  const materialPrivileges: SelectProps["options"] = [
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
      label: "Editar Material",
      value: "Editar Material"
    },
    {
      label: "Eliminar Material",
      value: "Eliminar Material"
    }
  ];
  const serviceFeePrivileges: SelectProps["options"] = [
    {
      label: "Listar Tarifas de Servicio",
      value: "Listar Tarifas de Servicio"
    },
    {
      label: "Crear Tarifas de Servicio",
      value: "Crear Tarifas de Servicio"
    },
    {
      label: "Editar Tarifas de Servicio",
      value: "Editar Tarifas de Servicio"
    },
    {
      label: "Eliminar Tarifas de Servicio",
      value: "Eliminar Tarifas de Servicio"
    }
  ];
  const projectPrivileges: SelectProps["options"] = [
    {
      label: "Listar Proyectos",
      value: "Listar Proyectos"
    },
    {
      label: "Crear Proyectos",
      value: "Crear Proyectos"
    },
    {
      label: "Editar Proyectos",
      value: "Editar Proyectos"
    },
    {
      label: "Eliminar Proyectos",
      value: "Eliminar Proyectos"
    }
  ];
  const costSheetPrivileges: SelectProps["options"] = [
    {
      label: "Listar Ficha de Costo",
      value: "Listar Ficha de Costo"
    },
    {
      label: "Crear Ficha de Costo",
      value: "Crear Ficha de Costo"
    },
    {
      label: "Editar Ficha de Costo",
      value: "Editar Ficha de Costo"
    },
    {
      label: "Eliminar Ficha de Costo",
      value: "Eliminar Ficha de Costo"
    }
  ];
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
    }
  ];
  const areas: SelectProps["options"] = [
    {
      label: "INICIO",
      value: "INICIO"
    },
    {
      label: "HP",
      value: "HP"
    }
  ];

  const [form] = Form.useForm();
  return (
    <Modal
      title={
        <div className="flex w-full justify-center">
          <span className="font-bold text-lg">Cambiar Permisos</span>
        </div>
      }
      centered
      open={open}
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
            className="modal-btn-primary"
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
        name="editPrivilegesForm"
        size="middle"
        fields={[
          {
            name: "user",
            value: defaultValues?.user
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
            name: "securityPrivileges",
            value: defaultValues?.privileges?.filter((privilege) => privilege.includes("Usuario"))
          },
          {
            name: "nomenclatorPrivileges",
            value: defaultValues?.privileges?.filter((privilege) =>
              privilege.includes("Nomenclador")
            )
          },
          {
            name: "humanResourcesPrivileges",
            value: defaultValues?.privileges?.filter((privilege) =>
              privilege.includes("Trabajador")
            )
          },
          {
            name: "warehousePrivileges",
            value: defaultValues?.privileges?.filter((privilege) => privilege.includes("Almacén"))
          },
          {
            name: "materialPrivileges",
            value: defaultValues?.privileges?.filter((privilege) => privilege.includes("Material"))
          },
          {
            name: "costSheetPrivileges",
            value: defaultValues?.privileges?.filter((privilege) =>
              privilege.includes("Ficha de Costo")
            )
          },
          {
            name: "serviceFeePrivileges",
            value: defaultValues?.privileges?.filter((privilege) =>
              privilege.includes("Tarifas de Servicio")
            )
          },
          {
            name: "projectPrivileges",
            value: defaultValues?.privileges?.filter((privilege) => privilege.includes("Proyectos"))
          },
          {
            name: "area",
            value: defaultValues?.area
          }
        ]}
      >
        <Form.Item
          className="hidden"
          name="user"
          label="Usuario"
          rules={[{ required: true, message: "Campo requerido" }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          className="hidden"
          name="userName"
          label="Nombre"
          rules={[{ required: true, message: "Campo requerido" }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          className="hidden"
          name="lastName"
          label="Apellidos"
          rules={[{ required: true, message: "Campo requerido" }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          className="hidden"
          name="area"
          label="Área"
          rules={[{ required: true, message: "Campo requerido" }]}
        >
          <Select mode="multiple" allowClear style={{ width: "100%" }} options={areas} />
        </Form.Item>
        <Form.Item className="hidden" name="privileges" label="Privilegios">
          <Select mode="multiple" allowClear style={{ width: "100%" }} options={privileges} />
        </Form.Item>
        <Form.Item name="securityPrivileges" label="Usuarios">
          <Select
            mode="multiple"
            allowClear
            style={{ width: "100%" }}
            options={securityPrivileges}
          />
        </Form.Item>
        <Form.Item name="nomenclatorPrivileges" label="Nomencladores">
          <Select
            mode="multiple"
            allowClear
            style={{ width: "100%" }}
            options={nomenclatorPrivileges}
          />
        </Form.Item>
        <Form.Item name="humanResourcesPrivileges" label="Recursos Humanos">
          <Select
            mode="multiple"
            allowClear
            style={{ width: "100%" }}
            options={humanResourcesPrivileges}
          />
        </Form.Item>
        <Form.Item name="warehousePrivileges" label="Almacenes">
          <Select
            mode="multiple"
            allowClear
            style={{ width: "100%" }}
            options={warehousePrivileges}
          />
        </Form.Item>
        <Form.Item name="materialPrivileges" label="Materiales">
          <Select
            mode="multiple"
            allowClear
            style={{ width: "100%" }}
            options={materialPrivileges}
          />
        </Form.Item>
        <Form.Item name="costSheetPrivileges" label="Fichas de Costo">
          <Select
            mode="multiple"
            allowClear
            style={{ width: "100%" }}
            options={costSheetPrivileges}
          />
        </Form.Item>
        <Form.Item name="serviceFeePrivileges" label="Tarifas de Servicio">
          <Select
            mode="multiple"
            allowClear
            style={{ width: "100%" }}
            options={serviceFeePrivileges}
          />
        </Form.Item>
        <Form.Item name="projectPrivileges" label="Proyectos">
          <Select
            mode="multiple"
            allowClear
            style={{ width: "100%" }}
            options={projectPrivileges}
          />
        </Form.Item>
      </Form>
    </Modal>
  );
};

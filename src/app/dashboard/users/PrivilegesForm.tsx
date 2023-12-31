"use client";

import { INomenclator } from "@/models/nomenclator";
import { RootState, useAppSelector } from "@/store/store";
import { Form, Input, Modal, Select, SelectProps } from "antd";

interface Values {
  user: string;
  userName: string;
  lastName: string;
  password?: string;
  privileges: string[];
  area: string[];
}
interface CollectionCreateFormProps {
  open: boolean;
  onCreate: (values: Values) => void;
  onCancel: () => void;
  defaultValues?: Values;
}

export const PrivilegesForm: React.FC<CollectionCreateFormProps> = ({ open, onCreate, onCancel, defaultValues }) => {


  const { nomenclators }: any = useAppSelector((state: RootState) => state?.nomenclator);
  const userArea: string[] | undefined = [];
  nomenclators.map((nomenclator: INomenclator) => {
    if (nomenclator.category === "Area de usuario") {
      userArea.push(nomenclator.code);
    }
  });

  const securityPrivileges: SelectProps["options"]= [
    {
      label: "Crear Usuario",
      value: "Crear Usuario",
    },
    {
      label: "Editar Usuario",
      value: "Editar Usuario",
    },
    {
      label: "Eliminar Usuario",
      value: "Eliminar Usuario",
    },
    {
      label: "Listar Usuarios",
      value: "Listar Usuarios",
    },
  ]
  const nomenclatorPrivileges: SelectProps["options"]= [
    {
      label: "Crear Nomenclador",
      value: "Crear Nomenclador",
    },
    {
      label: "Editar Nomenclador",
      value: "Editar Nomenclador",
    },
    {
      label: "Eliminar Nomenclador",
      value: "Eliminar Nomenclador",
    },
    {
      label: "Listar Nomencladores",
      value: "Listar Nomencladores",
    },
  ]
  const humanResourcesPrivileges: SelectProps["options"]= [
    {
      label: "Crear Trabajador",
      value: "Crear Trabajador",
    },
    {
      label: "Editar Trabajador",
      value: "Editar Trabajador",
    },
    {
      label: "Eliminar Trabajador",
      value: "Eliminar Trabajador",
    },
    {
      label: "Listar Trabajadores",
      value: "Listar Trabajadores",
    },
  ]
  const warehousePrivileges: SelectProps["options"]= [ 
    {
      label: "Crear Almacén",
      value: "Crear Almacén",
    },
    {
      label: "Editar Almacén",
      value: "Editar Almacén",
    },
    {
      label: "Eliminar Almacén",
      value: "Eliminar Almacén",
    },
    {
      label: "Listar Almacén",
      value: "Listar Almacén",
    },
  ]
  const materialPrivileges: SelectProps["options"]= [ 
    
    {
      label: "Listar Materiales",
      value: "Listar Materiales",
    },
    {
      label: "Añadir Material",
      value: "Añadir Material",
    },
    {
      label: "Sustraer Material",
      value: "Sustraer Material",
    },
    {
      label: "Nuevo Material",
      value: "Nuevo Material",
    },
    {
      label: "Editar Existencias Mínimas",
      value: "Editar Existencias Mínimas",
    },
    {
      label: "Eliminar Material",
      value: "Eliminar Material",
    },
  ]
  const costSheetPrivileges: SelectProps["options"]= [ 
    
    {
      label: "Listar Ficha de Costo",
      value: "Listar Ficha de Costo",
    },
    {
      label: "Crear Ficha de Costo",
      value: "Crear Ficha de Costo",
    },
    {
      label: "Editar Ficha de Costo",
      value: "Editar Ficha de Costo",
    },
    {
      label: "Eliminar Ficha de Costo",
      value: "Eliminar Ficha de Costo",
    },
  ]
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
  const areas: SelectProps["options"] = [
    {
      label: "INICIO",
      value: "INICIO",
    },
    {
      label: "HP",
      value: "HP",
    },
  ];

  const [form] = Form.useForm();
  return (
    <Modal
      className="flex flex-col"
      title={
        <div className="flex w-full justify-center">
          <span className="font-black text-lg">Cambiar Permisos</span>
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
          <button
            key="2"
            className="bg-danger-500 cursor-pointer hover:bg-danger-600 ease-in-out duration-300 w-[5rem] h-[2rem] flex items-center p-1 text-sm font-bold text-white-100  justify-center gap-2 rounded-md"
            onClick={onCancel}
          >
            Cancelar
          </button>
          <button
            key="1"
            className="bg-success-500 cursor-pointer hover:bg-success-600 ease-in-out duration-300 w-[5rem] h-[2rem] flex items-center p-1 text-sm font-bold text-white-100  justify-center gap-2 rounded-md "
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
        </div>,
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
            name: "securityPrivileges",
            value: defaultValues?.privileges.filter((privilege)=>privilege.includes("Usuario")),
          },
          {
            name: "nomenclatorPrivileges",
            value: defaultValues?.privileges.filter((privilege)=>privilege.includes("Nomenclador")),
          },
          {
            name: "humanResourcesPrivileges",
            value: defaultValues?.privileges.filter((privilege)=>privilege.includes("Trabajador")),
          },
          {
            name: "warehousePrivileges",
            value: defaultValues?.privileges.filter((privilege)=>privilege.includes("Almacén")),
          },
          {
            name: "materialPrivileges",
            value: defaultValues?.privileges.filter((privilege)=>privilege.includes("Material")),
          },
          {
            name: "costSheetPrivileges",
            value: defaultValues?.privileges.filter((privilege)=>privilege.includes("Ficha de Costo")),
          },
          {
            name: "area",
            value: defaultValues?.area,
          },
        ]}
      >
        <Form.Item className="hidden" name="user" label="Usuario" rules={[{ required: true, message: "Campo requerido" }]}>
          <Input />
        </Form.Item>
        <Form.Item className="hidden" name="userName" label="Nombre" rules={[{ required: true, message: "Campo requerido" }]}>
          <Input />
        </Form.Item>
        <Form.Item className="hidden" name="lastName" label="Apellidos" rules={[{ required: true, message: "Campo requerido" }]}>
          <Input />
        </Form.Item>
        <Form.Item className="hidden" name="area" label="Área" rules={[{ required: true, message: "Campo requerido" }]}>
          <Select mode="multiple" allowClear style={{ width: "100%" }} options={areas} />
        </Form.Item>
        <Form.Item className="hidden" name="privileges" label="Privilegios" >
          <Select mode="multiple" allowClear style={{ width: "100%" }} options={privileges} />
        </Form.Item>
        <Form.Item name="securityPrivileges" label="Usuarios" >
          <Select mode="multiple" allowClear style={{ width: "100%" }} options={securityPrivileges} />
        </Form.Item>
        <Form.Item name="nomenclatorPrivileges" label="Nomencladores" >
          <Select mode="multiple" allowClear style={{ width: "100%" }} options={nomenclatorPrivileges} />
        </Form.Item>
        <Form.Item name="humanResourcesPrivileges" label="Recursos Humanos" >
          <Select mode="multiple" allowClear style={{ width: "100%" }} options={humanResourcesPrivileges} />
        </Form.Item>
        <Form.Item name="warehousePrivileges" label="Almacenes" >
          <Select mode="multiple" allowClear style={{ width: "100%" }} options={warehousePrivileges} />
        </Form.Item>
        <Form.Item name="materialPrivileges" label="Materiales" >
          <Select mode="multiple" allowClear style={{ width: "100%" }} options={materialPrivileges} />
        </Form.Item>
        <Form.Item name="costSheetPrivileges" label="Fichas de Costo" >
          <Select mode="multiple" allowClear style={{ width: "100%" }} options={costSheetPrivileges} />
        </Form.Item>
      </Form>
    </Modal>
  );
};

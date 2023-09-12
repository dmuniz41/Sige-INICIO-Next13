"use client";

import { Form, Input, InputNumber, Modal, Select, SelectProps } from "antd";
interface Values {
  materialName: string;
  category: string;
  costPerUnit: number;
  unitsTotal: number;
  minimumExistence: number;
  unitMeasure?: string;
}
interface CollectionCreateFormProps {
  open: boolean;
  onCreate: (values: Values) => void;
  onCancel: () => void;
}

const category: SelectProps["options"] = [
  {
    label: "Vinilo",
    value: "Vinilo",
  },
  {
    label: "PVC",
    value: "PVC",
  },
  {
    label: "Cartuchos de Tinta",
    value: "Cartuchos de Tinta",
  },
  {
    label: "Lona",
    value: "Lona",
  },
  {
    label: "Tornillos",
    value: "Tornillos",
  },
  {
    label: "Acrilico",
    value: "Acrilico",
  },
];

const unitMeasure: SelectProps["options"] = [
  {
    label: "m2",
    value: "m2",
  },
  {
    label: "m",
    value: "m",
  },
  {
    label: "cc",
    value: "cc",
  },
  {
    label: "unidades",
    value: "unidades",
  },

];

export const AddMaterialForm: React.FC<CollectionCreateFormProps> = ({ open, onCreate, onCancel }) => {
  
  const [form] = Form.useForm();
  return (
    <Modal
      className="flex flex-col"
      title={<div className="flex w-full justify-center"><span className="font-black text-lg">Nuevo Material</span></div>}
      style={{textAlign: "left"}}
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
      okText="Añadir"
      cancelText="Cancelar"
    >
      <Form form={form} layout="vertical" name="createUserForm" size="middle">
        <Form.Item name="category" label="Categoría" rules={[{ required: true, message: "Campo requerido" }]}>
          <Select allowClear style={{ width: "100%" }} options={category} />
        </Form.Item>
        <Form.Item name="materialName" label="Nombre del material" rules={[{ required: true, message: "Campo requerido" }]}>
          <Input />
        </Form.Item>
        <Form.Item name="unitMeasure" label="Unidad de medida" rules={[{ required: true, message: "Campo requerido" }]}>
        <Select  allowClear style={{ width: "100%" }} options={unitMeasure} />
        </Form.Item>
        <Form.Item name="costPerUnit" label="Costo por unidad de medida" rules={[{ required: true, message: "Campo requerido" }]}>
          <InputNumber className="w-full"/>
        </Form.Item>
        <Form.Item name="unitsTotal" label="Cantidad a añadir" rules={[{ required: true, message: "Campo requerido" }]}>
          <InputNumber className="w-full"/>
        </Form.Item>
        <Form.Item name="minimumExistence" label="Existencias mínimas" rules={[{ required: true, message: "Campo requerido" }]}>
          <InputNumber className="w-full"/>
        </Form.Item>
      </Form>
    </Modal>
  );
};

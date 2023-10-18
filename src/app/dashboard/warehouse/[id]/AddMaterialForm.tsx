"use client";

import { Form, Input, InputNumber, Modal, Select, SelectProps } from "antd";

interface Values {
  _id: string;
  code: string;
  key: string;
  materialName: string;
  enterDate: string;
  category: string;
  costPerUnit: number;
  unitsTotal: number;
  minimumExistence: number;
  provider: string;
  unitMeasure: string;
}
interface CollectionCreateFormProps {
  open: boolean;
  onCreate: (values: Values) => void;
  onCancel: () => void;
  defaultValues?: Values;
}

export const AddMaterialForm: React.FC<CollectionCreateFormProps> = ({ open, onCreate, onCancel, defaultValues }) => {
  const [form] = Form.useForm();
  return (
    <Modal
      className="flex flex-col"
      title={
        <div className="flex w-full justify-center">
          <span className="font-black text-lg">Añadir Material</span>
        </div>
      }
      centered
      open={open}
      style={{ textAlign: "left" }}
      destroyOnClose
      onCancel={onCancel}
      okType="default"
      okText="Añadir"
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
            Añadir
          </button>
        </div>,
      ]}
    >
      <Form
        form={form}
        layout="vertical"
        name="editWarehouseForm"
        size="middle"
        fields={[
          {
            name: "category",
            value: defaultValues?.category,
          },
          {
            name: "materialName",
            value: defaultValues?.materialName,
          },
          {
            name: "costPerUnit",
            value: defaultValues?.costPerUnit,
          },
          {
            name: "unitMeasure",
            value: defaultValues?.unitMeasure,
          },
          {
            name: "minimumExistence",
            value: defaultValues?.minimumExistence,
          },
          {
            name: "provider",
            value: defaultValues?.provider,
          },
        ]}
      >
        <Form.Item name="category" label="Categoría" rules={[{ required: true, message: "Campo requerido" }]}>
          <Select allowClear style={{ width: "100%" }} disabled />
        </Form.Item>
        <Form.Item name="materialName" label="Nombre del material" rules={[{ required: true, message: "Campo requerido" }]}>
          <Input disabled />
        </Form.Item>
        <Form.Item name="costPerUnit" label="Costo por unidad de medida" rules={[{ required: true, message: "Campo requerido" }]}>
          <InputNumber className="w-full" disabled />
        </Form.Item>
        <Form.Item name="unitMeasure" label="Unidad de medida" rules={[{ required: true, message: "Campo requerido" }]}>
          <Select allowClear style={{ width: "100%" }} disabled />
        </Form.Item>
        <Form.Item name="unitsTotal" label="Cantidad a añadir" rules={[{ required: true, message: "Campo requerido" }]}>
          <InputNumber className="w-full" />
        </Form.Item>
        <Form.Item name="minimumExistence" label="Existencias mínimas" rules={[{ required: true, message: "Campo requerido" }]}>
          <InputNumber className="w-full" disabled />
        </Form.Item>
        <Form.Item name="provider" label="Proveedor" rules={[{ required: true, message: "Campo requerido" }]}>
          <Select allowClear style={{ width: "100%" }} disabled />
        </Form.Item>
      </Form>
    </Modal>
  );
};

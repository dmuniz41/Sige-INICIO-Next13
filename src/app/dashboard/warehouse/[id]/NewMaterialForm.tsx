"use client";

import { INomenclator } from "@/models/nomenclator";
import { RootState, useAppSelector } from "@/store/store";
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

export const NewMaterialForm: React.FC<CollectionCreateFormProps> = ({ open, onCreate, onCancel }) => {
  const { nomenclators }: any = useAppSelector((state: RootState) => state?.nomenclator);
  const materialCategory: string[] | undefined = [];
  const unitMeasures: string[] | undefined = [];
  nomenclators.map((nomenclator: INomenclator) => {
    if (nomenclator.category === "Categoría de material") {
      materialCategory.push(nomenclator.code);
    } else {
      if (nomenclator.category === "Unidad de medida") {
        unitMeasures.push(nomenclator.code);
      }
    }
  });

  const category: SelectProps["options"] = materialCategory.map((materialCategory) => {
    return {
      label: `${materialCategory}`,
      value: `${materialCategory}`,
    };
  });

  const unitMeasure: SelectProps["options"] = unitMeasures.map((unitMeasure) => {
    return {
      label: `${unitMeasure}`,
      value: `${unitMeasure}`,
    };
  });

  const [form] = Form.useForm();
  return (
    <Modal
      className="flex flex-col"
      title={
        <div className="flex w-full justify-center">
          <span className="font-black text-lg">Nuevo Material</span>
        </div>
      }
      style={{ textAlign: "left" }}
      centered
      open={open}
      destroyOnClose
      onCancel={onCancel}
      okType="default"
      okText="Crear"
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
            Crear
          </button>
        </div>,
      ]}
    >
      <Form form={form} layout="vertical" name="createUserForm" size="middle">
        <Form.Item name="category" label="Categoría" rules={[{ required: true, message: "Campo requerido" }]}>
          <Select allowClear style={{ width: "100%" }} options={category} />
        </Form.Item>
        <Form.Item name="materialName" label="Nombre del material" rules={[{ required: true, message: "Campo requerido" }]}>
          <Input />
        </Form.Item>
        <Form.Item name="costPerUnit" label="Costo por unidad de medida" rules={[{ required: true, message: "Campo requerido" }]}>
          <InputNumber className="w-full" />
        </Form.Item>
        <Form.Item name="unitMeasure" label="Unidad de medida" rules={[{ required: true, message: "Campo requerido" }]}>
          <Select allowClear style={{ width: "100%" }} options={unitMeasure} />
        </Form.Item>
        <Form.Item name="unitsTotal" label="Cantidad a añadir" rules={[{ required: true, message: "Campo requerido" }]}>
          <InputNumber className="w-full" />
        </Form.Item>
        <Form.Item name="minimumExistence" label="Existencias mínimas" rules={[{ required: true, message: "Campo requerido" }]}>
          <InputNumber className="w-full" />
        </Form.Item>
      </Form>
    </Modal>
  );
};

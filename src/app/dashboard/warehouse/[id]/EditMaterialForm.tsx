"use client";

import { Form, Input, InputNumber, Modal } from "antd";

interface Values {
  _id: string;
  category: string;
  code: string;
  costPerUnit: number;
  description: string;
  enterDate: string;
  key: string;
  materialName: string;
  minimumExistence: number;
  unitMeasure: string;
  unitsTotal: number;
}
interface CollectionCreateFormProps {
  open: boolean;
  onCreate: (values: Values) => void;
  onCancel: () => void;
  defaultValues?: Values;
}

export const EditMaterialForm: React.FC<CollectionCreateFormProps> = ({
  open,
  onCreate,
  onCancel,
  defaultValues
}) => {
  const [form] = Form.useForm();
  return (
    <Modal
      className="flex flex-col"
      title={
        <div className="flex w-full justify-center">
          <span className="font-semibold text-lg">Editar Material</span>
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
            className="bg-danger-500 cursor-pointer hover:bg-danger-600 ease-in-out duration-300 w-[5rem] h-[2rem] flex items-center p-1 text-sm font-semibold text-white-100  justify-center gap-2 rounded-md"
            onClick={onCancel}
          >
            Cancelar
          </button>
          <button
            key="1"
            className="bg-success-500 cursor-pointer hover:bg-success-600 ease-in-out duration-300 w-[5rem] h-[2rem] flex items-center p-1 text-sm font-semibold text-white-100  justify-center gap-2 rounded-md "
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
        name="editWarehouseForm"
        size="middle"
        fields={[
          {
            name: "minimumExistence",
            value: defaultValues?.minimumExistence
          },
          {
            name: "code",
            value: defaultValues?.code
          },
          {
            name: "materialName",
            value: defaultValues?.materialName
          },
          {
            name: "description",
            value: defaultValues?.description
          }
        ]}
      >
        <Form.Item name="code" label="Código">
          <Input disabled />
        </Form.Item>
        <Form.Item name="materialName" label="Nombre del material">
          <Input className="w-full" />
        </Form.Item>
        <Form.Item name="description" label="Descripción">
          <Input className="w-full" />
        </Form.Item>
        <Form.Item className="w-full" name="minimumExistence" label="Existencias mínimas">
          <InputNumber min={0} />
        </Form.Item>
      </Form>
    </Modal>
  );
};

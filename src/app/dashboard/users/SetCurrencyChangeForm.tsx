"use client";

import { RootState, useAppSelector } from "@/store/store";
import { Form, InputNumber, Modal } from "antd";

interface Values {
  MLCChange: number;
}
interface CollectionCreateFormProps {
  open: boolean;
  onCreate: (values: Values) => void;
  onCancel: () => void;
  defaultValues?: Values;
}

export const SetCurrencyChangeForm: React.FC<CollectionCreateFormProps> = ({ open, onCreate, onCancel, defaultValues }) => {
  const [form] = Form.useForm();
  return (
    <Modal
      className="flex flex-col"
      title={
        <div className="flex w-full justify-center">
          <span className="font-black text-lg">Establecer Tasa de Cambio</span>
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
            name: "currencyChange",
            value: defaultValues,
          },
        ]}
      >
        <Form.Item  name="currencyChange" label="Establecer Cambio" rules={[{ required: true, message: "Campo requerido" }]}>
          <InputNumber className="w-full"/>
        </Form.Item>
      </Form>
    </Modal>
  );
};

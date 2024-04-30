"use client";

import { INomenclator } from "@/models/nomenclator";
import { RootState, useAppSelector } from "@/store/store";
import { InfoCircleOutlined } from "@ant-design/icons";
import { Form, Input, InputNumber, Modal, Select, SelectProps } from "antd";
interface Values {
  key: string;
  name: string;
  CI: number;
  role: string[];
  address: string;
  phoneNumber: number;
  bankAccount: number;
}
interface CollectionCreateFormProps {
  open: boolean;
  onCreate: (values: Values) => void;
  onCancel: () => void;
}

export const CreateWorkerForm: React.FC<CollectionCreateFormProps> = ({ open, onCreate, onCancel }) => {
  const { nomenclators }: any = useAppSelector((state: RootState) => state?.nomenclator);
  const workerRole: string[] | undefined = [];
  nomenclators.map((nomenclator: INomenclator) => {
    if (nomenclator.category === "Cargo de trabajador") {
      workerRole.push(nomenclator.code);
    }
  });
  const options: SelectProps["options"] = workerRole.map((role) => {
    return {
      label: `${role}`,
      value: `${role}`,
    };
  });

  const [form] = Form.useForm();
  return (
    <Modal
      className="flex flex-col"
      title={
        <div className="flex w-full justify-center">
          <span className="font-bold text-lg">Nuevo Trabajador</span>
        </div>
      }
      centered
      open={open}
      style={{ textAlign: "left" }}
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
      <Form form={form} layout="vertical" name="createWorkerForm" size="middle">
        <Form.Item name="name" label="Nombre y Apellidos" rules={[{ required: true, message: "Campo requerido" }]}>
          <Input />
        </Form.Item>
        <Form.Item
          messageVariables={{ CI: "Carnet de identidad" }}
          name="CI"
          label="Carnet de Identidad"
          rules={[{ required: true, message: "${CI} debe tener 11 números" }]}
          tooltip={{ title: "El carnet debe tener 11 números", icon: <InfoCircleOutlined /> }}
        >
          <InputNumber min={0} className="w-full" />
        </Form.Item>
        <Form.Item name="role" label="Cargos" rules={[{ required: true, message: "Campo requerido" }]}>
          <Select mode="multiple" allowClear style={{ width: "100%" }} options={options} />
        </Form.Item>
        <Form.Item name="address" label="Dirección" rules={[{ required: true, message: "Campo requerido" }]}>
          <Input />
        </Form.Item>
        <Form.Item
          messageVariables={{ phoneNumber: "Telefono" }}
          name="phoneNumber"
          label="Teléfono"
          rules={[{ required: true, message: "${phoneNumber} debe tener 8 números" }]}
          tooltip={{ title: "El telefono debe tener 8 números", icon: <InfoCircleOutlined /> }}
        >
          <InputNumber min={0} className="w-full" />
        </Form.Item>
        <Form.Item
          messageVariables={{ bankAccount: "Cuenta bancaria" }}
          name="bankAccount"
          label="Cuenta Bancaria"
          rules={[{ required: true, message: "${bankAccount} debe tener 16 números" }]}
          tooltip={{ title: "La cuenta bancaria debe tener 16 números", icon: <InfoCircleOutlined /> }}
        >
          <InputNumber min={0} className="w-full" />
        </Form.Item>
      </Form>
    </Modal>
  );
};

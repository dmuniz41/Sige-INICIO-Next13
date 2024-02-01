"use client";

import { useState } from "react";
import { Form, InputNumber, Modal, Select, SelectProps } from "antd";

import { IServiceFeeSubItem } from "@/models/serviceFees";
import { RootState, useAppSelector } from "@/store/store";
import { IServiceFeeAuxiliary } from "@/models/serviceFeeAuxiliary";

interface CollectionCreateFormProps {
  open: boolean;
  onCreate: (values: IServiceFeeSubItem) => void;
  onCancel: () => void;
}

export const AddAdministrativeExpensesModal: React.FC<CollectionCreateFormProps> = ({ open, onCreate, onCancel }) => {
  const { serviceFeeAuxiliary }: { serviceFeeAuxiliary: IServiceFeeAuxiliary } = useAppSelector((state: RootState) => state?.serviceFee);

  const [currentAdministrativeExpense, setCurrentAdministrativeExpense] = useState<{ name: string; value: number }>({
    name: "",
    value: 0,
  });
  const [currentPrice, setCurrentPrice] = useState(0);

  const listOfAdministrativeExpenses: SelectProps["options"] = serviceFeeAuxiliary?.administrativeExpensesCoefficients?.map((ae) => {
    return {
      label: `${ae.name}`,
      value: `${ae.name}`,
    };
  });

  const [form] = Form.useForm();
  return (
    <Modal
      width={650}
      className="flex flex-col"
      title={
        <div className="flex w-full justify-center">
          <span className="font-black text-lg">Gastos Administrativos</span>
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
                  onCreate({
                    description: values.description.label,
                    amount: values.amount,
                    unitMeasure: "$/h",
                    price: currentAdministrativeExpense.value,
                    value: currentPrice,
                  });
                  form.resetFields();
                  setCurrentAdministrativeExpense({ name: "", value: 0 });
                  setCurrentPrice(0);
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
      <Form form={form} layout="horizontal" name="addAdministrativeExpense" size="middle">
        <Form.Item name="description" label="Descripción" rules={[{ required: true, message: "Campo requerido" }]}>
          <Select
            autoFocus
            allowClear
            labelInValue
            style={{ width: "100%" }}
            options={listOfAdministrativeExpenses}
            onSelect={(value: any) => {
              const selectedAdministrativeExpense = serviceFeeAuxiliary.administrativeExpensesCoefficients.find((ae) => ae.name === value.label);
              setCurrentAdministrativeExpense(selectedAdministrativeExpense!);
              form.setFieldsValue({
                unitMeasure: "$/h",
                price: form.getFieldValue("amount") * selectedAdministrativeExpense?.value!,
              });
              setCurrentPrice(form.getFieldValue("amount") * selectedAdministrativeExpense?.value!);
              // setSelectedAdministrativeExpense(selectedAdministrativeExpense);
            }}
            showSearch
            optionFilterProp="children"
            filterOption={(input: any, option: any) => (option?.label ?? "").toLowerCase().includes(input)}
            filterSort={(optionA: any, optionB: any) => (optionA?.label ?? "").toLowerCase().localeCompare((optionB?.label ?? "").toLowerCase())}
          />
        </Form.Item>
        <Form.Item name="amount" label="Cantidad" className="w-[10rem]" rules={[{ required: true, message: "Campo requerido" }]}>
          <InputNumber
            onChange={() => {
              setCurrentPrice(form.getFieldValue("amount") * currentAdministrativeExpense.value);
            }}
          />
        </Form.Item>
        <div className=" flex gap-2 pl-2 mb-4">
          <span className="font-bold">Unidad de Medida:</span>
          <span>$/h</span>
        </div>
        <div className=" flex gap-2 pl-2 mb-4">
          <span className="font-bold">Precio/UM:</span>
          <span>${currentAdministrativeExpense?.value?.toFixed(2)}</span>
        </div>
        <div className=" flex gap-2 pl-2 mb-4">
          <span className="font-bold">Importe:</span>
          <span>${!currentPrice ? 0 : currentPrice?.toFixed(2)}</span>
        </div>
      </Form>
    </Modal>
  );
};

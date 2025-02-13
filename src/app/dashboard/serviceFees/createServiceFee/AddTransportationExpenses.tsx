"use client";

import { Form, InputNumber, Modal, Select, SelectProps } from "antd";
import { useState } from "react";

import { IServiceFeeAuxiliary } from "@/models/serviceFeeAuxiliary";
import { IServiceFeeSubItem } from "@/models/serviceFees";
import { RootState, useAppSelector } from "@/store/store";

interface CollectionCreateFormProps {
  open: boolean;
  onCreate: (values: IServiceFeeSubItem) => void;
  onCancel: () => void;
}

export const AddTransportationExpensesModal: React.FC<CollectionCreateFormProps> = ({ open, onCreate, onCancel }) => {
  const { serviceFeeAuxiliary }: { serviceFeeAuxiliary: IServiceFeeAuxiliary } = useAppSelector((state: RootState) => state?.serviceFee);

  const [currentPrice, setCurrentPrice] = useState(0);
  const [currentTransportationExpense, setCurrentTransportationExpense] = useState<{
    name: string;
    value: number;
  }>({
    name: "",
    value: 0
  });

  const listOfTransportationExpenses: SelectProps["options"] = serviceFeeAuxiliary?.transportationExpensesCoefficients?.map(
    (transportationExpense) => {
      return {
        label: `${transportationExpense.name}`,
        value: `${transportationExpense.name}`
      };
    }
  );

  const [form] = Form.useForm();
  return (
    <Modal
      className="flex flex-col"
      title={
        <div className="flex w-full justify-center">
          <span className="font-semibold text-lg">Gastos de Transportación</span>
        </div>
      }
      cancelText="Cancelar"
      centered
      destroyOnClose
      okText="Crear"
      okType="default"
      onCancel={onCancel}
      open={open}
      style={{ textAlign: "left" }}
      width={"1000px"}
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
                  onCreate({
                    description: values.description,
                    amount: values.amount,
                    unitMeasure: "$/h",
                    price: currentTransportationExpense.value,
                    value: currentPrice
                  });
                  form.resetFields();
                  setCurrentTransportationExpense({ name: "", value: 0 });
                  setCurrentPrice(0);
                })
                .catch((error) => {
                  console.log("Validate Failed:", error);
                });
            }}
          >
            Crear
          </button>
        </div>
      ]}
    >
      <Form form={form} layout="horizontal" name="addTransportationExpenses" size="middle">
        <Form.Item name="description" label="Descripción" rules={[{ required: true, message: "Campo requerido" }]}>
          <Select
            allowClear
            options={listOfTransportationExpenses}
            style={{ width: "100%" }}
            onSelect={(value: any) => {
              const selectedTransportationExpense = serviceFeeAuxiliary?.transportationExpensesCoefficients?.find(
                (transportationExpense) => transportationExpense.name === value
              );
              setCurrentTransportationExpense(selectedTransportationExpense!);
              form.setFieldsValue({
                unitMeasure: "$/h",
                price: form.getFieldValue("amount") * selectedTransportationExpense?.value!
              });
              setCurrentPrice(form.getFieldValue("amount") * selectedTransportationExpense?.value!);
            }}
            showSearch
            optionFilterProp="children"
            filterOption={(input: any, option: any) => (option?.label ?? "").toLowerCase().includes(input)}
            filterSort={(optionA: any, optionB: any) =>
              (optionA?.label ?? "").toLowerCase().localeCompare((optionB?.label ?? "").toLowerCase())
            }
          />
        </Form.Item>
        <Form.Item name="amount" label="Cantidad" className="w-[10rem]" rules={[{ required: true, message: "Campo requerido" }]}>
          <InputNumber
            min={0}
            onChange={(value: number | null) => {
              setCurrentPrice(value! * currentTransportationExpense?.value!);
            }}
          />
        </Form.Item>
        <div className=" flex gap-2 pl-2 mb-4">
          <span className="font-semibold">Unidad de Medida:</span>
          <span>$/h</span>
        </div>
        <div className=" flex gap-2 pl-2 mb-4">
          <span className="font-semibold">Precio/UM:</span>
          <span>${currentTransportationExpense?.value?.toFixed(2)}</span>
        </div>
        <div className=" flex gap-2 pl-2 mb-4">
          <span className="font-semibold">Importe:</span>
          <span>${!currentPrice ? 0 : currentPrice?.toFixed(2)}</span>
        </div>
      </Form>
    </Modal>
  );
};

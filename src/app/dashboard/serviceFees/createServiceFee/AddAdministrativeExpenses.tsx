"use client";

import { Form, Input, InputNumber, Modal, Select, SelectProps } from "antd";
import { RootState, useAppSelector } from "@/store/store";
import { IServiceFeeSubItem } from "@/models/serviceFees";
import { useState } from "react";

interface CollectionCreateFormProps {
  open: boolean;
  onCreate: (values: IServiceFeeSubItem) => void;
  onCancel: () => void;
}

export const AddAdministrativeExpensesModal: React.FC<CollectionCreateFormProps> = ({ open, onCreate, onCancel }) => {
  const { serviceFeeAuxiliary }: any = useAppSelector((state: RootState) => state?.serviceFee);

  const [fuelExpenseValue, setFuelExpenseValue] = useState(0);
  const [leaseExpenseValue, setLeaseExpenseValue] = useState(0);
  const [electricityExpenseValue, setElectricityExpenseValue] = useState(0);
  const [feedingExpenseValue, setFeedingExpenseValue] = useState(0);
  const [phoneExpenseValue, setPhoneExpenseValue] = useState(0);

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
                    ...values,
                    fuelExpenseValue,
                    leaseExpenseValue,
                    electricityExpenseValue,
                    feedingExpenseValue,
                    phoneExpenseValue
                    });
                  form.resetFields();
                  setFuelExpenseValue(0);
                  setLeaseExpenseValue(0);
                  setElectricityExpenseValue(0);
                  setFeedingExpenseValue(0);
                  setPhoneExpenseValue(0);
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
      <Form
        form={form}
        layout="vertical"
        name="administrativeExpenses"
        size="middle"
        fields={[
          {
            name: "unitMeasure",
            value: "$/h",
          },
          {
            name: "fuelExpenseCoef",
            value: serviceFeeAuxiliary[0]?.administrativeExpensesCoefficients.fuelExpense,
          },
          {
            name: "electricityExpenseCoef",
            value: serviceFeeAuxiliary[0]?.administrativeExpensesCoefficients.electricityExpense,
          },
          {
            name: "feedingExpenseCoef",
            value: serviceFeeAuxiliary[0]?.administrativeExpensesCoefficients.feedingExpense,
          },
          {
            name: "leaseExpenseCoef",
            value: serviceFeeAuxiliary[0]?.administrativeExpensesCoefficients.leaseExpense,
          },
          {
            name: "phoneExpenseCoef",
            value: serviceFeeAuxiliary[0]?.administrativeExpensesCoefficients.phoneExpense,
          },
          {
            name: "fuelExpenseDescription",
            value: "Combustible",
          },
          {
            name: "electricityExpenseDescription",
            value: "Electricidad",
          },
          {
            name: "feedingExpenseDescription",
            value: "Alimentación",
          },
          {
            name: "leaseExpenseDescription",
            value: "Arrendamiento",
          },
          {
            name: "phoneExpenseDescription",
            value: "Teléfono",
          },
        ]}
      >
        {/* Combustible */}
        <section className="flex flex-1 gap-2">
          <Form.Item name="fuelExpenseDescription" className="w-[10rem]" label="Descripción">
            <Input style={{ width: "100%" }} />
          </Form.Item>
          <Form.Item name="unitMeasure" className="w-[10rem]" label="Unidad de Medida">
            <Input />
          </Form.Item>
          <Form.Item name="fuelAmount" label="Cantidad" rules={[{ required: true, message: "Campo requerido" }]}>
            <InputNumber
              onChange={() => {
                let values = form.getFieldsValue();
                setFuelExpenseValue(values.fuelAmount * values.fuelExpenseCoef);
              }}
            />
          </Form.Item>
          <Form.Item name="fuelExpenseCoef" label="Precio/UM">
            <InputNumber />
          </Form.Item>
          <div className=" flex flex-col w-[4rem]">
            <span className="font-bold h-[22px] mb-2">Importe</span>
            <span className="h-[30px] pt-1.5">$ {!fuelExpenseValue ? 0 : fuelExpenseValue?.toFixed(2)}</span>
          </div>
        </section>
        {/* Arrendamiento */}
        <section className="flex flex-1 gap-2">
          <Form.Item name="leaseExpenseDescription" className="w-[10rem]">
            <Input style={{ width: "100%" }} />
          </Form.Item>
          <Form.Item name="unitMeasure" className="w-[10rem]">
            <Input />
          </Form.Item>
          <Form.Item name="leaseAmount" rules={[{ required: true, message: "Campo requerido" }]}>
            <InputNumber
              onChange={() => {
                let values = form.getFieldsValue();
                setLeaseExpenseValue(values.leaseAmount * values.leaseExpenseCoef);
              }}
            />
          </Form.Item>
          <Form.Item name="leaseExpenseCoef">
            <InputNumber />
          </Form.Item>
          <div className=" flex flex-col w-[4rem]">
            <span className="pt-1.5 h-[30px]">$ {!leaseExpenseValue ? 0 : leaseExpenseValue?.toFixed(2)}</span>
          </div>
        </section>
        {/* Electricidad */}
        <section className="flex flex-1 gap-2">
          <Form.Item name="electricityExpenseDescription" className="w-[10rem]">
            <Input style={{ width: "100%" }} />
          </Form.Item>
          <Form.Item name="unitMeasure" className="w-[10rem]">
            <Input />
          </Form.Item>
          <Form.Item name="electricityAmount" rules={[{ required: true, message: "Campo requerido" }]}>
            <InputNumber
              onChange={() => {
                let values = form.getFieldsValue();
                setElectricityExpenseValue(values.electricityAmount * values.electricityExpenseCoef);
              }}
            />
          </Form.Item>
          <Form.Item name="electricityExpenseCoef">
            <InputNumber />
          </Form.Item>
          <div className=" flex flex-col w-[4rem]">
            <span className="pt-1.5 h-[30px]">$ {!electricityExpenseValue ? 0 : electricityExpenseValue?.toFixed(2)}</span>
          </div>
        </section>
        {/* Alimentacion */}
        <section className="flex flex-1 gap-2">
          <Form.Item name="feedingExpenseDescription" className="w-[10rem]">
            <Input style={{ width: "100%" }} />
          </Form.Item>
          <Form.Item name="unitMeasure" className="w-[10rem]">
            <Input />
          </Form.Item>
          <Form.Item name="feedingAmount" rules={[{ required: true, message: "Campo requerido" }]}>
            <InputNumber
              onChange={() => {
                let values = form.getFieldsValue();
                setFeedingExpenseValue(values.feedingAmount * values.feedingExpenseCoef);
              }}
            />
          </Form.Item>
          <Form.Item name="feedingExpenseCoef">
            <InputNumber />
          </Form.Item>
          <div className=" flex flex-col w-[4rem]">
            <span className="pt-1.5 h-[30px]">$ {!feedingExpenseValue ? 0 : feedingExpenseValue?.toFixed(2)}</span>
          </div>
        </section>
        <section className="flex flex-1 gap-2">
          <Form.Item name="phoneExpenseDescription" className="w-[10rem]">
            <Input style={{ width: "100%" }} />
          </Form.Item>
          <Form.Item name="unitMeasure" className="w-[10rem]">
            <Input />
          </Form.Item>
          <Form.Item name="phoneAmount" rules={[{ required: true, message: "Campo requerido" }]}>
            <InputNumber
              onChange={() => {
                let values = form.getFieldsValue();
                setPhoneExpenseValue(values.phoneAmount * values.phoneExpenseCoef);
              }}
            />
          </Form.Item>
          <Form.Item name="phoneExpenseCoef">
            <InputNumber />
          </Form.Item>
          <div className=" flex flex-col w-[4rem]">
            <span className="pt-1.5 h-[30px]">$ {!phoneExpenseValue ? 0 : phoneExpenseValue?.toFixed(2)}</span>
          </div>
        </section>
        {/* Telefono */}
      </Form>
    </Modal>
  );
};

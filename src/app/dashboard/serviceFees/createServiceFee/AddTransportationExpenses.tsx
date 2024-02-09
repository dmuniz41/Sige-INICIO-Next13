"use client";

import { Form, Input, InputNumber, Modal, } from "antd";
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

  const [transportationExpenseValue, setTransportationExpenseValue] = useState(0);
  const [salesAndDistributionExpenseValue, setSalesAndDistributionExpenseValue] = useState(0);

  const [form] = Form.useForm();
  return (
    <Modal
      width={650}
      className="flex flex-col"
      title={
        <div className="flex w-full justify-center">
          <span className="font-bold text-lg">Gastos de Transportación</span>
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
            className="modal-btn-danger"
            onClick={onCancel}
          >
            Cancelar
          </button>
          <button
            key="1"
            className="modal-btn-primary "
            onClick={() => {
              form
                .validateFields()
                .then((values) => {
                  onCreate({ ...values, transportationExpenseValue, salesAndDistributionExpenseValue });
                  form.resetFields();
                  setTransportationExpenseValue(0);
                  setSalesAndDistributionExpenseValue(0);
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
        name="transportationExpenses"
        size="middle"
        fields={[
          {
            name: "unitMeasure",
            value: "$/u",
          },
          {
            name: "transportationExpenseCoef",
            value: serviceFeeAuxiliary?.transportationExpensesCoefficient,
          },
          {
            name: "salesAndDistributionExpenseCoef",
            value: serviceFeeAuxiliary?.salesAndDistributionExpensesCoefficient,
          },

          {
            name: "transportationExpenseDescription",
            value: "Transportación",
          },
          {
            name: "salesAndDistributionExpenseDescription",
            value: "Distribución y Venta",
          },
        ]}
      >
        {/* Transportacion */}
        <section className="flex flex-1 gap-2">
          <Form.Item name="transportationExpenseDescription" className="w-[10rem]" label="Descripción">
            <Input style={{ width: "100%" }} />
          </Form.Item>
          <Form.Item name="unitMeasure" className="w-[10rem]" label="Unidad de Medida">
            <Input />
          </Form.Item>
          <Form.Item name="transportationAmount" label="Cantidad" rules={[{ required: true, message: "Campo requerido" }]}>
            <InputNumber
              onChange={() => {
                let values = form.getFieldsValue();
                setTransportationExpenseValue(values.transportationAmount * values.transportationExpenseCoef);
              }}
            />
          </Form.Item>
          <Form.Item name="transportationExpenseCoef" label="Precio/UM">
            <InputNumber />
          </Form.Item>
          <div className=" flex flex-col w-[4rem]">
            <span className="font-bold h-[22px] mb-2">Importe</span>
            <span className="h-[30px] pt-1.5">$ {!transportationExpenseValue ? 0 : transportationExpenseValue?.toFixed(2)}</span>
          </div>
        </section>
        {/* Distribucion y venta */}
        <section className="flex flex-1 gap-2">
          <Form.Item name="salesAndDistributionExpenseDescription" className="w-[10rem]">
            <Input style={{ width: "100%" }} />
          </Form.Item>
          <Form.Item name="unitMeasure" className="w-[10rem]">
            <Input />
          </Form.Item>
          <Form.Item name="salesAndDistributionAmount" rules={[{ required: true, message: "Campo requerido" }]}>
            <InputNumber
              onChange={() => {
                let values = form.getFieldsValue();
                setSalesAndDistributionExpenseValue(values.salesAndDistributionAmount * values.salesAndDistributionExpenseCoef);
              }}
            />
          </Form.Item>
          <Form.Item name="salesAndDistributionExpenseCoef">
            <InputNumber />
          </Form.Item>
          <div className=" flex flex-col w-[4rem]">
            <span className="pt-1.5 h-[30px]">$ {!salesAndDistributionExpenseValue ? 0 : salesAndDistributionExpenseValue?.toFixed(2)}</span>
          </div>
        </section>
      </Form>
    </Modal>
  );
};

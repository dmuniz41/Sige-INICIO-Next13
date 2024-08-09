"use client";
import { Form, Input, InputNumber, Modal } from "antd";
import { useState } from "react";

import { IServiceFeeSubItem } from "@/models/serviceFees";
import { RootState, useAppSelector } from "@/store/store";
import { IServiceFeeAuxiliary } from "@/models/serviceFeeAuxiliary";
interface CollectionCreateFormProps {
  open: boolean;
  onCreate: (values: IServiceFeeSubItem) => void;
  onCancel: () => void;
  activitiesTotalValue: number;
}

export const AddHiredPersonalExpensesModal: React.FC<CollectionCreateFormProps> = ({ open, onCreate, onCancel, activitiesTotalValue }) => {
  const [subcontractExpensesValue, setSubcontractExpensesValue] = useState(0);

  const { serviceFeeAuxiliary }: { serviceFeeAuxiliary: IServiceFeeAuxiliary } = useAppSelector((state: RootState) => state?.serviceFee);

  const [form] = Form.useForm();
  return (
    <Modal
      className="flex flex-col"
      title={
        <div className="flex w-full justify-center">
          <span className="font-semibold text-lg">Gastos de Personal Contratado</span>
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
      width={"600px"}
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
                    ...values,
                    indirectSalariesValue: activitiesTotalValue * serviceFeeAuxiliary?.indirectSalariesCoefficient,
                    indirectSalariesAmount: activitiesTotalValue,
                    indirectSalariesPrice: serviceFeeAuxiliary?.indirectSalariesCoefficient,
                    subcontractExpensesValue
                  });
                  form.resetFields();
                  setSubcontractExpensesValue(0);
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
      <Form
        form={form}
        layout="vertical"
        name="transportationExpenses"
        size="middle"
        fields={[
          {
            name: "indirectSalariesAmount",
            value: activitiesTotalValue
          },
          {
            name: "subcontractExpenseDescription",
            value: "Subcontratación"
          }
        ]}
      >
        <section className="pl-[8rem] flex gap-10 my-4 ">
          <span className="font-semibold">Cantidad</span>
          <span className="font-semibold">Precio</span>
          <span className="font-semibold">Importe</span>
        </section>
        {/* Salarios Indirectos */}
        <section className="flex gap-2 items-center">
          <div className="flex pr-2">
            <span className="font-semibold">Salarios Indirectos:</span>
          </div>
          <div className=" flex w-[5rem]">
            <span>$ {activitiesTotalValue?.toFixed(2)}</span>
          </div>
          <div className=" flex w-[5rem]">
            <span>$ {serviceFeeAuxiliary?.indirectSalariesCoefficient?.toFixed(2)}</span>
          </div>
          <div className=" flex w-[5rem]">
            <span>$ {(activitiesTotalValue * serviceFeeAuxiliary?.indirectSalariesCoefficient)?.toFixed(2)}</span>
          </div>
        </section>
        {/* Subcontratación */}
        <section className="flex gap-2 items-center">
          <div className="flex pr-2">
            <span className="font-semibold">Subcontratación:</span>
          </div>
          <Form.Item className="flex mt-5" name="subcontractAmount">
            <InputNumber
              min={0}
              onChange={() => {
                let values = form.getFieldsValue();
                setSubcontractExpensesValue(values?.subcontractAmount * values?.subcontractPrice);
              }}
            />
          </Form.Item>
          <Form.Item name="subcontractPrice" className="flex mt-5">
            <InputNumber
              min={0}
              onChange={() => {
                let values = form.getFieldsValue();
                setSubcontractExpensesValue(values.subcontractAmount * values.subcontractPrice);
              }}
            />
          </Form.Item>
          <span>$ {!subcontractExpensesValue ? 0 : subcontractExpensesValue?.toFixed(2)}</span>
        </section>
      </Form>
    </Modal>
  );
};

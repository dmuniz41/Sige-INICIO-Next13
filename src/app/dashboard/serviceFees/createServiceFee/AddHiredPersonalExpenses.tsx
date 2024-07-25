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
  const [indirectSalariesValue, setIndirectSalariesValue] = useState(0);
  const [subcontractExpensesValue, setSubcontractExpensesValue] = useState(0);

  const { serviceFeeAuxiliary }: { serviceFeeAuxiliary: IServiceFeeAuxiliary } = useAppSelector((state: RootState) => state?.serviceFee);

  const [form] = Form.useForm();
  return (
    <Modal
      className="flex flex-col"
      title={
        <div className="flex w-full justify-center">
          <span className="font-bold text-lg">Gastos de Personal Contratado</span>
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
                    ...values,
                    indirectSalariesValue: activitiesTotalValue * serviceFeeAuxiliary?.indirectSalariesCoefficient,
                    indirectSalariesAmount: activitiesTotalValue,
                    indirectSalariesPrice: serviceFeeAuxiliary?.indirectSalariesCoefficient,
                    subcontractExpensesValue
                  });
                  form.resetFields();
                  setIndirectSalariesValue(0);
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
          // {
          //   name: "indirectSalariesDescription",
          //   value: "Salarios Indirectos"
          // },
          {
            name: "subcontractExpenseDescription",
            value: "Subcontratación"
          }
          // {
          //   name: "indirectSalariesPrice",
          //   value: serviceFeeAuxiliary?.indirectSalariesCoefficient
          // }
        ]}
      >
        {/* Salarios Indirectos */}
        <section className="flex gap-2 items-center">
          <div className="flex pr-2 w-[13%]">
            <span className="font-bold">Salarios Indirectos:</span>
          </div>
          {/* <Form.Item name="indirectSalariesAmount" label="Cantidad" rules={[{ required: true, message: "Campo requerido" }]}>
            <InputNumber
              min={0}
              onChange={() => {
                let values = form.getFieldsValue();
                setIndirectSalariesValue(values.indirectSalariesAmount * values.indirectSalariesPrice);
              }}
            />
          </Form.Item>
          <Form.Item name="indirectSalariesPrice" label="Precio/UM" rules={[{ required: true, message: "Campo requerido" }]}>
            <InputNumber
              min={0}
              onChange={() => {
                let values = form.getFieldsValue();
                setIndirectSalariesValue(values.indirectSalariesAmount * values.indirectSalariesPrice);
              }}
            />
          </Form.Item> */}
          <div className=" flex flex-col w-[4rem]">
            <span>$ {activitiesTotalValue.toFixed(2)}</span>
          </div>
          <div className=" flex flex-col w-[4rem]">
            <span>$ {serviceFeeAuxiliary?.indirectSalariesCoefficient.toFixed(2)}</span>
          </div>
          <div className=" flex flex-col w-[4rem]">
            <span>$ {(activitiesTotalValue * serviceFeeAuxiliary?.indirectSalariesCoefficient).toFixed(2)}</span>
          </div>
        </section>
        {/* Subcontratación */}
        <section className="flex gap-2 items-center">
          <div className="flex pr-2 w-[13%]">
            <span className="font-bold">Subcontratación:</span>
          </div>
          <Form.Item className="flex mt-5" name="subcontractAmount">
            <InputNumber
              min={0}
              onChange={() => {
                let values = form.getFieldsValue();
                setSubcontractExpensesValue(values.subcontractAmount * values.subcontractPrice);
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

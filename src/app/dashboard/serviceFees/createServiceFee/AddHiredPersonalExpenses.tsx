"use client";
import { Form, Input, InputNumber, Modal } from "antd";
import { useState } from "react";

import { IServiceFeeSubItem } from "@/models/serviceFees";
interface CollectionCreateFormProps {
  open: boolean;
  onCreate: (values: IServiceFeeSubItem) => void;
  onCancel: () => void;
}

export const AddHiredPersonalExpensesModal: React.FC<CollectionCreateFormProps> = ({
  open,
  onCreate,
  onCancel
}) => {
  const [indirectSalariesValue, setIndirectSalariesValue] = useState(0);
  const [subcontractExpensesValue, setSubcontractExpensesValue] = useState(0);

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
                  onCreate({ ...values, indirectSalariesValue, subcontractExpensesValue });
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
            name: "indirectSalariesDescription",
            value: "Salarios Indirectos"
          },
          {
            name: "subcontractExpenseDescription",
            value: "Subcontratación"
          },
          {
            name: "unitMeasure",
            value: ""
          }
        ]}
      >
        {/* Salarios Indirectos */}
        <section className="flex flex-1 gap-2">
          <Form.Item name="indirectSalariesDescription" className="w-[20rem]" label="Descripción">
            <Input style={{ width: "100%" }} />
          </Form.Item>
          <Form.Item name="unitMeasure" className="w-[10rem] hidden" label="Unidad de Medida">
            <Input />
          </Form.Item>
          <Form.Item
            name="indirectSalariesAmount"
            label="Cantidad"
            rules={[{ required: true, message: "Campo requerido" }]}
          >
            <InputNumber
              min={0}
              onChange={() => {
                let values = form.getFieldsValue();
                setIndirectSalariesValue(
                  values.indirectSalariesAmount * values.indirectSalariesPrice
                );
              }}
            />
          </Form.Item>
          <Form.Item name="indirectSalariesPrice" label="Precio/UM">
            <InputNumber
              min={0}
              onChange={() => {
                let values = form.getFieldsValue();
                setIndirectSalariesValue(
                  values.indirectSalariesAmount * values.indirectSalariesPrice
                );
              }}
            />
          </Form.Item>
          <div className=" flex flex-col w-[4rem]">
            <span className="font-bold h-[22px] mb-2">Importe</span>
            <span className="h-[30px] pt-1.5">
              $ {!indirectSalariesValue ? 0 : indirectSalariesValue?.toFixed(2)}
            </span>
          </div>
        </section>
        {/* Subcontratación */}
        <section className="flex flex-1 gap-2">
          <Form.Item name="subcontractExpenseDescription" className="w-[20rem]">
            <Input style={{ width: "100%" }} />
          </Form.Item>
          <Form.Item name="unitMeasure" className="w-[10rem] hidden">
            <Input />
          </Form.Item>
          <Form.Item
            name="subcontractAmount"
            rules={[{ required: true, message: "Campo requerido" }]}
          >
            <InputNumber
              min={0}
              onChange={() => {
                let values = form.getFieldsValue();
                setSubcontractExpensesValue(values.subcontractAmount * values.subcontractPrice);
              }}
            />
          </Form.Item>
          <Form.Item name="subcontractPrice">
            <InputNumber
              min={0}
              onChange={() => {
                let values = form.getFieldsValue();
                setSubcontractExpensesValue(values.subcontractAmount * values.subcontractPrice);
              }}
            />
          </Form.Item>
          <div className=" flex flex-col w-[4rem]">
            <span className="pt-1.5 h-[30px]">
              $ {!subcontractExpensesValue ? 0 : subcontractExpensesValue?.toFixed(2)}
            </span>
          </div>
        </section>
      </Form>
    </Modal>
  );
};

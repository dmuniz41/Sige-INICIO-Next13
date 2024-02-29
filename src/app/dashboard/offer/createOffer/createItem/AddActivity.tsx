"use client";

import { Form, Input, Modal, Select, SelectProps } from "antd";
import { INomenclator } from "@/models/nomenclator";
import { RootState, useAppSelector } from "@/store/store";
import { IServiceFee, IServiceFeeSubItem } from "@/models/serviceFees";
import { useEffect, useState } from "react";
import { IMaterial } from "@/models/material";
import { useAppDispatch } from "@/hooks/hooks";
import { materialsStartLoading } from "@/actions/material";
import { IActivity } from "@/models/offer";
import { serviceFeeStartLoading } from "@/actions/serviceFee";

interface CollectionCreateFormProps {
  open: boolean;
  onCreate: (values: IActivity) => void;
  onCancel: () => void;
}

export const AddActivityModal: React.FC<CollectionCreateFormProps> = ({ open, onCreate, onCancel }) => {
  const [activityValue, setActivityValue] = useState<number>(0);
  const [currentUnitMeasure, setCurrentUnitMeasure] = useState<string>("");
  const [currentPrice, setCurrentPrice] = useState<number>(0);
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(serviceFeeStartLoading());
  }, [dispatch]);

  const { serviceFees }: { serviceFees: IServiceFee[] } = useAppSelector((state: RootState) => state?.serviceFee);

  const listOfActivities: SelectProps["options"] = serviceFees.map((serviceFee) => {
    return {
      label: `${serviceFee.taskName}`,
      value: `${serviceFee.taskName}`,
    };
  });

  const [form] = Form.useForm();
  return (
    <Modal
      className="flex flex-col"
      title={
        <div className="flex w-full justify-center">
          <span className="font-bold text-lg">Nueva Actividad</span>
        </div>
      }
      style={{ textAlign: "left" }}
      centered
      open={open}
      destroyOnClose
      onCancel={onCancel}
      okType="default"
      okText="Crear"
      width={"600px"}
      cancelText="Cancelar"
      footer={[
        <div key="footer" className="flex gap-2 w-full justify-end">
          <button key="2" className="modal-btn-danger" onClick={onCancel}>
            Cancelar
          </button>
          <button
            key="1"
            className="modal-btn-primary"
            onClick={() => {
              form
                .validateFields()
                .then((values) => {
                  onCreate({
                    amount: values.amount,
                    description: values.description.value,
                    price: Number(currentPrice.toFixed(2)),
                    unitMeasure: currentUnitMeasure,
                    value: Number(activityValue.toFixed(2)),
                  });
                  form.resetFields();
                  setActivityValue(0);
                  setCurrentPrice(0);
                  setCurrentUnitMeasure("");
                })
                .catch((error) => {
                  console.log("Validate Failed:", error);
                });
            }}
          >
            Añadir
          </button>
        </div>,
      ]}
    >
      <Form form={form} layout="horizontal" name="addActivity" size="middle">
        <Form.Item name="description" label="Descripción" rules={[{ required: true, message: "Campo requerido" }]}>
          <Select
            autoFocus
            allowClear
            labelInValue
            style={{ width: "100%" }}
            options={listOfActivities}
            onSelect={(value) => {
              const selectedServiceFee = serviceFees.find((serviceFee) => serviceFee.taskName === value.label);
              setCurrentUnitMeasure(selectedServiceFee?.valuePerUnitMeasure!);
              setCurrentPrice(selectedServiceFee?.salePrice!);

              form.setFieldsValue({
                unitMeasure: selectedServiceFee?.valuePerUnitMeasure,
                price: form.getFieldValue("description")?.value,
              });
            }}
            showSearch
            optionFilterProp="children"
            filterOption={(input: any, option: any) => (option?.label ?? "").toLowerCase().includes(input)}
            filterSort={(optionA: any, optionB: any) => (optionA?.label ?? "").toLowerCase().localeCompare((optionB?.label ?? "").toLowerCase())}
          />
        </Form.Item>
        <Form.Item name="amount" label="Cantidad" className="w-[10rem]" rules={[{ required: true, message: "Campo requerido" }]}>
          <Input
            onChange={() => {
              setActivityValue(form.getFieldValue("amount") * currentPrice);
            }}
          />
        </Form.Item>
        <div className=" flex gap-2 pl-2 mb-4">
          <span className="font-bold">Unidad de Medida:</span>
          <span>{currentUnitMeasure}</span>
        </div>
        <div className=" flex gap-2 pl-2 mb-4">
          <span className="font-bold">Precio:</span>
          <span>${currentPrice?.toFixed(2)}</span>
        </div>
        <div className=" flex gap-2 pl-2 mb-4">
          <span className="font-bold">Importe:</span>
          <span>${activityValue?.toFixed(2)}</span>
        </div>
      </Form>
    </Modal>
  );
};

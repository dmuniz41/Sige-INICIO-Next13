"use client";

import { Form, Input, Modal, Select, SelectProps } from "antd";
import { INomenclator } from "@/models/nomenclator";
import { RootState, useAppSelector } from "@/store/store";
import { IServiceFeeSubItem } from "@/models/serviceFees";
import { useState } from "react";
import { IMaterial } from "@/models/material";

interface CollectionCreateFormProps {
  open: boolean;
  onCreate: (values: IServiceFeeSubItem) => void;
  onCancel: () => void;
}

export const AddRawMaterialModal: React.FC<CollectionCreateFormProps> = ({ open, onCreate, onCancel }) => {
  const { nomenclators }: { nomenclators: INomenclator[] } = useAppSelector((state: RootState) => state?.nomenclator);
  const { materials }: { materials: IMaterial[] } = useAppSelector((state: RootState) => state?.material);
  const DBMaterials: INomenclator[] = [];
  const [rawMaterialValue, setRawMaterialValue] = useState<number>(0);
  const [currentUnitMeasure, setCurrentUnitMeasure] = useState<string>("");
  const [currentPrice, setCurrentPrice] = useState<number>(0);

  nomenclators.map((nomenclator: INomenclator) => {
    if (nomenclator.category === "Material") {
      DBMaterials.push(nomenclator);
    }
  });
  const listOfMaterials: SelectProps["options"] = DBMaterials.map((material) => {
    return {
      label: `${material.code}`,
      value: `${material.value}`,
    };
  });

  const [form] = Form.useForm();
  return (
    <Modal
      className="flex flex-col"
      title={
        <div className="flex w-full justify-center">
          <span className="font-black text-lg">Nueva Materia Prima</span>
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
                  onCreate({ ...values, description: values.description.label, unitMeasure: currentUnitMeasure, price: currentPrice, value: rawMaterialValue });
                  form.resetFields();
                  setRawMaterialValue(0);
                  setCurrentPrice(0)
                  setCurrentUnitMeasure("")
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
      <Form form={form} layout="horizontal" name="addRawMaterial" size="middle">
        <Form.Item name="description" label="Descripción" rules={[{ required: true, message: "Campo requerido" }]}>
          <Select
            autoFocus
            allowClear
            labelInValue
            style={{ width: "100%" }}
            options={listOfMaterials}
            onSelect={(value) => {
              let selectedMaterial = materials.find((material) => `${material.category} ${material.materialName}` === value.label);
              setCurrentUnitMeasure(selectedMaterial?.unitMeasure!);
              setCurrentPrice(selectedMaterial?.costPerUnit!);
              console.log(selectedMaterial?.costPerUnit);

              form.setFieldsValue({
                unitMeasure: selectedMaterial?.unitMeasure,
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
              let amount: number = form.getFieldValue("amount");
              setRawMaterialValue(amount * currentPrice);
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
          <span>${rawMaterialValue?.toFixed(2)}</span>
        </div>
      </Form>
    </Modal>
  );
};

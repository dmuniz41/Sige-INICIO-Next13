"use client";

import { Form, Input, InputNumber, Modal, Select, SelectProps } from "antd";
import { INomenclator } from "@/models/nomenclator";
import { RootState, useAppSelector } from "@/store/store";
import { IServiceFeeSubItem } from "@/models/serviceFees";
import { useEffect, useState } from "react";
import { IMaterial } from "@/models/material";
import { useAppDispatch } from "@/hooks/hooks";
import { materialsStartLoading } from "@/actions/material";

interface CollectionCreateFormProps {
  open: boolean;
  onCreate: (values: IServiceFeeSubItem) => void;
  onCancel: () => void;
}

export const AddRawMaterialModal: React.FC<CollectionCreateFormProps> = ({ open, onCreate, onCancel }) => {
  const [currentPrice, setCurrentPrice] = useState<number>(0);
  const [currentUnitMeasure, setCurrentUnitMeasure] = useState<string>("");
  const [rawMaterialValue, setRawMaterialValue] = useState<number>(0);
  const { materials }: { materials: IMaterial[] } = useAppSelector((state: RootState) => state?.material);
  const { nomenclators }: { nomenclators: INomenclator[] } = useAppSelector((state: RootState) => state?.nomenclator);
  const DBMaterials: INomenclator[] = [];
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(materialsStartLoading("653957480a9e16fed4c1bbd5"));
  }, [dispatch]);
  
  nomenclators.map((nomenclator: INomenclator) => {
    if (nomenclator.category === "Material") {
      DBMaterials.push(nomenclator);
    }
  });
  const listOfMaterials: SelectProps["options"] = DBMaterials.map((material) => {
    return {
      label: `${material.code}`,
      value: `${material.code}`,
    };
  });

  const [form] = Form.useForm();
  return (
    <Modal
      className="flex flex-col"
      title={
        <div className="flex w-full justify-center">
          <span className="font-bold text-lg">Nueva Materia Prima</span>
        </div>
      }
      style={{ textAlign: "left" }}
      centered
      open={open}
      destroyOnClose
      onCancel={onCancel}
      okType="default"
      okText="Crear"
      width={'600px'}
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
                  onCreate({ ...values, description: values.description.label, unitMeasure: currentUnitMeasure, price: currentPrice, value: rawMaterialValue });
                  form.resetFields();
                  setRawMaterialValue(0);
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
      <Form form={form} layout="horizontal" name="addRawMaterial" size="middle">
        <Form.Item name="description" label="Descripción" rules={[{ required: true, message: "Campo requerido" }]}>
          <Select
            autoFocus
            allowClear
            labelInValue
            style={{ width: "100%" }}
            options={listOfMaterials}
            onSelect={(value) => {
              const selectedMaterial = materials.find((material) => `${material.category} ${material.materialName}` === value.label);
              setCurrentUnitMeasure(selectedMaterial?.unitMeasure!);
              setCurrentPrice(selectedMaterial?.costPerUnit!);

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
          <InputNumber min={0}
            onChange={(value: number | null) => {
              setRawMaterialValue(value! * currentPrice);
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

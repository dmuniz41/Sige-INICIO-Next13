"use client";

import { Form, InputNumber, Modal, Select, SelectProps } from "antd";
import { useState } from "react";

import { IServiceFeeSubItem } from "@/models/serviceFees";
import { RootState, useAppSelector } from "@/store/store";
import { IServiceFeeAuxiliary } from "@/models/serviceFeeAuxiliary";

interface CollectionCreateFormProps {
  open: boolean;
  onCreate: (values: IServiceFeeSubItem) => void;
  onCancel: () => void;
}

export const AddEquipmentDepreciationModal: React.FC<CollectionCreateFormProps> = ({ open, onCreate, onCancel }) => {
  const { serviceFeeAuxiliary }: { serviceFeeAuxiliary: IServiceFeeAuxiliary } = useAppSelector((state: RootState) => state?.serviceFee);
  console.log("🚀 ~ serviceFeeAuxiliary:", serviceFeeAuxiliary.equipmentDepreciationCoefficients);
  const [currentPrice, setCurrentPrice] = useState(0);
  const [currentEquipmentDepreciation, setCurrentEquipmentDepreciation] = useState<{ name: string; value: number }>({
    name: "",
    value: 0,
  });

  const listOfEquipmentDepreciation: SelectProps["options"] = serviceFeeAuxiliary?.equipmentDepreciationCoefficients?.map((equipmentDepreciation) => {
    return {
      label: `${equipmentDepreciation.name}`,
      value: `${equipmentDepreciation.name}`,
    };
  });

  const [form] = Form.useForm();
  return (
    <Modal
      className="flex flex-col"
      title={
        <div className="flex w-full justify-center">
          <span className="font-black text-lg">Nueva Depreciación de Equipo</span>
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
                    description: values.description,
                    amount: values.amount,
                    unitMeasure: "$/h",
                    price: currentEquipmentDepreciation.value,
                    value: currentPrice,
                  });
                  form.resetFields();
                  setCurrentEquipmentDepreciation({ name: "", value: 0 });
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
      <Form form={form} layout="horizontal" name="addEquipmentDepreciation" size="middle">
        <Form.Item name="description" label="Descripción" rules={[{ required: true, message: "Campo requerido" }]}>
          <Select
            allowClear
            options={listOfEquipmentDepreciation}
            style={{ width: "100%" }}
            onSelect={(value: any) => {
              const selectedEquipmentDepreciation = serviceFeeAuxiliary?.equipmentDepreciationCoefficients?.find((equipmentDepreciation) => equipmentDepreciation.name === value);
              setCurrentEquipmentDepreciation(selectedEquipmentDepreciation!);
              form.setFieldsValue({
                unitMeasure: "$/m2",
                price: form.getFieldValue("amount") * selectedEquipmentDepreciation?.value!,
              });
              setCurrentPrice(form.getFieldValue("amount") * selectedEquipmentDepreciation?.value!);
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
              setCurrentPrice(form.getFieldValue("amount") * currentEquipmentDepreciation?.value);
            }}
          />
        </Form.Item>
        <div className=" flex gap-2 pl-2 mb-4">
          <span className="font-bold">Unidad de Medida:</span>
          <span>$/m2</span>
        </div>
        <div className=" flex gap-2 pl-2 mb-4">
          <span className="font-bold">Precio/UM:</span>
          <span>${currentEquipmentDepreciation?.value?.toFixed(2)}</span>
        </div>
        <div className=" flex gap-2 pl-2 mb-4">
          <span className="font-bold">Importe:</span>
          <span>${!currentPrice ? 0 : currentPrice?.toFixed(2)}</span>
        </div>
      </Form>
    </Modal>
  );
};

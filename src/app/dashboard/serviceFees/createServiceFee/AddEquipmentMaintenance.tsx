"use client";

import { Form, Input, InputNumber, Modal, Select, SelectProps } from "antd";
import { RootState, useAppSelector } from "@/store/store";
import { IServiceFeeSubItem } from "@/models/serviceFees";
import { useState } from "react";
import { IServiceFeeAuxiliary } from "@/models/serviceFeeAuxiliary";

interface CollectionCreateFormProps {
  open: boolean;
  onCreate: (values: IServiceFeeSubItem) => void;
  onCancel: () => void;
}

export const AddEquipmentMaintenanceModal: React.FC<CollectionCreateFormProps> = ({ open, onCreate, onCancel }) => {
  const { serviceFeeAuxiliary }: { serviceFeeAuxiliary: IServiceFeeAuxiliary } = useAppSelector((state: RootState) => state?.serviceFee);
  const [currentPrice, setCurrentPrice] = useState(0);
  const [currentEquipmentMaintenance, setCurrentEquipmentMaintenance] = useState<{ name: string; value: number }>({
    name: "",
    value: 0,
  });

  const listOfEquipmentMaintenance: SelectProps["options"] = serviceFeeAuxiliary?.equipmentMaintenanceCoefficients?.map((equipmentMaintenance) => {
    return {
      label: `${equipmentMaintenance.name}`,
      value: `${equipmentMaintenance.name}`,
    };
  });

  const [form] = Form.useForm();
  return (
    <Modal
      className="flex flex-col"
      title={
        <div className="flex w-full justify-center">
          <span className="font-bold text-lg">Nuevo Mantenimiento de Equipo</span>
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
                    price: currentEquipmentMaintenance.value,
                    value: currentPrice,
                  });
                  form.resetFields();
                  setCurrentEquipmentMaintenance({ name: "", value: 0 });
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
      <Form form={form} layout="horizontal" name="addEquipmentMaintenance" size="middle">
        <Form.Item name="description" label="Descripción" rules={[{ required: true, message: "Campo requerido" }]}>
          <Select
            allowClear
            options={listOfEquipmentMaintenance}
            style={{ width: "100%" }}
            onSelect={(value: any) => {
              const selectedEquipmentMaintenance = serviceFeeAuxiliary?.equipmentMaintenanceCoefficients?.find((equipmentMaintenance) => equipmentMaintenance.name === value);
              setCurrentEquipmentMaintenance(selectedEquipmentMaintenance!);
              form.setFieldsValue({
                unitMeasure: "$/m2",
                price: form.getFieldValue("amount") * selectedEquipmentMaintenance?.value!,
              });
              setCurrentPrice(form.getFieldValue("amount") * selectedEquipmentMaintenance?.value!);
            }}
            showSearch
            optionFilterProp="children"
            filterOption={(input: any, option: any) => (option?.label ?? "").toLowerCase().includes(input)}
            filterSort={(optionA: any, optionB: any) => (optionA?.label ?? "").toLowerCase().localeCompare((optionB?.label ?? "").toLowerCase())}
          />
        </Form.Item>
        <Form.Item name="amount" label="Cantidad" className="w-[10rem]" rules={[{ required: true, message: "Campo requerido" }]}>
          <InputNumber
            onChange={(value: any) => {
              setCurrentPrice(value * currentEquipmentMaintenance?.value!);
            }}
          />
        </Form.Item>
        <div className=" flex gap-2 pl-2 mb-4">
          <span className="font-bold">Unidad de Medida:</span>
          <span>$/m2</span>
        </div>
        <div className=" flex gap-2 pl-2 mb-4">
          <span className="font-bold">Precio/UM:</span>
          <span>${currentEquipmentMaintenance?.value?.toFixed(2)}</span>
        </div>
        <div className=" flex gap-2 pl-2 mb-4">
          <span className="font-bold">Importe:</span>
          <span>${!currentPrice ? 0 : currentPrice?.toFixed(2)}</span>
        </div>
      </Form>
    </Modal>
  );
};

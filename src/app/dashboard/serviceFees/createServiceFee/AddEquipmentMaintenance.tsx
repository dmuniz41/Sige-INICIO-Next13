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

export const AddEquipmentMaintenanceModal: React.FC<CollectionCreateFormProps> = ({ open, onCreate, onCancel }) => {
  const { serviceFeeAuxiliary }: any = useAppSelector((state: RootState) => state?.serviceFee);
  const equipmentNames = [
    {
      name: "Plotter de Impresión y corte",
      coefficient: serviceFeeAuxiliary[0]?.equipmentMaintenanceCoefficients.plotter,
    },
    {
      name: "Router",
      coefficient: serviceFeeAuxiliary[0]?.equipmentMaintenanceCoefficients.router,
    },
  ];
  const [equipmentMaintenanceValue, setEquipmentMaintenanceValue] = useState(0);

  const equipments: SelectProps["options"] = equipmentNames.map((equipment) => {
    return {
      label: `${equipment.name}`,
      value: `${equipment.name}`,
    };
  });

  const [form] = Form.useForm();
  return (
    <Modal
      className="flex flex-col"
      title={
        <div className="flex w-full justify-center">
          <span className="font-black text-lg">Nuevo Mantenimiento de Equipo</span>
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
                  onCreate({ ...values, value: equipmentMaintenanceValue });
                  form.resetFields();
                  setEquipmentMaintenanceValue(0);
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
            onSelect={() => {
              let values = form.getFieldsValue();
              equipmentNames.map((equipment) => {
                if (values.description === equipment.name)
                  form.setFieldsValue({
                    unitMeasure: "m2",
                    price: equipment.coefficient,
                  });
              });
              setEquipmentMaintenanceValue(values.amount * values.price);
            }}
            style={{ width: "100%" }}
            options={equipments}
            showSearch
            optionFilterProp="children"
            filterOption={(input: any, option: any) => (option?.label ?? "").toLowerCase().includes(input)}
            filterSort={(optionA: any, optionB: any) => (optionA?.label ?? "").toLowerCase().localeCompare((optionB?.label ?? "").toLowerCase())}
          />
        </Form.Item>
        <Form.Item name="unitMeasure" label="Unidad de Medida" rules={[{ required: true, message: "Campo requerido" }]}>
          <Input />
        </Form.Item>
        <Form.Item name="amount" label="Cantidad" className="w-[10rem]" rules={[{ required: true, message: "Campo requerido" }]}>
          <InputNumber
            onChange={() => {
              let values = form.getFieldsValue();
              setEquipmentMaintenanceValue(values.amount * values.price);
            }}
          />
        </Form.Item>
        <Form.Item name="price" label="Precio" className="w-[10rem]" rules={[{ required: true, message: "Campo requerido" }]}>
          <InputNumber />
        </Form.Item>
        <div className=" flex gap-2 pl-2">
          <span className="font-bold">Importe:</span>
          <span>${!equipmentMaintenanceValue ? 0 : equipmentMaintenanceValue?.toFixed(2)}</span>
        </div>
      </Form>
    </Modal>
  );
};
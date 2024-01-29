"use client";

import { Form, Input, InputNumber, Modal, Select, SelectProps, Tag } from "antd";
import { INomenclator } from "@/models/nomenclator";
import { IServiceFeeTask } from "@/models/serviceFeeTask";
import { RootState, useAppSelector } from "@/store/store";

interface CollectionCreateFormProps {
  open: boolean;
  onCancel: () => void;
  defaultValues: IServiceFeeTask;
}

export const ServiceFeeTaskView: React.FC<CollectionCreateFormProps> = ({ open, onCancel, defaultValues }) => {
  const { nomenclators }: any = useAppSelector((state: RootState) => state?.nomenclator);
  const categories: string[] | undefined = [];
  const unitMeasures: string[] | undefined = [];

  nomenclators.map((nomenclator: INomenclator) => {
    if (nomenclator.category === "Categoría de tareas") categories.push(nomenclator.code);
    if (nomenclator.category === "Unidad de medida") unitMeasures.push(nomenclator.code);
  });

  const categoryOptions: SelectProps["options"] = categories.map((category) => {
    return {
      label: `${category}`,
      value: `${category}`,
    };
  });

  const unitMeasureOptions: SelectProps["options"] = unitMeasures.map((UM) => {
    return {
      label: `${UM}`,
      value: `${UM}`,
    };
  });

  const [form] = Form.useForm();
  return (
    <Modal
      className="flex flex-col"
      title={
        <div className="flex w-full justify-center">
          <span className="font-black text-lg">Tarea</span>
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
      footer={<></>}
    >
      <section className="grid gap-2">
        <div className="flex gap-2">
          <label className="font-bold text-md">Descripción: </label>
          <label>{defaultValues?.description}</label>
        </div>
        <div className="flex gap-2">
          <label className="font-bold text-md">Categoría: </label>
          <label>{defaultValues?.category}</label>
        </div>
        <div className="flex gap-2">
          <label className="font-bold text-md">Unidad de Medida: </label>
          <label>{defaultValues?.unitMeasure}</label>
        </div>
        <div className="flex gap-2">
          <label className="font-bold text-md">Cantidad: </label>
          <label>{defaultValues?.amount.toFixed(2)}</label>
        </div>
        <div className="flex gap-2">
          <label className="font-bold text-md">Precio: </label>
          <label>${defaultValues?.price.toFixed(2)}</label>
        </div>
      </section>
      <section className="grid gap-2 mt-2">
        <span className="text-md font-bold">Coeficientes de Complejidad:</span>
        <div className="grid gap-2">
          <div className="flex gap-2">
            <Tag color="red" className="font-bold text-md">
              Alta
            </Tag>
            :<label>{defaultValues?.complexityLevels[0]?.coefficient?.toFixed(2)}</label>
          </div>
          <div className="flex gap-2">
            <Tag color="orange" className="font-bold text-md">
              Media
            </Tag>
            :<label>{defaultValues?.complexityLevels[1]?.coefficient?.toFixed(2)}</label>
          </div>
          <div className="flex gap-2">
            <Tag color="green" className="font-bold text-md">
              Baja
            </Tag>
            :<label>{defaultValues?.complexityLevels[2]?.coefficient?.toFixed(2)}</label>
          </div>
        </div>
      </section>
    </Modal>
  );
};

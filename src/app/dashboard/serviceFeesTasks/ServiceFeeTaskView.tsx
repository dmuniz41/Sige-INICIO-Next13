"use client";

import { Form, Input, InputNumber, Modal, Select, SelectProps } from "antd";
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
      footer={[
        <div key="footer" className="flex gap-2 w-full justify-end">
          <button
            key="2"
            className="bg-danger-500 cursor-pointer hover:bg-danger-600 ease-in-out duration-300 w-[5rem] h-[2rem] flex items-center p-1 text-sm font-bold text-white-100  justify-center gap-2 rounded-md"
            onClick={onCancel}
          >
            Cancelar
          </button>
        </div>,
      ]}
    >
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
        <label>{defaultValues?.amount}</label>
      </div>
      <div className="flex gap-2">
        <label className="font-bold text-md">Precio: </label>
        <label>{defaultValues?.price}</label>
      </div>
      <section className="grid">
        <span className="text-md font-bold">Coeficientes de Complejidad</span>

        <div className="flex gap-2">
          <label className="font-bold text-md">Alta: </label>
          <label>{defaultValues?.complexityLevels[0].coefficient}</label>
        </div>
        <div className="flex gap-2">
          <label className="font-bold text-md">Media: </label>
          <label>{defaultValues?.complexityLevels[1].coefficient}</label>
        </div>
        <div className="flex gap-2">
          <label className="font-bold text-md">Baja: </label>
          <label>{defaultValues?.complexityLevels[2].coefficient}</label>
        </div>
      </section>
    </Modal>
  );
};

"use client";

import { Form, InputNumber, Modal, Select, SelectProps } from "antd";
import { useMemo, useState } from "react";

import { IServiceFeeSubItem } from "@/models/serviceFees";
import { RootState, useAppSelector } from "@/store/store";
import { IServiceFeeAuxiliary } from "@/models/serviceFeeAuxiliary";
import { IServiceFeeTask } from "@/models/serviceFeeTask";

interface CollectionCreateFormProps {
  open: boolean;
  onCreate: (values: IServiceFeeSubItem) => void;
  onCancel: () => void;
  taskList: IServiceFeeTask[];
}

export const AddEquipmentDepreciationModal: React.FC<CollectionCreateFormProps> = ({ open, onCreate, onCancel, taskList }) => {
  const { serviceFeeAuxiliary }: { serviceFeeAuxiliary: IServiceFeeAuxiliary } = useAppSelector((state: RootState) => state?.serviceFee);
  const [currentTotalTime, setCurrentTotalTime] = useState(0);
  const [selectedEquipmentDepreciation, setSelectedEquipmentDepreciation] = useState<any>({});
  const price = useMemo(() => currentTotalTime * selectedEquipmentDepreciation?.value!, [currentTotalTime, selectedEquipmentDepreciation]);

  // ? CALCULA EL TIEMPO DE CADA CATEGORIA DE TAREA QUE IMPLIQUE EL USO DE EQUIPOS, SI LA TAREA NO HACE MATCH RETORNA 0? //
  // * ROUTER * //
  const routerTasks = taskList?.map((task) => {
    if (task.description.includes("Routeado")) return task;
  });
  const totalRouterTime = routerTasks
    ?.map((task) => {
      if (!task) {
        return 0;
      } else {
        return task?.currentComplexity?.time! * task?.amount;
      }
    })
    ?.reduce((accumulator: number, currentValue) => accumulator + currentValue!, 0);

  // * PLOTTER * //
  const plotterTasks = taskList?.map((task) => {
    if (task.description.includes("Rotulado") || task.description.includes("Impresión")) {
      return task;
    }
  });
  const totalPlotterTime = plotterTasks
    ?.map((task) => {
      if (!task) {
        return 0;
      } else {
        return task?.currentComplexity?.time! * task?.amount;
      }
    })
    ?.reduce((accumulator: number, currentValue) => accumulator + currentValue!, 0);

  // * DOBLADORA * //
  const bendingMachineTasks = taskList?.map((task) => {
    if (task.description.includes("Doblado")) {
      return task;
    }
  });
  const totalBendingMachineTime = bendingMachineTasks
    ?.map((task) => {
      if (!task) {
        return 0;
      } else {
        return task?.currentComplexity?.time! * task?.amount;
      }
    })
    ?.reduce((accumulator: number, currentValue) => accumulator + currentValue!, 0);

  // * HERRAMIENTAS MANUALES * //
  const manualTools = taskList?.map((task) => {
    if (task.description.includes("Montaje") || task.description.includes("Armado")) {
      return task;
    }
  });
  const totalManualToolsTime = manualTools
    ?.map((task) => {
      if (!task) {
        return 0;
      } else {
        return task?.currentComplexity?.time! * task?.amount;
      }
    })
    ?.reduce((accumulator: number, currentValue) => accumulator + currentValue!, 0);

  const listOfEquipmentDepreciation: SelectProps["options"] = serviceFeeAuxiliary?.equipmentDepreciationCoefficients?.map(
    (equipmentDepreciation) => {
      return {
        label: `${equipmentDepreciation.name}`,
        value: `${equipmentDepreciation.name}`
      };
    }
  );

  const [form] = Form.useForm();
  return (
    <Modal
      className="flex flex-col"
      title={
        <div className="flex justify-center w-full">
          <span className="text-lg font-semibold">Nueva Depreciación de Equipo</span>
        </div>
      }
      style={{ textAlign: "left" }}
      cancelText="Cancelar"
      centered
      destroyOnClose
      okText="Crear"
      okType="default"
      onCancel={onCancel}
      open={open}
      width={"1000px"}
      footer={[
        <div key="footer" className="flex justify-end w-full gap-2">
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
                    description: values.description,
                    amount: currentTotalTime,
                    unitMeasure: "$/h",
                    price: selectedEquipmentDepreciation.value,
                    value: price
                  });
                  form.resetFields();
                  setSelectedEquipmentDepreciation({});
                  setCurrentTotalTime(0);
                })
                .catch((error) => {
                  console.log("Validate Failed:", error);
                });
            }}
          >
            Añadir
          </button>
        </div>
      ]}
    >
      <Form form={form} layout="horizontal" name="addEquipmentDepreciation" size="middle">
        <Form.Item name="description" label="Descripción" rules={[{ required: true, message: "Campo requerido" }]}>
          <Select
            allowClear
            options={listOfEquipmentDepreciation}
            style={{ width: "100%" }}
            onSelect={(value: any) => {
              switch (value) {
                case "Plotter":
                  setCurrentTotalTime(totalPlotterTime);
                  setSelectedEquipmentDepreciation(
                    serviceFeeAuxiliary?.equipmentDepreciationCoefficients?.find(
                      (equipmentDepreciation) => equipmentDepreciation.name === "Plotter"
                    )!
                  );
                  break;
                case "Router":
                  setCurrentTotalTime(totalRouterTime);
                  setSelectedEquipmentDepreciation(
                    serviceFeeAuxiliary?.equipmentDepreciationCoefficients?.find(
                      (equipmentDepreciation) => equipmentDepreciation.name === "Router"
                    )!
                  );
                  break;
                case "Dobladora":
                  setCurrentTotalTime(totalBendingMachineTime);
                  setSelectedEquipmentDepreciation(
                    serviceFeeAuxiliary?.equipmentDepreciationCoefficients?.find(
                      (equipmentDepreciation) => equipmentDepreciation.name === "Dobladora"
                    )!
                  );
                  break;
                case "Herramientas Manuales":
                  setCurrentTotalTime(totalManualToolsTime);
                  setSelectedEquipmentDepreciation(
                    serviceFeeAuxiliary?.equipmentDepreciationCoefficients?.find(
                      (equipmentDepreciation) => equipmentDepreciation.name === "Herramientas Manuales"
                    )!
                  );
                  break;
                default:
                  break;
              }
            }}
            showSearch
            optionFilterProp="children"
            filterOption={(input: any, option: any) => (option?.label ?? "").toLowerCase().includes(input)}
            filterSort={(optionA: any, optionB: any) =>
              (optionA?.label ?? "").toLowerCase().localeCompare((optionB?.label ?? "").toLowerCase())
            }
          />
        </Form.Item>
        <div className="flex gap-2 pl-2 mb-4 ">
          <span className="font-semibold">Total de horas:</span>
          <span>{currentTotalTime?.toLocaleString("DE", { maximumFractionDigits: 2, minimumFractionDigits: 2 })} h</span>
        </div>
        <div className="flex gap-2 pl-2 mb-4 ">
          <span className="font-semibold">Precio/UM:</span>
          <span>${selectedEquipmentDepreciation?.value?.toLocaleString("DE", { maximumFractionDigits: 2, minimumFractionDigits: 2 })}</span>
        </div>
        <div className="flex gap-2 pl-2 mb-4 ">
          <span className="font-semibold">Importe:</span>
          <span>${!price ? 0 : price?.toLocaleString("DE", { maximumFractionDigits: 2, minimumFractionDigits: 2 })}</span>
        </div>
      </Form>
    </Modal>
  );
};

"use client";
import { Form, InputNumber, Modal, Select, SelectProps } from "antd";
import { useMemo, useState } from "react";

import { IServiceFeeAuxiliary } from "@/models/serviceFeeAuxiliary";
import { IServiceFeeSubItem } from "@/models/serviceFees";
import { RootState, useAppSelector } from "@/store/store";
import { IServiceFeeTask } from "@/models/serviceFeeTask";

interface CollectionCreateFormProps {
  open: boolean;
  onCreate: (values: IServiceFeeSubItem) => void;
  onCancel: () => void;
  taskList: IServiceFeeTask[];
}

export const AddEquipmentMaintenanceModal: React.FC<CollectionCreateFormProps> = ({ open, onCreate, onCancel, taskList }) => {
  const { serviceFeeAuxiliary }: { serviceFeeAuxiliary: IServiceFeeAuxiliary } = useAppSelector((state: RootState) => state?.serviceFee);
  const [currentTotalTime, setCurrentTotalTime] = useState(0);
  const [selectedEquipmentMaintenance, setsSelectedEquipmentMaintenance] = useState<any>({});
  const price = useMemo(() => currentTotalTime * selectedEquipmentMaintenance?.value!, [currentTotalTime, selectedEquipmentMaintenance]);

  // ? CALCULA EL TIEMPO DE CADA CATEGORIA DE TAREA QUE IMPLIQUE EL USO DE EQUIPOS, SI LA TAREA NO HACE MATCH RETORNA 0? //
  // * ROUTER * //
  const routerTasks = taskList?.map((task) => {
    if (task.category === "Routeado") return task;
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
    if (task.category === "Rotulado" || task.category === "Impresión") {
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
    if (task.category === "Doblado") {
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

  const listOfEquipmentMaintenance: SelectProps["options"] = serviceFeeAuxiliary?.equipmentMaintenanceCoefficients?.map(
    (equipmentMaintenance) => {
      return {
        label: `${equipmentMaintenance.name}`,
        value: `${equipmentMaintenance.name}`
      };
    }
  );

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
      cancelText="Cancelar"
      centered
      destroyOnClose
      okText="Crear"
      okType="default"
      onCancel={onCancel}
      open={open}
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
                  onCreate({
                    description: values.description,
                    amount: currentTotalTime,
                    unitMeasure: "$/h",
                    price: selectedEquipmentMaintenance.value,
                    value: price
                  });
                  form.resetFields();
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
      <Form form={form} layout="horizontal" name="addEquipmentMaintenance" size="middle">
        <Form.Item name="description" label="Descripción" rules={[{ required: true, message: "Campo requerido" }]}>
          <Select
            allowClear
            options={listOfEquipmentMaintenance}
            style={{ width: "100%" }}
            onSelect={(value: any) => {
              switch (value) {
                case "Plotter":
                  setCurrentTotalTime(totalPlotterTime);
                  setsSelectedEquipmentMaintenance(
                    serviceFeeAuxiliary?.equipmentMaintenanceCoefficients?.find(
                      (equipmentMaintenance) => equipmentMaintenance.name === "Plotter"
                    )!
                  );
                  break;
                case "Router":
                  setCurrentTotalTime(totalRouterTime);
                  setsSelectedEquipmentMaintenance(
                    serviceFeeAuxiliary?.equipmentMaintenanceCoefficients?.find(
                      (equipmentMaintenance) => equipmentMaintenance.name === "Router"
                    )!
                  );
                  break;
                case "Dobladora":
                  setCurrentTotalTime(totalBendingMachineTime);
                  setsSelectedEquipmentMaintenance(
                    serviceFeeAuxiliary?.equipmentMaintenanceCoefficients?.find(
                      (equipmentMaintenance) => equipmentMaintenance.name === "Dobladora"
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
        <div className=" flex gap-2 pl-2 mb-4">
          <span className="font-bold">Total de horas:</span>
          <span>{currentTotalTime?.toLocaleString("DE", { maximumFractionDigits: 2, minimumFractionDigits: 2 })} h</span>
        </div>
        <div className=" flex gap-2 pl-2 mb-4">
          <span className="font-bold">Precio/UM:</span>
          <span>${selectedEquipmentMaintenance?.value?.toLocaleString("DE", { maximumFractionDigits: 2, minimumFractionDigits: 2 })}</span>
        </div>
        <div className=" flex gap-2 pl-2 mb-4">
          <span className="font-bold">Importe:</span>
          <span>${!price ? 0 : price?.toLocaleString("DE", { maximumFractionDigits: 2, minimumFractionDigits: 2 })}</span>
        </div>
      </Form>
    </Modal>
  );
};

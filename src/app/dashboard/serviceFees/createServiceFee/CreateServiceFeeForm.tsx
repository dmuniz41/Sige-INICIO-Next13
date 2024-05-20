"use client";
import { Form, Input, InputNumber, Select, SelectProps } from "antd";
import React, { useEffect, useState } from "react";

import { AddAdministrativeExpensesModal } from "./AddAdministrativeExpenses";
import { AddEquipmentDepreciationModal } from "./AddEquipmentDepreciation";
import { AddEquipmentMaintenanceModal } from "./AddEquipmentMaintenance";
import { AddHiredPersonalExpensesModal } from "./AddHiredPersonalExpenses";
import { AddRawMaterialModal } from "./AddRawMaterial";
import { AddTaskListModal } from "./AddTaskList";
import { AddTransportationExpensesModal } from "./AddTransportationExpenses";
import { INomenclator } from "@/models/nomenclator";
import { IServiceFeeAuxiliary } from "@/models/serviceFeeAuxiliary";
import { nomenclatorsStartLoading } from "@/actions/nomenclator";
import { RootState, useAppSelector } from "@/store/store";
import { startAddServiceFee } from "@/actions/serviceFee";
import { startLoadServiceFeeAuxiliary } from "@/actions/serviceFeeAuxiliary";
import { startLoadServiceFeesTasks } from "@/actions/serviceFeeTask";
import { TableFormSection } from "../editServiceFee/EditServiceFeeForm";
import { useAppDispatch } from "@/hooks/hooks";
import { useRouter } from "next/navigation";
import TextArea from "antd/es/input/TextArea";

export const CreateServiceFeeForm = () => {
  const [form] = Form.useForm();
  const dispatch = useAppDispatch();
  const router = useRouter();
  const serviceFeeCategory: string[] | undefined = [];
  const unitMeasureNomenclators: string[] | undefined = [];

  // * ESTADOS DE MODALES DE CREAR //
  const [addAdministrativeExpensesModal, setAddAdministrativeExpensesModal] = useState(false);
  const [addEquipmentDepreciationModal, setAddEquipmentDepreciationModal] = useState(false);
  const [addEquipmentMaintenanceModal, setAddEquipmentMaintenanceModal] = useState(false);
  const [addHiredPersonalExpensesModal, setAddHiredPersonalExpensesModal] = useState(false);
  const [addRawMaterialModal, setAddRawMaterialModal] = useState(false);
  const [addTaskListModal, setAddTaskListModal] = useState(false);
  const [addTransportationExpensesModal, setAddTransportationExpensesModal] = useState(false);

  const [administrativeExpensesValues, setAdministrativeExpensesValues]: any = useState([]);
  const [equipmentDepreciationValues, setEquipmentDepreciationValues]: any = useState([]);
  const [equipmentMaintenanceValues, setEquipmentMaintenanceValues]: any = useState([]);
  const [hiredPersonalExpensesValues, setHiredPersonalExpensesValues]: any = useState([]);
  const [rawMaterialsValues, setRawMaterialsValues]: any = useState([]);
  const [taskListValues, setTaskListValues]: any = useState([]);
  const [transportationExpensesValues, setTransportationExpensesValues]: any = useState([]);

  useEffect(() => {
    dispatch(nomenclatorsStartLoading());
    dispatch(startLoadServiceFeeAuxiliary());
    dispatch(startLoadServiceFeesTasks());
  }, [dispatch]);

  const { nomenclators }: any = useAppSelector((state: RootState) => state?.nomenclator);
  const { serviceFeeAuxiliary }: { serviceFeeAuxiliary: IServiceFeeAuxiliary } = useAppSelector(
    (state: RootState) => state?.serviceFee
  );

  nomenclators.map((nomenclator: INomenclator) => {
    if (nomenclator.category === "Categoría de tarifas") serviceFeeCategory.push(nomenclator.code);
    if (nomenclator.category === "Unidad de medida") unitMeasureNomenclators.push(nomenclator.code);
  });

  const categoriesOptions: SelectProps["options"] = serviceFeeCategory.map((serviceFeeCategory) => {
    return {
      label: `${serviceFeeCategory}`,
      value: `${serviceFeeCategory}`
    };
  });

  const unitMeasureOptions: SelectProps["options"] = unitMeasureNomenclators.map((unitMeasure) => {
    return {
      label: `${unitMeasure}`,
      value: `${unitMeasure}`
    };
  });

  const onFinishFailed = (errorInfo: any) => {
    console.log("Failed:", errorInfo);
  };

  const onAddRawMaterial = (values: any) => {
    setRawMaterialsValues([values, ...rawMaterialsValues]);
    form.setFieldValue("rawMaterials", [...rawMaterialsValues, values]);
    setAddRawMaterialModal(false);
  };

  const onAddTaskList = (values: any) => {
    setTaskListValues([
      {
        description: values.description,
        unitMeasure: values.unitMeasure,
        amount: values.amount,
        price: values.price,
        value: values.value
      },
      ...taskListValues
    ]);
    form.setFieldValue("taskList", [
      ...taskListValues,
      {
        description: values.description,
        unitMeasure: values.unitMeasure,
        amount: values.amount,
        price: values.price,
        value: values.value
      }
    ]);
    setAddTaskListModal(false);
  };

  const onAddEquipmentDepreciation = (values: any) => {
    setEquipmentDepreciationValues([values, ...equipmentDepreciationValues]);
    form.setFieldValue("equipmentDepreciation", [...equipmentDepreciationValues, values]);
    setAddEquipmentDepreciationModal(false);
  };

  const onAddEquipmentMaintenance = (values: any) => {
    setEquipmentMaintenanceValues([values, ...equipmentMaintenanceValues]);
    form.setFieldValue("equipmentMaintenance", [...equipmentMaintenanceValues, values]);
    setAddEquipmentMaintenanceModal(false);
  };

  const onAddAdministrativeExpenses = (values: any) => {
    setAdministrativeExpensesValues([values, ...administrativeExpensesValues]);
    form.setFieldValue("administrativeExpenses", [...administrativeExpensesValues, values]);
    setAddAdministrativeExpensesModal(false);
  };

  const onAddTransportationExpenses = (values: any) => {
    setTransportationExpensesValues([values, ...transportationExpensesValues]);
    form.setFieldValue("transportationExpenses", [...transportationExpensesValues, values]);
    setAddTransportationExpensesModal(false);
  };

  const onAddHiredPersonalExpenses = (values: any) => {
    setHiredPersonalExpensesValues([
      {
        description: "Gasto de salarios indirectos",
        price: values.indirectSalariesPrice,
        unitMeasure: " ",
        amount: values.indirectSalariesAmount,
        value: values.indirectSalariesValue
      },
      {
        description: "Subcontratación",
        price: values.subcontractPrice,
        unitMeasure: " ",
        amount: values.subcontractAmount,
        value: values.subcontractExpensesValue
      }
    ]);
    form.setFieldValue("hiredPersonalExpenses", [
      {
        description: "Gasto de salarios indirectos",
        price: values.indirectSalariesPrice,
        unitMeasure: " ",
        amount: values.indirectSalariesAmount,
        value: values.indirectSalariesValue
      },
      {
        description: "Subcontratación",
        price: values.subcontractPrice,
        unitMeasure: " ",
        amount: values.subcontractAmount,
        value: values.subcontractExpensesValue
      }
    ]);
    setAddHiredPersonalExpensesModal(false);
  };

  return (
    <Form
      form={form}
      name="createCostSheetForm"
      labelCol={{ span: 0 }}
      wrapperCol={{ span: 0 }}
      className="w-full flex flex-col gap-0"
      initialValues={{ remember: true }}
      onFinishFailed={onFinishFailed}
      autoComplete="off"
      requiredMark={"optional"}
      size="middle"
      fields={[
        {
          name: "currencyChange",
          value: serviceFeeAuxiliary?.currencyChange
        }
      ]}
    >
      <section className=" flex-col mb-4">
        <div className="flex flex-row gap-4">
          <Form.Item
            className="mb-3 w-[35%]"
            name="taskName"
            label={<span className="font-bold text-md">Descripción</span>}
            rules={[{ required: true, message: "Campo requerido" }]}
          >
            <TextArea rows={3} />
          </Form.Item>
          <article className="flex flex-col flex-1">
            <Form.Item
              className="mb-3"
              label={<span className="font-bold text-md">Nomenclador</span>}
              name="nomenclatorId"
              rules={[{ required: true, message: "Campo requerido" }]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              className="mb-3"
              label={<span className="font-bold text-md">Categoría</span>}
              name="category"
              rules={[{ required: true, message: "Campo requerido" }]}
            >
              <Select
                allowClear
                options={categoriesOptions}
                showSearch
                onSelect={(value) => {
                  value === "Trabajo Pladur"
                    ? form.setFieldValue("commercialMargin", 12)
                    : form.setFieldValue("commercialMargin", 15);
                }}
                optionFilterProp="children"
                filterOption={(input: any, option: any) =>
                  (option?.label ?? "").toLowerCase().includes(input)
                }
                filterSort={(optionA: any, optionB: any) =>
                  (optionA?.label ?? "")
                    .toLowerCase()
                    .localeCompare((optionB?.label ?? "").toLowerCase())
                }
              />
            </Form.Item>
          </article>
          <article className="flex flex-col flex-1">
            <Form.Item
              className="mb-3 "
              label={<span className="font-bold text-md">Cantidad de empleados</span>}
              name="workersAmount"
              rules={[{ required: true, message: "Campo requerido" }]}
            >
              <InputNumber min={0} className="w-full" />
            </Form.Item>
            <Form.Item
              className="mb-3"
              label={<span className="font-bold text-md">Unidad de Medida</span>}
              name="unitMeasure"
              rules={[{ required: true, message: "Campo requerido" }]}
            >
              <Select
                allowClear
                options={unitMeasureOptions}
                showSearch
                optionFilterProp="children"
                filterOption={(input: any, option: any) =>
                  (option?.label ?? "").toLowerCase().includes(input)
                }
                filterSort={(optionA: any, optionB: any) =>
                  (optionA?.label ?? "")
                    .toLowerCase()
                    .localeCompare((optionB?.label ?? "").toLowerCase())
                }
              />
            </Form.Item>
          </article>
          <article className="flex flex-col w-[150px]">
            <Form.Item
              className="mb-3 "
              label={<span className="font-bold text-md">Cambio (USD)</span>}
              name="currencyChange"
              rules={[{ required: true, message: "Campo requerido" }]}
            >
              <InputNumber min={0} disabled className="w-full" />
            </Form.Item>
          </article>
        </div>
      </section>

      <TableFormSection
        sectionName="Materias Primas"
        values={rawMaterialsValues}
        formName="rawMaterials"
        valuesSetter={setRawMaterialsValues}
        addModalSetter={setAddRawMaterialModal}
        buttonText="Añadir Materia Prima"
        form={form}
      />
      <TableFormSection
        sectionName="Actividades a Ejecutar"
        values={taskListValues}
        formName="taskList"
        valuesSetter={setTaskListValues}
        addModalSetter={setAddTaskListModal}
        buttonText="Añadir Actividad"
        form={form}
      />
      <TableFormSection
        sectionName="Depreciación de Equipos"
        values={equipmentDepreciationValues}
        formName="equipmentDepreciation"
        valuesSetter={setEquipmentDepreciationValues}
        addModalSetter={setAddEquipmentDepreciationModal}
        buttonText="Añadir Depreciación de Equipos"
        form={form}
      />
      <TableFormSection
        sectionName="Mantenimiento de Equipos"
        values={equipmentMaintenanceValues}
        formName="equipmentMaintenance"
        valuesSetter={setEquipmentMaintenanceValues}
        addModalSetter={setAddEquipmentMaintenanceModal}
        buttonText="Añadir Mantenimiento de Equipos"
        form={form}
      />
      <TableFormSection
        sectionName="Gastos Administrativos"
        values={administrativeExpensesValues}
        formName="administrativeExpenses"
        valuesSetter={setAdministrativeExpensesValues}
        addModalSetter={setAddAdministrativeExpensesModal}
        buttonText="Añadir Gasto Administrativo"
        form={form}
      />
      <TableFormSection
        sectionName="Gastos Transportación"
        values={transportationExpensesValues}
        formName="transportationExpenses"
        valuesSetter={setTransportationExpensesValues}
        addModalSetter={setAddTransportationExpensesModal}
        buttonText="Añadir Gastos de Transportación"
        form={form}
      />
      <TableFormSection
        sectionName={`Gastos Personal Contratado`}
        values={hiredPersonalExpensesValues}
        formName="hiredPersonalExpenses"
        valuesSetter={setHiredPersonalExpensesValues}
        addModalSetter={setAddHiredPersonalExpensesModal}
        buttonText="Añadir Gastos de Personal Contratado"
        form={form}
      />
      <article className="flex gap-5">
        <div className="font-bold text-base items-center flex">
          <span>Coeficientes de Complejidad</span>
        </div>
        <div className="flex gap-2 pt-3 items-center">
          <Form.Item
            className="mb-3"
            label={<span className="font-bold text-md">Alta</span>}
            name="highComplexity"
            rules={[{ required: true, message: "Campo requerido" }]}
          >
            <InputNumber min={0} />
          </Form.Item>
          <Form.Item
            className="mb-3 "
            label={<span className="font-bold text-md">Media</span>}
            name="mediumComplexity"
            rules={[{ required: true, message: "Campo requerido" }]}
          >
            <InputNumber min={0} />
          </Form.Item>
          <Form.Item
            className="mb-3 "
            label={<span className="font-bold text-md">Baja</span>}
            name="lowComplexity"
            rules={[{ required: true, message: "Campo requerido" }]}
          >
            <InputNumber min={0} />
          </Form.Item>
        </div>
      </article>
      <section className="flex gap-4 mt-4">
        {/* ONAT */}
        <Form.Item
          className="mb-3 "
          label={<span className="font-bold text-md">ONAT (%)</span>}
          name="ONAT"
          rules={[{ required: true, message: "Campo requerido" }]}
        >
          <InputNumber min={0} />
        </Form.Item>
        {/* CommercialMargin */}
        <Form.Item
          className="mb-3 "
          label={<span className="font-bold text-md">Margen Comercial (%)</span>}
          name="commercialMargin"
          rules={[{ required: true, message: "Campo requerido" }]}
        >
          <InputNumber min={0} />
        </Form.Item>
        <Form.Item
          className="mb-3 "
          label={<span className="font-bold text-md">Talento Artístico</span>}
          name="artisticTalent"
          rules={[{ required: true, message: "Campo requerido" }]}
        >
          <InputNumber min={0} />
        </Form.Item>
      </section>
      <Form.Item>
        <button
          type="submit"
          className="mt-4 select-none rounded-lg bg-success-500 py-3 px-6 text-center align-middle text-sm font-bold uppercase text-white-100 shadow-md shadow-success-500/20 transition-all hover:shadow-lg hover:shadow-success-500/40 focus:opacity-[0.85] focus:shadow-none active:opacity-[0.85] active:shadow-none disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none "
          onClick={() => {
            form
              .validateFields()
              .then((values) => {
                dispatch(
                  startAddServiceFee({
                    administrativeExpenses: administrativeExpensesValues,
                    // PORCIENTO
                    artisticTalent: values.artisticTalent,
                    category: values.category,
                    // PORCIENTO
                    commercialMargin: values.commercialMargin,
                    complexity: [
                      {
                        name: "Alta",
                        coefficient: values.highComplexity
                      },
                      {
                        name: "Media",
                        coefficient: values.mediumComplexity
                      },
                      {
                        name: "Baja",
                        coefficient: values.lowComplexity
                      }
                    ],
                    currencyChange: values.currencyChange,
                    equipmentDepreciation: equipmentDepreciationValues,
                    equipmentMaintenance: equipmentMaintenanceValues,
                    hiredPersonalExpenses: hiredPersonalExpensesValues,
                    nomenclatorId: values.nomenclatorId,
                    // PORCIENTO
                    ONAT: values.ONAT,
                    rawMaterials: rawMaterialsValues,
                    taskList: taskListValues,
                    taskName: values.taskName,
                    transportationExpenses: transportationExpensesValues,
                    unitMeasure: values.unitMeasure,
                    workersAmount: values.workersAmount
                  })
                );
                form.resetFields();
                router.push("/dashboard/serviceFees");
              })
              .catch((error) => {
                console.log("Validate Failed:", error);
              });
          }}
        >
          Crear
        </button>
      </Form.Item>
      <AddRawMaterialModal
        open={addRawMaterialModal}
        onCancel={() => setAddRawMaterialModal(false)}
        onCreate={onAddRawMaterial}
      />
      <AddTaskListModal
        open={addTaskListModal}
        onCancel={() => setAddTaskListModal(false)}
        onCreate={onAddTaskList}
      />
      <AddEquipmentDepreciationModal
        open={addEquipmentDepreciationModal}
        onCancel={() => setAddEquipmentDepreciationModal(false)}
        onCreate={onAddEquipmentDepreciation}
      />
      <AddEquipmentMaintenanceModal
        open={addEquipmentMaintenanceModal}
        onCancel={() => setAddEquipmentMaintenanceModal(false)}
        onCreate={onAddEquipmentMaintenance}
      />
      <AddAdministrativeExpensesModal
        open={addAdministrativeExpensesModal}
        onCancel={() => setAddAdministrativeExpensesModal(false)}
        onCreate={onAddAdministrativeExpenses}
      />
      <AddTransportationExpensesModal
        open={addTransportationExpensesModal}
        onCancel={() => setAddTransportationExpensesModal(false)}
        onCreate={onAddTransportationExpenses}
      />
      <AddHiredPersonalExpensesModal
        open={addHiredPersonalExpensesModal}
        onCancel={() => setAddHiredPersonalExpensesModal(false)}
        onCreate={onAddHiredPersonalExpenses}
      />
    </Form>
  );
};

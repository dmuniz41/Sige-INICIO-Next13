"use client";
import { Button, Form, Input, InputNumber, Select, SelectProps } from "antd";
import { MinusCircleOutlined, PlusOutlined } from "@ant-design/icons";
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
import { useAppDispatch } from "@/hooks/hooks";
import { useRouter } from "next/navigation";
import TextArea from "antd/es/input/TextArea";

export const CreateServiceFeeForm = () => {
  const dispatch = useAppDispatch();
  const [form] = Form.useForm();
  const serviceFeeCategory: string[] | undefined = [];
  const unitMeasureNomenclators: string[] | undefined = [];
  const router = useRouter();

  const [addRawMaterialModal, setAddRawMaterialModal] = useState(false);
  const [addTaskListModal, setAddTaskListModal] = useState(false);
  const [addEquipmentDepreciationModal, setAddEquipmentDepreciationModal] = useState(false);
  const [addEquipmentMaintenanceModal, setAddEquipmentMaintenanceModal] = useState(false);
  const [addAdministrativeExpensesModal, setAddAdministrativeExpensesModal] = useState(false);
  const [addTransportationExpensesModal, setAddTransportationExpensesModal] = useState(false);
  const [addHiredPersonalExpensesModal, setAddHiredPersonalExpensesModal] = useState(false);

  const [rawMaterialsValues, setRawMaterialsValues]: any = useState([]);
  const [taskListValues, setTaskListValues]: any = useState([]);
  const [equipmentDepreciationValues, setEquipmentDepreciationValues]: any = useState([]);
  const [equipmentMaintenanceValues, setEquipmentMaintenanceValues]: any = useState([]);
  const [administrativeExpensesValues, setAdministrativeExpensesValues]: any = useState([]);
  const [transportationExpensesValues, setTransportationExpensesValues]: any = useState([]);
  const [hiredPersonalExpensesValues, setHiredPersonalExpensesValues]: any = useState([]);

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
    if (nomenclator.category === "Categoría de tarifas")
      serviceFeeCategory.push(nomenclator.code);
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
    console.log("🚀 ~ onAddRawMaterial ~ values:", values);
    setRawMaterialsValues([values, ...rawMaterialsValues]);
    form.setFieldValue("rawMaterials", [...rawMaterialsValues, values]);
    setAddRawMaterialModal(false);
  };

  const onAddTaskList = (values: any) => {
    console.log("🚀 ~ onAddTaskList ~ values:", values);
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
    console.log("🚀 ~ onAddEquipmentDepreciation ~ values:", values);
    setEquipmentDepreciationValues([values, ...equipmentDepreciationValues]);
    form.setFieldValue("equipmentDepreciation", [...equipmentDepreciationValues, values]);
    setAddEquipmentDepreciationModal(false);
  };

  const onAddEquipmentMaintenance = (values: any) => {
    console.log("🚀 ~ onAddEquipmentMaintenance ~ values:", values);
    setEquipmentMaintenanceValues([values, ...equipmentMaintenanceValues]);
    form.setFieldValue("equipmentMaintenance", [...equipmentMaintenanceValues, values]);
    setAddEquipmentMaintenanceModal(false);
  };

  const onAddAdministrativeExpenses = (values: any) => {
    console.log("🚀 ~ onAddAdministrativeExpenses ~ values:", values);
    setAdministrativeExpensesValues([values, ...administrativeExpensesValues]);
    form.setFieldValue("administrativeExpenses", [...administrativeExpensesValues, values]);
    setAddAdministrativeExpensesModal(false);
  };

  const onAddTransportationExpenses = (values: any) => {
    console.log("🚀 ~ onAddTransportationExpenses ~ values:", values);
    setTransportationExpensesValues([values, ...transportationExpensesValues]);
    form.setFieldValue("transportationExpenses", [...transportationExpensesValues, values]);
    setAddTransportationExpensesModal(false);
  };

  const onAddHiredPersonalExpenses = (values: any) => {
    console.log("🚀 ~ onAddHiredPersonalExpenses ~ values:", values);
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
              <InputNumber className="w-full" />
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
              <InputNumber disabled className="w-full" />
            </Form.Item>
          </article>
        </div>
      </section>

      <FormSection
        sectionName="Materias Primas"
        values={rawMaterialsValues}
        formName="rawMaterials"
        valuesSetter={setRawMaterialsValues}
        modalSetter={setAddRawMaterialModal}
        buttonText="Añadir Materia Prima"
        form={form}
      />
      <FormSection
        sectionName="Actividades a Ejecutar"
        values={taskListValues}
        formName="taskList"
        valuesSetter={setTaskListValues}
        modalSetter={setAddTaskListModal}
        buttonText="Añadir Actividad"
        form={form}
      />
      <FormSection
        sectionName="Depreciación de Equipos"
        values={equipmentDepreciationValues}
        formName="equipmentDepreciation"
        valuesSetter={setEquipmentDepreciationValues}
        modalSetter={setAddEquipmentDepreciationModal}
        buttonText="Añadir Depreciación de Equipos"
        form={form}
      />
      <FormSection
        sectionName="Mantenimiento de Equipos"
        values={equipmentMaintenanceValues}
        formName="equipmentMaintenance"
        valuesSetter={setEquipmentMaintenanceValues}
        modalSetter={setAddEquipmentMaintenanceModal}
        buttonText="Añadir Mantenimiento de Equipos"
        form={form}
      />
      <FormSection
        sectionName="Gastos Administrativos"
        values={administrativeExpensesValues}
        formName="administrativeExpenses"
        valuesSetter={setAdministrativeExpensesValues}
        modalSetter={setAddAdministrativeExpensesModal}
        buttonText="Añadir Gasto Administrativo"
        form={form}
      />
      <FormSection
        sectionName="Gastos de Transportación"
        values={transportationExpensesValues}
        formName="transportationExpenses"
        valuesSetter={setTransportationExpensesValues}
        modalSetter={setAddTransportationExpensesModal}
        buttonText="Añadir Gastos de Transportación"
        form={form}
      />
      <FormSection
        sectionName="Gastos de Personal Contratado"
        values={hiredPersonalExpensesValues}
        formName="hiredPersonalExpenses"
        valuesSetter={setHiredPersonalExpensesValues}
        modalSetter={setAddHiredPersonalExpensesModal}
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
            <InputNumber />
          </Form.Item>
          <Form.Item
            className="mb-3 "
            label={<span className="font-bold text-md">Media</span>}
            name="mediumComplexity"
            rules={[{ required: true, message: "Campo requerido" }]}
          >
            <InputNumber />
          </Form.Item>
          <Form.Item
            className="mb-3 "
            label={<span className="font-bold text-md">Baja</span>}
            name="lowComplexity"
            rules={[{ required: true, message: "Campo requerido" }]}
          >
            <InputNumber />
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
          <InputNumber />
        </Form.Item>
        {/* commercialMargin */}
        <Form.Item
          className="mb-3 "
          label={<span className="font-bold text-md">Margen Comercial (%)</span>}
          name="commercialMargin"
          rules={[{ required: true, message: "Campo requerido" }]}
        >
          <InputNumber />
        </Form.Item>
        <Form.Item
          className="mb-3 "
          label={<span className="font-bold text-md">Talento Artístico</span>}
          name="artisticTalentValue"
          rules={[{ required: true, message: "Campo requerido" }]}
        >
          <InputNumber />
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
                console.log("🚀 ~ .then ~ values:", values);
                dispatch(
                  startAddServiceFee({
                    administrativeExpenses: values.administrativeExpenses,
                    // PORCIENTO
                    artisticTalentValue: values.artisticTalentValue,
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
                    equipmentDepreciation: values.equipmentDepreciation,
                    equipmentMaintenance: values.equipmentMaintenance,
                    hiredPersonalExpenses: values.hiredPersonalExpenses,
                    nomenclatorId: values.nomenclatorId,
                    // PORCIENTO
                    ONAT: values.ONAT,
                    rawMaterials: values.rawMaterials,
                    taskList: values.taskList,
                    taskName: values.taskName,
                    transportationExpenses: values.transportationExpenses,
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

export const FormSection = (props: any) => {
  const { sectionName, values, formName, valuesSetter, modalSetter, buttonText, form } = props;
  return (
    <section className=" flex items-center w-full mb-8 bg-white-100 rounded-md p-2 shadow-[0px_0px_5px_0px_#00000024] ">
      <div className="flex w-[15%] min-h-[100px] h-full p-2 text-center items-center justify-center">
        <span className="text-base font-bold">{sectionName.toUpperCase()}</span>
      </div>
      <div className="flex pl-2 w-full flex-col">
        {values?.length == 0 ? (
          <div></div>
        ) : (
          <div className="flex w-full pr-9 gap-1 pt-4 font-bold">
            <div className="grow">
              <span>Descripción</span>
            </div>
            <div className="w-[200px] text-center">
              <span>Unidad de Medida</span>
            </div>
            <div className="w-[88px] text-center">
              <span>Cantidad</span>
            </div>
            <div className="w-[88px] text-center">
              <span>Precio/UM</span>
            </div>
            <div className="w-[88px] text-center">
              <span>Importe</span>
            </div>
          </div>
        )}
        <Form.List name={formName}>
          {(fields, { add, remove }) => (
            <div className="flex flex-col pr-4 flex-1 pt-6">
              {fields.map(({ key, name, ...restField }) => (
                <div key={key} className="w-full">
                  <div className="flex items-center flex-row mb-0 h-9  gap-1">
                    <Form.Item
                      className="grow"
                      {...restField}
                      name={[name, "description"]}
                      rules={[{ required: true }]}
                    >
                      <Input
                        disabled
                        placeholder="Descripción"
                        className="w-full disabled:bg-white-100  disabled:text-white-900"
                      />
                    </Form.Item>
                    <Form.Item
                      {...restField}
                      name={[name, "unitMeasure"]}
                      className="w-[200px]"
                      rules={[{ required: true }]}
                    >
                      <Input
                        disabled
                        placeholder="Unidad de Medida"
                        className=" disabled:bg-white-100 disabled:text-white-900"
                      />
                    </Form.Item>
                    <Form.Item
                      {...restField}
                      name={[name, "amount"]}
                      className="w-[88px]"
                      rules={[{ required: true }]}
                    >
                      <Input
                        disabled
                        placeholder="Cantidad"
                        className=" disabled:bg-white-100  disabled:text-white-900"
                      />
                    </Form.Item>
                    <Form.Item
                      {...restField}
                      name={[name, "price"]}
                      className="w-[88px]"
                      rules={[{ required: true }]}
                      
                    >
                      <Input
                        disabled
                        placeholder="Precio"
                        className=" disabled:bg-white-100  disabled:text-white-900"
                      />
                    </Form.Item>
                    <Form.Item
                      {...restField}
                      name={[name, "value"]}
                      className="w-[88px]"
                      rules={[{ required: true }]}
                    >
                      <Input disabled className=" disabled:bg-white-100  disabled:text-white-900" />
                    </Form.Item>
                    <MinusCircleOutlined
                      className="mb-auto"
                      onClick={() => {
                        remove(name);
                        valuesSetter(form.getFieldValue(`${formName}`));
                      }}
                    />
                  </div>
                </div>
              ))}
              <Form.Item className="justify-center w-full">
                <Button
                  className="flex flex-row justify-center items-center"
                  block
                  type="dashed"
                  onClick={() => modalSetter(true)}
                  icon={<PlusOutlined />}
                >
                  {buttonText}
                </Button>
              </Form.Item>
            </div>
          )}
        </Form.List>
      </div>
    </section>
  );
};

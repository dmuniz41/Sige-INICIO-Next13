"use client";
import { Button, Form, Input, InputNumber, Select, SelectProps } from "antd";
import { MinusCircleOutlined, PlusOutlined } from "@ant-design/icons";
import React, { useEffect, useState } from "react";

import { INomenclator } from "@/models/nomenclator";
import { IRepresentationCoefficients, IServiceFeeAuxiliary } from "@/models/serviceFeeAuxiliary";
import { nomenclatorsStartLoading } from "@/actions/nomenclator";
import { RootState, useAppSelector } from "@/store/store";
import { startUpdateServiceFee } from "@/actions/serviceFee";
import { startLoadServiceFeeAuxiliary } from "@/actions/serviceFeeAuxiliary";
import { startLoadServiceFeesTasks } from "@/actions/serviceFeeTask";
import { useAppDispatch } from "@/hooks/hooks";
import { useRouter } from "next/navigation";
import { IServiceFee } from "@/models/serviceFees";
import { AddRawMaterialModal } from "../createServiceFee/AddRawMaterial";
import { AddTaskListModal } from "../createServiceFee/AddTaskList";
import { AddEquipmentDepreciationModal } from "../createServiceFee/AddEquipmentDepreciation";
import { AddEquipmentMaintenanceModal } from "../createServiceFee/AddEquipmentMaintenance";
import { AddAdministrativeExpensesModal } from "../createServiceFee/AddAdministrativeExpenses";
import { AddTransportationExpensesModal } from "../createServiceFee/AddTransportationExpenses";
import { AddHiredPersonalExpensesModal } from "../createServiceFee/AddHiredPersonalExpenses";

export const EditServiceFeeForm = () => {
  const dispatch = useAppDispatch();
  const [form] = Form.useForm();
  const serviceFeeCategory: string[] | undefined = [];
  const valuePerUM: string[] | undefined = [];
  const payMethods: IRepresentationCoefficients[] | undefined = [];
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

  const { nomenclators }: any = useAppSelector((state: RootState) => state?.nomenclator);
  const { selectedServiceFee }: { selectedServiceFee: IServiceFee } = useAppSelector((state: RootState) => state?.serviceFee);
  const { serviceFeeAuxiliary }: { serviceFeeAuxiliary: IServiceFeeAuxiliary } = useAppSelector((state: RootState) => state?.serviceFee);
  serviceFeeAuxiliary?.payMethod?.map((payMethod) => payMethods.push(payMethod));

  useEffect(() => {
    dispatch(nomenclatorsStartLoading());
    dispatch(startLoadServiceFeeAuxiliary());
    dispatch(startLoadServiceFeesTasks());
    setRawMaterialsValues(selectedServiceFee?.rawMaterials);
    setTaskListValues(selectedServiceFee?.taskList);
    setEquipmentDepreciationValues(selectedServiceFee?.equipmentDepreciation);
    setEquipmentMaintenanceValues(selectedServiceFee?.equipmentMaintenance);
    setTransportationExpensesValues(selectedServiceFee?.transportationExpenses);
    setHiredPersonalExpensesValues(selectedServiceFee?.hiredPersonalExpenses);
  }, [dispatch, selectedServiceFee]);

  nomenclators.map((nomenclator: INomenclator) => {
    if (nomenclator.category === "Categoría de ficha de costo") serviceFeeCategory.push(nomenclator.code);
    if (nomenclator.category === "Precio/UM en ficha de costo") valuePerUM.push(nomenclator.code);
  });

  const categoriesOptions: SelectProps["options"] = serviceFeeCategory.map((serviceFeeCategory) => {
    return {
      label: `${serviceFeeCategory}`,
      value: `${serviceFeeCategory}`,
    };
  });
  const valuePerUMOptions: SelectProps["options"] = valuePerUM.map((valuePerUM) => {
    return {
      label: `${valuePerUM}`,
      value: `${valuePerUM}`,
    };
  });
  const payMethodOptions: SelectProps["options"] = payMethods.map((payMethod) => {
    return {
      label: `${payMethod.representative}`,
      value: payMethod.coefficientValue,
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
        value: values.value,
      },
      ...taskListValues,
    ]);
    form.setFieldValue("taskList", [
      ...taskListValues,
      {
        description: values.description,
        unitMeasure: values.unitMeasure,
        amount: values.amount,
        price: values.price,
        value: values.value,
      },
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
    setTransportationExpensesValues([
      {
        description: "Transportación",
        price: values.transportationExpenseCoef,
        unitMeasure: "$/u",
        amount: values.transportationAmount,
        value: values.transportationExpenseValue,
      },
      {
        description: "Distribución y Venta",
        price: values.salesAndDistributionExpenseCoef,
        unitMeasure: "$/u",
        amount: values.salesAndDistributionAmount,
        value: values.salesAndDistributionExpenseValue,
      },
    ]);
    form.setFieldValue("transportationExpenses", [
      {
        description: "Transportación",
        price: values.transportationExpenseCoef,
        unitMeasure: "$/u",
        amount: values.transportationAmount,
        value: values.transportationExpenseValue,
      },
      {
        description: "Distribución y Venta",
        price: values.salesAndDistributionExpenseCoef,
        unitMeasure: "$/u",
        amount: values.salesAndDistributionAmount,
        value: values.salesAndDistributionExpenseValue,
      },
    ]);
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
        value: values.indirectSalariesValue,
      },
      {
        description: "Subcontratación",
        price: values.subcontractPrice,
        unitMeasure: " ",
        amount: values.subcontractAmount,
        value: values.subcontractExpensesValue,
      },
    ]);
    form.setFieldValue("hiredPersonalExpenses", [
      {
        description: "Gasto de salarios indirectos",
        price: values.indirectSalariesPrice,
        unitMeasure: " ",
        amount: values.indirectSalariesAmount,
        value: values.indirectSalariesValue,
      },
      {
        description: "Subcontratación",
        price: values.subcontractPrice,
        unitMeasure: " ",
        amount: values.subcontractAmount,
        value: values.subcontractExpensesValue,
      },
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
          name: "taskName",
          value: selectedServiceFee?.taskName,
        },
        {
          name: "nomenclatorId",
          value: selectedServiceFee?.nomenclatorId,
        },
        {
          name: "category",
          value: selectedServiceFee?.category,
        },
        {
          name: "workersAmount",
          value: selectedServiceFee?.workersAmount,
        },
        {
          name: "valuePerUnitMeasure",
          value: selectedServiceFee?.valuePerUnitMeasure,
        },
        {
          name: "currencyChange",
          value: serviceFeeAuxiliary?.currencyChange,
        },
        {
          name: "payMethodCoef",
          value: selectedServiceFee?.payMethodCoef,
        },
        {
          name: "rawMaterials",
          value: rawMaterialsValues,
        },
        {
          name: "taskList",
          value: taskListValues,
        },
        {
          name: "equipmentDepreciation",
          value: equipmentDepreciationValues,
        },
        {
          name: "equipmentMaintenance",
          value: equipmentMaintenanceValues,
        },
        {
          name: "administrativeExpenses",
          value: administrativeExpensesValues,
        },
        {
          name: "transportationExpenses",
          value: transportationExpensesValues,
        },
        {
          name: "hiredPersonalExpenses",
          value: hiredPersonalExpensesValues,
        },
        {
          name: "ONAT",
          value: selectedServiceFee?.ONAT,
        },
        {
          name: "commercialMargin",
          value: selectedServiceFee?.commercialMargin,
        },
        {
          name: "rawMaterialsByClient",
          value: selectedServiceFee?.rawMaterialsByClient,
        },
        {
          name: "artisticTalentValue",
          value: selectedServiceFee?.artisticTalent,
        },
        {
          name: "highComplexity",
          value: selectedServiceFee?.complexity?.find((complexity) => complexity.name === "Alta")?.coefficient,
        },
        {
          name: "mediumComplexity",
          value: selectedServiceFee?.complexity?.find((complexity) => complexity.name === "Media")?.coefficient,
        },
        {
          name: "lowComplexity",
          value: selectedServiceFee?.complexity?.find((complexity) => complexity.name === "Baja")?.coefficient,
        },
      ]}
    >
      <section className=" flex-col mb-4">
        <div className="flex flex-row gap-4">
          <Form.Item className="mb-3 w-[35%]" name="taskName" label={<span className="font-bold text-md">Descripción</span>} rules={[{ required: true, message: "Campo requerido" }]}>
            <Input />
          </Form.Item>
          <article className="flex flex-col w-[300px]">
            <Form.Item className="mb-3" label={<span className="font-bold text-md">Nomenclador</span>} name="nomenclatorId" rules={[{ required: true, message: "Campo requerido" }]}>
              <Input />
            </Form.Item>
            <Form.Item className="mb-3" label={<span className="font-bold text-md">Categoría</span>} name="category" rules={[{ required: true, message: "Campo requerido" }]}>
              <Select
                allowClear
                options={categoriesOptions}
                showSearch
                onSelect={(value) => {
                  value === "Trabajo Pladur" ? form.setFieldValue("commercialMargin", 20) : form.setFieldValue("commercialMargin", 50);
                }}
                optionFilterProp="children"
                filterOption={(input: any, option: any) => (option?.label ?? "").toLowerCase().includes(input)}
                filterSort={(optionA: any, optionB: any) => (optionA?.label ?? "").toLowerCase().localeCompare((optionB?.label ?? "").toLowerCase())}
              />
            </Form.Item>
          </article>
          <article className="flex flex-col w-[300px]">
            <Form.Item className="mb-3 " label={<span className="font-bold text-md">Cantidad de empleados</span>} name="workersAmount" rules={[{ required: true, message: "Campo requerido" }]}>
              <InputNumber className="w-full" />
            </Form.Item>
            <Form.Item className="mb-3" label={<span className="font-bold text-md">Precio/UM</span>} name="valuePerUnitMeasure" rules={[{ required: true, message: "Campo requerido" }]}>
              <Select
                allowClear
                options={valuePerUMOptions}
                showSearch
                optionFilterProp="children"
                filterOption={(input: any, option: any) => (option?.label ?? "").toLowerCase().includes(input)}
                filterSort={(optionA: any, optionB: any) => (optionA?.label ?? "").toLowerCase().localeCompare((optionB?.label ?? "").toLowerCase())}
              />
            </Form.Item>
          </article>
          <article className="flex flex-col w-[300px]">
            <Form.Item className="mb-3 " label={<span className="font-bold text-md">Cambio $ </span>} name="currencyChange" rules={[{ required: true, message: "Campo requerido" }]}>
              <InputNumber disabled className="w-full" />
            </Form.Item>
            <Form.Item className="mb-3" label={<span className="font-bold text-md">Método de pago </span>} name="payMethodCoef" rules={[{ required: true, message: "Campo requerido" }]}>
              <Select
                allowClear
                options={payMethodOptions}
                showSearch
                optionFilterProp="children"
                filterOption={(input: any, option: any) => (option?.label ?? "").toLowerCase().includes(input)}
                filterSort={(optionA: any, optionB: any) => (optionA?.label ?? "").toLowerCase().localeCompare((optionB?.label ?? "").toLowerCase())}
              />
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
      <article className="flex gap-2">
        <div className="font-bold text-base items-center flex">
          <span>Coeficientes de Complejidad</span>
        </div>
        <div className="flex gap-2 pt-3 items-center">
          <Form.Item className="mb-3" label={<span className="font-bold text-md">Alta</span>} name="highComplexity" rules={[{ required: true, message: "Campo requerido" }]}>
            <InputNumber />
          </Form.Item>
          <Form.Item className="mb-3 " label={<span className="font-bold text-md">Media</span>} name="mediumComplexity" rules={[{ required: true, message: "Campo requerido" }]}>
            <InputNumber />
          </Form.Item>
          <Form.Item className="mb-3 " label={<span className="font-bold text-md">Baja</span>} name="lowComplexity" rules={[{ required: true, message: "Campo requerido" }]}>
            <InputNumber />
          </Form.Item>
        </div>
      </article>
      <section className="flex gap-4 mt-4">
        {/* ONAT */}
        <Form.Item className="mb-3 " label={<span className="font-bold text-md">ONAT (%)</span>} name="ONAT" rules={[{ required: true, message: "Campo requerido" }]}>
          <InputNumber />
        </Form.Item>
        {/* commercialMargin */}
        <Form.Item className="mb-3 " label={<span className="font-bold text-md">Margen Comercial (%)</span>} name="commercialMargin" rules={[{ required: true, message: "Campo requerido" }]}>
          <InputNumber />
        </Form.Item>
        {/* rawMaterialsByClient */}
        <Form.Item
          className="mb-3 "
          label={<span className="font-bold text-md">Materias Primas Aportadas por el Cliente</span>}
          name="rawMaterialsByClient"
          rules={[{ required: true, message: "Campo requerido" }]}
        >
          <InputNumber />
        </Form.Item>
        <Form.Item className="mb-3 " label={<span className="font-bold text-md">Talento Artístico</span>} name="artisticTalentValue" rules={[{ required: true, message: "Campo requerido" }]}>
          <InputNumber />
        </Form.Item>
      </section>
      <Form.Item>
        <button
          type="submit"
          className="bg-success-500 cursor-pointer hover:bg-success-600 ease-in-out duration-300 w-[5rem] h-[2rem] flex items-center p-1 text-sm font-bold text-white-100  justify-center gap-2 rounded-md "
          onClick={() => {
            form
              .validateFields()
              .then((values) => {
                console.log("🚀 ~ .then ~ values:", values);
                dispatch(
                  startUpdateServiceFee({
                    _id: selectedServiceFee?._id,
                    administrativeExpenses: values.administrativeExpenses,
                    // PORCIENTO
                    artisticTalentValue: values.artisticTalentValue,
                    category: values.category,
                    // PORCIENTO
                    commercialMargin: values.commercialMargin,
                    complexity: [
                      {
                        name: "Alta",
                        coefficient: values.highComplexity,
                      },
                      {
                        name: "Media",
                        coefficient: values.mediumComplexity,
                      },
                      {
                        name: "Baja",
                        coefficient: values.lowComplexity,
                      },
                    ],
                    currencyChange: values.currencyChange,
                    equipmentDepreciation: values.equipmentDepreciation,
                    equipmentMaintenance: values.equipmentMaintenance,
                    hiredPersonalExpenses: values.hiredPersonalExpenses,
                    nomenclatorId: values.nomenclatorId,
                    // PORCIENTO
                    ONAT: values.ONAT,
                    payMethodCoef: values.payMethodCoef,
                    rawMaterials: values.rawMaterials,
                    rawMaterialsByClient: values.rawMaterialsByClient,
                    taskList: values.taskList,
                    taskName: values.taskName,
                    transportationExpenses: values.transportationExpenses,
                    valuePerUnitMeasure: values.valuePerUnitMeasure,
                    workersAmount: values.workersAmount,
                  })
                );
                form.resetFields();
                router.push(`/dashboard/serviceFees/${selectedServiceFee?._id}`);
              })
              .catch((error) => {
                console.log("Validate Failed:", error);
              });
          }}
        >
          Editar
        </button>
      </Form.Item>
      <AddRawMaterialModal open={addRawMaterialModal} onCancel={() => setAddRawMaterialModal(false)} onCreate={onAddRawMaterial} />
      <AddTaskListModal open={addTaskListModal} onCancel={() => setAddTaskListModal(false)} onCreate={onAddTaskList} />
      <AddEquipmentDepreciationModal open={addEquipmentDepreciationModal} onCancel={() => setAddEquipmentDepreciationModal(false)} onCreate={onAddEquipmentDepreciation} />
      <AddEquipmentMaintenanceModal open={addEquipmentMaintenanceModal} onCancel={() => setAddEquipmentMaintenanceModal(false)} onCreate={onAddEquipmentMaintenance} />
      <AddAdministrativeExpensesModal open={addAdministrativeExpensesModal} onCancel={() => setAddAdministrativeExpensesModal(false)} onCreate={onAddAdministrativeExpenses} />
      <AddTransportationExpensesModal open={addTransportationExpensesModal} onCancel={() => setAddTransportationExpensesModal(false)} onCreate={onAddTransportationExpenses} />
      <AddHiredPersonalExpensesModal open={addHiredPersonalExpensesModal} onCancel={() => setAddHiredPersonalExpensesModal(false)} onCreate={onAddHiredPersonalExpenses} />
    </Form>
  );
};

export const FormSection = (props: any) => {
  const { sectionName, values, formName, valuesSetter, modalSetter, buttonText, form } = props;
  return (
    <section className=" flex w-full mb-4 bg-background_light p-2 rounded shadow-md ">
      <div className="flex w-[15%] justify-center items-center text-center gap-1 ">
        <span className="text-base font-bold mb-3">{sectionName}</span>
      </div>
      <div className="flex pl-2 w-full flex-col">
        {values?.length == 0 ? (
          <div></div>
        ) : (
          <div className="flex flex-1 mb-4 pr-4 font-bold">
            <div className="flex-1">
              <span>Descripción</span>
            </div>
            <div className="w-[200px]">
              <span>Unidad de Medida</span>
            </div>
            <div className="w-[88px]">
              <span>Cantidad</span>
            </div>
            <div className="w-[88px]">
              <span>Precio/UM</span>
            </div>
            <div className="w-[88px]">
              <span>Importe</span>
            </div>
          </div>
        )}
        <Form.List name={formName}>
          {(fields, { add, remove }) => (
            <div className="flex flex-col w-full">
              {fields.map(({ key, name, ...restField }) => (
                <div key={key} className="w-full">
                  <div className="flex items-center flex-row mb-0 h-9  gap-1">
                    <Form.Item className="flex-1" {...restField} name={[name, "description"]} rules={[{ required: true }]}>
                      <Input placeholder="Descripción" className="w-full" />
                    </Form.Item>
                    <Form.Item {...restField} name={[name, "unitMeasure"]} rules={[{ required: true }]}>
                      <InputNumber className="w-full" placeholder="Unidad de Medida" />
                    </Form.Item>
                    <Form.Item {...restField} name={[name, "amount"]} rules={[{ required: true }]}>
                      <InputNumber placeholder="Cantidad" />
                    </Form.Item>
                    <Form.Item {...restField} name={[name, "price"]} rules={[{ required: true }]}>
                      <InputNumber placeholder="Precio" />
                    </Form.Item>
                    <Form.Item {...restField} name={[name, "value"]} rules={[{ required: true }]}>
                      <InputNumber disabled />
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
              <Form.Item className="mb-2 w-full">
                <Button className="flex flex-row justify-center items-center" type="dashed" onClick={() => modalSetter(true)} block icon={<PlusOutlined />}>
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

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
import { IRepresentationCoefficients, IServiceFeeAuxiliary } from "@/models/serviceFeeAuxiliary";
import { materialsStartLoading } from "@/actions/material";
import { nomenclatorsStartLoading } from "@/actions/nomenclator";
import { RootState, useAppSelector } from "@/store/store";
import { startAddServiceFee } from "@/actions/serviceFee";
import { startLoadServiceFeeAuxiliary } from "@/actions/serviceFeeAuxiliary";
import { startLoadServiceFeesTasks } from "@/actions/serviceFeeTask";
import { useAppDispatch } from "@/hooks/hooks";
import { useRouter } from "next/navigation";

export const CreateServiceFeeForm = () => {
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

  useEffect(() => {
    dispatch(nomenclatorsStartLoading());
    dispatch(startLoadServiceFeeAuxiliary());
    dispatch(startLoadServiceFeesTasks());
    dispatch(materialsStartLoading("653957480a9e16fed4c1bbd5"));
  }, [dispatch]);

  const { nomenclators }: any = useAppSelector((state: RootState) => state?.nomenclator);
  const { serviceFeeAuxiliary }: { serviceFeeAuxiliary: IServiceFeeAuxiliary[] } = useAppSelector((state: RootState) => state?.serviceFee);
  serviceFeeAuxiliary[0]?.payMethod.map((payMethod) => payMethods.push(payMethod));

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
    setAdministrativeExpensesValues([
      {
        description: "Combustible",
        price: values.fuelExpenseCoef,
        unitMeasure: "$/h",
        amount: values.fuelAmount,
        value: values.fuelExpenseValue,
      },
      {
        description: "Electricidad",
        price: values.electricityExpenseCoef,
        unitMeasure: "$/h",
        amount: values.electricityAmount,
        value: values.electricityExpenseValue,
      },
      {
        description: "Alimentacion",
        price: values.feedingExpenseCoef,
        unitMeasure: "$/h",
        amount: values.feedingAmount,
        value: values.feedingExpenseValue,
      },
      {
        description: "Arrendamiento",
        price: values.leaseExpenseCoef,
        unitMeasure: "$/h",
        amount: values.leaseAmount,
        value: values.leaseExpenseValue,
      },
      {
        description: "Telefono",
        price: values.phoneExpenseCoef,
        unitMeasure: "$/h",
        amount: values.phoneAmount,
        value: values.phoneExpenseValue,
      },
    ]);
    form.setFieldValue("administrativeExpenses", [
      {
        description: "Combustible",
        price: values.fuelExpenseCoef,
        unitMeasure: "$/h",
        amount: values.fuelAmount,
        value: values.fuelExpenseValue,
      },
      {
        description: "Electricidad",
        price: values.electricityExpenseCoef,
        unitMeasure: "$/h",
        amount: values.electricityAmount,
        value: values.electricityExpenseValue,
      },
      {
        description: "Alimentacion",
        price: values.feedingExpenseCoef,
        unitMeasure: "$/h",
        amount: values.feedingAmount,
        value: values.feedingExpenseValue,
      },
      {
        description: "Arrendamiento",
        price: values.leaseExpenseCoef,
        unitMeasure: "$/h",
        amount: values.leaseAmount,
        value: values.leaseExpenseValue,
      },
      {
        description: "Telefono",
        price: values.phoneExpenseCoef,
        unitMeasure: "$/h",
        amount: values.phoneAmount,
        value: values.phoneExpenseValue,
      },
    ]);
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
          name: "currencyChange",
          value: serviceFeeAuxiliary[0]?.currencyChange,
        },

        {
          name: "ONAT",
          value: 25,
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
                  value === "Trabajo Pladur" ? form.setFieldValue("commercialMargin", 1.2) : form.setFieldValue("commercialMargin", 1.5);
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
            <Form.Item className="mb-3" label={<span className="font-bold text-md">Método de pago: </span>} name="payMethodCoef" rules={[{ required: true, message: "Campo requerido" }]}>
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
      {/* Seccion para introducir las materias primas */}
      <section className=" flex w-full mb-0">
        <div className="flex w-[15%] justify-center items-center text-center gap-1 ">
          <span className="text-base font-bold mb-3">Materias Primas</span>
        </div>
        <div className="flex pl-2 w-full flex-col">
          {rawMaterialsValues.length == 0 ? (
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
          <Form.List name="rawMaterials">
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
                          setRawMaterialsValues(form.getFieldValue("rawMaterials"));
                        }}
                      />
                    </div>
                  </div>
                ))}
                {/* <div className="flex w-full h-[32px] items-center border rounded-md pl-2 border-border_light mb-4 justify-between gap-2">
                <span className="font-bold flex-1 justify-end flex">Subtotal: </span>
                <span className="mr-[5rem]">$ {rawMaterialsSubtotal.toFixed(2)}</span>
              </div> */}
                <Form.Item className="mb-2 w-full">
                  <Button className="flex flex-row  justify-center items-center" type="dashed" onClick={() => setAddRawMaterialModal(true)} block icon={<PlusOutlined />}>
                    Añadir Materia Prima
                  </Button>
                </Form.Item>
              </div>
            )}
          </Form.List>
        </div>
      </section>
      {/* Seccion para introducir la lista de tareas */}
      <section className=" flex w-full mb-0">
        <div className="flex w-[15%] justify-center items-center text-center gap-1 ">
          <span className="text-base font-bold mb-3">Actividades a Ejecutar</span>
        </div>
        <div className="flex pl-2 w-full flex-col">
          {taskListValues.length == 0 ? (
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
          <Form.List name="taskList">
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
                          setTaskListValues(form.getFieldValue("taskList"));
                        }}
                      />
                    </div>
                  </div>
                ))}
                <Form.Item className="mb-2 w-full">
                  <Button className="flex flex-row  justify-center items-center" type="dashed" onClick={() => setAddTaskListModal(true)} block icon={<PlusOutlined />}>
                    Añadir Actividad
                  </Button>
                </Form.Item>
              </div>
            )}
          </Form.List>
        </div>
      </section>
      {/* Seccion para introducir la depreciacion de equipos */}
      <section className=" flex w-full mb-0">
        <div className="flex w-[15%] justify-center items-center text-center gap-1 ">
          <span className="text-base font-bold mb-3">Depreciación de Equipos</span>
        </div>
        <div className="flex pl-2 w-full flex-col">
          {equipmentDepreciationValues.length == 0 ? (
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
          <Form.List name="equipmentDepreciation">
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
                          setEquipmentDepreciationValues(form.getFieldValue("equipmentDepreciation"));
                        }}
                      />
                    </div>
                  </div>
                ))}
                <Form.Item className="mb-2 w-full ">
                  <Button className="flex flex-row h-full justify-center items-center" type="dashed" onClick={() => setAddEquipmentDepreciationModal(true)} block icon={<PlusOutlined />}>
                    Añadir Depreciación de Equipos
                  </Button>
                </Form.Item>
              </div>
            )}
          </Form.List>
        </div>
      </section>
      {/* seccion para introducir el mantenimiento de equipos */}
      <section className=" flex w-full mb-0">
        <div className="flex w-[15%] justify-center items-center text-center gap-1 ">
          <span className="text-base font-bold mb-3">Mantenimiento de Equipos</span>
        </div>
        <div className="flex pl-2 w-full flex-col">
          {equipmentMaintenanceValues.length == 0 ? (
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
          <Form.List name="equipmentMaintenance">
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
                          setEquipmentMaintenanceValues(form.getFieldValue("equipmentMaintenance"));
                        }}
                      />
                    </div>
                  </div>
                ))}
                <Form.Item className="mb-2 w-full ">
                  <Button className="flex flex-row h-full justify-center items-center" type="dashed" onClick={() => setAddEquipmentMaintenanceModal(true)} block icon={<PlusOutlined />}>
                    Añadir Mantenimiento de Equipos
                  </Button>
                </Form.Item>
              </div>
            )}
          </Form.List>
        </div>
      </section>
      {/* seccion para introducir los gastos administrativos */}
      <section className=" flex w-full mb-0">
        <div className="flex w-[15%] justify-center items-center text-center gap-1 ">
          <span className="text-base font-bold mb-3">Gastos Administrativos</span>
        </div>
        <div className="flex pl-2 w-full flex-col">
          {administrativeExpensesValues.length == 0 ? (
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
          <Form.List name="administrativeExpenses">
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
                          setAdministrativeExpensesValues(form.getFieldValue("administrativeExpenses"));
                        }}
                      />
                    </div>
                  </div>
                ))}
                <Form.Item className="mb-2 w-full ">
                  <Button className="flex flex-row h-full justify-center items-center" type="dashed" onClick={() => setAddAdministrativeExpensesModal(true)} block icon={<PlusOutlined />}>
                    Gastos Administrativos
                  </Button>
                </Form.Item>
              </div>
            )}
          </Form.List>
        </div>
      </section>
      {/* seccion para introducir los gastos de transportacion */}
      <section className=" flex w-full mb-0">
        <div className="flex w-[15%] justify-center items-center text-center gap-1 ">
          <span className="text-base font-bold mb-3">Gastos de Transportación</span>
        </div>
        <div className="flex pl-2 w-full flex-col">
          {transportationExpensesValues.length == 0 ? (
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
          <Form.List name="transportationExpenses">
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
                          setTransportationExpensesValues(form.getFieldValue("transportationExpenses"));
                        }}
                      />
                    </div>
                  </div>
                ))}
                <Form.Item className="mb-2 w-full ">
                  <Button className="flex flex-row h-full justify-center items-center" type="dashed" onClick={() => setAddTransportationExpensesModal(true)} block icon={<PlusOutlined />}>
                    Añadir Gastos de Transportación
                  </Button>
                </Form.Item>
              </div>
            )}
          </Form.List>
        </div>
      </section>
      {/* seccion para introducir los gastos de personal contratado */}
      <section className=" flex w-full mb-0">
        <div className="flex w-[15%] justify-center items-center text-center gap-1 ">
          <span className="text-base font-bold mb-3">Gastos de Personal Contratado</span>
        </div>
        <div className="flex pl-2 w-full flex-col">
          {hiredPersonalExpensesValues.length == 0 ? (
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
          <Form.List name="hiredPersonalExpenses">
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
                          setHiredPersonalExpensesValues(form.getFieldValue("transportationExpenses"));
                        }}
                      />
                    </div>
                  </div>
                ))}
                <Form.Item className="mb-2 w-full ">
                  <Button className="flex flex-row h-full justify-center items-center" type="dashed" onClick={() => setAddHiredPersonalExpensesModal(true)} block icon={<PlusOutlined />}>
                    Añadir Gastos de Personal Contratado
                  </Button>
                </Form.Item>
              </div>
            )}
          </Form.List>
        </div>
      </section>
      <section className="flex gap-4 mt-4">
        {/* ONAT */}
        <Form.Item className="mb-3 " label={<span className="font-bold text-md">ONAT (%)</span>} name="ONAT" rules={[{ required: true, message: "Campo requerido" }]}>
          <InputNumber disabled />
        </Form.Item>
        {/* commercialMargin */}
        <Form.Item className="mb-3 " label={<span className="font-bold text-md">Margen Comercial</span>} name="commercialMargin" rules={[{ required: true, message: "Campo requerido" }]}>
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
                  startAddServiceFee({
                    administrativeExpenses: values.administrativeExpenses,
                    artisticTalentValue: values.artisticTalentValue,
                    category: values.category,
                    commercialMargin: values.commercialMargin,
                    currencyChange: values.currencyChange,
                    equipmentDepreciation: values.equipmentDepreciation,
                    equipmentMaintenance: values.equipmentMaintenance,
                    hiredPersonalExpenses: values.hiredPersonalExpenses,
                    nomenclatorId: values.nomenclatorId,
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
                // form.resetFields();
                // router.push("/dashboard/serviceFees");
              })
              .catch((error) => {
                console.log("Validate Failed:", error);
              });
          }}
        >
          Crear
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

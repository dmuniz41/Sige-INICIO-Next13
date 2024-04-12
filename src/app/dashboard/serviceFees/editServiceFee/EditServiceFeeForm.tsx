"use client";
import { Button, Form, Input, InputNumber, Select, SelectProps, Tooltip } from "antd";
import { MinusCircleOutlined, PlusOutlined } from "@ant-design/icons";
import React, { useEffect, useMemo, useState } from "react";

import { AddAdministrativeExpensesModal } from "../createServiceFee/AddAdministrativeExpenses";
import { AddEquipmentDepreciationModal } from "../createServiceFee/AddEquipmentDepreciation";
import { AddEquipmentMaintenanceModal } from "../createServiceFee/AddEquipmentMaintenance";
import { AddHiredPersonalExpensesModal } from "../createServiceFee/AddHiredPersonalExpenses";
import { AddRawMaterialModal } from "../createServiceFee/AddRawMaterial";
import { AddTaskListModal } from "../createServiceFee/AddTaskList";
import { AddTransportationExpensesModal } from "../createServiceFee/AddTransportationExpenses";
import { INomenclator } from "@/models/nomenclator";
import { nomenclatorsStartLoading } from "@/actions/nomenclator";
import { IServiceFee, IServiceFeeSubItem } from "@/models/serviceFees";
import { RootState, useAppSelector } from "@/store/store";
import { startLoadServiceFeeAuxiliary } from "@/actions/serviceFeeAuxiliary";
import { startLoadServiceFeesTasks } from "@/actions/serviceFeeTask";
import { startUpdateServiceFee } from "@/actions/serviceFee";
import { useAppDispatch } from "@/hooks/hooks";
import { useRouter } from "next/navigation";
import TextArea from "antd/es/input/TextArea";
import { IServiceFeeAuxiliary } from "@/models/serviceFeeAuxiliary";
import { EditSvg } from "@/app/global/EditSvg";
import { DeleteSvg } from "@/app/global/DeleteSvg";
import Table, { ColumnsType } from "antd/es/table";
import { PlusSvg } from "@/app/global/PlusSvg";
import { EditRawMaterialModal } from "./EditRawMaterial";

export const EditServiceFeeForm = () => {
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

  // // * ESTADOS DE MODALES DE EDITAR //
  // const [editAdministrativeExpensesModal, setEditAdministrativeExpensesModal] = useState(false);
  // const [editEquipmentDepreciationModal, setEditEquipmentDepreciationModal] = useState(false);
  // const [editEquipmentMaintenanceModal, setEditEquipmentMaintenanceModal] = useState(false);
  // const [editHiredPersonalExpensesModal, setEditHiredPersonalExpensesModal] = useState(false);
  // const [editRawMaterialModal, setEditRawMaterialModal] = useState(false);
  // const [editTaskListModal, setEditTaskListModal] = useState(false);
  // const [editTransportationExpensesModal, setEditTransportationExpensesModal] = useState(false);

  // const [valueToEdit, setValueToEdit] = useState<IServiceFeeSubItem>({
  //   description: "",
  //   unitMeasure: "",
  //   amount: 0,
  //   price: 0,
  //   value: 0
  // });

  const [administrativeExpensesValues, setAdministrativeExpensesValues]: any = useState([]);
  const [equipmentDepreciationValues, setEquipmentDepreciationValues]: any = useState([]);
  const [equipmentMaintenanceValues, setEquipmentMaintenanceValues]: any = useState([]);
  const [hiredPersonalExpensesValues, setHiredPersonalExpensesValues]: any = useState([]);
  const [rawMaterialsValues, setRawMaterialsValues]: any = useState([]);
  const [taskListValues, setTaskListValues]: any = useState([]);
  const [transportationExpensesValues, setTransportationExpensesValues]: any = useState([]);

  const { nomenclators }: any = useAppSelector((state: RootState) => state?.nomenclator);
  const { selectedServiceFee }: { selectedServiceFee: IServiceFee } = useAppSelector(
    (state: RootState) => state?.serviceFee
  );
  const { serviceFeeAuxiliary }: { serviceFeeAuxiliary: IServiceFeeAuxiliary } = useAppSelector(
    (state: RootState) => state?.serviceFee
  );

  useEffect(() => {
    dispatch(nomenclatorsStartLoading());
    dispatch(startLoadServiceFeeAuxiliary());
    dispatch(startLoadServiceFeesTasks());
    setRawMaterialsValues(selectedServiceFee?.rawMaterials);
    setTaskListValues(selectedServiceFee?.taskList);
    setAdministrativeExpensesValues(selectedServiceFee?.administrativeExpenses);
    setEquipmentDepreciationValues(selectedServiceFee?.equipmentDepreciation);
    setEquipmentMaintenanceValues(selectedServiceFee?.equipmentMaintenance);
    setTransportationExpensesValues(selectedServiceFee?.transportationExpenses);
    setHiredPersonalExpensesValues(selectedServiceFee?.hiredPersonalExpenses);
  }, [dispatch, selectedServiceFee]);

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
    setAddRawMaterialModal(false);
  };

  // const onEditRawMaterial = (values: any) => {
  //   console.log("🚀 ~ onEditRawMaterial ~ values:", values)
  //   // setRawMaterialsValues([values, ...rawMaterialsValues]);
  //   setAddRawMaterialModal(false);
  // };

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
          name: "taskName",
          value: selectedServiceFee?.taskName
        },
        {
          name: "nomenclatorId",
          value: selectedServiceFee?.nomenclatorId
        },
        {
          name: "category",
          value: selectedServiceFee?.category
        },
        {
          name: "workersAmount",
          value: selectedServiceFee?.workersAmount
        },
        {
          name: "unitMeasure",
          value: selectedServiceFee?.unitMeasure
        },
        {
          name: "currencyChange",
          value: serviceFeeAuxiliary?.currencyChange
        },
        {
          name: "rawMaterials",
          value: rawMaterialsValues
        },
        {
          name: "taskList",
          value: taskListValues
        },
        {
          name: "equipmentDepreciation",
          value: equipmentDepreciationValues
        },
        {
          name: "equipmentMaintenance",
          value: equipmentMaintenanceValues
        },
        {
          name: "administrativeExpenses",
          value: administrativeExpensesValues
        },
        {
          name: "transportationExpenses",
          value: transportationExpensesValues
        },
        {
          name: "hiredPersonalExpenses",
          value: hiredPersonalExpensesValues
        },
        {
          name: "ONAT",
          value: selectedServiceFee?.ONAT
        },
        {
          name: "commercialMargin",
          value: selectedServiceFee?.commercialMargin
        },
        {
          name: "artisticTalent",
          value: selectedServiceFee?.artisticTalent
        },
        {
          name: "highComplexity",
          value: selectedServiceFee?.complexity?.find((complexity) => complexity.name === "Alta")
            ?.coefficient
        },
        {
          name: "mediumComplexity",
          value: selectedServiceFee?.complexity?.find((complexity) => complexity.name === "Media")
            ?.coefficient
        },
        {
          name: "lowComplexity",
          value: selectedServiceFee?.complexity?.find((complexity) => complexity.name === "Baja")
            ?.coefficient
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
                    ? form.setFieldValue("commercialMargin", 20)
                    : form.setFieldValue("commercialMargin", 50);
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

      <TableFormSection
        sectionName="Materias Primas"
        values={rawMaterialsValues}
        formName="rawMaterials"
        valuesSetter={setRawMaterialsValues}
        addModalSetter={setAddRawMaterialModal}
        // editModalSetter={setEditRawMaterialModal}
        // valueToEditSetter={setValueToEdit}
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
        sectionName="Gastos de Transportación"
        values={transportationExpensesValues}
        formName="transportationExpenses"
        valuesSetter={setTransportationExpensesValues}
        addModalSetter={setAddTransportationExpensesModal}
        buttonText="Añadir Gastos de Transportación"
        form={form}
      />
      <TableFormSection
        sectionName="Gastos de Personal Contratado"
        values={hiredPersonalExpensesValues}
        formName="hiredPersonalExpenses"
        valuesSetter={setHiredPersonalExpensesValues}
        addModalSetter={setAddHiredPersonalExpensesModal}
        buttonText="Añadir Gastos de Personal Contratado"
        form={form}
      />
      <article className="flex gap-2">
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
          name="artisticTalent"
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
                  startUpdateServiceFee({
                    _id: selectedServiceFee?._id,
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
                    payMethodCoef: values.payMethodCoef,
                    rawMaterials: rawMaterialsValues,
                    taskList: taskListValues,
                    taskName: values.taskName,
                    transportationExpenses: transportationExpensesValues,
                    unitMeasure: values.unitMeasure,
                    workersAmount: values.workersAmount
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

      {/* MODALES PARA CREAR Y EDITAR MATERIAS PRIMAS */}
      <AddRawMaterialModal
        open={addRawMaterialModal}
        onCancel={() => setAddRawMaterialModal(false)}
        onCreate={onAddRawMaterial}
      />
      {/* <EditRawMaterialModal
        open={editRawMaterialModal}
        onCancel={() => setEditRawMaterialModal(false)}
        onCreate={onEditRawMaterial}
        defaultValues={valueToEdit}
      /> */}
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

const FormSection = (props: any) => {
  const { sectionName, values, formName, valuesSetter, modalSetter, buttonText, form } = props;
  return (
    <section className=" flex w-full mb-8 bg-white-100 rounded-md p-2 shadow-[0px_0px_5px_0px_#00000024] ">
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
                      rules={[{ required: false }]}
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

const TableFormSection = (props: any) => {
  const {
    sectionName,
    values,
    valuesSetter,
    addModalSetter,
    editModalSetter,
    valueToEditSetter,
    buttonText
  } = props;

  const subtotal = useMemo(() => values?.map((value: IServiceFeeSubItem) => value.value), [values]);

  const handleDelete = (record: IServiceFeeSubItem) => {
    valuesSetter(
      values.filter((value: IServiceFeeSubItem) => value.description !== record.description)
    );
  };
  // const handleEdit = (record: IServiceFeeSubItem) => {
  //   valueToEditSetter(record);
  //   editModalSetter(true);
  // };

  const columns: ColumnsType<IServiceFeeSubItem> = [
    {
      title: <span className="font-bold">Descripción</span>,
      dataIndex: "description",
      key: "description",
      width: "50%"
    },
    {
      title: <span className="font-bold">Unidad de Medida</span>,
      dataIndex: "unitMeasure",
      key: "unitMeasure",
      width: "15%"
    },
    {
      title: <span className="font-bold">Cantidad</span>,
      dataIndex: "amount",
      key: "amount",
      width: "10%",
      render: (value) => (
        <span>
          $ {value.toLocaleString("DE", { maximumFractionDigits: 2, minimumFractionDigits: 2 })}
        </span>
      )
    },
    {
      title: <span className="font-bold">Precio/UM</span>,
      dataIndex: "price",
      key: "price",
      width: "15%",
      render: (value) => (
        <span>
          $ {value.toLocaleString("DE", { maximumFractionDigits: 2, minimumFractionDigits: 2 })}
        </span>
      )
    },
    {
      title: <span className="font-bold">Importe</span>,
      dataIndex: "value",
      key: "value",
      width: "15%",
      render: (value) => (
        <span>
          $ {value.toLocaleString("DE", { maximumFractionDigits: 2, minimumFractionDigits: 2 })}
        </span>
      )
    },
    {
      title: <span className="font-bold">Acciones</span>,
      key: "actions",
      width: "5%",
      render: (_, { ...record }) => (
        <div className="flex gap-1 justify-center">
          {/* <Tooltip placement="top" title={"Editar"} arrow={{ pointAtCenter: true }}>
            <button onClick={() => handleEdit(record)} className="table-see-action-btn">
              <EditSvg width={18} height={18} />
            </button>
          </Tooltip> */}
          <Tooltip placement="top" title={"Eliminar"} arrow={{ pointAtCenter: true }}>
            <button onClick={() => handleDelete(record)} className="table-delete-action-btn">
              <DeleteSvg width={17} height={17} />
            </button>
          </Tooltip>
        </div>
      )
    }
  ];
  return (
    <section className=" flex w-full mb-8 bg-white-100 rounded-md p-2  ">
      <div className="flex w-[15%] min-h-[100px] h-full p-2 text-center items-center justify-center">
        <span className="text-base font-bold">{sectionName.toUpperCase()}</span>
      </div>
      <div className="grid pl-2 w-full gap-2">
        <Table
          size="small"
          columns={columns}
          dataSource={values}
          className="shadow-sm"
          sortDirections={["ascend"]}
          pagination={false}
          footer={() => (
            <footer className="flex w-full">
              <div className="font-bold grow flex w-[90%]">
                <span>Subtotal: </span>
              </div>
              <div className="flex flex-1 pl-1 justify-start font-bold">
                <span>
                  ${" "}
                  {subtotal
                    ?.reduce((total: number, current: number) => total + current, 0)
                    ?.toLocaleString("DE", {
                      maximumFractionDigits: 2,
                      minimumFractionDigits: 2
                    })}
                </span>
              </div>
            </footer>
          )}
          bordered
        />
        <button
          className="add-item-form-btn"
          onClick={() => {
            addModalSetter(true);
          }}
        >
          <PlusSvg width={20} height={20} />
          {buttonText}
        </button>
      </div>
    </section>
  );
};

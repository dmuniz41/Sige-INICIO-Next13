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
import Swal from "sweetalert2";

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
    setAddEquipmentDepreciationModal(false);
  };

  const onAddEquipmentMaintenance = (values: any) => {
    setEquipmentMaintenanceValues([values, ...equipmentMaintenanceValues]);
    setAddEquipmentMaintenanceModal(false);
  };

  const onAddAdministrativeExpenses = (values: any) => {
    setAdministrativeExpensesValues([values, ...administrativeExpensesValues]);
    setAddAdministrativeExpensesModal(false);
  };

  const onAddTransportationExpenses = (values: any) => {
    setTransportationExpensesValues([values, ...transportationExpensesValues]);
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
        {/* commercialMargin */}
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

export const TableFormSection = (props: any) => {
  const { sectionName, values, valuesSetter, addModalSetter, buttonText } = props;

  const subtotal = useMemo(() => values?.map((value: IServiceFeeSubItem) => value.value), [values]);

  const handleDelete = (record: IServiceFeeSubItem) => {
    Swal.fire({
      title: "Eliminar",
      text: "Está seguro que desea eliminar este elemento",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      cancelButtonText: "Cancelar",
      confirmButtonText: "Eliminar"
    }).then((result) => {
      if (result.isConfirmed) {
        valuesSetter(
          values.filter((value: IServiceFeeSubItem) => value.description !== record.description)
        );
      }
    });
  };

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
          $ {value?.toLocaleString("DE", { maximumFractionDigits: 2, minimumFractionDigits: 2 })}
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
          $ {value?.toLocaleString("DE", { maximumFractionDigits: 2, minimumFractionDigits: 2 })}
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
          $ {value?.toLocaleString("DE", { maximumFractionDigits: 2, minimumFractionDigits: 2 })}
        </span>
      )
    },
    {
      title: <span className="font-bold">Acciones</span>,
      key: "actions",
      width: "5%",
      render: (_, { ...record }) => (
        <div className="flex gap-1 justify-center">
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
    <section className=" flex w-full mb-8 rounded-md p-2 border border-border_light shadow-sm">
      <div className="flex w-[15%] h-full p-2 text-center items-center justify-center bg-[#fafafa] rounded-l-md">
        <span className="text-base font-bold">{sectionName?.toUpperCase()}</span>
      </div>
      <div className="grid pl-2 w-full gap-2">
        <Table
          size="small"
          columns={columns}
          dataSource={values}
          className="shadow-sm"
          sortDirections={["ascend"]}
          pagination={false}
          bordered
          footer={() => (
            <footer className="flex w-full">
              <div className="font-bold flex w-[87.4%]">
                <span>Subtotal: </span>
              </div>
              <div className="flex justify-start font-bold">
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

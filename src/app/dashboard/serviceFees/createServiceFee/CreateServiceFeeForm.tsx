"use client";
import { AddRawMaterialModal } from "./AddRawMaterialModal";
import { Button, Form, Input, InputNumber, Select, SelectProps } from "antd";
import { INomenclator } from "@/models/nomenclator";
import { IRepresentationCoefficients, IServiceFeeAuxiliary } from "@/models/serviceFeeAuxiliary";
import { MinusCircleOutlined, PlusOutlined } from "@ant-design/icons";
import { nomenclatorsStartLoading } from "@/actions/nomenclator";
import { RootState, useAppSelector } from "@/store/store";
import { startLoadServiceFeeAuxiliary } from "@/actions/serviceFeeAuxiliary";
import { useAppDispatch } from "@/hooks/hooks";
import React, { useEffect, useState } from "react";
import { IServiceFeeSubItem } from "@/models/serviceFees";
import { AddTaskListModal } from "./AddTaskListModal";

export const CreateServiceFeeForm = () => {
  const dispatch = useAppDispatch();
  const [form] = Form.useForm();
  const serviceFeeCategory: string[] | undefined = [];
  const valuePerUM: string[] | undefined = [];
  const payMethods: IRepresentationCoefficients[] | undefined = [];
  const [addRawMaterialModal, setAddRawMaterialModal] = useState(false);
  const [addTaskListModal, setAddTaskListModal] = useState(false);
  const [rawMaterialsValues, setRawMaterialsValues]: any = useState([]);
  const [taskListValues, setTaskListValues]: any = useState([]);

  useEffect(() => {
    dispatch(nomenclatorsStartLoading());
    dispatch(startLoadServiceFeeAuxiliary());
  }, [dispatch]);

  const { nomenclators }: any = useAppSelector((state: RootState) => state?.nomenclator);
  const { currencyChange }: any = useAppSelector((state: RootState) => state?.costSheet);
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
      value: `${payMethod.coefficientValue}`,
    };
  });

  const onFinishFailed = (errorInfo: any) => {
    console.log("Failed:", errorInfo);
  };

  const onAddRawMaterial = (values: any) => {
    setRawMaterialsValues([values, ...rawMaterialsValues]);
    form.setFieldValue("Materias Primas", [...rawMaterialsValues, values]);
    // form.setFieldValue("Materias Primas", [
    //   {
    //     description: "descripcion",
    //     amount: 11,
    //     price: 1,
    //     unitMeasure: " m",
    //     value: 12,
    //   },
    //   {
    //     description: "descripcion",
    //     amount: 11,
    //     price: 1,
    //     unitMeasure: " m",
    //     value: 12,
    //   },
    // ]);
    setAddRawMaterialModal(false);
  };

  const onAddTaskList = (values: any) => {
    console.log("🚀 ~ onAddTaskList ~ values:", values);
    setTaskListValues([values, ...taskListValues]);
    form.setFieldValue("Actividades a Ejecutar", [...taskListValues, values]);
    setAddTaskListModal(false);
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
          name: "USDValue",
          value: currencyChange,
        },
      ]}
    >
      <section className=" flex-col ">
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
            <Form.Item className="mb-3 " label={<span className="font-bold text-md">Cambio $ </span>} name="USDValue" rules={[{ required: true, message: "Campo requerido" }]}>
              <InputNumber disabled className="w-full" />
            </Form.Item>
            <Form.Item className="mb-3" label={<span className="font-bold text-md">Método de pago: </span>} name="payMethod" rules={[{ required: true, message: "Campo requerido" }]}>
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
      <section className=" flex flex-col w-full mb-0">
        <div className="flex gap-1 ">
          <label className="text-md font-bold mb-3">Materias Primas</label>
        </div>
        <Form.List name="Materias Primas">
          {(fields, { add, remove }) => (
            <div className="flex flex-col w-full">
              {fields.map(({ key, name, ...restField }) => (
                <div key={key} className="w-full">
                  <div className="flex items-center flex-row mb-0 h-9  gap-1">
                    <Form.Item className="w-[60%]" {...restField} name={[name, "description"]} rules={[{ required: true, message: "Introduzca la descripción" }]}>
                      <Input placeholder="Descripción" className="w-full" />
                    </Form.Item>
                    <Form.Item {...restField} className="w-[20%]" name={[name, "unitMeasure"]} rules={[{ required: true }]}>
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
                        form.getFieldValue("Materias Primas");
                        setRawMaterialsValues(form.getFieldValue("Materias Primas"));
                      }}
                    />
                  </div>
                </div>
              ))}
              <Form.Item className="mb-2 w-full">
                <Button className="flex flex-row  justify-center items-center" type="dashed" onClick={() => setAddRawMaterialModal(true)} block icon={<PlusOutlined />}>
                  Añadir Materia Prima
                </Button>
              </Form.Item>
            </div>
          )}
        </Form.List>
      </section>
      {/* Seccion para introducir la lista de tareas */}
      <section className=" flex flex-col w-full mb-0">
        <div className="flex gap-1 ">
          <label className="text-md font-bold mb-3">Actividades a Ejecutar</label>
        </div>
        <Form.List name="Actividades a Ejecutar">
          {(fields, { add, remove }) => (
            <div className="flex flex-col w-full">
              {fields.map(({ key, name, ...restField }) => (
                <div key={key} className="w-full">
                  <div className="flex items-center flex-row mb-0 h-9  gap-1">
                    <Form.Item className="w-[60%]" {...restField} name={[name, "description"]} rules={[{ required: true }]}>
                      <Input placeholder="Descripción" className="w-full" />
                    </Form.Item>
                    <Form.Item className="w-[20%]" {...restField} name={[name, "unitMeasure"]} rules={[{ required: true }]}>
                      <InputNumber className="w-full" />
                    </Form.Item>
                    <Form.Item {...restField} name={[name, "amount"]} rules={[{ required: true }]}>
                      <InputNumber />
                    </Form.Item>
                    <Form.Item {...restField} name={[name, "price"]} rules={[{ required: true }]}>
                      <InputNumber />
                    </Form.Item>
                    <Form.Item {...restField} name={[name, "value"]} rules={[{ required: true }]}>
                      <InputNumber disabled />
                    </Form.Item>
                    <MinusCircleOutlined
                      className="mb-auto"
                      onClick={() => {
                        remove(name);
                        form.getFieldValue("Actividades a Ejecutar");
                        setTaskListValues(form.getFieldValue("Actividades a Ejecutar"));
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
                // dispatch(
                //   startAddCostSheet(
                //     values.administrativeExpenses,
                //     values.approvedBy,
                //     values.artisticTalent,
                //     values.category,
                //     values.createdBy,
                //     values.description,
                //     values.directSalaries,
                //     values.financialExpenses,
                //     values.nomenclatorId,
                //     values.otherDirectExpenses,
                //     values.payMethod,
                //     values.productionRelatedExpenses,
                //     values.rawMaterials,
                //     values.rawMaterialsByClient,
                //     values.representationCost,
                //     values.taskName,
                //     values.taxExpenses,
                //     values.transportationExpenses,
                //     values.USDValue,
                //     values.valuePerUnitMeasure,
                //     values.workersAmount
                //   )
                // );
                form.resetFields();
                // router.push("/dashboard/costSheets");
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
    </Form>
  );
};

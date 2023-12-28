"use client";

import { Form, Input, InputNumber, Select, SelectProps } from "antd";
import React from "react";

import { useAppDispatch } from "@/hooks/hooks";
import { startUpdateCostSheet } from "@/actions/costSheet";
import { useRouter } from "next/navigation";
import { ICostSheet } from "@/models/costSheet";
import { CSFormSection } from "../createCostSheet/CSFormSection";
import { RootState, useAppSelector } from "@/store/store";
import { nomenclatorsStartLoading } from "@/actions/nomenclator";

const onFinishFailed = (errorInfo: any) => {
  console.log("Failed:", errorInfo);
};

const payMethod: SelectProps["options"] = [
  {
    label: `Efectivo`,
    value: `CASH`,
  },
  {
    label: `Contrato`,
    value: `CONTRACT`,
  },
];

export const EditCostSheetForm = () => {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const [form] = Form.useForm();
  const { TextArea } = Input;

  dispatch(nomenclatorsStartLoading());
  const { selectedCostSheet }: { selectedCostSheet: ICostSheet } = useAppSelector((state: RootState) => state?.costSheet);

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
          value: selectedCostSheet.taskName,
        },
        {
          name: "workersAmount",
          value: selectedCostSheet.workersAmount,
        },
        {
          name: "payMethod",
          value: selectedCostSheet.payMethod,
        },
        {
          name: "description",
          value: selectedCostSheet.description,
        },
        {
          name: "rawMaterials",
          value: selectedCostSheet.rawMaterials,
        },
        {
          name: "directSalaries",
          value: selectedCostSheet.directSalaries,
        },
        {
          name: "otherDirectExpenses",
          value: selectedCostSheet.otherDirectExpenses,
        },
        {
          name: "productionRelatedExpenses",
          value: selectedCostSheet.productionRelatedExpenses,
        },
        {
          name: "administrativeExpenses",
          value: selectedCostSheet.administrativeExpenses,
        },
        {
          name: "transportationExpenses",
          value: selectedCostSheet.transportationExpenses,
        },
        {
          name: "financialExpenses",
          value: selectedCostSheet.financialExpenses,
        },
        {
          name: "taxExpenses",
          value: selectedCostSheet.taxExpenses,
        },
        {
          name: "representationCost",
          value: selectedCostSheet.representationCost,
        },
        {
          name: "artisticTalent",
          value: selectedCostSheet.artisticTalent,
        },
        {
          name: "createdBy",
          value: selectedCostSheet.createdBy,
        },
        {
          name: "approvedBy",
          value: selectedCostSheet.approvedBy,
        },
        {
          name: "rawMaterialsByClient",
          value: selectedCostSheet.rawMaterialsByClient,
        },
      ]}
    >
      <section className=" flex-col">
        <div className="flex gap-2 ">
          <Form.Item className="mb-3 " label={<span className="font-bold text-md">Tarea a ejecutar</span>} name="taskName" rules={[{ required: true, message: "Campo requerido" }]}>
            <Input className="w-[30rem]" />
          </Form.Item>
          <Form.Item className="mb-3 " label={<span className="font-bold text-md">Cantidad de empleados</span>} name="workersAmount" rules={[{ required: true, message: "Campo requerido" }]}>
            <InputNumber className="w-[5rem]" />
          </Form.Item>
          <Form.Item className="mb-3 " name="payMethod" label={<span className="font-bold text-md">Método de pago</span>} rules={[{ required: true, message: "Campo requerido" }]}>
            <Select allowClear style={{ width: "10rem" }} options={payMethod} />
          </Form.Item>
        </div>
        <Form.Item className="mb-3 w-[35%]" name="description" label={<span className="font-bold text-md">Descripción</span>} rules={[{ required: true, message: "Campo requerido" }]}>
          <TextArea rows={3} />
        </Form.Item>
      </section>
      <section className="flex flex-col w-full">
        <CSFormSection label="Gasto Material" tooltip="Considera los gastos de recursos materiales comprados y producidos" name="rawMaterials" />
        <CSFormSection label="Salarios directos" tooltip="(Actividades a ejecutar)" name="directSalaries" />
        <CSFormSection
          label="Otros gastos directos"
          tooltip="Se incluye pagos por mantenimientos y reparaciones recibidas, depreciación de los activos fijos tangibles y amortización de activos fijos intangibles.(Gasto en Uso de Equipos)"
          name="otherDirectExpenses"
        />
        <CSFormSection
          label="Gastos asociados a la producción"
          tooltip="Comprende los importes de los gastos que se incurren en las actividades asociadas a la producción, no identificables con un producto o servicio determinado.Ej: gasto de las actividades de mantenimiento, reparaciones, explotación de equipos, dirección de la producción, control de calidad, depreciación de activos fijos tangibles de producción y servicios auxiliares a estas, incluidos salarios, etc."
          name="productionRelatedExpenses"
        />
        <CSFormSection label="Gastos generales y de administración" tooltip="Incluidos salarios(Gastos administrativos)" name="administrativeExpenses" />
        <CSFormSection label="Gastos de distribución y ventas" tooltip="Incluye salarios(Gastos de Transporte)" name="transportationExpenses" />
        <CSFormSection
          label="Gastos financieros"
          tooltip="Comprende los gastos en que se incurre, por las operaciones financieras relacionadas con la producción o servicios para la que se elabora la ficha, reconociendo solamente los conceptos de intereses, comisiones bancarias y primas del seguro."
          name="financialExpenses"
        />
        <CSFormSection
          label="Gastos tributarios"
          tooltip="Incluye los importes de contribución a la seguridad social e impuestos sobre utilización de fuerzas de trabajo (no se considera el importe por la contribución al desarrollo local)"
          name="taxExpenses"
        />
      </section>

      <section className="flex gap-2">
        <div className="flex flex-col gap-2 justify-start">
          <Form.Item
            className="mb-3 "
            tooltip="Para la actividad de producción de bienes, la tasa máxima de utilidad aprobada no puede exceder el 25%"
            label={<span className="font-bold text-md">Utilidad</span>}
            name="representationCost"
            rules={[{ required: true, message: "Campo requerido" }]}
          >
            <InputNumber className="w-[5rem] " />
          </Form.Item>
          <Form.Item className="mb-3 " label={<span className="font-bold text-md">Talento artístico</span>} name="artisticTalent" rules={[{ required: true, message: "Campo requerido" }]}>
            <InputNumber className="w-[5rem] " />
          </Form.Item>
        </div>
        <div className="flex flex-col gap-1 justify-start">
          <Form.Item className="mb-3 " label={<span className="font-bold text-md">Elaborado por</span>} name="createdBy" rules={[{ required: true, message: "Campo requerido" }]}>
            <Input className="w-[15rem]" />
          </Form.Item>
          <Form.Item className="mb-3 " label={<span className="font-bold text-md">Aprobado por</span>} name="approvedBy" rules={[{ required: true, message: "Campo requerido" }]}>
            <Input className="w-[15rem]" />
          </Form.Item>
        </div>
        <Form.Item
          className="mb-3 "
          label={<span className="font-bold text-md">Materias primas aportadas por el cliente</span>}
          name="rawMaterialsByClient"
          rules={[{ required: true, message: "Campo requerido" }]}
        >
          <InputNumber className="w-[5rem] " />
        </Form.Item>
      </section>

      <Form.Item>
        <button
          type="submit"
          className="bg-success-500 cursor-pointer hover:bg-success-600 ease-in-out duration-300 w-[5rem] h-[2rem] flex items-center p-1 text-sm font-bold text-white-100  justify-center gap-2 rounded-md "
          onClick={() => {
            form
              .validateFields()
              .then((values: ICostSheet) => {
                console.log(values);
                dispatch(
                  startUpdateCostSheet(
                    selectedCostSheet._id,
                    values.taskName,
                    values.payMethod,
                    values.createdBy,
                    values.approvedBy,
                    values.description,
                    250,
                    values.workersAmount,
                    values.rawMaterials,
                    values.directSalaries,
                    values.otherDirectExpenses,
                    values.productionRelatedExpenses,
                    values.administrativeExpenses,
                    values.transportationExpenses,
                    values.financialExpenses,
                    values.taxExpenses,
                    values.artisticTalent,
                    values.representationCost,
                    values.rawMaterialsByClient
                  )
                );
                form.resetFields();
                router.push(`/dashboard/costSheets/${selectedCostSheet._id}`);
              })
              .catch((error) => {
                console.log("Validate Failed:", error);
              });
          }}
        >
          Editar
        </button>
      </Form.Item>
    </Form>
  );
};

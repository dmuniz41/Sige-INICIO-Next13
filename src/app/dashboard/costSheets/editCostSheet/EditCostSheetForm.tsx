"use client";

import { Form, Input, InputNumber, Select, SelectProps } from "antd";
import React from "react";

import { useAppDispatch } from "@/hooks/hooks";
import { startUpdateCostSheet } from "@/actions/costSheet";
import { useRouter } from "next/navigation";
import { ICostSheet } from "@/models/costSheet";
import { CSFormSection } from "../createCostSheet/CSFormSection";
import { RootState, useAppSelector } from "@/store/store";
import { INomenclator } from "@/models/nomenclator";

const onFinishFailed = (errorInfo: any) => {
  console.log("Failed:", errorInfo);
};

const payMethod: SelectProps["options"] = [
  {
    label: `Efectivo`,
    value: `CASH`
  },
  {
    label: `Contrato`,
    value: `CONTRACT`
  }
];

export const EditCostSheetForm = () => {
  const { nomenclators }: any = useAppSelector((state: RootState) => state?.nomenclator);
  const { currencyChange }: any = useAppSelector((state: RootState) => state?.costSheet);
  const costSheetCategory: string[] | undefined = [];
  const valuePerUM: string[] | undefined = [];
  const dispatch = useAppDispatch();
  const router = useRouter();
  const [form] = Form.useForm();
  const { TextArea } = Input;

  const { selectedCostSheet }: { selectedCostSheet: ICostSheet } = useAppSelector(
    (state: RootState) => state?.costSheet
  );

  nomenclators.map((nomenclator: INomenclator) => {
    if (nomenclator.category === "Categoría de ficha de costo")
      costSheetCategory.push(nomenclator.code);
    if (nomenclator.category === "Precio/UM en ficha de costo") valuePerUM.push(nomenclator.code);
  });

  const categoriesOptions: SelectProps["options"] = costSheetCategory.map((costSheetCategory) => {
    return {
      label: `${costSheetCategory}`,
      value: `${costSheetCategory}`
    };
  });

  const valuePerUMOptions: SelectProps["options"] = valuePerUM.map((valuePerUM) => {
    return {
      label: `${valuePerUM}`,
      value: `${valuePerUM}`
    };
  });
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
          value: selectedCostSheet.taskName
        },
        {
          name: "valuePerUnitMeasure",
          value: selectedCostSheet.valuePerUnitMeasure
        },
        {
          name: "nomenclatorId",
          value: selectedCostSheet.nomenclatorId
        },
        {
          name: "category",
          value: selectedCostSheet.category
        },
        {
          name: "workersAmount",
          value: selectedCostSheet.workersAmount
        },
        {
          name: "payMethod",
          value: selectedCostSheet.payMethod
        },
        {
          name: "description",
          value: selectedCostSheet.description
        },
        {
          name: "rawMaterials",
          value: selectedCostSheet.rawMaterials
        },
        {
          name: "directSalaries",
          value: selectedCostSheet.directSalaries
        },
        {
          name: "otherDirectExpenses",
          value: selectedCostSheet.otherDirectExpenses
        },
        {
          name: "productionRelatedExpenses",
          value: selectedCostSheet.productionRelatedExpenses
        },
        {
          name: "administrativeExpenses",
          value: selectedCostSheet.administrativeExpenses
        },
        {
          name: "transportationExpenses",
          value: selectedCostSheet.transportationExpenses
        },
        {
          name: "financialExpenses",
          value: selectedCostSheet.financialExpenses
        },
        {
          name: "taxExpenses",
          value: selectedCostSheet.taxExpenses
        },
        {
          name: "representationCost",
          value: selectedCostSheet.representationCost
        },
        {
          name: "artisticTalent",
          value: selectedCostSheet.artisticTalent
        },
        {
          name: "createdBy",
          value: selectedCostSheet.createdBy
        },
        {
          name: "approvedBy",
          value: selectedCostSheet.approvedBy
        },
        {
          name: "rawMaterialsByClient",
          value: selectedCostSheet.rawMaterialsByClient
        },
        {
          name: "USDValue",
          value: currencyChange
        }
      ]}
    >
      <section className=" flex-col">
        <div className="flex gap-2 pr-[13rem]">
          <Form.Item
            className="mb-3 flex-1"
            label={<span className="font-semibold text-md">Tarea a ejecutar</span>}
            name="taskName"
            rules={[{ required: true, message: "Campo requerido" }]}
          >
            <Input />
          </Form.Item>
        </div>
        <div className="flex flex-row gap-4">
          <Form.Item
            className="mb-3 w-[35%]"
            name="description"
            label={<span className="font-semibold text-md">Descripción</span>}
            rules={[{ required: true, message: "Campo requerido" }]}
          >
            <TextArea rows={3} />
          </Form.Item>
          <div className="flex flex-col">
            <Form.Item
              className="mb-3"
              label={<span className="font-semibold text-md">Nomenclador</span>}
              name="nomenclatorId"
              rules={[{ required: true, message: "Campo requerido" }]}
            >
              <Input disabled />
            </Form.Item>
            <Form.Item
              className="mb-3"
              label={<span className="font-semibold text-md">Categoría</span>}
              name="category"
              rules={[{ required: true, message: "Campo requerido" }]}
            >
              <Select
                allowClear
                options={categoriesOptions}
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
          </div>
          {/* <Form.Item className="mb-3 " name="payMethod" label={<span className="font-semibold text-md">Método de pago</span>} rules={[{ required: true, message: "Campo requerido" }]}>
            <Select allowClear style={{ width: "10rem" }} options={payMethod} />
          </Form.Item> */}
          <div className="flex flex-col">
            <Form.Item
              className="mb-3 "
              label={<span className="font-semibold text-md">Cantidad de empleados</span>}
              name="workersAmount"
              rules={[{ required: true, message: "Campo requerido" }]}
            >
              <InputNumber min={0} className="w-[5rem]" />
            </Form.Item>
            <Form.Item
              className="mb-3"
              label={<span className="font-semibold text-md">Precio/UM</span>}
              name="valuePerUnitMeasure"
              rules={[{ required: true, message: "Campo requerido" }]}
            >
              <Select
                allowClear
                options={valuePerUMOptions}
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
          </div>
          <div className="flex flex-col">
            <Form.Item
              className="mb-3 "
              label={<span className="font-semibold text-md">Cambio $ </span>}
              name="USDValue"
              rules={[{ required: true, message: "Campo requerido" }]}
            >
              <InputNumber min={0} disabled className="w-[5rem]" />
            </Form.Item>
          </div>
        </div>
      </section>
      <section className="flex flex-col w-full">
        <CSFormSection
          label="Gasto Material"
          tooltip="Considera los gastos de recursos materiales comprados y producidos"
          name="rawMaterials"
        />
        <CSFormSection
          label="Salarios directos"
          tooltip="(Actividades a ejecutar)"
          name="directSalaries"
        />
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
        <CSFormSection
          label="Gastos generales y de administración"
          tooltip="Incluidos salarios(Gastos administrativos)"
          name="administrativeExpenses"
        />
        <CSFormSection
          label="Gastos de distribución y ventas"
          tooltip="Incluye salarios(Gastos de Transporte)"
          name="transportationExpenses"
        />
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

      <section className="flex gap-5 pt-3">
        <div className="flex flex-col gap-2 justify-start">
          <Form.Item
            className="mb-3 "
            tooltip="Para la actividad de producción de bienes, la tasa máxima de utilidad aprobada no puede exceder el 25%"
            label={<span className="font-semibold text-md">Utilidad</span>}
            name="representationCost"
            rules={[{ required: true, message: "Campo requerido" }]}
          >
            <InputNumber min={0} className="w-[5rem] " />
          </Form.Item>
          <Form.Item
            className="mb-3 "
            label={<span className="font-semibold text-md">Talento artístico</span>}
            name="artisticTalent"
            rules={[{ required: true, message: "Campo requerido" }]}
          >
            <InputNumber min={0} className="w-[5rem] " />
          </Form.Item>
        </div>
        <div className="flex flex-col gap-1 justify-start">
          <Form.Item
            className="mb-3 "
            label={<span className="font-semibold text-md">Elaborado por</span>}
            name="createdBy"
            rules={[{ required: true, message: "Campo requerido" }]}
          >
            <Input className="w-[15rem]" />
          </Form.Item>
          <Form.Item
            className="mb-3 "
            label={<span className="font-semibold text-md">Aprobado por</span>}
            name="approvedBy"
            rules={[{ required: true, message: "Campo requerido" }]}
          >
            <Input className="w-[15rem]" />
          </Form.Item>
        </div>
        <Form.Item
          className="mb-3 "
          label={
            <span className="font-semibold text-md">Materias primas aportadas por el cliente</span>
          }
          name="rawMaterialsByClient"
          rules={[{ required: true, message: "Campo requerido" }]}
        >
          <InputNumber min={0} className="w-[5rem] " />
        </Form.Item>
      </section>

      <Form.Item>
        <button
          type="submit"
          className="mt-4 select-none rounded-lg bg-success-500 py-3 px-6 text-center align-middle text-sm font-semibold uppercase text-white-100 shadow-md shadow-success-500/20 transition-all hover:shadow-lg hover:shadow-success-500/40 focus:opacity-[0.85] focus:shadow-none active:opacity-[0.85] active:shadow-none disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none "
          onClick={() => {
            form
              .validateFields()
              .then((values: ICostSheet) => {
                dispatch(
                  startUpdateCostSheet(
                    selectedCostSheet._id,
                    values.administrativeExpenses,
                    values.approvedBy,
                    values.artisticTalent,
                    values.category,
                    values.createdBy,
                    values.description,
                    values.directSalaries,
                    values.financialExpenses,
                    values.otherDirectExpenses,
                    values.payMethod,
                    values.productionRelatedExpenses,
                    values.rawMaterials,
                    values.rawMaterialsByClient,
                    values.representationCost,
                    values.taskName,
                    values.taxExpenses,
                    values.transportationExpenses,
                    values.USDValue,
                    values.valuePerUnitMeasure,
                    values.workersAmount
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

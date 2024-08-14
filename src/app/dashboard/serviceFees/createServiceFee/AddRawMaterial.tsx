"use client";
import { Form, InputNumber, Modal, Select, SelectProps } from "antd";
import { useEffect, useState } from "react";

import { IMaterial } from "@/models/material";
import { INomenclator } from "@/models/nomenclator";
import { IServiceFeeSubItem } from "@/models/serviceFees";
import { materialsStartLoading } from "@/actions/material";
import { RootState, useAppSelector } from "@/store/store";
import { useAppDispatch } from "@/hooks/hooks";
import { IMaterialNomenclator } from "@/models/nomenclators/materials";
import { IServiceFeeAuxiliary } from "@/models/serviceFeeAuxiliary";

interface CollectionCreateFormProps {
  open: boolean;
  onCreate: (values: IServiceFeeSubItem) => void;
  onCancel: () => void;
}

export const AddRawMaterialModal: React.FC<CollectionCreateFormProps> = ({
  open,
  onCreate,
  onCancel
}) => {
  const [currentPrice, setCurrentPrice] = useState<number>(0);
  const [currentUnitMeasure, setCurrentUnitMeasure] = useState<string>("");
  const [rawMaterialValue, setRawMaterialValue] = useState<number>(0);
  const { materials }: { materials: IMaterial[] } = useAppSelector(
    (state: RootState) => state?.material
  );

  const {
    nomenclators,
    materialsNomenclators
  }: { nomenclators: INomenclator[]; materialsNomenclators: IMaterialNomenclator[] } =
    useAppSelector((state: RootState) => state?.nomenclator);

  const { serviceFeeAuxiliary }: { serviceFeeAuxiliary: IServiceFeeAuxiliary } = useAppSelector(
    (state: RootState) => state?.serviceFee
  );

  const DBMaterials: INomenclator[] = [];
  const dispatch = useAppDispatch();

  // TODO: QUITAR EL ID DEL ALMACEN HARCODEADO //
  useEffect(() => {
    dispatch(materialsStartLoading("66b679882628e2b4e1727b3d"));
  }, [dispatch]);

  nomenclators.map((nomenclator: INomenclator) => {
    if (nomenclator.category === "Material") {
      DBMaterials.push(nomenclator);
    }
  });
  const listOfMaterials: SelectProps["options"] = DBMaterials.map((material) => {
    return {
      label: `${material.code}`,
      value: `${material.code}`
    };
  });

  const [form] = Form.useForm();
  return (
    <Modal
      className="flex flex-col"
      title={
        <div className="flex w-full justify-center">
          <span className="font-semibold text-lg">Nueva Materia Prima</span>
        </div>
      }
      cancelText="Cancelar"
      centered
      destroyOnClose
      okText="Crear"
      okType="default"
      onCancel={onCancel}
      open={open}
      style={{ textAlign: "left" }}
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
                    ...values,
                    description: values.description.label,
                    unitMeasure: currentUnitMeasure,
                    price: currentPrice,
                    value: rawMaterialValue
                  });
                  form.resetFields();
                  setRawMaterialValue(0);
                  setCurrentPrice(0);
                  setCurrentUnitMeasure("");
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
      <Form form={form} layout="horizontal" name="addRawMaterial" size="middle">
        <Form.Item
          name="description"
          label="Descripción"
          rules={[{ required: true, message: "Campo requerido" }]}
        >
          <Select
            autoFocus
            allowClear
            labelInValue
            style={{ width: "100%" }}
            options={listOfMaterials}
            onSelect={(value) => {
              const selectedMaterial = materials.find(
                (material) =>
                  `${material.category} ${material.materialName}`.trim().toLowerCase() ===
                  String(value.label).trim().toLowerCase()
              );
              const materialNomenclator = materialsNomenclators.find(
                (mn) =>
                  mn.name.trim().toLocaleLowerCase() ===
                  selectedMaterial?.category.trim().toLocaleLowerCase()
              );
              setCurrentUnitMeasure(selectedMaterial?.unitMeasure!);

              // ? SI EL MATERIAL ES GASTABLE SE LE APLICA EL COEFICIENTE DE MERMA AL PRECIO DEL MATERIAL, EN CASO CONTRARIO MANTIENE EL PRECIO ORIGINAL?//
              if (materialNomenclator?.isDecrease) {
                setCurrentPrice(
                  selectedMaterial?.costPerUnit! * serviceFeeAuxiliary?.mermaCoefficient
                );
              } else {
                setCurrentPrice(selectedMaterial?.costPerUnit!);
              }
              setRawMaterialValue(0);

              form.setFieldsValue({
                unitMeasure: selectedMaterial?.unitMeasure,
                price: form.getFieldValue("description")?.value,
                amount: 0
              });
            }}
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
        <Form.Item
          name="amount"
          label="Cantidad"
          className="w-[10rem]"
          rules={[{ required: true, message: "Campo requerido" }]}
        >
          <InputNumber
            min={0}
            onChange={(value: number | null) => {
              setRawMaterialValue(value! * currentPrice);
            }}
          />
        </Form.Item>
        <div className=" flex gap-2 pl-2 mb-4">
          <span className="font-semibold">Unidad de Medida:</span>
          <span>{currentUnitMeasure}</span>
        </div>
        <div className=" flex gap-2 pl-2 mb-4">
          <span className="font-semibold">Precio:</span>
          <span>${currentPrice?.toFixed(2)}</span>
        </div>
        <div className=" flex gap-2 pl-2 mb-4">
          <span className="font-semibold">Importe:</span>
          <span>${rawMaterialValue?.toFixed(2)}</span>
        </div>
      </Form>
    </Modal>
  );
};

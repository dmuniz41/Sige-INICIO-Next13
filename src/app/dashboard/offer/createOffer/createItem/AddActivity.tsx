"use client";

import { Form, InputNumber, Modal, Radio, Select, SelectProps } from "antd";
import { IActivity } from "@/models/offer";
import { IServiceFee } from "@/models/serviceFees";
import { RootState, useAppSelector } from "@/store/store";
import { serviceFeeStartLoading } from "@/actions/serviceFee";
import { useAppDispatch } from "@/hooks/hooks";
import { useEffect, useMemo, useState } from "react";

interface CollectionCreateFormProps {
  open: boolean;
  onCreate: (values: IActivity) => void;
  onCancel: () => void;
}

export const AddActivityModal: React.FC<CollectionCreateFormProps> = ({
  open,
  onCreate,
  onCancel
}) => {
  const [size, setSize] = useState<number>(0);
  const [currentUnitMeasure, setCurrentUnitMeasure] = useState<string>("");
  const [currentPrice, setCurrentPrice] = useState<number>(0);
  const [currentAmount, setCurrentAmount] = useState<number>(0);
  const [selectedServiceFee, setSelectedServiceFee] = useState<IServiceFee>();
  const activityValue = useMemo(() => size * currentPrice, [size, currentPrice]);
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(serviceFeeStartLoading());
  }, [dispatch]);

  const { serviceFees }: { serviceFees: IServiceFee[] } = useAppSelector(
    (state: RootState) => state?.serviceFee
  );

  const listOfActivities: SelectProps["options"] = serviceFees.map((serviceFee) => {
    return {
      label: `${serviceFee.taskName}`,
      value: `${serviceFee.taskName}`
    };
  });

  const [form] = Form.useForm();
  return (
    <Modal
      className="flex flex-col"
      title={
        <div className="flex w-full justify-center">
          <span className="font-bold text-lg">Nueva Actividad</span>
        </div>
      }
      style={{ textAlign: "left" }}
      centered
      open={open}
      destroyOnClose
      onCancel={onCancel}
      okType="default"
      okText="Crear"
      width={"1000px"}
      cancelText="Cancelar"
      footer={[
        <div key="footer" className="flex gap-2 w-full justify-end">
          <button key="2" className="modal-btn-danger" onClick={onCancel}>
            Cancelar
          </button>
          <button
            key="1"
            className="modal-btn-primary"
            onClick={() => {
              form
                .validateFields()
                .then((values) => {                  
                  onCreate(
                    currentUnitMeasure.includes("Unidad (U)") ||
                      currentUnitMeasure.includes("Metro (m)")
                      ? {
                          amount: values.amount,
                          size: 0,
                          width: 0,
                          height: 0,
                          _id: selectedServiceFee?._id!,
                          description: values.description.value,
                          price: Number(currentPrice.toFixed(2)),
                          unitMeasure: currentUnitMeasure,
                          value: Number(activityValue.toFixed(2))
                        }
                      : {
                          size: values.width * values.height,
                          width: values.width,
                          height: values.height,
                          _id: selectedServiceFee?._id!,
                          amount: values.width * values.height,
                          description: values.description.value,
                          price: Number(currentPrice.toFixed(2)),
                          unitMeasure: currentUnitMeasure,
                          value: Number(activityValue.toFixed(2))
                        }
                  );
                  form.resetFields();
                  setCurrentPrice(0);
                  setSize(0);
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
      <Form form={form} layout="horizontal" name="addActivity" size="middle">
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
            options={listOfActivities}
            onSelect={(value) => {
              const currentServiceFee = serviceFees.find(
                (serviceFee) => serviceFee.taskName === value.label
              );
              setSelectedServiceFee(currentServiceFee!);
              setCurrentUnitMeasure(currentServiceFee?.unitMeasure!);
              setCurrentPrice(0);

              form.setFieldsValue({
                unitMeasure: selectedServiceFee?.unitMeasure,
                price: form.getFieldValue("description")?.value,
                height: 0,
                width: 0,
                amount: 0,
                size: 0,
                complexity: null
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
          className={`w-[12rem] ${currentUnitMeasure?.includes("Unidad (U)") || currentUnitMeasure?.includes("Metro (m)") ? "" : "hidden"}`}
          rules={[{ required: true, message: "Campo requerido" }]}
        >
          <InputNumber
            onChange={(value: number | null) => {
              setSize(value!);
            }}
          />
        </Form.Item>
        <Form.Item
          name="width"
          label="Largo"
          className={`w-[12rem] ${(currentUnitMeasure?.includes("Unidad (U)") || currentUnitMeasure?.includes("Metro (m)")) && "hidden"}`}
          rules={[{ required: true, message: "Campo vacío o incorrecto" }]}
        >
          <InputNumber
            precision={2}
            className="w-full"
            onChange={() => {
              setSize(form.getFieldValue("width") * form.getFieldValue("height"));
              form.setFieldValue(
                "size",
                form.getFieldValue("width") * form.getFieldValue("height")
              );
            }}
          />
        </Form.Item>
        <Form.Item
          name="height"
          label="Ancho"
          className={`w-[12rem] ${(currentUnitMeasure?.includes("Unidad (U)") || currentUnitMeasure?.includes("Metro (m)")) && "hidden"}`}
          rules={[{ required: true, message: "Campo vacío o incorrecto" }]}
        >
          <InputNumber
            precision={2}
            className="w-full"
            onChange={() => {
              setSize(form.getFieldValue("width") * form.getFieldValue("height"));
              form.setFieldValue(
                "size",
                form.getFieldValue("width") * form.getFieldValue("height")
              );
              setSize(form.getFieldValue("height") * form.getFieldValue("width"));
            }}
          />
        </Form.Item>
        <Form.Item
          name="complexity"
          label="Complejidad"
          rules={[{ required: true, message: "Seleccione un nivel de complejidad" }]}
        >
          <Radio.Group
            buttonStyle="solid"
            onChange={(value) => {
              value.target.value === "Alta"
                ? selectedServiceFee?.complexity.find(
                    (complexity) => complexity.name === "Alta" && setCurrentPrice(complexity.value)
                  )
                : value.target.value === "Media"
                  ? selectedServiceFee?.complexity.find(
                      (complexity) =>
                        complexity.name === "Media" && setCurrentPrice(complexity.value)
                    )
                  : selectedServiceFee?.complexity.find(
                      (complexity) =>
                        complexity.name === "Baja" && setCurrentPrice(complexity.value)
                    );
            }}
          >
            <Radio.Button value="Alta">Alta</Radio.Button>
            <Radio.Button value="Media">Media</Radio.Button>
            <Radio.Button value="Baja">Baja</Radio.Button>
          </Radio.Group>
        </Form.Item>
        <Form.Item
          name="size"
          label="Tamano"
          className="w-[12rem] hidden"
          rules={[{ required: true, message: "Campo requerido" }]}
        >
          <InputNumber precision={2} disabled className="w-full" />
        </Form.Item>
        {currentUnitMeasure?.includes("Unidad (U)") || currentUnitMeasure?.includes("Metro (m)") ? (
          <div className={`flex gap-2 pl-2 mb-4 ${currentUnitMeasure.includes("u") && "hidden"}`}>
            <span className="font-bold">Cantidad:</span>
            <span>
              {!form.getFieldValue("amount")
                ? 0
                : form.getFieldValue("amount").toLocaleString("DE", {
                    maximumFractionDigits: 2,
                    minimumFractionDigits: 2
                  })}{" "}
            </span>
          </div>
        ) : (
          <div className=" flex gap-2 pl-2 mb-4">
            <span className="font-bold">Tamaño:</span>
            <span>
              {!size
                ? 0
                : size.toLocaleString("DE", { maximumFractionDigits: 2, minimumFractionDigits: 2 })}
            </span>
          </div>
        )}
        <div className=" flex gap-2 pl-2 mb-4">
          <span className="font-bold">Unidad de Medida:</span>
          <span>{currentUnitMeasure}</span>
        </div>
        <div className=" flex gap-2 pl-2 mb-4">
          <span className="font-bold">Precio:</span>
          <span>
            $
            {currentPrice?.toLocaleString("DE", {
              maximumFractionDigits: 2,
              minimumFractionDigits: 2
            })}
          </span>
        </div>
        <div className=" flex gap-2 pl-2 mb-4">
          <span className="font-bold">Importe:</span>
          <span>
            $
            {activityValue?.toLocaleString("DE", {
              maximumFractionDigits: 2,
              minimumFractionDigits: 2
            })}
          </span>
        </div>
      </Form>
    </Modal>
  );
};

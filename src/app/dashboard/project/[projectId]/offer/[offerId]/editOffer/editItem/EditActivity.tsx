"use client";

import { Form, Input, InputNumber, Modal, Radio, Table, Tooltip } from "antd";
import { IActivity } from "@/models/offer";
import { IServiceFee } from "@/models/serviceFees";
import { RootState, useAppSelector } from "@/store/store";
import { useAppDispatch } from "@/hooks/hooks";
import { useEffect, useMemo, useState } from "react";
import { ColumnsType } from "antd/es/table";
import { PlusCircleSvg } from "@/app/global/PlusCircleSvg";
import { DeleteSvg } from "@/app/global/DeleteSvg";

interface CollectionCreateFormProps {
  open: boolean;
  onCreate: (values: IActivity) => void;
  onCancel: () => void;
  defaultValues: IActivity;
}

export const EditActivityModal: React.FC<CollectionCreateFormProps> = ({
  open,
  onCreate,
  onCancel,
  defaultValues
}) => {
  const { serviceFees }: { serviceFees: IServiceFee[] } = useAppSelector(
    (state: RootState) => state?.serviceFee
  );
  const dispatch = useAppDispatch();
  const [form] = Form.useForm();
  const [currentPrice, setCurrentPrice] = useState<number>(defaultValues?.price);
  const [currentUnitMeasure, setCurrentUnitMeasure] = useState<string>(defaultValues?.unitMeasure);
  const [currentDescription, setCurrentDescription] = useState<string>(defaultValues?.description);
  // const [selectedServiceFee, setSelectedServiceFee] = useState<IServiceFee>();
  const [size, setSize] = useState<number>(0);
  const [activitiesTableValues, setActivitiesTableValues] = useState<
    {
      amount: number;
      description: string;
      height: number;
      unitMeasure: string;
      width: number;
    }[]
  >(defaultValues?.listOfMeasures);
  const activityValue = useMemo(
    () =>
      activitiesTableValues?.reduce(
        (total, currentValue) =>
          total + currentValue.amount * currentValue.width * currentValue.height,
        0
      ) * currentPrice,
    [currentPrice, activitiesTableValues]
  );

  useEffect(() => {
    form.setFieldValue("height", 0);
    form.setFieldValue("width", 0);
    form.setFieldValue("amountOfUnits", 0);
    form.setFieldValue("amount", 0);
    form.setFieldValue("size", 0);
    // form.setFieldValue("complexity", defaultValues?.complexity);
    form.setFieldValue("description", defaultValues?.description);
    setCurrentUnitMeasure(defaultValues?.unitMeasure);
    setActivitiesTableValues(defaultValues?.listOfMeasures);
    setCurrentDescription(defaultValues?.description);
    setCurrentPrice(defaultValues?.price);
    // setSelectedServiceFee(
    //   serviceFees?.find((sf) => sf?.taskName === form.getFieldValue("description"))!
    // );
  }, [dispatch, defaultValues, form, currentDescription, serviceFees]);

  const columns: ColumnsType<{
    description: string;
    unitMeasure: string;
    width: number;
    height: number;
    amount: number;
  }> = [
    {
      title: <span className="font-semibold">Descripción</span>,
      dataIndex: "description",
      key: "description",
      width: "70%"
    },
    {
      title: <span className="font-semibold">Cantidad</span>,
      dataIndex: "size",
      key: "size",
      width: "10%",
      render: (_, { ...record }) => (
        <div className="flex gap-1 justify-center">
          {(record.width * record.height * record.amount).toLocaleString("DE", {
            maximumFractionDigits: 2,
            minimumFractionDigits: 2
          })}
        </div>
      )
    },
    {
      title: <span className="font-semibold">Unidad de Medida</span>,
      dataIndex: "unitMeasure",
      key: "unitMeasure",
      width: "20%"
    },
    {
      title: <span className="font-semibold">Acciones</span>,
      width: "10%",
      render: (_, { ...record }) => (
        <div className="flex gap-1 justify-center">
          <Tooltip placement="top" title={"Eliminar"} arrow={{ pointAtCenter: true }}>
            <button
              className="table-delete-action-btn"
              onClick={() => {
                setActivitiesTableValues(
                  activitiesTableValues.filter((av) => av.description !== record.description)
                );
              }}
            >
              <DeleteSvg width={17} height={17} />
            </button>
          </Tooltip>
        </div>
      )
    }
  ];

  return (
    <Modal
      className="flex flex-col"
      title={
        <div className="flex w-full justify-center">
          <span className="font-semibold text-lg">Editar Actividad</span>
        </div>
      }
      style={{ textAlign: "left" }}
      centered
      open={open}
      destroyOnClose={true}
      onCancel={() => {
        form.setFieldValue("description", "");
      }}
      okType="default"
      okText="Crear"
      width={"1200px"}
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
                          description: defaultValues.description,
                          height: 0,
                          price: Number(currentPrice.toFixed(2)),
                          size: 0,
                          unitMeasure: currentUnitMeasure,
                          value: size * currentPrice,
                          width: 0,
                          listOfMeasures: activitiesTableValues,
                          // complexity: form.getFieldValue("complexity")
                        }
                      : {
                          amount: activitiesTableValues?.reduce(
                            (total, currentValue) =>
                              total +
                              currentValue.amount * currentValue.width * currentValue.height,
                            0
                          ),
                          description: defaultValues.description,
                          height: values.height,
                          price: Number(currentPrice.toFixed(2)),
                          size: activitiesTableValues?.reduce(
                            (total, currentValue) =>
                              total +
                              currentValue.amount * currentValue.width * currentValue.height,
                            0
                          ),
                          unitMeasure: currentUnitMeasure,
                          value: Number(activityValue.toFixed(2)),
                          width: values.width,
                          listOfMeasures: activitiesTableValues,
                          // complexity: form.getFieldValue("complexity")
                        }
                  );
                  form.resetFields();
                  setCurrentPrice(0);
                  setSize(0);
                  setCurrentUnitMeasure("");
                  setActivitiesTableValues([]);
                })
                .catch((error) => {
                  console.log("Validate Failed:", error);
                });
            }}
          >
            Editar
          </button>
        </div>
      ]}
    >
      <Form
        form={form}
        layout="horizontal"
        name="addActivity"
        size="middle"
        // initialValues={{ complexity: defaultValues?.complexity }}
      >
        <div className=" flex gap-2 pl-2 mb-4">
          <span className="font-semibold">Descripción:</span>
          <span>{defaultValues?.description}</span>
        </div>
        {/* SOLO SE MUESTRA SI LA UNIDAD DE MEDIDA DE LA TARIFA ES EN UNIDADES LINEALES */}
        <Form.Item
          name="description"
          label="Cantidad"
          className="hidden"
          rules={[{ required: true, message: "" }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name="amount"
          label="Cantidad"
          className={`w-[12rem] ${currentUnitMeasure?.includes("Unidad (U)") || currentUnitMeasure?.includes("Metro (m)") ? "" : "hidden"}`}
          rules={[{ required: true, message: "" }]}
        >
          <InputNumber
            min={0}
            onChange={(value: number | null) => {
              setSize(value!);
            }}
          />
        </Form.Item>
        <section className="w-full flex">
          <article className="grid bg w-[40%]">
            <article className="flex gap-4  w-fit border-border_light rounded-md">
              <div className="flex flex-col items-center">
                {/* SOLO SE MUESTRA SI LA UNIDAD DE MEDIDA DE LA TARIFA ES EN UNIDADES CUADRADAS */}
                <Form.Item
                  name="width"
                  label="Largo"
                  className={`w-[12rem] mb-2 ${(currentUnitMeasure?.includes("Unidad (U)") || currentUnitMeasure?.includes("Metro (m)")) && "hidden"}`}
                  rules={[{ required: true, message: "" }]}
                >
                  <InputNumber min={0} precision={2} className="w-full" />
                </Form.Item>
                {/* SOLO SE MUESTRA SI LA UNIDAD DE MEDIDA DE LA TARIFA ES EN UNIDADES CUADRADAS */}
                <Form.Item
                  name="height"
                  label="Ancho"
                  className={`w-[12rem] mb-2 ${(currentUnitMeasure?.includes("Unidad (U)") || currentUnitMeasure?.includes("Metro (m)")) && "hidden"}`}
                  rules={[{ required: true, message: "" }]}
                >
                  <InputNumber min={0} precision={2} className="w-full" />
                </Form.Item>
                {/* SOLO SE MUESTRA SI LA UNIDAD DE MEDIDA DE LA TARIFA ES EN UNIDADES CUADRADAS */}
                <Form.Item
                  name="amountOfUnits"
                  label="Cantidad"
                  className={`w-[12rem] mb-2 ${(currentUnitMeasure?.includes("Unidad (U)") || currentUnitMeasure?.includes("Metro (m)")) && "hidden"}`}
                  rules={[{ required: true, message: "" }]}
                >
                  <InputNumber min={0} className="w-full" precision={2} />
                </Form.Item>
              </div>
              <div
                className={
                  currentUnitMeasure?.includes("Unidad (U)") ||
                  currentUnitMeasure?.includes("Metro (m)")
                    ? "hidden"
                    : `flex items-center text-success-500`
                }
              >
                <button
                  className="hover:bg-success-100 rounded-full"
                  onClick={() => {
                    const currentWidth = form.getFieldValue("width");
                    const currentHeight = form.getFieldValue("height");
                    const currentAmount = form.getFieldValue("amountOfUnits");
                    setActivitiesTableValues([
                      ...activitiesTableValues,
                      {
                        description: `Cant(${currentAmount}) (${currentWidth.toLocaleString("DE", {
                          maximumFractionDigits: 2,
                          minimumFractionDigits: 2
                        })} x ${currentHeight.toLocaleString("DE", {
                          maximumFractionDigits: 2,
                          minimumFractionDigits: 2
                        })})`,
                        width: currentWidth,
                        height: currentHeight,
                        amount: currentAmount,
                        unitMeasure: currentUnitMeasure
                      }
                    ]);
                    setSize(size + currentHeight * currentWidth * currentAmount);
                    form.setFieldsValue({
                      height: 0,
                      width: 0,
                      amountOfUnits: 0
                    });
                  }}
                >
                  <PlusCircleSvg width={40} height={40} />
                </button>
              </div>
            </article>
            <article className="w-fit grid">
              {/* <Form.Item
                name="complexity"
                label="Complejidad"
                rules={[{ required: true, message: "Seleccione un nivel de complejidad" }]}
              >
                <Radio.Group
                  buttonStyle="solid"
                  onChange={(value) => {
                    serviceFees?.map((serviceFee) => {
                      if (serviceFee?.taskName === defaultValues?.description.trim()) {
                        setSelectedServiceFee(serviceFee);
                      }
                    });
                    value.target.value === "Alta"
                      ? selectedServiceFee?.complexity.find(
                          (complexity) =>
                            complexity.name === "Alta" && setCurrentPrice(complexity.value)
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
              </Form.Item> */}
              <Form.Item
                name="size"
                label="Tamano"
                className="w-[12rem] hidden"
                rules={[{ required: true, message: "" }]}
              >
                <InputNumber min={0} precision={2} disabled className="w-full" />
              </Form.Item>
              {currentUnitMeasure?.includes("Unidad (U)") ||
              currentUnitMeasure?.includes("Metro (m)") ? (
                <div
                  className={`flex gap-2 pl-2 mb-4 ${currentUnitMeasure.includes("Unidad (U)") || (currentUnitMeasure?.includes("Metro (m)") && "hidden")}`}
                >
                  <span className="font-semibold">Cantidad:</span>
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
                  <span className="font-semibold">Tamaño:</span>
                  <span>
                    {activitiesTableValues
                      ?.reduce(
                        (total, currentValue) =>
                          total + currentValue.amount * currentValue.width * currentValue.height,
                        0
                      )
                      .toLocaleString("DE", {
                        maximumFractionDigits: 2,
                        minimumFractionDigits: 2
                      })}{" "}
                    {currentUnitMeasure}
                  </span>
                </div>
              )}
              <div className=" flex gap-2 pl-2 mb-4">
                <span className="font-semibold">Precio:</span>
                <span>
                  $
                  {currentPrice?.toLocaleString("DE", {
                    maximumFractionDigits: 2,
                    minimumFractionDigits: 2
                  })}
                </span>
              </div>
              <div className=" flex gap-2 pl-2 mb-4">
                <span className="font-semibold">Importe:</span>
                <span>
                  $
                  {currentUnitMeasure?.includes("Unidad (U)") ||
                  currentUnitMeasure?.includes("Metro (m)") ? (
                    <span>
                      {(size * currentPrice).toLocaleString("DE", {
                        maximumFractionDigits: 2,
                        minimumFractionDigits: 2
                      })}
                    </span>
                  ) : (
                    <span>
                      {activityValue?.toLocaleString("DE", {
                        maximumFractionDigits: 2,
                        minimumFractionDigits: 2
                      })}
                    </span>
                  )}
                </span>
              </div>
            </article>
          </article>
          <article
            className={
              currentUnitMeasure?.includes("Unidad (U)") ||
              currentUnitMeasure?.includes("Metro (m)")
                ? "hidden"
                : `flex w-full`
            }
          >
            <Table
              size="small"
              columns={columns}
              dataSource={activitiesTableValues}
              className="w-full "
              sortDirections={["ascend"]}
              pagination={false}
              bordered
            />
          </article>
        </section>
      </Form>
    </Modal>
  );
};

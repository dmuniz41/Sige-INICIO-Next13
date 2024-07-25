"use client";
import { ColumnsType } from "antd/es/table";
import { Form, InputNumber, Modal, Radio, Select, SelectProps, Table, Tooltip } from "antd";
import { useEffect, useMemo, useState } from "react";

import { DeleteSvg } from "@/app/global/DeleteSvg";
import { IActivity } from "@/models/offer";
import { IServiceFee } from "@/models/serviceFees";
import { PlusCircleSvg } from "@/app/global/PlusCircleSvg";
import { RootState, useAppSelector } from "@/store/store";
import { serviceFeeStartLoading } from "@/actions/serviceFee";
import { useAppDispatch } from "@/hooks/hooks";

interface CollectionCreateFormProps {
  open: boolean;
  onCreate: (values: IActivity) => void;
  onCancel: () => void;
}

export const AddActivityModal: React.FC<CollectionCreateFormProps> = ({ open, onCreate, onCancel }) => {
  const dispatch = useAppDispatch();
  const [currentPrice, setCurrentPrice] = useState<number>(0);
  const [currentUnitMeasure, setCurrentUnitMeasure] = useState<string>("");
  const [selectedServiceFee, setSelectedServiceFee] = useState<IServiceFee>();
  const [activitiesTableValues, setActivitiesTableValues] = useState<
    {
      amount: number;
      description: string;
      height: number;
      unitMeasure: string;
      width: number;
    }[]
  >([]);
  const [size, setSize] = useState<number>(0);
  const activityValue = useMemo(
    () =>
      activitiesTableValues.reduce((total, currentValue) => total + currentValue.amount * currentValue.width * currentValue.height, 0) *
      currentPrice,
    [currentPrice, activitiesTableValues]
  );

  useEffect(() => {
    dispatch(serviceFeeStartLoading());
  }, [dispatch]);

  const { serviceFees }: { serviceFees: IServiceFee[] } = useAppSelector((state: RootState) => state?.serviceFee);

  const listOfActivities: SelectProps["options"] = serviceFees.map((serviceFee) => {
    return {
      label: `${serviceFee.taskName}`,
      value: `${serviceFee.taskName}`
    };
  });

  const columns: ColumnsType<{
    description: string;
    unitMeasure: string;
    width: number;
    height: number;
    amount: number;
  }> = [
    {
      title: <span className="font-bold">Descripción</span>,
      dataIndex: "description",
      key: "description",
      width: "70%"
    },
    {
      title: <span className="font-bold">Cantidad</span>,
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
      title: <span className="font-bold">Unidad de Medida</span>,
      dataIndex: "unitMeasure",
      key: "unitMeasure",
      width: "20%"
    },
    {
      title: <span className="font-bold">Acciones</span>,
      width: "10%",
      render: (_, { ...record }) => (
        <div className="flex gap-1 justify-center">
          <Tooltip placement="top" title={"Eliminar"} arrow={{ pointAtCenter: true }}>
            <button
              className="table-delete-action-btn"
              onClick={() => {
                setActivitiesTableValues(activitiesTableValues.filter((av) => av.description !== record.description));
              }}
            >
              <DeleteSvg width={17} height={17} />
            </button>
          </Tooltip>
        </div>
      )
    }
  ];
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
                    currentUnitMeasure.includes("Unidad (U)") || currentUnitMeasure.includes("Metro (m)")
                      ? {
                          amount: values.amount,
                          description: values.description.value,
                          height: 0,
                          price: Number(currentPrice.toFixed(2)),
                          size: 0,
                          unitMeasure: currentUnitMeasure,
                          value: size * currentPrice,
                          width: 0,

                          listOfMeasures: activitiesTableValues
                          // complexity: form.getFieldValue("complexity")
                        }
                      : {
                          amount: activitiesTableValues.reduce(
                            (total, currentValue) => total + currentValue.amount * currentValue.width * currentValue.height,
                            0
                          ),
                          description: values.description.value,
                          height: values.height,
                          price: Number(currentPrice.toFixed(2)),
                          size: activitiesTableValues.reduce(
                            (total, currentValue) => total + currentValue.amount * currentValue.width * currentValue.height,
                            0
                          ),
                          unitMeasure: currentUnitMeasure,
                          value: Number(activityValue.toFixed(2)),
                          width: values.width,
                          listOfMeasures: activitiesTableValues
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
            Añadir
          </button>
        </div>
      ]}
    >
      <Form form={form} layout="horizontal" name="addActivity" size="middle">
        <Form.Item name="description" label="Descripción" rules={[{ required: true, message: "Campo requerido" }]}>
          <Select
            autoFocus
            allowClear
            labelInValue
            style={{ width: "100%" }}
            options={listOfActivities}
            onSelect={(value) => {
              const currentServiceFee = serviceFees.find((serviceFee) => serviceFee.taskName === value.label);
              setSelectedServiceFee(currentServiceFee!);
              setCurrentUnitMeasure(currentServiceFee?.unitMeasure!);
              setCurrentPrice(currentServiceFee?.salePrice!);
              setActivitiesTableValues([]);
              setSize(0);

              form.setFieldsValue({
                unitMeasure: selectedServiceFee?.unitMeasure,
                //TODO: REVISAR ESTE VALOR
                price: form.getFieldValue("description")?.value,
                height: 0,
                width: 0,
                amount: 0,
                amountOfUnits: 0,
                size: 0,
                complexity: null
              });
            }}
            showSearch
            optionFilterProp="children"
            filterOption={(input: any, option: any) => (option?.label ?? "").toLowerCase().includes(input)}
            filterSort={(optionA: any, optionB: any) =>
              (optionA?.label ?? "").toLowerCase().localeCompare((optionB?.label ?? "").toLowerCase())
            }
          />
        </Form.Item>
        {/* SOLO SE MUESTRA SI LA UNIDAD DE MEDIDA DE LA TARIFA ES EN UNIDADES LINEALES */}
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
                  currentUnitMeasure.includes("Unidad (U)") || currentUnitMeasure.includes("Metro (m)")
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
              <Form.Item name="size" label="Tamano" className="w-[12rem] hidden" rules={[{ required: true, message: "" }]}>
                <InputNumber min={0} precision={2} disabled className="w-full" />
              </Form.Item>
              {currentUnitMeasure?.includes("Unidad (U)") || currentUnitMeasure?.includes("Metro (m)") ? (
                <div
                  className={`flex gap-2 pl-2 mb-4 ${currentUnitMeasure.includes("Unidad (U)") || (currentUnitMeasure?.includes("Metro (m)") && "hidden")}`}
                >
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
                    {activitiesTableValues
                      .reduce((total, currentValue) => total + currentValue.amount * currentValue.width * currentValue.height, 0)
                      .toLocaleString("DE", {
                        maximumFractionDigits: 2,
                        minimumFractionDigits: 2
                      })}{" "}
                    {currentUnitMeasure}
                  </span>
                </div>
              )}
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
                  {currentUnitMeasure.includes("Unidad (U)") || currentUnitMeasure?.includes("Metro (m)") ? (
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
            className={currentUnitMeasure.includes("Unidad (U)") || currentUnitMeasure.includes("Metro (m)") ? "hidden" : `flex w-full`}
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

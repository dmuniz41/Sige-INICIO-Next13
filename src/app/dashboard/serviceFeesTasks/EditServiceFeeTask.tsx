"use client";
import { Form, Input, InputNumber, Modal, Select, SelectProps } from "antd";

import { INomenclator } from "@/models/nomenclator";
import { IServiceFeeTask } from "@/models/serviceFeeTask";
import { RootState, useAppSelector } from "@/store/store";

interface CollectionCreateFormProps {
  open: boolean;
  onCreate: (values: IServiceFeeTask) => void;
  onCancel: () => void;
  defaultValues: IServiceFeeTask;
}

export const EditServiceFeeTaskForm: React.FC<CollectionCreateFormProps> = ({
  open,
  onCreate,
  onCancel,
  defaultValues
}) => {
  const { nomenclators }: any = useAppSelector((state: RootState) => state?.nomenclator);
  const categories: string[] | undefined = [];
  const unitMeasures: string[] | undefined = [];

  nomenclators.map((nomenclator: INomenclator) => {
    if (nomenclator.category === "Categoría de tareas") categories.push(nomenclator.code);
    if (nomenclator.category === "Unidad de medida") unitMeasures.push(nomenclator.code);
  });

  const categoryOptions: SelectProps["options"] = categories.map((category) => {
    return {
      label: `${category}`,
      value: `${category}`
    };
  });

  const unitMeasureOptions: SelectProps["options"] = unitMeasures.map((UM) => {
    return {
      label: `${UM}`,
      value: `${UM}`
    };
  });

  const [form] = Form.useForm();
  return (
    <Modal
      className="flex flex-col"
      title={
        <div className="flex w-full justify-center">
          <span className="font-semibold text-lg">Editar Tarea</span>
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
      width={"800px"}
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
                  onCreate({
                    ...values,
                    complexity: [
                      {
                        name: "Alta",
                        value: values.highComplexity,
                        time: values.highComplexityTime
                      },
                      {
                        name: "Media",
                        value: values.mediumComplexity,
                        time: values.mediumComplexityTime
                      },
                      {
                        name: "Baja",
                        value: values.lowComplexity,
                        time: values.lowComplexityTime
                      }
                    ]
                  });
                  form.resetFields();
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
        name="createUserForm"
        size="middle"
        fields={[
          {
            name: "description",
            value: defaultValues?.description
          },
          {
            name: "category",
            value: defaultValues?.category
          },
          {
            name: "unitMeasure",
            value: defaultValues?.unitMeasure
          },
          {
            name: "amount",
            value: defaultValues?.amount
          },
          {
            name: "highComplexity",
            value: defaultValues?.complexity[0].value
          },
          {
            name: "mediumComplexity",
            value: defaultValues?.complexity[1].value
          },
          {
            name: "lowComplexity",
            value: defaultValues?.complexity[2].value
          },
          {
            name: "highComplexityTime",
            value: defaultValues?.complexity[0].time
          },
          {
            name: "mediumComplexityTime",
            value: defaultValues?.complexity[1].time
          },
          {
            name: "lowComplexityTime",
            value: defaultValues?.complexity[2].time
          }
          // {
          //   name: "price",
          //   value: defaultValues?.price
          // }
        ]}
      >
        <Form.Item
          name="category"
          label="Categoría"
          rules={[{ required: true, message: "Campo requerido" }]}
        >
          <Select
            allowClear
            style={{ width: "100%" }}
            options={categoryOptions}
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
          name="description"
          label="Descripción"
          rules={[{ required: true, message: "Campo requerido" }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name="unitMeasure"
          label="Unidad de Medida"
          rules={[{ required: true, message: "Campo requerido" }]}
        >
          <Select
            allowClear
            style={{ width: "100%" }}
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
        <Form.Item
          name="amount"
          label="Cantidad"
          rules={[{ required: true, message: "Campo requerido" }]}
        >
          <InputNumber min={0} />
        </Form.Item>
        {/* <Form.Item
          name="price"
          label="Precio"
          rules={[{ required: true, message: "Campo requerido" }]}
        >
          <InputNumber min={0} />
        </Form.Item> */}
        <span className="flex mb-2 font-semibold">Complejidad:</span>
        <div className="flex gap-2">
          <Form.Item
            name="highComplexity"
            label="Alta"
            rules={[{ required: true, message: "Campo requerido" }]}
          >
            <InputNumber min={0} />
          </Form.Item>
          <Form.Item
            name="mediumComplexity"
            label="Media"
            rules={[{ required: true, message: "Campo requerido" }]}
          >
            <InputNumber min={0} />
          </Form.Item>
          <Form.Item
            name="lowComplexity"
            label="Baja"
            rules={[{ required: true, message: "Campo requerido" }]}
          >
            <InputNumber min={0} />
          </Form.Item>
        </div>
        <span className="flex mb-2 font-semibold">Tiempo por Complejidad (h):</span>
        <div className="flex gap-2">
          <Form.Item
            name="highComplexityTime"
            label="Alta"
            rules={[{ required: true, message: "Campo requerido" }]}
          >
            <InputNumber min={0} />
          </Form.Item>
          <Form.Item
            name="mediumComplexityTime"
            label="Media"
            rules={[{ required: true, message: "Campo requerido" }]}
          >
            <InputNumber min={0} />
          </Form.Item>
          <Form.Item
            name="lowComplexityTime"
            label="Baja"
            rules={[{ required: true, message: "Campo requerido" }]}
          >
            <InputNumber min={0} />
          </Form.Item>
        </div>
      </Form>
    </Modal>
  );
};

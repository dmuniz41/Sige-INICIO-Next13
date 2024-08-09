"use client";

import { DatePicker, Form, Input, InputNumber, Modal, Select, SelectProps } from "antd";
import { INomenclator } from "@/models/nomenclator";
import { RootState, useAppSelector } from "@/store/store";
import { IMaterialNomenclator } from "@/models/nomenclators/materials";
interface Values {
  category: string;
  costPerUnit: number;
  materialName: string;
  minimumExistence: number;
  provider: string;
  unitMeasure?: string;
  unitsTotal: number;
  enterDate: Date;
}
interface CollectionCreateFormProps {
  open: boolean;
  onCreate: (values: Values) => void;
  onCancel: () => void;
}

export const NewMaterialForm: React.FC<CollectionCreateFormProps> = ({
  open,
  onCreate,
  onCancel
}) => {
  const { nomenclators }: any = useAppSelector((state: RootState) => state?.nomenclator);
  const { materialsNomenclators }: { materialsNomenclators: IMaterialNomenclator[] } =
    useAppSelector((state: RootState) => state?.nomenclator);
  const unitMeasures: string[] | undefined = [];
  const providers: string[] | undefined = [];

  nomenclators.map((nomenclator: INomenclator) => {
    if (nomenclator.category === "Unidad de medida") {
      unitMeasures.push(nomenclator.code);
    }
    if (nomenclator.category === "Proveedor") {
      providers.push(nomenclator.code);
    }
  });

  const category: SelectProps["options"] = materialsNomenclators.map((materialNomenclator) => {
    return {
      label: `${materialNomenclator.name}`,
      value: `${materialNomenclator.name}`
    };
  });

  const unitMeasure: SelectProps["options"] = unitMeasures.map((unitMeasure) => {
    return {
      label: `${unitMeasure}`,
      value: `${unitMeasure}`
    };
  });

  const provider: SelectProps["options"] = providers.map((provider) => {
    return {
      label: `${provider}`,
      value: `${provider}`
    };
  });

  const [form] = Form.useForm();
  return (
    <Modal
      className="flex flex-col"
      title={
        <div className="flex w-full justify-center">
          <span className="font-semibold text-lg">Nuevo Material</span>
        </div>
      }
      style={{ textAlign: "left" }}
      centered
      open={open}
      destroyOnClose
      onCancel={onCancel}
      okType="default"
      okText="Crear"
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
                  onCreate(values);
                  form.resetFields();
                })
                .catch((error) => {
                  console.log("Validate Failed:", error);
                });
            }}
          >
            Crear
          </button>
        </div>
      ]}
    >
      <Form form={form} layout="vertical" name="createUserForm" size="middle">
        <Form.Item
          name="category"
          label="Categoría"
          rules={[{ required: true, message: "Campo requerido" }]}
        >
          <Select
            allowClear
            style={{ width: "100%" }}
            options={category}
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
          name="materialName"
          label="Nombre del material"
          rules={[{ required: true, message: "Campo requerido" }]}
        >
          <Input />
        </Form.Item>
        <Form.Item name="description" label="Descripción">
          <Input />
        </Form.Item>
        <Form.Item
          name="costPerUnit"
          label="Costo por unidad de medida"
          rules={[{ required: true, message: "Campo requerido" }]}
        >
          <InputNumber min={0} className="w-full" />
        </Form.Item>
        <Form.Item
          name="unitMeasure"
          label="Unidad de medida"
          rules={[{ required: true, message: "Campo requerido" }]}
        >
          <Select
            allowClear
            style={{ width: "100%" }}
            options={unitMeasure}
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
          name="unitsTotal"
          label="Cantidad a añadir"
          rules={[{ required: true, message: "Campo requerido" }]}
        >
          <InputNumber min={0} className="w-full" />
        </Form.Item>
        <Form.Item
          name="minimumExistence"
          label="Existencias mínimas"
          rules={[{ required: true, message: "Campo requerido" }]}
        >
          <InputNumber min={0} className="w-full" />
        </Form.Item>
        <Form.Item
          name="provider"
          label="Proveedor"
          rules={[{ required: true, message: "Campo requerido" }]}
        >
          <Select
            allowClear
            style={{ width: "100%" }}
            options={provider}
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
          name="enterDate"
          label="Fecha de entrada"
          rules={[{ required: true, message: "Campo requerido" }]}
        >
          <DatePicker format={"MM/DD/YYYY"} />
        </Form.Item>
      </Form>
    </Modal>
  );
};

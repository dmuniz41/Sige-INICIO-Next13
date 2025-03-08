import { Button, Col, DatePicker, Form, Input, InputNumber, Row, Select, SelectProps } from "antd";

import { MaterialCategoryNomenclators, Nomenclator } from "../../../../../db/migrations/schema";
import { useMaterialCategoryNomenclator } from "@/hooks/nomenclators/materialCategory/useMaterialCategoryNomenclator";
import { useNomenclator } from "@/hooks/nomenclators/useNomenclator";
import Title from "antd/es/typography/Title";

export const NewMaterialForm = ({ warehouseId }: { warehouseId: string }) => {
  const [form] = Form.useForm();
  const { useGetNomenclatorsByCategoryCode } = useNomenclator();
  const { useGetMaterialCategoryNomenclator } = useMaterialCategoryNomenclator();
  const { data: materialCategory } = useGetMaterialCategoryNomenclator(1, 100);
  const { data: unitMeasures } = useGetNomenclatorsByCategoryCode("N_UM");
  const { data: providers } = useGetNomenclatorsByCategoryCode("N_PRO");

  const category: SelectProps["options"] = materialCategory?.data?.map((materialCategoryNomenclator: MaterialCategoryNomenclators) => {
    return {
      label: `${materialCategoryNomenclator.value}`,
      value: `${materialCategoryNomenclator.value}`
    };
  });

  const unitMeasure: SelectProps["options"] = unitMeasures?.data?.map((unitMeasure: Nomenclator) => {
    return {
      label: `${unitMeasure.value}`,
      value: `${unitMeasure.value}`
    };
  });

  const provider: SelectProps["options"] = providers?.data?.map((provider: Nomenclator) => {
    return {
      label: `${provider.value}`,
      value: `${provider.category}`
    };
  });

  return (
    <>
      <Row className="py-4">
        <Col span={12}>
          <Title level={3}>Nuevo Material</Title>
        </Col>
        <Col span={12}>
          <Row justify={"end"} gutter={16} className="flex gap-2 ">
            <button className="toolbar-danger-icon-btn">Cancelar</button>
            <button className="toolbar-primary-icon-btn" type="submit">
              Guardar Material
            </button>
          </Row>
        </Col>
      </Row>
      <Form form={form} layout="vertical" name="newMaterialForm" size="large">
        <Row justify={"space-between"}>
          <Col span={12} className="border-light border rounded-md py-4 px-2">
            <div className="flex font-bold text-2xl mb-4 ml-2">
              <span>General</span>
            </div>
            <Form.Item name="category" label={<Title level={5}>Categoría</Title>} rules={[{ required: true, message: "Campo requerido" }]}>
              <Select
                allowClear
                style={{ width: "100%" }}
                options={category}
                showSearch
                optionFilterProp="children"
                filterOption={(input: any, option: any) => (option?.label ?? "").toLowerCase().includes(input)}
                filterSort={(optionA: any, optionB: any) =>
                  (optionA?.label ?? "").toLowerCase().localeCompare((optionB?.label ?? "").toLowerCase())
                }
              />
            </Form.Item>
            <Form.Item
              name="materialName"
              label={<Title level={5}>Nombre del material</Title>}
              rules={[{ required: true, message: "Campo requerido" }]}
            >
              <Input />
            </Form.Item>
            <Form.Item name="description" label={<Title level={5}>Descripción</Title>}>
              <Input />
            </Form.Item>
            <Form.Item
              name="costPerUnit"
              label={<Title level={5}>Costo por unidad de medida</Title>}
              rules={[{ required: true, message: "Campo requerido" }]}
            >
              <InputNumber min={0} className="w-full" />
            </Form.Item>
            <Form.Item
              name="unitMeasure"
              label={<Title level={5}>Unidad de medida</Title>}
              rules={[{ required: true, message: "Campo requerido" }]}
            >
              <Select
                allowClear
                style={{ width: "100%" }}
                options={unitMeasure}
                showSearch
                optionFilterProp="children"
                filterOption={(input: any, option: any) => (option?.label ?? "").toLowerCase().includes(input)}
                filterSort={(optionA: any, optionB: any) =>
                  (optionA?.label ?? "").toLowerCase().localeCompare((optionB?.label ?? "").toLowerCase())
                }
              />
            </Form.Item>
          </Col>
          <Col span={12} className="border-light border rounded-md py-4 px-2">
            <div className="flex font-bold text-2xl mb-4 ml-2">
              <span>Detalles</span>
            </div>
            <Form.Item
              name="unitsTotal"
              label={<Title level={5}>Cantidad a añadir</Title>}
              rules={[{ required: true, message: "Campo requerido" }]}
            >
              <InputNumber min={0} className="w-full" />
            </Form.Item>
            <Form.Item
              name="minimumExistence"
              label={<Title level={5}>Existencias mínimas</Title>}
              rules={[{ required: true, message: "Campo requerido" }]}
            >
              <InputNumber min={0} className="w-full" />
            </Form.Item>
            <Form.Item name="provider" label={<Title level={5}>Proveedor</Title>} rules={[{ required: true, message: "Campo requerido" }]}>
              <Select
                allowClear
                style={{ width: "100%" }}
                options={provider}
                showSearch
                optionFilterProp="children"
                filterOption={(input: any, option: any) => (option?.label ?? "").toLowerCase().includes(input)}
                filterSort={(optionA: any, optionB: any) =>
                  (optionA?.label ?? "").toLowerCase().localeCompare((optionB?.label ?? "").toLowerCase())
                }
              />
            </Form.Item>
            <Form.Item
              name="enterDate"
              label={<Title level={5}>Fecha de entrada</Title>}
              rules={[{ required: true, message: "Campo requerido" }]}
            >
              <DatePicker format={"MM/DD/YYYY"} />
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </>
  );
};

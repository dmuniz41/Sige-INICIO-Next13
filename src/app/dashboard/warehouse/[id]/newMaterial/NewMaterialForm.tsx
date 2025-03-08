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
    <Row className="flex flex-col ">
      <section>
        <Title level={2}>Nuevo Material</Title>
      </section>
      <Col span={10}>
        <Form form={form} layout="vertical" name="newMaterialForm" size="large">
          <Form.Item name="category" label={<Title level={4}>Categoría</Title>} rules={[{ required: true, message: "Campo requerido" }]}>
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
          <Form.Item name="materialName" label={<Title level={4}>Nombre del material</Title>} rules={[{ required: true, message: "Campo requerido" }]}>
            <Input />
          </Form.Item>
          <Form.Item name="description" label={<Title level={4}>Descripción</Title>}>
            <Input />
          </Form.Item>
          <Form.Item name="costPerUnit" label={<Title level={4}>Costo por unidad de medida</Title>} rules={[{ required: true, message: "Campo requerido" }]}>
            <InputNumber min={0} className="w-full" />
          </Form.Item>
          <Form.Item name="unitMeasure" label={<Title level={4}>Unidad de medida</Title>} rules={[{ required: true, message: "Campo requerido" }]}>
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
          <Form.Item name="unitsTotal" label={<Title level={4}>Cantidad a añadir</Title>} rules={[{ required: true, message: "Campo requerido" }]}>
            <InputNumber min={0} className="w-full" />
          </Form.Item>
          <Form.Item name="minimumExistence" label={<Title level={4}>Existencias mínimas</Title>} rules={[{ required: true, message: "Campo requerido" }]}>
            <InputNumber min={0} className="w-full" />
          </Form.Item>
          <Form.Item name="provider" label={<Title level={4}>Proveedor</Title>} rules={[{ required: true, message: "Campo requerido" }]}>
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
          <Form.Item name="enterDate" label={<Title level={4}>Fecha de entrada</Title>} rules={[{ required: true, message: "Campo requerido" }]}>
            <DatePicker format={"MM/DD/YYYY"} />
          </Form.Item>
          <Row>
          <Form.Item>
            <Button>Añadir</Button>
          </Form.Item>
          <Form.Item>
            <Button>Cancelar</Button>
          </Form.Item>
          </Row>
        </Form>
      </Col>
    </Row>
  );
};

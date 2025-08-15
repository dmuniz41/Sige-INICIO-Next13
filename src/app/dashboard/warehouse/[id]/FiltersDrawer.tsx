"use client";
import { Drawer, Form, Input, Space } from "antd"; 
import { FilterOffSvg } from "@/app/global/FilterOffSvg";
import { FilterSvg } from "@/app/global/FilterSvg";

interface FilterDrawerProps {
  onFilter: (values: any) => void;
  onReset: () => void;
  onCancel: () => void;
  open: boolean;
  initialValues?: any;
}

const FilterDrawer = ({ open, onCancel, onReset, onFilter, initialValues = {} }: FilterDrawerProps) => {
  const [form] = Form.useForm();

  const handleSubmit = () => {
    form.validateFields().then((values) => {
      onFilter(values);
      onCancel();
    });
  };

  const handleReset = () => {
    form.resetFields();
    onReset();
    onCancel();
  };

  return (
    <>
      <Drawer
        title="Filtros"
        placement="right"
        onClose={onCancel}
        open={open}
        width={400}
        footer={
          <Space>
            <button className="apply-filters-btn" onClick={handleSubmit}>
              <FilterSvg width={20} height={20} />
              Aplicar Filtros
            </button>
            <button className="clear-filters-btn" onClick={handleReset}>
              <FilterOffSvg width={20} height={20} />
              Limpiar Filtros
            </button>
          </Space>
        }
      >
        <Form form={form} layout="vertical" initialValues={initialValues} autoComplete="off">
          <Form.Item name="category" label="Categoría">
            <Input placeholder="Categoría" />
          </Form.Item>
          <Form.Item name="name" label="Nombre">
            <Input placeholder="Nombre" />
          </Form.Item>
          <Form.Item name="description" label="Descripción">  
            <Input placeholder="Descripción" />
          </Form.Item>
          <Form.Item name="unitMeasure" label="Unidad de Medida"> 
            <Input placeholder="Unidad de Medida" />
          </Form.Item>
          <Form.Item name="provider" label="Proveedor">
            <Input placeholder="Proveedor" />
          </Form.Item>
        </Form>
      </Drawer>
    </>
  );
};

export default FilterDrawer;

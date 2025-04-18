import { Checkbox, Col, Form, Input, Row } from "antd";

import { CancelSvg } from "@/app/global/CancelSvg";
import { FilterSvg } from "@/app/global/FilterSvg";

export type MaterialsNomenclatorsFilters = {
  material_category?: string;
  material_name?: string;
  isDecrease?: boolean;
  isNotDecrease?: boolean;
};

export const MaterialsNomenclatorsFilters = ({
  open,
  onCancel,
  onFilter
}: {
  open: boolean;
  onCancel: () => void;
  onFilter: (values: MaterialsNomenclatorsFilters) => void;
}) => {
  const [form] = Form.useForm();

  const handleFilter = () => {
    form
      .validateFields()
      .then((values) => {
        onFilter(values);
      })
      .catch((error) => {
        console.log("Validate Failed:", error);
      });
  };

  return (
    <section className={`flex flex-col shadow-md w-full bg-white-100 rounded-md py-2 px-8 gap-2 mb-2 ${open ? "" : "hidden"}`}>
      <div className=" flex gap-2">
        <FilterSvg />
        <span className="text-xl font-bold">Filtros</span>
      </div>
      <Form form={form} layout="vertical" name="editMaterialNomenclator" size="large">
        <Row gutter={[16, 16]}>
          <Col span={12}>
            <Form.Item name="material_category" label={<span className="text-lg font-bold">Categoría de material: </span>}>
              <Input />
            </Form.Item>
            <Form.Item name="material_name" label={<span className="text-lg font-bold">Nombre de material: </span>}>
              <Input />
            </Form.Item>
            <div className="flex gap-4">
              <Form.Item name="isDecrease" valuePropName="checked">
                <Checkbox className="custom-checkbox">
                  <span className="text-lg font-bold">Gastable</span>
                </Checkbox>
              </Form.Item>
              <Form.Item name="isNotDecrease" valuePropName="checked">
                <Checkbox className="custom-checkbox">
                  <span className="text-lg font-bold">No Gastable</span>
                </Checkbox>
              </Form.Item>
            </div>
          </Col>
          <Col span={12} className="flex items-end justify-end">
            <Row className="gap-2">
              <button className="filter-modal-btn-danger" onClick={onCancel}>
                <CancelSvg />
                Cerrar
              </button>
              <button className="filter-modal-btn-primary" onClick={handleFilter}>
                <FilterSvg />
                Aplicar
              </button>
            </Row>
          </Col>
        </Row>
      </Form>
    </section>
  );
};

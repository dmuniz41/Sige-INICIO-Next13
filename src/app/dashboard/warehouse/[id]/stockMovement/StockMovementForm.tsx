import { Col, Form, Input, InputNumber, Row, Select, SelectProps, Spin } from "antd";
import { LoadingOutlined } from "@ant-design/icons";
import { useRouter } from "next/navigation";
import Swal from "sweetalert2";
import Title from "antd/es/typography/Title";

import { InsertMaterial } from "@/types/DTOs/materials/materials";
import { MaterialCategoryNomenclators, Nomenclator } from "../../../../../db/migrations/schema";
import { useMaterialCategoryNomenclator } from "@/hooks/nomenclators/materialCategory/useMaterialCategoryNomenclator";
import { useMaterials } from "@/hooks/materials/useMaterials";
import { useNomenclator } from "@/hooks/nomenclators/useNomenclator";

export const NewMaterialForm = ({ warehouseId }: { warehouseId: string }) => {
  const [form] = Form.useForm();
  const router = useRouter();
  const { useGetNomenclatorsByCategoryCode } = useNomenclator();
  const { useGetMaterialCategoryNomenclator } = useMaterialCategoryNomenclator();
  const { data: materialCategory } = useGetMaterialCategoryNomenclator(1, 100);
  const { data: unitMeasures } = useGetNomenclatorsByCategoryCode("N_UM");
  const { data: providers } = useGetNomenclatorsByCategoryCode("N_PRO");

  const { useAddMaterial } = useMaterials();
  const { mutateAsync: addMaterialMutation, isPending: isAddMaterialPending } = useAddMaterial();

  const handleAddMaterial = () => {
    form
      .validateFields()
      .then(async (values: InsertMaterial) => {
        await addMaterialMutation({
          warehouseId: Number(warehouseId),
          category: values.category,
          costPerUnit: values.costPerUnit,
          description: values.description,
          name: values.name,
          minimumExistence: values.minimumExistence,
          provider: values.provider,
          unitMeasure: values.unitMeasure,
          stock: values.stock
        })
          .then(() => {
            router.push(`/dashboard/warehouse/${warehouseId}`);
            form.resetFields();
          })
          .catch((error) => {
            console.log("Error al guardar el nuevo material:", error);
            Swal.fire("Error", "Error al guardar el nuevo material", "error");
          });
      })
      .catch((error) => {
        console.log("Validate Failed:", error);
      });
  };

  const handleCancel = () => {
    router.push(`/dashboard/warehouse/${warehouseId}`);
    form.resetFields();
  };

  return (
    <>
      {/* ENCABEZADO */}
      <Row className="py-4 px-8">
        <Col span={12}>
          <span className="flex text-3xl font-bold">Nuevo Material</span>
        </Col>
        <Col span={12}>
          <Row justify={"end"} gutter={16} className="flex gap-2">
            <button onClick={handleCancel} className="toolbar-danger-icon-btn">
              Cancelar
            </button>
            <button onClick={handleAddMaterial} className="toolbar-primary-icon-btn" type="submit">
              {isAddMaterialPending ? (
                <Spin spinning={isAddMaterialPending} indicator={<LoadingOutlined style={{ color: "white" }} spin />} />
              ) : (
                <span>Aceptar</span>
              )}
            </button>
          </Row>
        </Col>
      </Row>
      <Form form={form} layout="vertical" name="newMaterialForm" size="large">
        <Row justify={"space-between"}>
          {/* FORMULARIO*/}
          <Col span={12} className="border-light shadow-md border rounded-md p-8">
            <div className="flex font-bold text-2xl mb-8 ml-2">
              <span>General</span>
            </div>

          </Col>
          {/* SECCION DE DETALLES DEL MATERIAL */}
          <Col span={12} className="border-light shadow-md border rounded-md p-8">
            <div className="flex font-bold text-2xl mb-8 ml-2">
              <span>Detalles</span>
            </div>

          </Col>
        </Row>
      </Form>
    </>
  );
};

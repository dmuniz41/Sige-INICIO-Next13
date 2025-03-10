import { Col, Form, Input, InputNumber, Row, Select, SelectProps, Spin } from "antd";
import { LoadingOutlined } from "@ant-design/icons";
import { useRouter, useSearchParams } from "next/navigation";
import Swal from "sweetalert2";
import Title from "antd/es/typography/Title";

import { useMaterials } from "@/hooks/materials/useMaterials";
import { useNomenclator } from "@/hooks/nomenclators/useNomenclator";
import { useMaterialCategoryNomenclator } from "@/hooks/nomenclators/materialCategory/useMaterialCategoryNomenclator";
import { MaterialCategoryNomenclators, Nomenclator } from "@/db/migrations/schema";
import { UpdateMaterial } from "@/types/DTOs/materials/materials";

export const UpdateMaterialForm = ({ warehouseId }: { warehouseId: string }) => {
  const [form] = Form.useForm();
  const searchParams = useSearchParams();
  const params = Object.fromEntries(searchParams.entries());
  const router = useRouter();
  const { useGetNomenclatorsByCategoryCode } = useNomenclator();
  const { useGetMaterialCategoryNomenclator } = useMaterialCategoryNomenclator();
  const { data: materialCategory } = useGetMaterialCategoryNomenclator(1, 100);
  const { data: unitMeasures } = useGetNomenclatorsByCategoryCode("N_UM");
  const { data: providers } = useGetNomenclatorsByCategoryCode("N_PRO");

  // TODO: HACER ENDPOINT PARA OBTENER UN MATERIAL POR SU ID

  const { useUpdateMaterial } = useMaterials();
  const { mutateAsync: updateMaterialMutation, isPending: isUpdateMaterialPending } = useUpdateMaterial();

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
      value: `${provider.value}`
    };
  });

  const handleAddMaterial = () => {
    form
      .validateFields()
      .then(async (values: UpdateMaterial) => {
        await updateMaterialMutation({
          materialId: Number(params.materialId),
          warehouseId: Number(warehouseId),
          values: {
            category: values.category,
            costPerUnit: values.costPerUnit,
            description: values.description,
            name: values.name,
            minimumExistence: values.minimumExistence,
            provider: values.provider,
            unitMeasure: values.unitMeasure,
            stock: values.stock
          }
        })
          .then(() => {
            router.push(`/dashboard/warehouse/${warehouseId}`);
            form.resetFields();
          })
          .catch((error) => {
            console.log("Error al editar material:", error);
            Swal.fire("Error", "Error al editar material", "error");
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
          <span className="flex text-3xl font-bold">Editar Material</span>
        </Col>
        <Col span={12}>
          <Row justify={"end"} gutter={16} className="flex gap-2">
            <button onClick={handleCancel} className="toolbar-danger-icon-btn">
              Cancelar
            </button>
            <button onClick={handleAddMaterial} className="toolbar-primary-icon-btn" type="submit">
              {isUpdateMaterialPending ? (
                <Spin spinning={isUpdateMaterialPending} indicator={<LoadingOutlined style={{ color: "white" }} spin />} />
              ) : (
                <span>Guardar Material</span>
              )}
            </button>
          </Row>
        </Col>
      </Row>
      <Form form={form} layout="vertical" name="newMaterialForm" size="large">
        <Row justify={"space-between"}>
          {/* SECCION DE DATOS GENERALES */}
          <Col span={12} className="border-light shadow-md border rounded-md p-8">
            <div className="flex font-bold text-2xl mb-8 ml-2">
              <span>General</span>
            </div>
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
            <Form.Item
              name="name"
              label={<Title level={4}>Nombre del material</Title>}
              rules={[{ required: true, message: "Campo requerido" }]}
            >
              <Input />
            </Form.Item>
            <Form.Item name="description" label={<Title level={4}>Descripción</Title>}>
              <Input />
            </Form.Item>
            <Form.Item
              name="costPerUnit"
              label={<Title level={4}>Costo por unidad de medida</Title>}
              rules={[{ required: true, message: "Campo requerido" }]}
            >
              <InputNumber min={0} className="w-full" />
            </Form.Item>
          </Col>
          {/* SECCION DE DETALLES */}
          <Col span={12} className="border-light shadow-md border rounded-md p-8">
            <div className="flex font-bold text-2xl mb-8 ml-2">
              <span>Detalles</span>
            </div>
            <Form.Item
              name="unitMeasure"
              label={<Title level={4}>Unidad de medida</Title>}
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
            <Form.Item
              name="stock"
              label={<Title level={4}>Cantidad a añadir</Title>}
              rules={[{ required: true, message: "Campo requerido" }]}
            >
              <InputNumber min={0} className="w-full" />
            </Form.Item>
            <Form.Item
              name="minimumExistence"
              label={<Title level={4}>Existencias mínimas</Title>}
              rules={[{ required: true, message: "Campo requerido" }]}
            >
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
            {/* <Form.Item
              name="enterDate"
              label={<Title level={5}>Fecha de entrada</Title>}
              rules={[{ required: true, message: "Campo requerido" }]}
            >
              <DatePicker format={"MM/DD/YYYY"} />
            </Form.Item> */}
          </Col>
        </Row>
      </Form>
    </>
  );
};

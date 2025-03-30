import { Alert, Col, Form, InputNumber, Row, Select, SelectProps, Spin } from "antd";
import { LoadingOutlined } from "@ant-design/icons";
import { useRouter, useSearchParams } from "next/navigation";
import Swal from "sweetalert2";
import Title from "antd/es/typography/Title";

import { InsertMaterial } from "@/types/DTOs/materials/materials";
import { useMaterials } from "@/hooks/materials/useMaterials";
import TextArea from "antd/es/input/TextArea";
import { useMemo, useState } from "react";

export const MovementForm = ({ warehouseId }: { warehouseId: string }) => {
  const [form] = Form.useForm();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [quantityChange, setQuantityChange] = useState<number>();
  const [typeMovement, setTypeMovement] = useState<string>("ADDED");
  const [stockDeficit, setStockDeficit] = useState<number>(0);

  const materialId = searchParams.get("materialId");

  const typeMovementOptions: SelectProps["options"] = [
    {
      label: "Entrada",
      value: "ADDED"
    },
    {
      label: "Salida",
      value: "REMOVED"
    }
  ];

  const { useAddMaterial, useGetMaterialById } = useMaterials();
  const { mutateAsync: addMaterialMutation, isPending: isAddMaterialPending } = useAddMaterial();
  const { data: material, isLoading: isMaterialLoading, isError } = useGetMaterialById(Number(materialId), Number(warehouseId));

  const isAvailableStock = useMemo<boolean>(() => (stockDeficit >= 0 ? true : false), [stockDeficit]);

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

  const handleQuantityChange = (value: number) => {
    console.log("🚀 ~ handleQuantityChange ~ value:", value);
    setQuantityChange(value);
    setStockDeficit(
      typeMovement == "REMOVED" ? material?.data?.stock - (quantityChange || 0) : material?.data?.stock + (quantityChange || 0)
    );
  };

  if (isMaterialLoading)
    return (
      <section className="flex h-full w-full items-center justify-center">
        <Spin indicator={<LoadingOutlined style={{ fontSize: 70, color: "#ff8533" }} spin />} />
      </section>
    );

  if (isError) {
    Swal.fire({
      icon: "error",
      title: "Error",
      text: "Ocurrió un error al obtener el material"
    });
  }

  return (
    <>
      {/* ENCABEZADO */}
      <Row className="py-4 px-8">
        <Col span={12}>
          <span className="flex text-2xl font-bold">Nuevo Movimiento de Inventario</span>
        </Col>
        <Col span={12}>
          <Row justify={"end"} gutter={16} className="flex gap-2">
            <button onClick={handleCancel} className="toolbar-danger-icon-btn">
              Cancelar
            </button>
            <button disabled={!isAvailableStock} onClick={handleAddMaterial} className="toolbar-primary-icon-btn" type="submit">
              {isAddMaterialPending ? (
                <Spin spinning={isAddMaterialPending} indicator={<LoadingOutlined style={{ color: "white" }} spin />} />
              ) : (
                <span>Aceptar</span>
              )}
            </button>
          </Row>
        </Col>
      </Row>
      <Row className="py-4 px-8" hidden={isAvailableStock}>
        <Col span={12}>
          <Alert
            className="flex w-full"
            message="Inventario insuficiente"
            description="No hay inventario disponible para realizar el movimiento"
            type="error"
          />
        </Col>
      </Row>
      {/* FORMULARIO */}
      <Form form={form} layout="vertical" name="stockMovementForm" size="large">
        <Row justify={"space-between"} className="mx-8">
          {/* FORMULARIO*/}
          <Col span={12} className="border-light shadow-md border rounded-md p-8">
            <Form.Item
              name="typeMovement"
              label={<Title level={4}>Tipo de Movimiento</Title>}
              rules={[{ required: true, message: "Campo requerido" }]}
            >
              <Select
                allowClear
                options={typeMovementOptions}
                onSelect={(value) => {
                  setTypeMovement(value);
                }}
                defaultValue={"ADDED"}
              />
            </Form.Item>
            <Form.Item
              name="quantityChange"
              label={<Title level={4}>Cantidad ({material?.data?.unitMeasure})</Title>}
              rules={[{ required: true, message: "Campo requerido" }]}
            >
              <InputNumber
                defaultValue={0}
                min={0}
                onChange={(value) => handleQuantityChange(value || 0)}
                onInput={(value) => handleQuantityChange(Number(value) || 0)}
              />
            </Form.Item>
            <Form.Item name="notes" label={<Title level={4}>Nota</Title>}>
              <TextArea rows={3} />
            </Form.Item>
          </Col>
        </Row>
      </Form>
      {/* DETALLES */}
      <Row className="py-4 px-8">
        <Col span={12}>
          <span className="flex text-2xl font-bold">Detalles</span>
          <div className="w-full flex bg-white-900 h-[0.5px] my-2"></div>
          <Row>
            <Col span={12}>
              <div>
                <span className="text-xl font-bold">Material</span>
              </div>
              <div>
                <span className="text-xl font-bold">Cantidad Disponible</span>
              </div>
              <div>
                <span className="text-xl font-bold">Nueva Cantidad</span>
              </div>
              <div>
                <span className="text-xl font-bold">Unidad de Medida</span>
              </div>
            </Col>
            <Col span={12}>
              <div>
                <span className="text-xl">
                  {material?.data?.category}-{material?.data?.name}-{material?.data?.description}
                </span>
              </div>
              <div>
                <span className="text-xl">{material?.data?.stock}</span>
              </div>
              <div>
                <span className="text-xl">
                  {typeMovement == "REMOVED"
                    ? material?.data?.stock - (quantityChange || 0)
                    : material?.data?.stock + (quantityChange || 0)}
                </span>
              </div>
              <div>
                <span className="text-xl">{material?.data?.unitMeasure}</span>
              </div>
            </Col>
          </Row>
        </Col>
      </Row>
    </>
  );
};

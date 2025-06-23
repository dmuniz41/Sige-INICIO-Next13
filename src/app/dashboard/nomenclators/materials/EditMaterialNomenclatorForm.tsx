"use client";
import { Checkbox, Form, Input, Modal, Spin } from "antd";
import { LoadingOutlined } from "@ant-design/icons";
import Title from "antd/es/typography/Title";

import { CancelActionModalBtn } from "@/app/global/CancelActionModalBtn";
import { MaterialNomenclators } from "@/db/migrations/schema";
import { SaveActionModalBtn } from "@/app/global/SaveActionModalBtn";
import { useMaterialNomenclator } from "@/hooks/nomenclators/material/useMaterialNomenclator";

interface CollectionCreateFormProps {
  open: boolean;
  onCancel: () => void;
  defaultValues: MaterialNomenclators;
}

export const EditMaterialNomenclatorForm: React.FC<CollectionCreateFormProps> = ({ open, onCancel, defaultValues }) => {
  const [form] = Form.useForm();

  const { useUpdateMaterialNomenclator } = useMaterialNomenclator();
  const { mutateAsync: updateMaterialNomenclator, isPending } = useUpdateMaterialNomenclator();

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      await updateMaterialNomenclator({
        id: defaultValues.code,
        values: {
          material_category: values.material_category,
          material_name: values.material_name,
          isDecrease: values.isDecrease
        },
        accessToken: ""
      });
      onCancel();
    } catch (error: any) {
      console.log("Validate Failed:", error);
    }
  };

  const handleCancel = () => {
    console.log("Cancelar");
    form.resetFields();
    onCancel();
  };

  return (
    <Modal
      className="flex flex-col"
      title={
        <div className="grid w-full">
          <Title level={4}>Editar Nomenclador de Material</Title>
          <div className="flex h-[1px] bg-gray-500 my-2"></div>
        </div>
      }
      style={{ textAlign: "left" }}
      centered
      open={open}
      destroyOnClose
      onCancel={onCancel}
      footer={[
        <div key="footer" className="flex gap-2 w-full justify-end">
          <CancelActionModalBtn onClick={handleCancel} />
          <SaveActionModalBtn onClick={handleSubmit} />
        </div>
      ]}
    >
      <Spin
        spinning={isPending}
        indicator={<LoadingOutlined style={{ fontSize: 80 }} spin />}
        size="large"
        fullscreen
        tip={<span className="text-xl font-bold">Cargando ...</span>}
      />
      <Form
        form={form}
        layout="vertical"
        name="createUserForm"
        size="large"
        fields={[
          {
            name: "material_category",
            value: defaultValues?.material_category
          },
          {
            name: "material_name",
            value: defaultValues?.material_name
          },
          {
            name: "isDecrease",
            value: defaultValues?.isDecrease
          }
        ]}
      >
        <Form.Item
          name="material_category"
          label={<Title level={5}>Categoría</Title>}
          rules={[{ required: true, message: "Campo requerido" }]}
        >
          <Input />
        </Form.Item>
        <Form.Item name="material_name" label={<Title level={5}>Nombre</Title>} rules={[{ required: true, message: "Campo requerido" }]}>
          <Input />
        </Form.Item>
        <Form.Item name="isDecrease" valuePropName="checked">
          <Checkbox className="custom-checkbox">
            <Title style={{ marginBottom: 0 }} level={5}>
              Gastable
            </Title>
          </Checkbox>
        </Form.Item>
      </Form>
    </Modal>
  );
};

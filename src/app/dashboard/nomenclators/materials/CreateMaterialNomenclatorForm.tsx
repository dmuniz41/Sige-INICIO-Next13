"use client";

import { CancelActionModalBtn } from "@/app/global/CancelActionModalBtn";
import { CancelSvg } from "@/app/global/CancelSvg";
import { PlusSvg } from "@/app/global/PlusSvg";
import { SaveActionModalBtn } from "@/app/global/SaveActionModalBtn";
import { MaterialNomenclators } from "@/db/migrations/schema";
import { useMaterialNomenclator } from "@/hooks/nomenclators/material/useMaterialNomenclator";
import { LoadingOutlined } from "@ant-design/icons";
import { Checkbox, Form, Input, Modal, Spin } from "antd";
import Title from "antd/es/typography/Title";
import { useState } from "react";

interface CollectionCreateFormProps {
  open: boolean;
  onCancel: () => void;
}

export const CreateMaterialNomenclatorForm: React.FC<CollectionCreateFormProps> = ({ open, onCancel }) => {
  const [form] = Form.useForm();
  const [isDecrease, setIsDecrease] = useState<boolean>(false);

  const { useCreateMaterialNomenclator } = useMaterialNomenclator();
  const { mutateAsync: createMaterialNomenclator, isPending } = useCreateMaterialNomenclator();

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      await createMaterialNomenclator({ ...values, isDecrease });
      onCancel();
      form.resetFields();
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
          <Title level={4}>Nuevo Nomenclador de Material</Title>
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
      {/* <Spin
        spinning={isPending}
        indicator={<LoadingOutlined style={{ fontSize: 80 }} spin />}
        size="large"
        fullscreen
        tip={<span className="text-xl font-bold">Cargando ...</span>}
      /> */}
      <Form
        form={form}
        layout="vertical"
        name="createMaterialNomenclatorForm"
        size="large"
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
        <Form.Item name="isDecrease">
          <Checkbox className="custom-checkbox" checked={isDecrease} onChange={(e) => setIsDecrease(e.target.checked)}>
            <Title style={{marginBottom:0}} level={5}>Gastable</Title>
          </Checkbox>
        </Form.Item>
      </Form>
    </Modal>
  );
};

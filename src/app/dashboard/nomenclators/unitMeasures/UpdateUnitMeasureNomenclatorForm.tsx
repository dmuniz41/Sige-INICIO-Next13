"use client";
import { Divider, Form, Input, Modal } from "antd";
import Title from "antd/es/typography/Title";

import { CancelActionModalBtn } from "@/app/global/CancelActionModalBtn";
import { SaveActionModalBtn } from "@/app/global/SaveActionModalBtn";
import { UnitmeasureNomenclator } from "@/db/migrations/schema";
import { de } from "@faker-js/faker/.";
import { UpdateUnitMeasureNomenclator } from "@/types/DTOs/nomenclators/unitMeasures";

interface CollectionCreateFormProps {
  open: boolean;
  onCancel: () => void;
  onCreate: (id: number, values: UpdateUnitMeasureNomenclator) => void;
  defaultValues: UnitmeasureNomenclator;
}

export const UpdateUnitMeasureNomenclatorForm: React.FC<CollectionCreateFormProps> = ({ open, onCancel, onCreate, defaultValues }) => {
  const [form] = Form.useForm();

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      onCreate(defaultValues.id, { ...values });
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
          <Title level={4}>Nuevo Nomenclador de Unidad de Medida</Title>
          <Divider></Divider>
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
      <Form
        form={form}
        layout="vertical"
        name="createUnitMeasureNomenclatorForm"
        size="large"
        fields={[
          {
            name: "name",
            value: defaultValues?.name
          },
        ]}
      >
        <Form.Item name="name" label={<Title level={5}>Nombre</Title>} rules={[{ required: true, message: "Campo requerido" }]}>
          <Input />
        </Form.Item>
      </Form>
    </Modal>
  );
};

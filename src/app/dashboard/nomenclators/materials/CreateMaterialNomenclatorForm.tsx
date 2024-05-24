"use client";

import { IMaterialNomenclator } from "@/models/nomenclators/materials";
import { IRepresentativeNomenclator } from "@/models/nomenclators/representative";
import { Checkbox, Form, Input, InputNumber, Modal } from "antd";
import { useState } from "react";

interface CollectionCreateFormProps {
  open: boolean;
  onCreate: (values: IMaterialNomenclator) => void;
  onCancel: () => void;
}

export const CreateMaterialNomenclatorForm: React.FC<CollectionCreateFormProps> = ({
  open,
  onCreate,
  onCancel
}) => {
  const [isDecrease, setIsDecrease] = useState<boolean>(false);
  const [form] = Form.useForm();
  return (
    <Modal
      className="flex flex-col"
      title={
        <div className="flex w-full justify-center">
          <span className="font-bold text-lg">Nuevo Nomenclador de Material</span>
        </div>
      }
      style={{ textAlign: "left" }}
      centered
      open={open}
      destroyOnClose
      onCancel={onCancel}
      okType="default"
      okText="Crear"
      cancelText="Cancelar"
      width={"600px"}
      footer={[
        <div key="footer" className="flex gap-2 w-full justify-end">
          <button key="2" className="modal-btn-danger " onClick={onCancel}>
            Cancelar
          </button>
          <button
            key="1"
            className="modal-btn-primary  "
            onClick={() => {
              form
                .validateFields()
                .then((values) => {
                  onCreate({ ...values, isDecrease: isDecrease });
                  setIsDecrease(false);
                  form.resetFields();
                })
                .catch((error) => {
                  console.log("Validate Failed:", error);
                });
            }}
          >
            Crear
          </button>
        </div>
      ]}
    >
      <Form form={form} layout="vertical" name="createMaterialNomenclator" size="middle">
        <Form.Item
          name="name"
          label="Nombre"
          rules={[{ required: true, message: "Campo requerido" }]}
        >
          <Input />
        </Form.Item>
        <Form.Item name="isDecrease">
          <Checkbox checked={isDecrease} onChange={(e) => setIsDecrease(e.target.checked)}>
            Gastable
          </Checkbox>
        </Form.Item>
      </Form>
    </Modal>
  );
};

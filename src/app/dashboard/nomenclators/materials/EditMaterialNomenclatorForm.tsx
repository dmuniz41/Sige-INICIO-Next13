"use client";
import { Checkbox, CheckboxProps, Form, Input, Modal } from "antd";
import { useEffect, useState } from "react";

import { IMaterialNomenclator } from "@/models/nomenclators/materials";

interface CollectionCreateFormProps {
  open: boolean;
  onCreate: (values: IMaterialNomenclator) => void;
  onCancel: () => void;
  defaultValues: IMaterialNomenclator;
}
// ? INTERACCIÓN RARA CUANDO SE EDITAN A LA VEZ EL NOMBRE Y EL CAMPO BOLEANO ?//

export const EditMaterialNomenclatorForm: React.FC<CollectionCreateFormProps> = ({
  open,
  onCreate,
  onCancel,
  defaultValues
}) => {
  const [isDecrease, setIsDecrease] = useState<boolean>();

  useEffect(() => {
    setIsDecrease(defaultValues?.isDecrease);
  }, [defaultValues]);

  const onChange: CheckboxProps["onChange"] = (e) => {
    setIsDecrease(e.target.checked);
  };

  const [form] = Form.useForm();
  return (
    <Modal
      className="flex flex-col"
      title={
        <div className="flex w-full justify-center">
          <span className="font-semibold text-lg">Editar Nomenclador de Material</span>
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
          <button key="2" className="modal-btn-danger" onClick={onCancel}>
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
                  form.resetFields();
                })
                .catch((error) => {
                  console.log("Validate Failed:", error);
                });
            }}
          >
            Editar
          </button>
        </div>
      ]}
    >
      <Form
        form={form}
        layout="vertical"
        name="editMaterialNomenclator"
        size="middle"
        fields={[
          {
            name: "name",
            value: defaultValues?.name
          }
        ]}
      >
        <Form.Item
          name="name"
          label="Nombre"
          rules={[{ required: true, message: "Campo requerido" }]}
        >
          <Input />
        </Form.Item>
        <Form.Item name="isDecrease">
          <Checkbox checked={isDecrease} onChange={onChange}>
            Gastable
          </Checkbox>
        </Form.Item>
      </Form>
    </Modal>
  );
};

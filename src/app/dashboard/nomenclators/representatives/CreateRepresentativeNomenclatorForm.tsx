"use client";
import { Form, Input, InputNumber, Modal, Tooltip } from "antd";

import { InfoCircleSvg } from "@/app/global/InfoCircleSvg";
import { useRepresentative } from "@/hooks/nomenclators/representative/useRepresentative";

interface CollectionCreateFormProps {
  open: boolean;
  onCancel: () => void;
}

export const CreateRepresentativeNomenclatorForm: React.FC<CollectionCreateFormProps> = ({ open, onCancel }) => {
  const [form] = Form.useForm();

  const { useCreateRepresentative } = useRepresentative();
  const mutation = useCreateRepresentative();
  return (
    <Modal
      className="flex flex-col"
      title={
        <div className="flex w-full justify-center">
          <span className="font-semibold text-lg">Nuevo Representante</span>
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
                  mutation.mutate(values);
                  form.resetFields();
                  onCancel();
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
      <Form form={form} layout="vertical" name="createRepresentativeNomenclator" size="middle">
        <Form.Item name="name" label="Nombre" rules={[{ required: true, message: "Campo requerido" }]}>
          <Input />
        </Form.Item>
        <Form.Item name="contact" label="Persona de Contacto" rules={[{ required: true, message: "Campo requerido" }]}>
          <Input />
        </Form.Item>
        <Form.Item name="percentage" label="Representación (%)" rules={[{ required: true, message: "Campo requerido" }]}>
          <InputNumber min={0} />
        </Form.Item>
        <Form.Item
          name="phoneNumber"
          label={
            <Tooltip
              placement="top"
              title={"Si hay mas de un teléfono introducirlos separados por comas"}
            >
              <div className="flex w-fit gap-2 items-center">
                <span>Teléfono</span>
                <InfoCircleSvg width={20} height={20} />
              </div>
            </Tooltip>
          }
        >
          <Input className="w-full" />
        </Form.Item>
        <Form.Item name="address" label="Domicilio Legal" rules={[{ required: false }]}>
          <Input />
        </Form.Item>
        <Form.Item name="email" label="Correo Electrónico" rules={[{ required: false }]}>
          <Input />
        </Form.Item>
      </Form>
    </Modal>
  );
};

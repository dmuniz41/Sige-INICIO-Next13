"use client";
import { generateRandomString } from "@/helpers/randomStrings";
import { Form, Modal } from "antd";
import TextArea from "antd/es/input/TextArea";

interface CollectionCreateFormProps {
  open: boolean;
  onCreate: (values: any) => void;
  onCancel: () => void;
  itemsList: any[];
}

export const AddItemModal: React.FC<CollectionCreateFormProps> = ({
  open,
  onCreate,
  onCancel,
  itemsList
}) => {
  const [form] = Form.useForm();
  return (
    <Modal
      className="flex flex-col"
      title={
        <div className="flex w-full justify-center">
          <span className="font-bold text-lg">Nuevo Item</span>
        </div>
      }
      style={{ textAlign: "left" }}
      centered
      open={open}
      destroyOnClose
      onCancel={onCancel}
      okType="default"
      okText="Crear"
      width={"600px"}
      cancelText="Cancelar"
      footer={[
        <div key="footer" className="flex gap-2 w-full justify-end">
          <button className="modal-btn-danger" onClick={onCancel}>
            Cancelar
          </button>
          <button
            className="modal-btn-primary "
            onClick={() => {
              form
                .validateFields()
                .then((values) => {
                  onCreate({
                    idNumber: itemsList?.length + 1,
                    key: generateRandomString(26),
                    description: values?.description,
                    activities: [],
                    value: 0
                  });
                  form.resetFields();
                })
                .catch((error) => {
                  console.log("Validate Failed:", error);
                });
            }}
          >
            Añadir
          </button>
        </div>
      ]}
    >
      <Form form={form} layout="horizontal" name="addItem" size="middle">
        <Form.Item
          name="description"
          label="Descripción"
          rules={[{ required: true, message: "Campo requerido" }]}
        >
          <TextArea rows={3} />
        </Form.Item>
      </Form>
    </Modal>
  );
};

"use client";

import { Form, Input, Modal, Select, SelectProps } from "antd";
import { INomenclator } from "@/models/nomenclator";
import { RootState, useAppSelector } from "@/store/store";
import { IServiceFeeSubItem } from "@/models/serviceFees";
import { useEffect, useState } from "react";
import { IMaterial } from "@/models/material";
import { useAppDispatch } from "@/hooks/hooks";
import { materialsStartLoading } from "@/actions/material";

interface CollectionCreateFormProps {
  open: boolean;
  onCreate: (values: IServiceFeeSubItem) => void;
  onCancel: () => void;
}

export const AddItemModal: React.FC<CollectionCreateFormProps> = ({ open, onCreate, onCancel }) => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(materialsStartLoading("653957480a9e16fed4c1bbd5"));
  }, [dispatch]);
  

  const [form] = Form.useForm();
  return (
    <Modal
      className="flex flex-col"
      title={
        <div className="flex w-full justify-center">
          <span className="font-bold text-lg">Nueva Materia Prima</span>
        </div>
      }
      style={{ textAlign: "left" }}
      centered
      open={open}
      destroyOnClose
      onCancel={onCancel}
      okType="default"
      okText="Crear"
      width={'600px'}
      cancelText="Cancelar"
      footer={[
        <div key="footer" className="flex gap-2 w-full justify-end">
          <button
            key="2"
            className="modal-btn-danger"
            onClick={onCancel}
          >
            Cancelar
          </button>
          <button
            key="1"
            className="modal-btn-primary "
            // onClick={() => {
            //   form
            //     .validateFields()
            //     .then((values) => {
            //       onCreate({ ...values, description: values.description.label, unitMeasure: currentUnitMeasure, price: currentPrice, value: rawMaterialValue });
            //       form.resetFields();
            //       setRawMaterialValue(0);
            //       setCurrentPrice(0);
            //       setCurrentUnitMeasure("");
            //     })
            //     .catch((error) => {
            //       console.log("Validate Failed:", error);
            //     });
            // }}
          >
            Añadir
          </button>
        </div>,
      ]}
    >
      <Form form={form} layout="horizontal" name="addItem" size="middle">
          
      </Form>
    </Modal>
  );
};

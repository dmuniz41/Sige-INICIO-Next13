"use client";

import { Form, InputNumber, Modal, Radio, Select, SelectProps, Table } from "antd";
import { IActivity } from "@/models/offer";
import { IServiceFee } from "@/models/serviceFees";
import { RootState, useAppSelector } from "@/store/store";
import { serviceFeeStartLoading } from "@/actions/serviceFee";
import { useAppDispatch } from "@/hooks/hooks";
import { useEffect, useMemo, useState } from "react";
import { ColumnsType } from "antd/es/table";

interface CollectionCreateFormProps {
  open: boolean;
  onCancel: () => void;
  values?: {description: string, amount: number}[];
}

export const MaterialsListModal: React.FC<CollectionCreateFormProps> = ({
  open,
  onCancel,
  values
}) => {
  
    const columns: ColumnsType<{ description: string; amount: number }> = [
      {
        title: "Nombre del Material",
        dataIndex: "description",
        key: "description",
        width: "60%",
      },
      {
        title: "Cantidad",
        dataIndex: "amount",
        key: "amount",
        width: "10%",
        render: (text) => <span>{parseFloat(text).toFixed(2)}</span>,
        sorter: {
          compare: (a, b) => a.amount - b.amount
        }
      }
    ];
  return (
    <Modal
      className="flex flex-col"
      title={
        <div className="flex w-full justify-center">
          <span className="font-bold text-lg">Lista de Materiales</span>
        </div>
      }
      style={{ textAlign: "left" }}
      centered
      open={open}
      destroyOnClose
      onCancel={onCancel}
      width={"1000px"}
      cancelText="Cancelar"
      footer={<></>}
    >
    <Table
        size="small"
        columns={columns}
        dataSource={values}
        pagination={{ position: ["bottomCenter"], defaultPageSize: 20 }}
        className="shadow-md"
      />
    </Modal>
  );
};

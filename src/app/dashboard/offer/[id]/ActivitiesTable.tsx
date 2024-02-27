import { IOfferItem } from "@/models/offer";
import Table, { ColumnsType } from "antd/es/table";
import React from "react";

export const ActivitiesTable = (props: any) => {
  const { activities } = props;

  const columns: ColumnsType<IOfferItem> = [
    {
      title: "Descripción",
      dataIndex: "description",
      key: "description",
      width: "50%",
    },
    {
      title: "Unidad de Medida",
      dataIndex: "unitMeasure",
      key: "unitMeasure",
      width: "8%",
    },
    {
      title: "Cantidad",
      dataIndex: "amount",
      key: "amount",
      width: "5%",
    },
    {
      title: "Precio CUP",
      dataIndex: "price",
      key: "price",
      width: "5%",
      render: (text) => <span>$ {parseFloat(text).toFixed(2)}</span>,
    },
    {
      title: "Importe CUP",
      dataIndex: "value",
      key: "value",
      width: "5%",
      render: (text) => <span>$ {parseFloat(text).toFixed(2)}</span>,
    },
  ];
  return <Table size="small" columns={columns} dataSource={activities} className="border-solid w-full rounded-none" pagination={false} bordered />;
};

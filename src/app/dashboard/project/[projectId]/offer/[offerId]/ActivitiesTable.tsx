import { IOfferItem } from "@/models/offer";
import React from "react";
import Table, { ColumnsType } from "antd/es/table";

export const ActivitiesTable = (props: any) => {
  const { activities } = props;

  const columns: ColumnsType<IOfferItem> = [
    {
      title: <span className="font-bold">Descripción</span>,
      dataIndex: "description",
      key: "description",
      width: "45%"
    },
    {
      title: <span className="font-bold">U/M</span>,
      dataIndex: "unitMeasure",
      key: "unitMeasure",
      width: "10%",
      render: (text) => <span>{text.replace("$/", "")}</span>
    },
    {
      title: <span className="font-bold">Cantidad</span>,
      dataIndex: "amount",
      key: "amount",
      width: "5%",
      render: (value) => (
        <span>
          {value.toLocaleString("DE", { maximumFractionDigits: 2, minimumFractionDigits: 2 })}
        </span>
      )
    },
    {
      title: <span className="font-bold">Precio CUP</span>,
      dataIndex: "price",
      key: "price",
      width: "5%",
      render: (value) => (
        <span>
          $ {value.toLocaleString("DE", { maximumFractionDigits: 2, minimumFractionDigits: 2 })}
        </span>
      )
    },
    {
      title: <span className="font-bold">Importe CUP</span>,
      dataIndex: "value",
      key: "value",
      width: "5%",
      render: (value) => (
        <span>
          $ {value.toLocaleString("DE", { maximumFractionDigits: 2, minimumFractionDigits: 2 })}
        </span>
      )
    }
  ];
  return (
    <Table
      size="small"
      columns={columns}
      dataSource={activities}
      className="border-solid w-full rounded-none"
      pagination={false}
      bordered
    />
  );
};

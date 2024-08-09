import { IActivity } from "@/models/offer";
import React from "react";
import Table, { ColumnsType } from "antd/es/table";

export const ActivitiesTable = (props: any) => {
  const { activities } = props;

  const columns: ColumnsType<IActivity> = [
    {
      title: <span className="font-semibold">Descripción</span>,
      dataIndex: "description",
      key: "description",
      width: "50%",
      render: (_, { ...record }) => (
        <span className="flex gap-1">
          {`${record.description}${record.listOfMeasures.map((e) => e.description)}`}
        </span>
      )
    },
    {
      title: <span className="font-semibold">U/M</span>,
      dataIndex: "unitMeasure",
      key: "unitMeasure",
      width: "10%",
      render: (text) => <span>{text.replace("$/", "")}</span>
    },
    {
      title: <span className="font-semibold">Cantidad</span>,
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
      title: <span className="font-semibold">Precio CUP</span>,
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
      title: <span className="font-semibold">Importe CUP</span>,
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

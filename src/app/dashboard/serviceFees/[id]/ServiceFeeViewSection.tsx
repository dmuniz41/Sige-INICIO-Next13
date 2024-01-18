import { IServiceFeeSubItem } from "@/models/serviceFees";
import { Table } from "antd";
import { ColumnsType } from "antd/es/table";
import React from "react";

export const ServiceFeeViewSection = (props: any) => {
  const { data, subtotal, name } = props;

  const columns: ColumnsType<IServiceFeeSubItem> = [
    {
      title: "Descripción",
      dataIndex: "description",
      key: "description",
      width: "55%",
    },
    {
      title: "Unidad de Medida",
      dataIndex: "unitMeasure",
      key: "unitMeasure",
      width: "15%",
    },
    {
      title: "Cantidad",
      dataIndex: "amount",
      key: "amount",
      width: "10%",
    },
    {
      title: "Precio",
      dataIndex: "price",
      key: "price",
      width: "10%",
      render: (text) => <span>$ {parseFloat(text).toFixed(2)}</span>,
    },
    {
      title: "Importe",
      dataIndex: "value",
      key: "value",
      width: "25%",
      render: (text) => <span>$ {parseFloat(text).toFixed(2)}</span>,
    },
  ];
  return (
    <section className="flex flex-1 mt-2">
      <article className="flex justify-center items-center w-[15rem] p-4">
        <h2 className="text-lg font-bold">{name}</h2>
      </article>
      <Table
        size="small"
        columns={columns}
        dataSource={data}
        className="border-solid w-full"
        pagination={false}
        bordered
        footer={() => (
          <footer className="flex w-full">
            <div className="font-bold grow flex w-[90%]">
              <span>Subtotal: </span>
            </div>
            <div className="flex w-[9%] pl-1 justify-start">
              <span>$ {subtotal?.toFixed(2)}</span>
            </div>
          </footer>
        )}
      />
    </section>
  );
};

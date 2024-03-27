import { ColumnsType } from "antd/es/table";
import { Table } from "antd";
import React from "react";

import { IServiceFeeSubItem } from "@/models/serviceFees";

export const ServiceFeeViewTableSection = (props: any) => {
  const { data, subtotal, name } = props;

  const columns: ColumnsType<IServiceFeeSubItem> = [
    {
      title: "Descripción",
      dataIndex: "description",
      key: "description",
      width: "55%"
    },
    {
      title: "Unidad de Medida",
      dataIndex: "unitMeasure",
      key: "unitMeasure",
      width: "15%"
    },
    {
      title: "Cantidad",
      dataIndex: "amount",
      key: "amount",
      width: "10%"
    },
    {
      title: "Precio",
      dataIndex: "price",
      key: "price",
      width: "10%",
      render: (value) => (
        <span>
          $ {value.toLocaleString("DE", { maximumFractionDigits: 2, minimumFractionDigits: 2 })}
        </span>
      )
    },
    {
      title: "Importe",
      dataIndex: "value",
      key: "value",
      width: "25%",
      render: (value) => (
        <span>
          $ {value.toLocaleString("DE", { maximumFractionDigits: 2, minimumFractionDigits: 2 })}
        </span>
      )
    }
  ];
  return (
    <section className="flex flex-1 mt-2">
      <article className="flex items-center text-center w-[15rem] p-4">
        <h2 className="text-base w-full font-bold">{name.toUpperCase()}</h2>
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
              <span>
                ${" "}
                {subtotal?.toLocaleString("DE", {
                  maximumFractionDigits: 2,
                  minimumFractionDigits: 2
                })}
              </span>
            </div>
          </footer>
        )}
      />
    </section>
  );
};

import { ColumnsType } from "antd/es/table";
import { Table } from "antd";
import React from "react";

import { IServiceFeeSubItem } from "@/models/serviceFees";

export const ServiceFeeViewTableSection = (props: any) => {
  const { data, subtotal, name } = props;

  const columns: ColumnsType<IServiceFeeSubItem> = [
    {
      title: <span className="font-semibold">Descripción</span>,
      dataIndex: "description",
      key: "description",
      width: "55%"
    },
    {
      title: <span className="font-semibold">Unidad de Medida</span>,
      dataIndex: "unitMeasure",
      key: "unitMeasure",
      width: "15%"
    },
    {
      title: <span className="font-semibold">Cantidad</span>,
      dataIndex: "amount",
      key: "amount",
      width: "10%",
      render: (value) => <span>$ {value?.toLocaleString("DE", { maximumFractionDigits: 2, minimumFractionDigits: 2 })}</span>
    },
    {
      title: <span className="font-semibold">Precio</span>,
      dataIndex: "price",
      key: "price",
      width: "10%",
      render: (value) => <span>$ {value?.toLocaleString("DE", { maximumFractionDigits: 2, minimumFractionDigits: 2 })}</span>
    },
    {
      title: <span className="font-semibold">Importe</span>,
      dataIndex: "value",
      key: "value",
      width: "25%",
      render: (value) => <span>$ {value?.toLocaleString("DE", { maximumFractionDigits: 2, minimumFractionDigits: 2 })}</span>
    }
  ];

  return (
    <section className="flex w-full mb-5 rounded-md p-2 border border-border_light shadow-sm">
      <div className="flex w-[15%] p-2 text-center items-center justify-center bg-[#fafafa] rounded-l-md">
        <span className="text-base font-semibold">{name.toUpperCase()}</span>
      </div>
      <div className="grid pl-2 w-full gap-2">
        <Table
          size="small"
          columns={columns}
          dataSource={data}
          className="shadow-sm"
          pagination={false}
          bordered
          footer={() => (
            <footer className="flex w-full">
              <div className="font-semibold flex w-[91%]">
                <span>Subtotal: </span>
              </div>
              <div className="flex font-semibold">
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
      </div>
    </section>
  );
};

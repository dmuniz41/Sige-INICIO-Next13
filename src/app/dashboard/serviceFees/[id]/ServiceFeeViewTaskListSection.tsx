import { ColumnsType } from "antd/es/table";
import { Table } from "antd";
import React from "react";

import { IServiceFeeTask } from "@/models/serviceFeeTask";

export const ServiceFeeViewTaskListSection = (props: any) => {
  const { data, subtotal, name } = props;

  const columns: ColumnsType<IServiceFeeTask> = [
    {
      title: <span className="font-bold">Descripción (Complejidad)</span>,
      dataIndex: "description",
      key: "description",
      width: "45%",
      render: (_, { ...record }) => <span>{`${record.description} (${record.currentComplexity?.name})`}</span>
    },
    {
      title: <span className="font-bold">Unidad de Medida</span>,
      dataIndex: "unitMeasure",
      key: "unitMeasure",
      width: "15%"
    },
    {
      title: <span className="font-bold">Cantidad</span>,
      dataIndex: "amount",
      key: "amount",
      width: "10%",
      render: (value) => <span>$ {value?.toLocaleString("DE", { maximumFractionDigits: 2, minimumFractionDigits: 2 })}</span>
    },
    {
      title: <span className="font-bold">Duración (h)</span>,
      dataIndex: "amount",
      key: "amount",
      width: "10%",
      render: (_, { ...record }) => (
        <span>
          {(record.currentComplexity?.time! * record.amount)?.toLocaleString("DE", {
            maximumFractionDigits: 2,
            minimumFractionDigits: 2
          })}
        </span>
      )
    },
    {
      title: <span className="font-bold">Precio</span>,
      dataIndex: "price",
      key: "price",
      width: "10%",
      render: (_, { ...record }) => (
        <span>
          ${" "}
          {record.currentComplexity?.value?.toLocaleString("DE", {
            maximumFractionDigits: 2,
            minimumFractionDigits: 2
          })}
        </span>
      )
    },
    {
      title: <span className="font-bold">Importe</span>,
      dataIndex: "value",
      key: "value",
      width: "30%",
      render: (_, { ...record }) => (
        <span>
          ${" "}
          {(record.currentComplexity?.value! * record.amount).toLocaleString("DE", {
            maximumFractionDigits: 2,
            minimumFractionDigits: 2
          })}
        </span>
      )
    }
  ];

  return (
    <section className="flex w-full mb-5 rounded-md p-2 border border-border_light shadow-sm">
      <div className="flex w-[15%] p-2 text-center items-center justify-center bg-[#fafafa] rounded-l-md">
        <span className="text-base font-bold">{name.toUpperCase()}</span>
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
              <div className="font-bold flex w-[91%]">
                <span>Subtotal: </span>
              </div>
              <div className="flex font-bold">
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

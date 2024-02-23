import { ColumnsType } from "antd/es/table";
import { Table } from "antd";
import React from "react";

import { IItem } from "@/models/project";


export const ProjectViewTable = (props: any) => {
  const { data } = props;

  const columns: ColumnsType<IItem> = [
    {
      title: "No.",
      dataIndex: "idNumber",
      key: "idNumber",
      width: "1%",
    },
    {
      title: "Descripción del servicio ",
      dataIndex: "description",
      key: "description",
      width: "55%",
    },
  ];
  return (
      <Table
        size="small"
        columns={columns}
        dataSource={data}
        className="border-solid w-full"
        pagination={false}
        bordered
      />
  );
};

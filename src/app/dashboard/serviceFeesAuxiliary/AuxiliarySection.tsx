import { Table } from "antd";
import React from "react";

export const AuxiliarySection = (props: any) => {
  const { data, columns, sectionName } = props;
  return (
    <article className="flex gap-8 w-full">
      <div className="font-semibold text-base flex items-center min-w-[200px] justify-center">
        <span>{sectionName}</span>
      </div>
      <Table dataSource={data} columns={columns} pagination={false} size="small" bordered />
    </article>
  );
};

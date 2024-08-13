import { Table } from "antd";

export const AuxiliarySection = (props: any) => {
  const { data, columns, sectionName } = props;
  return (
    <article className="flex border-1 border-solid border-border_light rounded-md bg-background_light">
      <div className="font-bold text-lg flex items-center min-w-[350px] justify-center">
        <span className="w-[250px] text-center">{sectionName}</span>
      </div>
      <Table dataSource={data} columns={columns} pagination={false} size="small" bordered className="p-2"/>
    </article>
  );
};

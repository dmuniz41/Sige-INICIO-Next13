import { Table } from "antd";
import { ColumnsType } from "antd/es/table";
import { NoDataSvg } from "@/app/global/NoDataSvg";

export const MaterialsSection = ({
  materials
}: {
  materials: {
    itemId: string;
    description: string;
    amount: number;
    unitMeasure: string;
  }[];
}) => {
  const columns: ColumnsType<{
    itemId: string;
    description: string;
    amount: number;
    unitMeasure: string;
  }> = [
    {
      title: <span className="font-bold">Nombre del Material</span>,
      dataIndex: "description",
      key: "description",
      width: "60%"
    },
    {
      title: <span className="font-bold">Cantidad</span>,
      dataIndex: "amount",
      key: "amount",
      width: "10%",
      render: (value) => (
        <span>
          {value.toLocaleString("DE", {
            maximumFractionDigits: 2,
            minimumFractionDigits: 2
          })}
        </span>
      ),
      sorter: {
        compare: (a, b) => a.amount - b.amount
      }
    },
    {
      title: <span className="font-bold">Unidad de Medida</span>,
      dataIndex: "unitMeasure",
      key: "unitMeasure",
      width: "15%"
    }
  ];

  return (
    <section>
      {materials.length == 0 ? (
        <section className="grid p-4 w-full  justify-center border border-border_light rounded-md">
          <div className="flex justify-center">
            <NoDataSvg width={100} height={100} />
          </div>
          <p className="font-bold">Esta actividad no contiene materiales</p>
        </section>
      ) : (
        <Table
          size="small"
          columns={columns}
          dataSource={materials}
          pagination={false}
          bordered
        />
      )}
    </section>
  );
};

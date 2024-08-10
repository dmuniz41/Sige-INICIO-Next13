"use client";

import { PDFSvg } from "@/app/global/PDFSvg";
import { Modal, Table } from "antd";
import { ColumnsType } from "antd/es/table";
import dynamic from "next/dynamic";
import PDFReport from "@/helpers/PDFReport";

interface CollectionCreateFormProps {
  open: boolean;
  onCancel: () => void;
  values?: { values: { description: string; amount: number; unitMeasure: string }[]; name: string };
}

const PDFDownloadLink = dynamic(
  () => import("@react-pdf/renderer").then((mod) => mod.PDFDownloadLink),
  {
    ssr: true,
    loading: () => <p>Loading...</p>
  }
);

export const MaterialsListModal: React.FC<CollectionCreateFormProps> = ({
  open,
  onCancel,
  values
}) => {
  let PDFReportData: { description: string; amount: number; unitMeasure: string }[] =
    values?.values!;
  const fields = [
    {
      title: "Nombre del Material",
      custom: true,
      component: (item: any) => `${item.description}`,
      width: "60"
    },
    {
      title: "Cantidad",
      custom: true,
      component: (item: any) =>
        `${item.amount.toLocaleString("DE", {
          maximumFractionDigits: 2,
          minimumFractionDigits: 2
        })}`,
      width: "10"
    },
    {
      title: "Unidad de Medida",
      custom: true,
      component: (item: any) => `${item.unitMeasure}`,
      width: "30"
    }
  ];

  const columns: ColumnsType<{ description: string; amount: number; unitMeasure: string }> = [
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
    <Modal
      className="flex flex-col"
      title={
        <div className="flex w-full justify-center">
          <span className="font-bold text-lg">Lista de Materiales</span>
        </div>
      }
      style={{ textAlign: "left" }}
      centered
      open={open}
      destroyOnClose
      onCancel={onCancel}
      width={"1000px"}
      cancelText="Cancelar"
      footer={<></>}
    >
      <div className="">
        <PDFDownloadLink
          className=" flex w-[2.5rem] h-[2.5rem]"
          document={
            <PDFReport
              fields={fields}
              data={PDFReportData}
              title={`LISTA DE MATERIALES (${values?.name})  `}
            />
          }
          fileName={`Listado de Materiales ${values?.name}  `}
        >
          {({ blob, url, loading, error }) =>
            loading ? (
              <button
                disabled
                className={`opacity-20 pt-2 pl-2" flex justify-center items-center w-[2.5rem] h-[2.5rem] text-xl rounded-full`}
              >
                <PDFSvg />
              </button>
            ) : (
              <button className={"toolbar-auxiliary-icon"}>
                <PDFSvg />
              </button>
            )
          }
        </PDFDownloadLink>
        <Table
          size="small"
          columns={columns}
          dataSource={values?.values}
          pagination={{ position: ["bottomCenter"], defaultPageSize: 20 }}
          className="shadow-md"
        />
      </div>
    </Modal>
  );
};

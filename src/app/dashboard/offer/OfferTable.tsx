"use client";
import { Button, Input, Space, Table, Tooltip } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import dynamic from "next/dynamic";
import Highlighter from "react-highlight-words";
import React, { useEffect, useMemo, useRef, useState } from "react";
import type { ColumnType, ColumnsType, TableProps } from "antd/es/table";
import type { FilterConfirmProps } from "antd/es/table/interface";
import type { InputRef } from "antd";

import { PDFSvg } from "@/app/global/PDFSvg";
import { RootState, useAppSelector } from "@/store/store";
import { SeeSvg } from "@/app/global/SeeSvg";
import { useAppDispatch } from "@/hooks/hooks";
import { useRouter } from "next/navigation";
import { IOffer } from "@/models/offer";
import { loadSelectedOffer, offersStartLoading } from "../../../actions/offer";
import { IProject } from "@/models/project";
import { CircleCheckSvg } from "@/app/global/CircleCheckSvg";

// const PDFDownloadLink = dynamic(() => import("@react-pdf/renderer").then((mod) => mod.PDFDownloadLink), {
//   ssr: false,
//   loading: () => <p>Loading...</p>,
// });

type DataIndex = keyof IOffer;

const OfferTable: React.FC = () => {
  const dispatch = useAppDispatch();
  const [filteredData, setFilteredData] = useState<IOffer[]>();
  const router = useRouter();

  // const fields = [
  //   {
  //     title: "Nomenclador",
  //     custom: true,
  //     component: (item: any) => `${item.nomenclatorId}`,
  //     width: "10",
  //   },
  //   {
  //     title: " Nombre de la tarea",
  //     custom: true,
  //     component: (item: any) => `${item.taskName}`,
  //     width: "50",
  //   },
  //   {
  //     title: " Categoría",
  //     custom: true,
  //     component: (item: any) => `${item.category}`,
  //     width: "20",
  //   },
  //   {
  //     title: " Precio",
  //     custom: true,
  //     component: (item: any) => `$ ${item.salePrice}`,
  //     width: "10",
  //   },
  //   {
  //     title: " Precio/UM",
  //     custom: true,
  //     component: (item: any) => `${item.valuePerUnitMeasure}`,
  //     width: "10",
  //   },
  // ];

  const { selectedProject }: { selectedProject: IProject } = useAppSelector(
    (state: RootState) => state?.project
  );

  useEffect(() => {
    dispatch(offersStartLoading(selectedProject._id));
  }, [dispatch, selectedProject]);

  const { offers, finalOfferId }: { offers: IOffer[]; finalOfferId: string } = useAppSelector(
    (state: RootState) => state?.offer
  );

  // let PDFReportData: ICostSheet[] = [];

  // if (filteredData) {
  //   PDFReportData = filteredData;
  // } else {
  //   PDFReportData = data;
  // }

  const handleView = (projectId: string): void => {
    dispatch(loadSelectedOffer(projectId));
    router.push(`/dashboard/offer/${projectId}`);
  };

  const onChange: TableProps<IOffer>["onChange"] = (pagination, filters, sorter, extra) => {
    setFilteredData(extra.currentDataSource);
    console.log(filteredData);
  };

  const columns: ColumnsType<IOffer> = [
    {
      title: "Nombre",
      dataIndex: "projectName",
      key: "projectName",
      width: "60%",
      render: (_, record) => (
        <div className="flex gap-4">
          <span>{record.projectName}</span>
          {record.isFinalOffer ? (
            <div className=" text-success-500">
              <CircleCheckSvg />
            </div>
          ) : (
            <></>
          )}
        </div>
      ),
      sorter: (a: any, b: any) => a.projectName.localeCompare(b.projectName)
    },
    {
      title: "Valor",
      dataIndex: "value",
      key: "value",
      width: "10%",
      render: (value) => (
        <span>
          ${" "}
          {value.toLocaleString("DE", {
            maximumFractionDigits: 2,
            minimumFractionDigits: 2
          })}
        </span>
      )
    },
    {
      title: "Representación",
      dataIndex: "representationCoef",
      key: "representationCoef",
      width: "10%",
      render: (representationCoef) => <span>{representationCoef?.representative}</span>
    },
    {
      title: "Acciones",
      key: "actions",
      width: "5%",
      render: (_, record) => (
        <div className="flex gap-1 justify-center">
          <Tooltip placement="top" title={"Ver"} arrow={{ pointAtCenter: true }}>
            <button onClick={() => handleView(record._id)} className="table-see-action-btn">
              <SeeSvg width={20} height={20} />
            </button>
          </Tooltip>
        </div>
      )
    }
  ];

  const isFinalOfferRow = (rowObject: IOffer) => {
    return rowObject.isFinalOffer ? 'bg-success-100' : '';
};

  return (
    <>
      <div className="flex h-16 w-full bg-white-100 rounded-md shadow-md mb-4 items-center pl-4 gap-4">
        {/* <div className="flex gap-2">
          <button onClick={() => router.push("/dashboard/serviceFees/createServiceFee")} className={`${canCreate ? "toolbar-primary-icon-btn" : "bg-success-200"} `}>
            <PlusSvg />
            Nuevo
          </button>
        </div> */}
        <div className="flex">
          {/* <PDFDownloadLink document={<CostSheetTablePDFReport fields={fields} data={PDFReportData} title={`Fichas de costo`} />} fileName={`Listado de fichas de costo `}>
            {({ blob, url, loading, error }) => (
              <button disabled={loading} className="cursor-pointer hover:bg-white-600 ease-in-out duration-300 rounded-full w-[2.5rem] h-[2.5rem] flex justify-center items-center">
                <PDFSvg />
              </button>
            )}
          </PDFDownloadLink> */}
          {/* <Tooltip placement="top" title={"Refrescar"} arrow={{ pointAtCenter: true }}>
            <button
              className={`${
                canList ? "cursor-pointer hover:bg-white-600 ease-in-out duration-300" : "opacity-20 pt-2 pl-2"
              } flex justify-center items-center w-[2.5rem] h-[2.5rem] text-xl rounded-full`}
              onClick={() => dispatch(serviceFeeStartLoading())}
            >
              <RefreshSvg />
            </button>
          </Tooltip> */}
        </div>
      </div>

      <Table
        size="small"
        columns={columns}
        dataSource={offers}
        onChange={onChange}
        pagination={{ position: ["bottomCenter"], defaultPageSize: 20 }}
        className="shadow-md"
        rowClassName={(record) => isFinalOfferRow(record)}
      />
    </>
  );
};

export default OfferTable;

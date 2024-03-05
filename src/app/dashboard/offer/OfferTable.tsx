"use client";
import { Button, Input, Space, Table, Tooltip } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import dynamic from "next/dynamic";
import Highlighter from "react-highlight-words";
import React, { useEffect, useMemo, useRef, useState } from "react";
import Swal from "sweetalert2";
import type { ColumnType, ColumnsType, TableProps } from "antd/es/table";
import type { FilterConfirmProps } from "antd/es/table/interface";
import type { InputRef } from "antd";

import { DeleteSvg } from "@/app/global/DeleteSvg";
import { INomenclator } from "@/models/nomenclator";
import { loadSelectedServiceFee, serviceFeeStartLoading, startDeleteServiceFee } from "@/actions/serviceFee";
import { nomenclatorsStartLoading, startDeleteNomenclator } from "@/actions/nomenclator";
import { PDFSvg } from "@/app/global/PDFSvg";
import { PlusSvg } from "@/app/global/PlusSvg";
import { RefreshSvg } from "@/app/global/RefreshSvg";
import { RootState, useAppSelector } from "@/store/store";
import { SeeSvg } from "@/app/global/SeeSvg";
import { Toast } from "@/helpers/customAlert";
import { useAppDispatch } from "@/hooks/hooks";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { startLoadServiceFeeAuxiliary } from "@/actions/serviceFeeAuxiliary";
import { IOffer } from '@/models/offer';
import { loadSelectedOffer, offersStartLoading, startDeleteOffer } from '../../../actions/offer';
import { IProject } from "@/models/project";

// const PDFDownloadLink = dynamic(() => import("@react-pdf/renderer").then((mod) => mod.PDFDownloadLink), {
//   ssr: false,
//   loading: () => <p>Loading...</p>,
// });

type DataIndex = keyof IOffer;

const OfferTable: React.FC = () => {
  const dispatch = useAppDispatch();
  const [searchText, setSearchText] = useState("");
  const [searchedColumn, setSearchedColumn] = useState("");
  const [filteredData, setFilteredData] = useState<IOffer[]>();
  const searchInput = useRef<InputRef>(null);
  const router = useRouter();
  const { data: sessionData } = useSession();

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
  
  const { selectedProject }: {selectedProject: IProject} = useAppSelector((state: RootState) => state?.project);
  
  useEffect(() => {
    dispatch(offersStartLoading(selectedProject._id ));
  }, [dispatch, selectedProject]);
  
  const { offers }: any = useAppSelector((state: RootState) => state?.offer);


  // let PDFReportData: ICostSheet[] = [];

  // if (filteredData) {
  //   PDFReportData = filteredData;
  // } else {
  //   PDFReportData = data;
  // }

  const handleView = (projectId: string): void => {
    if (projectId) {
      dispatch(loadSelectedOffer(projectId));
      router.push(`/dashboard/offer/${projectId}`);
    } else {
      Toast.fire({
        icon: "error",
        title: "Seleccione una oferta para ver",
      });
    }
  };

  const handleSearch = (selectedKeys: string[], confirm: (param?: FilterConfirmProps) => void, dataIndex: DataIndex) => {
    confirm();
    setSearchText(selectedKeys[0]);
    setSearchedColumn(dataIndex);
  };

  const handleDelete = (record: any) => {
    if (record) {
      Swal.fire({
        title: "Eliminar Oferta de Servicio",
        text: "La oferta seleccionada se borrará de forma permanente",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        cancelButtonText: "Cancelar",
        confirmButtonText: "Eliminar",
      }).then((result) => {
        if (result.isConfirmed) {
          dispatch(startDeleteOffer(record._id));
        }
      });
    } else {
      Toast.fire({
        icon: "error",
        title: "Seleccione una oferta a eliminar",
      });
    }
  };

  const handleReset = (clearFilters: () => void) => {
    clearFilters();
    setSearchText("");
  };

  const onChange: TableProps<IOffer>["onChange"] = (pagination, filters, sorter, extra) => {
    setFilteredData(extra.currentDataSource);
    console.log(filteredData);
  };

  const getColumnSearchProps = (dataIndex: DataIndex): ColumnType<IOffer> => ({
    filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters, close }) => (
      <div style={{ padding: 8 }} onKeyDown={(e) => e.stopPropagation()}>
        <Input
          ref={searchInput}
          placeholder={`Search ${dataIndex}`}
          value={selectedKeys[0]}
          onChange={(e) => setSelectedKeys(e.target.value ? [e.target.value] : [])}
          onPressEnter={() => handleSearch(selectedKeys as string[], confirm, dataIndex)}
          style={{ marginBottom: 8, display: "block" }}
        />
        <Space>
          <Button
            type="primary"
            onClick={() => handleSearch(selectedKeys as string[], confirm, dataIndex)}
            icon={<SearchOutlined />}
            size="small"
            style={{ width: 90 }}
            className="bg-blue-500 items-center flex"
          >
            Search
          </Button>
          <Button onClick={() => clearFilters && handleReset(clearFilters)} size="small" style={{ width: 90 }}>
            Reset
          </Button>
          <Button
            type="link"
            size="small"
            onClick={() => {
              confirm({ closeDropdown: false });
              setSearchText((selectedKeys as string[])[0]);
              setSearchedColumn(dataIndex);
            }}
          >
            Filter
          </Button>
          <Button
            type="link"
            size="small"
            onClick={() => {
              close();
            }}
          >
            close
          </Button>
        </Space>
      </div>
    ),
    filterIcon: (filtered: boolean) => <SearchOutlined style={{ color: filtered ? "#1677ff" : undefined }} />,
    onFilter: (value, record) =>
      record[dataIndex]!
        .toString()
        .toLowerCase()
        .includes((value as string).toLowerCase()),
    onFilterDropdownOpenChange: (visible) => {
      if (visible) {
        setTimeout(() => searchInput.current?.select(), 100);
      }
    },
    render: (text) =>
      searchedColumn === dataIndex ? (
        <Highlighter highlightStyle={{ backgroundColor: "#ffc069", padding: 0 }} searchWords={[searchText]} autoEscape textToHighlight={text ? text.toString() : ""} />
      ) : (
        text
      ),
  });

  const columns: ColumnsType<IOffer> = [
    {
      title: "Nombre",
      dataIndex: "projectName",
      key: "projectName",
      width: "60%",
      sorter: (a: any, b: any) => a.projectName.localeCompare(b.projectName),
      ...getColumnSearchProps("projectName"),
    },
    {
      title: "Valor",
      dataIndex: "value",
      key: "value",
      width: "10%",
    },

    {
      title: "Acciones",
      key: "actions",
      width: "5%",
      render: (_, record) => (
        <div className="flex gap-1">

  
            <Tooltip placement="top" title={"Ver"} arrow={{ pointAtCenter: true }}>
              <button  onClick={() => handleView(record._id)} className="table-see-action-btn">
                <SeeSvg width={20} height={20} />
              </button>
            </Tooltip>
          

            <Tooltip placement="top" title={"Eliminar"} arrow={{ pointAtCenter: true }}>
              <button  className="table-delete-action-btn" onClick={() => handleDelete(record)}>
                <DeleteSvg width={20} height={20} />
              </button>
            </Tooltip>

        </div>
      ),
    },
  ];

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

      <Table size="small" columns={columns} dataSource={offers} onChange={onChange} pagination={{ position: ["bottomCenter"], defaultPageSize: 20 }} className="shadow-md" />
    </>
  );
};

export default OfferTable;

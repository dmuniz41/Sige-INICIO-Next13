"use client";
import { Button, Input, Space, Spin, Table, Tooltip } from "antd";
import { LoadingOutlined, SearchOutlined } from "@ant-design/icons";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import dynamic from "next/dynamic";
import Highlighter from "react-highlight-words";
import moment from "moment";
import React, { useEffect, useMemo, useRef, useState } from "react";
import Swal from "sweetalert2";
import type { ColumnType, ColumnsType, TableProps } from "antd/es/table";
import type { FilterConfirmProps } from "antd/es/table/interface";
import type { InputRef } from "antd";

import { DeleteSvg } from "@/app/global/DeleteSvg";
import { INomenclator } from "@/models/nomenclator";
import { IServiceFee } from "@/models/serviceFees";
import { nomenclatorsStartLoading, startDeleteNomenclator } from "@/actions/nomenclator";
import { PDFSvg } from "@/app/global/PDFSvg";
import { PlusSvg } from "@/app/global/PlusSvg";
import { RefreshSvg } from "@/app/global/RefreshSvg";
import { RootState, useAppSelector } from "@/store/store";
import { SeeSvg } from "@/app/global/SeeSvg";
import { startLoadServiceFeeAuxiliary } from "@/actions/serviceFeeAuxiliary";
import { Toast } from "@/helpers/customAlert";
import { useAppDispatch } from "@/hooks/hooks";
import {
  loadSelectedServiceFee,
  serviceFeeStartLoading,
  startDeleteServiceFee
} from "@/actions/serviceFee";
import PDFReport from "@/helpers/PDFReport";

const PDFDownloadLink = dynamic(
  () => import("@react-pdf/renderer").then((mod) => mod.PDFDownloadLink),
  {
    ssr: false,
    loading: () => <Spin indicator={<LoadingOutlined style={{ fontSize: 24 }} spin />} />
  }
);

type DataIndex = keyof IServiceFee;

let date = moment();
let currentDate = date.format("L");

const ServiceFeeTable: React.FC = () => {
  const [filteredData, setFilteredData] = useState<IServiceFee[]>();
  const [searchedColumn, setSearchedColumn] = useState("");
  const [searchText, setSearchText] = useState("");
  const { data: sessionData } = useSession();
  const dispatch = useAppDispatch();
  const router = useRouter();
  const searchInput = useRef<InputRef>(null);

  const canList = sessionData?.user.role.includes("Listar Tarifas de Servicio");
  const canCreate = sessionData?.user.role.includes("Crear Tarifas de Servicio");
  const canDelete = sessionData?.user.role.includes("Eliminar Tarifas de Servicio");

  const fields = [
    {
      title: "Descripción",
      custom: true,
      component: (item: any) => `${item.taskName}`,
      width: "40"
    },
    {
      title: "Categoría",
      custom: true,
      component: (item: any) => `${item.category}`,
      width: "20"
    },
    {
      title: "Precio",
      custom: true,
      component: (item: any) =>
        `$ ${item.salePrice.toLocaleString("DE", { maximumFractionDigits: 2, minimumFractionDigits: 2 })}`,
      width: "20"
    },
    {
      title: "Unidad de Medida",
      custom: true,
      component: (item: any) => `${item.unitMeasure}`,
      width: "20s"
    }
  ];

  useEffect(() => {
    dispatch(serviceFeeStartLoading());
    dispatch(nomenclatorsStartLoading());
    dispatch(startLoadServiceFeeAuxiliary());
  }, [dispatch]);

  const { serviceFees }: any = useAppSelector((state: RootState) => state?.serviceFee);
  let data: IServiceFee[] = useMemo(() => serviceFees, [serviceFees]);
  if (!canList) {
    data = [];
  }

  let PDFReportData: IServiceFee[] = [];

  if (filteredData) {
    PDFReportData = filteredData;
  } else {
    PDFReportData = data;
  }

  const { nomenclators }: any = useAppSelector((state: RootState) => state?.nomenclator);

  const categoryFilter: any[] = [];
  nomenclators.map((nomenclator: INomenclator) => {
    if (nomenclator.category === "Categoría de tarifas") {
      categoryFilter.push({
        text: `${nomenclator.code}`,
        value: `${nomenclator.code}`
      });
    }
  });

  const handleView = (id: string): void => {
    if (id) {
      dispatch(loadSelectedServiceFee(id));
      router.push(`/dashboard/serviceFees/${id}`);
    } else {
      Toast.fire({
        icon: "error",
        title: "Seleccione una ficha de costo para ver"
      });
    }
  };

  const handleSearch = (
    selectedKeys: string[],
    confirm: (param?: FilterConfirmProps) => void,
    dataIndex: DataIndex
  ) => {
    confirm();
    setSearchText(selectedKeys[0]);
    setSearchedColumn(dataIndex);
  };

  const handleDelete = (record: any) => {
    Swal.fire({
      title: "Eliminar Tarifa de Servicio",
      text: "La tarifa de servicio seleccionada se borrará de forma permanente",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      cancelButtonText: "Cancelar",
      confirmButtonText: "Eliminar"
    }).then((result) => {
      if (result.isConfirmed) {
        const nomenclatorToDelete = nomenclators.find(
          (nomenclator: INomenclator) => nomenclator?.code === record?.nomenclatorId
        );
        dispatch(startDeleteServiceFee(record._id));
        dispatch(startDeleteNomenclator(nomenclatorToDelete?._id));
      }
    });
  };

  const handleReset = (clearFilters: () => void) => {
    clearFilters();
    setSearchText("");
  };

  const onChange: TableProps<IServiceFee>["onChange"] = (pagination, filters, sorter, extra) => {
    setFilteredData(extra.currentDataSource);
    console.log(filteredData);
  };

  const getColumnSearchProps = (dataIndex: DataIndex): ColumnType<IServiceFee> => ({
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
          <Button
            onClick={() => clearFilters && handleReset(clearFilters)}
            size="small"
            style={{ width: 90 }}
          >
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
    filterIcon: (filtered: boolean) => (
      <SearchOutlined style={{ color: filtered ? "#1677ff" : undefined }} />
    ),
    onFilter: (value, record) =>
      record[dataIndex]
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
        <Highlighter
          highlightStyle={{ backgroundColor: "#ffc069", padding: 0 }}
          searchWords={[searchText]}
          autoEscape
          textToHighlight={text ? text.toString() : ""}
        />
      ) : (
        text
      )
  });

  const columns: ColumnsType<IServiceFee> = [
    {
      title: <span className="font-bold">Nombre de la Tarifa</span>,
      dataIndex: "taskName",
      key: "taskName",
      width: "45%",
      sorter: (a: any, b: any) => a.taskName.localeCompare(b.taskName),
      ...getColumnSearchProps("taskName")
    },
    {
      title: <span className="font-bold">Nomenclador</span>,
      dataIndex: "nomenclatorId",
      key: "nomenclatorId",
      width: "10%",
      filterSearch: true,
      sorter: (a: any, b: any) => a.nomenclatorId.localeCompare(b.nomenclatorId)
    },
    {
      title: <span className="font-bold">Categoría</span>,
      dataIndex: "category",
      key: "category",
      width: "15%",
      filters: categoryFilter,
      onFilter: (value: any, record: any) => record.category.startsWith(value),
      filterSearch: true
    },

    {
      title: <span className="font-bold">Precio</span>,
      dataIndex: "salePrice",
      key: "salePrice",
      width: "10%",
      render: (value) => (
        <span>
          $ {value.toLocaleString("DE", { maximumFractionDigits: 2, minimumFractionDigits: 2 })}
        </span>
      ),
      sorter: {
        compare: (a, b) => a.salePrice - b.salePrice
      }
    },
    {
      title: <span className="font-bold">Precio USD</span>,
      dataIndex: "salePriceUSD",
      key: "salePriceUSD",
      width: "10%",
      render: (value) => (
        <span>
          ${" "}
          {value.toLocaleString("DE", {
            maximumFractionDigits: 2,
            minimumFractionDigits: 2
          })}
        </span>
      ),
      sorter: {
        compare: (a, b) => a.salePriceUSD - b.salePriceUSD
      }
    },
    {
      title: <span className="font-bold">Unidad de Medida</span>,
      dataIndex: "unitMeasure",
      key: "unitMeasure",
      width: "15%"
    },
    {
      title: <span className="font-bold">Acciones</span>,
      key: "actions",
      width: "5%",
      render: (_, record) => (
        <div className="flex gap-1">
          {!canList ? (
            <></>
          ) : (
            <Tooltip placement="top" title={"Ver"} arrow={{ pointAtCenter: true }}>
              <button
                disabled={!canList}
                onClick={() => handleView(record._id)}
                className="table-see-action-btn"
              >
                <SeeSvg width={20} height={20} />
              </button>
            </Tooltip>
          )}
          {!canDelete ? (
            <></>
          ) : (
            <Tooltip placement="top" title={"Eliminar"} arrow={{ pointAtCenter: true }}>
              <button
                disabled={!canDelete}
                className="table-delete-action-btn"
                onClick={() => handleDelete(record)}
              >
                <DeleteSvg width={20} height={20} />
              </button>
            </Tooltip>
          )}
        </div>
      )
    }
  ];

  return (
    <>
      <div className="flex h-16 w-full bg-white-100 rounded-md shadow-md mb-4 items-center pl-4 gap-4">
        <div className="flex gap-2">
          <button
            disabled={!canCreate}
            onClick={() => router.push("/dashboard/serviceFees/createServiceFee")}
            className={`${canCreate ? "toolbar-primary-icon-btn" : "bg-success-200"} `}
          >
            <PlusSvg />
            Nuevo
          </button>
        </div>
        <div className="flex">
          <PDFDownloadLink
            className=" flex w-[2.5rem] h-[2.5rem]"
            document={
              <PDFReport fields={fields} data={PDFReportData} title={`LISTADO DE TARIFAS `} />
            }
            fileName={`Listado de Tarifas (${currentDate})`}
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
          <Tooltip placement="top" title={"Refrescar"} arrow={{ pointAtCenter: true }}>
            <button
              disabled={!canList}
              className={`${
                canList
                  ? "cursor-pointer hover:bg-white-600 ease-in-out duration-300"
                  : "opacity-20 pt-2 pl-2"
              } flex justify-center items-center w-[2.5rem] h-[2.5rem] text-xl rounded-full`}
              onClick={() => dispatch(serviceFeeStartLoading())}
            >
              <RefreshSvg />
            </button>
          </Tooltip>
        </div>
      </div>

      <Table
        size="small"
        columns={columns}
        dataSource={data}
        onChange={onChange}
        pagination={{ position: ["bottomCenter"], defaultPageSize: 20 }}
        className="shadow-md"
      />
    </>
  );
};

export default ServiceFeeTable;

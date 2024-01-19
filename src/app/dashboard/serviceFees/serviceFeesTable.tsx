"use client";
import { Button, Input, Space, Table, Tooltip } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import dynamic from "next/dynamic";
import Highlighter from "react-highlight-words";
import React, { useEffect, useMemo, useRef, useState } from "react";
import Swal from "sweetalert2";
import type { ColumnType, ColumnsType, TableProps } from "antd/es/table";
import type { FilterConfirmProps, TableRowSelection } from "antd/es/table/interface";
import type { InputRef } from "antd";

import { DeleteSvg } from "@/app/global/DeleteSvg";
import { INomenclator } from "@/models/nomenclator";
import { IServiceFee } from "@/models/serviceFees";
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

const PDFDownloadLink = dynamic(() => import("@react-pdf/renderer").then((mod) => mod.PDFDownloadLink), {
  ssr: false,
  loading: () => <p>Loading...</p>,
});

type DataIndex = keyof IServiceFee;

const ServiceFeeTable: React.FC = () => {
  const dispatch = useAppDispatch();
  const [searchText, setSearchText] = useState("");
  const [searchedColumn, setSearchedColumn] = useState("");
  const [selectedRow, setSelectedRow] = useState<IServiceFee>();
  const [filteredData, setFilteredData] = useState<IServiceFee[]>();
  const searchInput = useRef<InputRef>(null);
  const router = useRouter();
  const { data: sessionData } = useSession();
  const serviceFeeNomenclator: string[] | undefined = [];

  const canList = sessionData?.user.role.includes("Listar Tarifas de Servicio");
  const canCreate = sessionData?.user.role.includes("Crear Tarifas de Servicio");
  const canEdit = sessionData?.user.role.includes("Editar Tarifas de Servicio");
  const canDelete = sessionData?.user.role.includes("Eliminar Tarifas de Servicio");

  const fields = [
    {
      title: "Nomenclador",
      custom: true,
      component: (item: any) => `${item.nomenclatorId}`,
      width: "10",
    },
    {
      title: " Nombre de la tarea",
      custom: true,
      component: (item: any) => `${item.taskName}`,
      width: "50",
    },
    {
      title: " Categoría",
      custom: true,
      component: (item: any) => `${item.category}`,
      width: "20",
    },
    {
      title: " Precio",
      custom: true,
      component: (item: any) => `$ ${item.salePrice}`,
      width: "10",
    },
    {
      title: " Precio/UM",
      custom: true,
      component: (item: any) => `${item.valuePerUnitMeasure}`,
      width: "10",
    },
  ];

  useEffect(() => {
    dispatch(serviceFeeStartLoading());
    dispatch(nomenclatorsStartLoading());
    dispatch(startLoadServiceFeeAuxiliary())
  }, [dispatch]);

  const { serviceFees }: any = useAppSelector((state: RootState) => state?.serviceFee);
  let data: IServiceFee[] = useMemo(() => serviceFees, [serviceFees]);
  if (!canList) {
    data = [];
  }

  // let PDFReportData: ICostSheet[] = [];

  // if (filteredData) {
  //   PDFReportData = filteredData;
  // } else {
  //   PDFReportData = data;
  // }

  const { nomenclators }: any = useAppSelector((state: RootState) => state?.nomenclator);

  nomenclators.map((nomenclator: INomenclator) => {
    if (nomenclator.category === "Tarifa de Servicio") serviceFeeNomenclator.push(nomenclator.code);
  });

  const costSheetNomenclatorFilter: any[] = [];
  serviceFeeNomenclator.map((nomenclator: string) => {
    costSheetNomenclatorFilter.push({
      text: `${nomenclator}`,
      value: `${nomenclator}`,
    });
  });

  const handleView = (): void => {
    if (selectedRow) {
      dispatch(loadSelectedServiceFee(selectedRow._id));
      router.push(`/dashboard/serviceFees/${selectedRow._id}`);
    } else {
      Toast.fire({
        icon: "error",
        title: "Seleccione una ficha de costo para ver",
      });
    }
  };

  const handleSearch = (selectedKeys: string[], confirm: (param?: FilterConfirmProps) => void, dataIndex: DataIndex) => {
    confirm();
    setSearchText(selectedKeys[0]);
    setSearchedColumn(dataIndex);
  };

  const handleDelete = () => {
    if (selectedRow) {
      Swal.fire({
        title: "Eliminar Tarifa de Servicio",
        text: "La tarifa de servicio seleccionada se borrará de forma permanente",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        cancelButtonText: "Cancelar",
        confirmButtonText: "Eliminar",
      }).then((result) => {
        if (result.isConfirmed) {
          const nomenclatorToDelete = nomenclators.find((nomenclator: INomenclator) => nomenclator?.code === selectedRow?.nomenclatorId);
          dispatch(startDeleteServiceFee(selectedRow?._id));
          dispatch(startDeleteNomenclator(nomenclatorToDelete?._id));
        }
      });
    } else {
      Toast.fire({
        icon: "error",
        title: "Seleccione una tarifa de servicio a eliminar",
      });
    }
  };

  const handleReset = (clearFilters: () => void) => {
    clearFilters();
    setSearchText("");
  };

  const onChange: TableProps<IServiceFee>["onChange"] = (pagination, filters, sorter, extra) => {
    setFilteredData(extra.currentDataSource);
    console.log(filteredData);
  };

  const rowSelection: TableRowSelection<IServiceFee> = {
    onChange: async (selectedRowKeys: React.Key[], selectedRows: IServiceFee[]) => {
      setSelectedRow(selectedRows[0]);
      dispatch(loadSelectedServiceFee(selectedRows[0]._id));
      console.log(`selectedRowKeys: ${selectedRowKeys}`, "selectedRow: ", selectedRows);
    },
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
        <Highlighter highlightStyle={{ backgroundColor: "#ffc069", padding: 0 }} searchWords={[searchText]} autoEscape textToHighlight={text ? text.toString() : ""} />
      ) : (
        text
      ),
  });

  const columns: ColumnsType<IServiceFee> = [
    {
      title: "Nombre de la Tarea",
      dataIndex: "taskName",
      key: "taskName",
      width: "40%",
      sorter: (a: any, b: any) => a.taskName.localeCompare(b.taskName),
      ...getColumnSearchProps("taskName"),
    },
    {
      title: "Nomenclador",
      dataIndex: "nomenclatorId",
      key: "nomenclatorId",
      width: "10%",
      filters: costSheetNomenclatorFilter,
      onFilter: (value: any, record: any) => record.nomenclatorId.startsWith(value),
      filterSearch: true,
      sorter: (a: any, b: any) => a.nomenclatorId.localeCompare(b.nomenclatorId),
    },
    {
      title: "Categoría",
      dataIndex: "category",
      key: "category",
      width: "15%",
      filterSearch: true,
    },

    {
      title: "Precio",
      dataIndex: "salePrice",
      key: "salePrice",
      width: "20%",
      render: (text) => <span>$ {parseFloat(text).toFixed(2)}</span>,
      sorter: {
        compare: (a, b) => a.salePrice - b.salePrice,
      },
    },
    {
      title: "Precio USD",
      dataIndex: "salePriceUSD",
      key: "salePriceUSD",
      width: "30%",
      render: (text) => <span>$ {parseFloat(text).toFixed(2)}</span>,
      sorter: {
        compare: (a, b) => a.salePriceUSD - b.salePriceUSD,
      },
    },
    {
      title: "$/UM",
      dataIndex: "valuePerUnitMeasure",
      key: "valuePerUnitMeasure",
      width: "10%",
    },
  ];

  return (
    <>
      <div className="flex h-16 w-full bg-white-100 rounded-md shadow-md mb-4 items-center pl-4 gap-4">
        <div className="flex gap-2">
          <button
            disabled={!canCreate}
            onClick={() => router.push("/dashboard/serviceFees/createServiceFee")}
            className={`${
              canCreate ? "bg-success-500 cursor-pointer hover:bg-success-600 ease-in-out duration-300" : "bg-success-200"
            } w-[6rem] h-[2.5rem] flex items-center p-1 text-base font-bold text-white-100  justify-center gap-2 rounded-md `}
          >
            <PlusSvg />
            Nuevo
          </button>
          <button
            disabled={!canList}
            onClick={handleView}
            className={`${
              canList ? "bg-secondary-500 cursor-pointer hover:bg-secondary-600 ease-in-out duration-300" : "bg-secondary-200"
            } w-[6rem] h-[2.5rem] flex items-center p-1 text-base font-bold text-white-100  justify-center gap-2 rounded-md `}
          >
            <SeeSvg />
            Ver
          </button>
        </div>
        <div className="flex">
          {/* <PDFDownloadLink document={<CostSheetTablePDFReport fields={fields} data={PDFReportData} title={`Fichas de costo`} />} fileName={`Listado de fichas de costo `}>
            {({ blob, url, loading, error }) => (
              <button disabled={loading} className="cursor-pointer hover:bg-white-600 ease-in-out duration-300 rounded-full w-[2.5rem] h-[2.5rem] flex justify-center items-center">
                <PDFSvg />
              </button>
            )}
          </PDFDownloadLink> */}
          <Tooltip placement="top" title={"Eliminar"} arrow={{ pointAtCenter: true }}>
            <button
              disabled={!canDelete}
              className={`${
                canDelete ? "cursor-pointer hover:bg-white-600 ease-in-out duration-300" : "opacity-20 pt-2 pl-2"
              } flex justify-center items-center w-[2.5rem] h-[2.5rem] text-xl rounded-full`}
              onClick={handleDelete}
            >
              <DeleteSvg />
            </button>
          </Tooltip>
          <Tooltip placement="top" title={"Refrescar"} arrow={{ pointAtCenter: true }}>
            <button
              disabled={!canList}
              className={`${
                canList ? "cursor-pointer hover:bg-white-600 ease-in-out duration-300" : "opacity-20 pt-2 pl-2"
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
        pagination={{ position: ["bottomCenter"], pageSize: 15 }}
        rowSelection={{
          type: "radio",
          ...rowSelection,
        }}
        className="shadow-md"
      />
    </>
  );
};

export default ServiceFeeTable;

"use client";

import Highlighter from "react-highlight-words";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { SearchOutlined } from "@ant-design/icons";
import { Button, Input, Space, Table, Tooltip } from "antd";
import type { InputRef } from "antd";
import type { ColumnType, ColumnsType, TableProps } from "antd/es/table";
import type { FilterConfirmProps, TableRowSelection } from "antd/es/table/interface";
import Swal from "sweetalert2";
import dynamic from "next/dynamic";

import { useAppDispatch } from "@/hooks/hooks";
import { RootState, useAppSelector } from "@/store/store";
import { Toast } from "@/helpers/customAlert";
import { useSession } from "next-auth/react";
import { DeleteSvg } from "@/app/global/DeleteSvg";
import { PlusSvg } from "@/app/global/PlusSvg";
import { RefreshSvg } from "@/app/global/RefreshSvg";
import { ICostSheet } from "@/models/costSheet";
import { costSheetsStartLoading, loadSelectedCostSheet, startDeleteCostSheet } from "@/actions/costSheet";
import { useRouter } from "next/navigation";
import { SeeSvg } from "@/app/global/SeeSvg";
import { nomenclatorsStartLoading } from "@/actions/nomenclator";
import { INomenclator } from "@/models/nomenclator";
import { PDFSvg } from "@/app/global/PDFSvg";
import CostSheetTablePDFReport from "@/helpers/CostSheetTablePDFReport";

const PDFDownloadLink = dynamic(() => import("@react-pdf/renderer").then((mod) => mod.PDFDownloadLink), {
  ssr: false,
  loading: () => <p>Loading...</p>,
});

type DataIndex = keyof ICostSheet;

const CostSheetsTable: React.FC = () => {
  const dispatch = useAppDispatch();
  const [searchText, setSearchText] = useState("");
  const [searchedColumn, setSearchedColumn] = useState("");
  const [selectedRow, setSelectedRow] = useState<ICostSheet>();
  const [filteredData, setFilteredData] = useState<ICostSheet[]>();
  const searchInput = useRef<InputRef>(null);
  const router = useRouter();
  const { data: sessionData } = useSession();
  const costSheetCategory: string[] | undefined = [];
  const costSheetNomenclator: string[] | undefined = [];
  const costSheetValuePerUnitMeasure: string[] | undefined = [];

  const canList = sessionData?.user.role.includes("Listar Ficha de Costo");
  const canCreate = sessionData?.user.role.includes("Crear Ficha de Costo");
  // const canEdit = sessionData?.user.role.includes("Editar Ficha de Costo");
  const canDelete = sessionData?.user.role.includes("Eliminar Ficha de Costo");

  const fields = [
    {
      title: " Nomenclador",
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
    dispatch(costSheetsStartLoading());
    dispatch(nomenclatorsStartLoading());
  }, [dispatch]);

  const { costSheets }: any = useAppSelector((state: RootState) => state?.costSheet);
  let data: ICostSheet[] = useMemo(() => costSheets, [costSheets]);
  if (!canList) {
    data = [];
  }

  let PDFReportData: ICostSheet[] = [];

  if (filteredData) {
    PDFReportData = filteredData;
  } else {
    PDFReportData = data;
  }

  const { nomenclators }: any = useAppSelector((state: RootState) => state?.nomenclator);

  nomenclators.map((nomenclator: INomenclator) => {
    if (nomenclator.category === "Categoría de ficha de costo") costSheetCategory.push(nomenclator.code);
    if (nomenclator.category === "Ficha de costo") costSheetNomenclator.push(nomenclator.code);
    if (nomenclator.category === "Precio/UM en ficha de costo") costSheetValuePerUnitMeasure.push(nomenclator.code);
  });

  const costSheetCategoryFilter: any[] = [];
  costSheetCategory.map((category: string) => {
    costSheetCategoryFilter.push({
      text: `${category}`,
      value: `${category}`,
    });
  });
  const costSheetNomenclatorFilter: any[] = [];
  costSheetNomenclator.map((nomenclator: string) => {
    costSheetNomenclatorFilter.push({
      text: `${nomenclator}`,
      value: `${nomenclator}`,
    });
  });
  const costSheetValuePerUnitMeasureFilter: any[] = [];
  costSheetValuePerUnitMeasure.map((valuePerUnitMeasure: string) => {
    costSheetValuePerUnitMeasureFilter.push({
      text: `${valuePerUnitMeasure}`,
      value: `${valuePerUnitMeasure}`,
    });
  });

  const handleView = (): void => {
    if (selectedRow) {
      dispatch(loadSelectedCostSheet(selectedRow._id));
      router.push(`/dashboard/costSheets/${selectedRow._id}`);
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
        title: "Eliminar Ficha de Costo",
        text: "La ficha de costo seleccionada se borrará de forma permanente",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        cancelButtonText: "Cancelar",
        confirmButtonText: "Eliminar",
      }).then((result) => {
        if (result.isConfirmed) {
          dispatch(startDeleteCostSheet(selectedRow?._id));
        }
      });
    } else {
      Toast.fire({
        icon: "error",
        title: "Seleccione una ficha de costo a eliminar",
      });
    }
  };

  const handleReset = (clearFilters: () => void) => {
    clearFilters();
    setSearchText("");
  };

  const onChange: TableProps<ICostSheet>["onChange"] = (pagination, filters, sorter, extra) => {
    setFilteredData(extra.currentDataSource);
    console.log(filteredData);
  };

  const rowSelection: TableRowSelection<ICostSheet> = {
    onChange: async (selectedRowKeys: React.Key[], selectedRows: ICostSheet[]) => {
      setSelectedRow(selectedRows[0]);
      dispatch(loadSelectedCostSheet(selectedRows[0]._id));
      console.log(`selectedRowKeys: ${selectedRowKeys}`, "selectedRow: ", selectedRows);
    },
  };

  const getColumnSearchProps = (dataIndex: DataIndex): ColumnType<ICostSheet> => ({
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

  const columns: ColumnsType<ICostSheet> = [
    {
      title: "Nombre de la Tarea",
      dataIndex: "taskName",
      key: "taskName",
      width: "50%",
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
      width: "20%",
      filters: costSheetCategoryFilter,
      onFilter: (value: any, record: any) => record.category.startsWith(value),
      filterSearch: true,
      sorter: (a: any, b: any) => a.category.localeCompare(b.category),
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
      title: "Precio/UM",
      dataIndex: "valuePerUnitMeasure",
      key: "valuePerUnitMeasure",
      width: "20%",
      filters: costSheetValuePerUnitMeasureFilter,
      onFilter: (value: any, record: any) => record.valuePerUnitMeasure.startsWith(value),
      filterSearch: true,
    },
  ];

  return (
    <>
      <div className="flex h-16 w-full bg-white-100 rounded-md shadow-md mb-4 items-center pl-4 gap-4">
        <div className="flex gap-2">
          <button disabled={!canCreate} onClick={() => router.push("/dashboard/costSheets/createCostSheet")} className={`${canCreate ? "toolbar-primary-icon-btn" : "bg-success-200"}`}>
            <PlusSvg />
            Nuevo
          </button>
          <button disabled={!canList} onClick={handleView} className={`${canList ? "toolbar-secondary-icon-btn" : "bg-secondary-200"}`}>
            <SeeSvg />
            Ver
          </button>
        </div>
        <div className="flex">
          <PDFDownloadLink document={<CostSheetTablePDFReport fields={fields} data={PDFReportData} title={`Fichas de costo`} />} fileName={`Listado de fichas de costo `}>
            {({ blob, url, loading, error }) => (
              <button disabled={loading} className="cursor-pointer hover:bg-white-600 ease-in-out duration-300 rounded-full w-[2.5rem] h-[2.5rem] flex justify-center items-center">
                <PDFSvg />
              </button>
            )}
          </PDFDownloadLink>
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
              onClick={() => dispatch(costSheetsStartLoading())}
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

export default CostSheetsTable;

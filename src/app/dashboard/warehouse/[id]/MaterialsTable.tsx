"use client";

import Highlighter from "react-highlight-words";
import React, { useEffect, useMemo, useRef, useState } from "react";
import moment from "moment";
import Swal from "sweetalert2";
import { Button, Input, Space, Table, Tooltip } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import type { InputRef } from "antd";
import type { ColumnType, ColumnsType, TableProps } from "antd/es/table";
import type { FilterConfirmProps, TableRowSelection } from "antd/es/table/interface";
import dynamic from "next/dynamic";
import { useSession } from "next-auth/react";
import { usePathname } from "next/navigation";

import { useAppDispatch } from "@/hooks/hooks";
import { RootState, useAppSelector } from "@/store/store";
import { Toast } from "@/helpers/customAlert";
import { editMaterial, materialsStartLoading, startAddMaterial, startDeleteMaterial } from "@/actions/material";
import { NewMaterialForm } from "./NewMaterialForm";
import { AddMaterialForm } from "./AddMaterialForm";
import { IOperation } from "@/models/operation";
import { MinusMaterialForm } from "./MinusMaterialForm";
import { OperationsList } from "./OperationsListModal";
import { nomenclatorsStartLoading } from "@/actions/nomenclator";
import { EditMaterialForm } from "./EditMaterialForm";
import { PlusSvg } from "../../../global/PlusSvg";
import { MinusSvg } from "../../../global/MinusSvg";
import { EditSvg } from "../../../global/EditSvg";
import { DeleteSvg } from "../../../global/DeleteSvg";
import { RefreshSvg } from "../../../global/RefreshSvg";
import { ListSvg } from "../../../global/ListSvg";
import { PDFSvg } from "@/app/global/PDFSvg";
import { INomenclator } from "@/models/nomenclator";
import PDFReport from "@/helpers/PDFReport";

const PDFDownloadLink = dynamic(() => import("@react-pdf/renderer").then((mod) => mod.PDFDownloadLink), {
  ssr: false,
  loading: () => <p>Loading...</p>,
});
interface DataType {
  _id: string;
  category: string;
  code: string;
  costPerUnit: number;
  description: string;
  enterDate: string;
  key: string;
  materialName: string;
  minimumExistence: number;
  operations: [IOperation];
  provider: string;
  unitMeasure: string;
  unitsTotal: number;
}

type DataIndex = keyof DataType;

let date = moment();
let currentDate = date.format("L");

const MaterialsTable: React.FC = () => {
  const dispatch = useAppDispatch();
  const [searchText, setSearchText] = useState("");
  const [searchedColumn, setSearchedColumn] = useState("");
  const [createNewModal, setCreateNewModal] = useState(false);
  const [editMaterialModal, setEditMaterialModal] = useState(false);
  const [addModal, setAddModal] = useState(false);
  const [minusModal, setMinusModal] = useState(false);
  const [showOperationsModal, setShowOperationModal] = useState(false);
  const [selectedRow, setSelectedRow] = useState<DataType>();
  const [filteredData, setFilteredData] = useState<DataType[]>();
  const searchInput = useRef<InputRef>(null);
  const materialCategory: string[] | undefined = [];
  const { data: sessionData } = useSession();

  const canList = sessionData?.user.role.includes("Listar Materiales");
  const canCreate = sessionData?.user.role.includes("Nuevo Material");
  const canEditMinimumExistences = sessionData?.user.role.includes("Editar Existencias Mínimas");
  const canDelete = sessionData?.user.role.includes("Eliminar Material");
  const canAdd = sessionData?.user.role.includes("Añadir Material");
  const canMinus = sessionData?.user.role.includes("Sustraer Material");

  const url = usePathname().split("/");
  const selectedWarehouse: string = url[3];
  useEffect(() => {
    dispatch(materialsStartLoading(selectedWarehouse));
    dispatch(nomenclatorsStartLoading());
  }, [dispatch, selectedWarehouse]);

  const fields = [
    {
      title: " Categoría",
      custom: true,
      component: (item: any) => `${item.category}`,
      width: "20",
    },
    {
      title: " Nombre",
      custom: true,
      component: (item: any) => `${item.materialName}`,
      width: "20",
    },
    {
      title: " Descripción",
      custom: true,
      component: (item: any) => `${item.description}`,
      width: "20",
    },
    {
      title: " Coste Unitario",
      custom: true,
      component: (item: any) => `$ ${item.costPerUnit.toFixed(2)}`,
      width: "10",
    },
    {
      title: " Existencias",
      custom: true,
      component: (item: any) => `${item.unitsTotal}`,
      width: "10",
    },
    {
      title: " Proveedor",
      custom: true,
      component: (item: any) => `${item.provider}`,
      width: "10",
    },
    {
      title: " Unidad de Medida",
      custom: true,
      component: (item: any) => `${item.unitMeasure}`,
      width: "10",
    },
  ];

  const { materials } = useAppSelector((state: RootState) => state?.material);
  let data: DataType[] = useMemo(() => materials, [materials]);
  if (!canList) {
    data = [];
  }

  const { nomenclators }: any = useAppSelector((state: RootState) => state?.nomenclator);

  nomenclators.map((nomenclator: INomenclator) => {
    if (nomenclator.category === "Categoría de material") materialCategory.push(nomenclator.code);
  });

  const categoryFilter: any[] = [];
  materialCategory.map((category: string) => {
    categoryFilter.push({
      text: `${category}`,
      value: `${category}`,
    });
  });

  let PDFReportData: DataType[] = [];

  if (filteredData) {
    PDFReportData = filteredData;
  } else {
    PDFReportData = data;
  }

  const handleNew = (): void => {
    setCreateNewModal(true);
  };
  const handleAdd = (): void => {
    if (selectedRow) {
      setAddModal(true);
    } else {
      Toast.fire({
        icon: "error",
        title: "Seleccione un material para añadir",
      });
    }
  };
  const handleMinus = (): void => {
    if (selectedRow) {
      setMinusModal(true);
    } else {
      Toast.fire({
        icon: "error",
        title: "Seleccione un material para sustraer",
      });
    }
  };
  const handleShowOperations = (): void => {
    if (selectedRow) {
      setShowOperationModal(true);
    } else {
      Toast.fire({
        icon: "error",
        title: "Seleccione el material que desea ver sus operaciones",
      });
    }
  };

  const handleEditMaterial = (): void => {
    if (selectedRow) {
      setEditMaterialModal(true);
    } else {
      Toast.fire({
        icon: "error",
        title: "Seleccione un material a editar",
      });
    }
  };

  const handleRefresh = () => {
    dispatch(materialsStartLoading(selectedWarehouse));
  };

  const handleSearch = (selectedKeys: string[], confirm: (param?: FilterConfirmProps) => void, dataIndex: DataIndex) => {
    confirm();
    setSearchText(selectedKeys[0]);
    setSearchedColumn(dataIndex);
  };

  const handleDelete = () => {
    if (selectedRow) {
      Swal.fire({
        title: "Eliminar Material",
        text: "El material seleccionado se borrará de forma permanente",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        cancelButtonText: "Cancelar",
        confirmButtonText: "Eliminar",
      }).then((result) => {
        if (result.isConfirmed) {
          dispatch(startDeleteMaterial(selectedRow?.code, selectedWarehouse));
        }
      });
    } else {
      Toast.fire({
        icon: "error",
        title: "Seleccione un material a eliminar",
      });
    }
  };

  const handleReset = (clearFilters: () => void) => {
    clearFilters();
    setSearchText("");
  };

  const onCreate = (values: any): void => {
    let operation: IOperation = {
      date: currentDate,
      tipo: "Añadir",
      amount: values.unitsTotal,
    };
    dispatch(
      startAddMaterial(
        values.category,
        values.costPerUnit,
        values.description,
        values.enterDate.format("MM/DD/YYYY"),
        values.materialName,
        values.minimumExistence,
        operation,
        values.provider,
        values.unitMeasure,
        selectedWarehouse,
      )
    );
    setCreateNewModal(false);
  };

  const onAdd = (values: any): void => {
    console.log("🚀 ~ file: MaterialsTable.tsx:232 ~ onAdd ~ values:", values);
    let operation: IOperation = {
      date: currentDate,
      tipo: "Añadir",
      amount: values.unitsTotal,
    };
    dispatch(
      startAddMaterial(
        values.category,
        values.costPerUnit,
        values.description,
        currentDate,
        values.materialName,
        values.minimumExistence,
        operation,
        values.provider,
        values.unitMeasure,
        selectedWarehouse
      )
    );
    setAddModal(false);
  };

  const onMinus = (values: any): void => {
    let operation: IOperation = {
      date: currentDate,
      tipo: "Sustraer",
      amount: values.unitsTotal,
    };
    dispatch(startAddMaterial(
      values.category,
      values.costPerUnit,
      values.description,
      currentDate,
      values.materialName,
      values.minimumExistence,
      operation,
      values.provider,
      values.unitMeasure,
      selectedWarehouse
      ));
    setMinusModal(false);
  };

  const onEditMaterial = (values: any): void => {
    dispatch(editMaterial(
      values.code, 
      values.description,
      values.materialName, 
      values.minimumExistence, 
      selectedWarehouse
      ));
    setEditMaterialModal(false);
  };

  const onChange: TableProps<DataType>["onChange"] = (pagination, filters, sorter, extra) => {
    setFilteredData(extra.currentDataSource);
    console.log(filteredData);
  };

  const rowSelection: TableRowSelection<DataType> = {
    onChange: async (selectedRowKeys: React.Key[], selectedRows: DataType[]) => {
      setSelectedRow(selectedRows[0]);
      console.log(`selectedRowKeys: ${selectedRowKeys}`, "selectedRow: ", selectedRows);
    },
  };

  const getColumnSearchProps = (dataIndex: DataIndex): ColumnType<DataType> => ({
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

  const columns: ColumnsType<DataType> = [
    {
      title: "Código",
      dataIndex: "code",
      key: "code",
      width: "5%",
      // ...getColumnSearchProps("code"),
    },
    {
      title: "Categoría",
      dataIndex: "category",
      key: "category",
      filters: categoryFilter,
      onFilter: (value: any, record: any) => record.category.startsWith(value),
      filterSearch: true,
      width: "15%",
    },
    {
      title: "Nombre",
      dataIndex: "materialName",
      key: "materialName",
      width: "15%",
      ...getColumnSearchProps("materialName"),
    },
    {
      title: "Descripción",
      dataIndex: "description",
      key: "description",
      width: "15%",
      // ...getColumnSearchProps("description"),
    },
    {
      title: "Coste Unitario",
      dataIndex: "costPerUnit",
      key: "costPerUnit",
      width: "10%",
      sorter: {
        compare: (a, b) => a.costPerUnit - b.costPerUnit,
      },
      render: (text) => <span>$ {parseFloat(text).toFixed(2)}</span>,
    },
    {
      title: "Existencias",
      dataIndex: "unitsTotal",
      key: "unitsTotal",
      width: "5%",
      sorter: {
        compare: (a, b) => a.unitsTotal - b.unitsTotal,
      },
      ...getColumnSearchProps("unitsTotal"),
    },
    {
      title: "Unidad de Medida",
      dataIndex: "unitMeasure",
      key: "unitMeasure",
      width: "10%",
      ...getColumnSearchProps("unitMeasure"),
    },
    {
      title: "Existencias Mínimas",
      dataIndex: "minimumExistence",
      key: "minimumExistence",
      width: "5%",
      ...getColumnSearchProps("minimumExistence"),
    },
    {
      title: "Proveedor",
      dataIndex: "provider",
      key: "provider",
      width: "10%",
      sorter: (a: any, b: any) => a.provider.localeCompare(b.provider),
      ...getColumnSearchProps("provider"),
    },
    {
      title: "Fecha de Entrada",
      dataIndex: "enterDate",
      key: "enterDate",
      width: "8%",
      ...getColumnSearchProps("enterDate"),
    },
  ];

  return (
    <>
      <div className="flex h-16 w-full bg-white-100 rounded-md shadow-md mb-4 items-center pl-4 gap-4">
        <div className="flex gap-2">
          <button
            disabled={!canAdd}
            onClick={handleAdd}
            className={`${
              canCreate ? "bg-success-500 cursor-pointer hover:bg-success-600 ease-in-out duration-300" : "bg-success-200"
            } w-[6rem] h-[2.5rem] flex items-center p-1 text-base font-bold text-white-100  justify-center gap-2 rounded-md `}
          >
            <PlusSvg />
            Añadir
          </button>
          <button
            disabled={!canMinus}
            onClick={handleMinus}
            className={`${
              canCreate ? "bg-danger-500 cursor-pointer hover:bg-danger-600 ease-in-out duration-300" : "bg-danger-200"
            } w-[6rem] h-[2.5rem] flex items-center p-1 pr-2 text-base font-bold text-white-100 justify-center gap-2 rounded-md `}
          >
            <MinusSvg />
            Sustraer
          </button>
        </div>
        <div className="flex">
          <Tooltip placement="top" title={"Nuevo Material"} arrow={{ pointAtCenter: true }}>
            <button
              disabled={!canCreate}
              className={`${
                canCreate ? "cursor-pointer hover:bg-white-600 ease-in-out duration-300" : "opacity-20 pt-2 pl-2"
              } flex justify-center items-center w-[2.5rem] h-[2.5rem] text-xl rounded-full`}
              onClick={handleNew}
            >
              <PlusSvg />
            </button>
          </Tooltip>
          <Tooltip placement="top" title={"Editar Material"} arrow={{ pointAtCenter: true }}>
            <button
              disabled={!canEditMinimumExistences}
              className={`${
                canEditMinimumExistences ? "cursor-pointer hover:bg-white-600 ease-in-out duration-300" : "opacity-20 pt-2 pl-2"
              } flex justify-center items-center w-[2.5rem] h-[2.5rem] text-xl rounded-full`}
              onClick={handleEditMaterial}
            >
              <EditSvg />
            </button>
          </Tooltip>

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
              onClick={handleRefresh}
            >
              <RefreshSvg />
            </button>
          </Tooltip>
          <Tooltip placement="top" title={"Historial de Operaciones"} arrow={{ pointAtCenter: true }}>
            <button
              disabled={!canList}
              className={`${
                canList ? "cursor-pointer hover:bg-white-600 ease-in-out duration-300" : "opacity-20 pt-2 pl-2"
              } flex justify-center items-center w-[2.5rem] h-[2.5rem] text-xl rounded-full`}
              onClick={handleShowOperations}
            >
              <ListSvg />
            </button>
          </Tooltip>
          <Tooltip placement="top" title={"Generar Reporte"} arrow={{ pointAtCenter: true }}>
            <PDFDownloadLink document={<PDFReport fields={fields} data={PDFReportData} title={"Reporte de almacén "} />} fileName="Reporte de almacén">
              {({ blob, url, loading, error }) =>
                loading ? (
                  <button disabled className={`opacity-20 pt-2 pl-2" flex justify-center items-center w-[2.5rem] h-[2.5rem] text-xl rounded-full`}>
                    <PDFSvg />
                  </button>
                ) : (
                  <button
                    disabled={!canList}
                    className={`${
                      canList ? "cursor-pointer hover:bg-white-600 ease-in-out duration-300" : "opacity-20 pt-2 pl-2"
                    } flex justify-center items-center w-[2.5rem] h-[2.5rem] text-xl rounded-full`}
                  >
                    <PDFSvg />
                  </button>
                )
              }
            </PDFDownloadLink>
          </Tooltip>
        </div>
      </div>

      <NewMaterialForm open={createNewModal} onCancel={() => setCreateNewModal(false)} onCreate={onCreate} />
      <AddMaterialForm open={addModal} onCancel={() => setAddModal(false)} onCreate={onAdd} defaultValues={selectedRow} />
      <MinusMaterialForm open={minusModal} onCancel={() => setMinusModal(false)} onCreate={onMinus} defaultValues={selectedRow} />
      <EditMaterialForm open={editMaterialModal} onCancel={() => setEditMaterialModal(false)} onCreate={onEditMaterial} defaultValues={selectedRow} />
      <OperationsList open={showOperationsModal} onCancel={() => setShowOperationModal(false)} onCreate={onMinus} defaultValues={selectedRow} />

      <Table
        size="small"
        columns={columns}
        dataSource={data}
        pagination={{ position: ["bottomCenter"], pageSize: 15 }}
        onChange={onChange}
        rowSelection={{
          type: "radio",
          ...rowSelection,
        }}
        className="shadow-md"
      />
    </>
  );
};

export default MaterialsTable;

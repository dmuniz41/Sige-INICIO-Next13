"use client";

import { Button, Input, Space, Table, Tooltip } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import { usePathname } from "next/navigation";
import { useSession } from "next-auth/react";
import dynamic from "next/dynamic";
import Highlighter from "react-highlight-words";
import moment from "moment";
import React, { useEffect, useMemo, useRef, useState } from "react";
import Swal from "sweetalert2";
import type { ColumnType, ColumnsType, TableProps } from "antd/es/table";
import type { FilterConfirmProps, TableRowSelection } from "antd/es/table/interface";
import type { InputRef } from "antd";

import { AddMaterialForm } from "./AddMaterialForm";
import { DeleteSvg } from "../../../global/DeleteSvg";
import {
  editMaterial,
  materialsStartLoading,
  startAddMaterial,
  startDeleteMaterial
} from "@/actions/material";
import { EditMaterialForm } from "./EditMaterialForm";
import { EditSvg } from "../../../global/EditSvg";
import { INomenclator } from "@/models/nomenclator";
import { IOperation } from "@/models/operation";
import { ListSvg } from "../../../global/ListSvg";
import { MinusMaterialForm } from "./MinusMaterialForm";
import { MinusSvg } from "../../../global/MinusSvg";
import { NewMaterialForm } from "./NewMaterialForm";
import { nomenclatorsStartLoading } from "@/actions/nomenclator";
import { OperationsList } from "./OperationsListModal";
import { PDFSvg } from "@/app/global/PDFSvg";
import { PlusSvg } from "../../../global/PlusSvg";
import { RefreshSvg } from "../../../global/RefreshSvg";
import { RootState, useAppSelector } from "@/store/store";
import { Toast } from "@/helpers/customAlert";
import { useAppDispatch } from "@/hooks/hooks";
import PDFReport from "@/helpers/PDFReport";
import { materialNomenclatorsStartLoading } from "@/actions/nomenclators/material";

const PDFDownloadLink = dynamic(
  () => import("@react-pdf/renderer").then((mod) => mod.PDFDownloadLink),
  {
    ssr: false,
    loading: () => <p>Loading...</p>
  }
);
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
  const { data: sessionData } = useSession();

  const canList = sessionData?.user.role.includes("Listar Materiales");
  const canCreate = sessionData?.user.role.includes("Nuevo Material");
  const canEditMaterial = sessionData?.user.role.includes("Editar Material");
  const canDelete = sessionData?.user.role.includes("Eliminar Material");
  const canAdd = sessionData?.user.role.includes("Añadir Material");
  const canMinus = sessionData?.user.role.includes("Sustraer Material");

  const url = usePathname().split("/");
  const selectedWarehouse: string = url[3];

  useEffect(() => {
    dispatch(materialsStartLoading(selectedWarehouse));
    dispatch(nomenclatorsStartLoading());
    dispatch(materialNomenclatorsStartLoading());
  }, [dispatch, selectedWarehouse]);

  const fields = [
    {
      title: "Categoría",
      custom: true,
      component: (item: any) => `${item.category}`,
      width: "20"
    },
    {
      title: "Nombre",
      custom: true,
      component: (item: any) => `${item.materialName}`,
      width: "15"
    },
    {
      title: "Descripción",
      custom: true,
      component: (item: any) => `${item.description}`,
      width: "15"
    },
    {
      title: "Coste Unitario",
      custom: true,
      component: (item: any) =>
        `$ ${item.costPerUnit.toLocaleString("DE", {
          maximumFractionDigits: 2,
          minimumFractionDigits: 2
        })}`,
      width: "15"
    },
    {
      title: "Existencias",
      custom: true,
      component: (item: any) =>
        `${item.unitsTotal.toLocaleString("DE", {
          maximumFractionDigits: 2,
          minimumFractionDigits: 2
        })}`,
      width: "10"
    },
    {
      title: "U/M",
      custom: true,
      component: (item: any) => `${item.unitMeasure}`,
      width: "15"
    },
    {
      title: "Proveedor",
      custom: true,
      component: (item: any) => `${item.provider}`,
      width: "10"
    }
  ];

  const { materials } = useAppSelector((state: RootState) => state?.material);
  let data: DataType[] = useMemo(() => materials, [materials]);
  if (!canList) {
    data = [];
  }

  const { nomenclators }: any = useAppSelector((state: RootState) => state?.nomenclator);

  const categoryFilter: any[] = [];
  nomenclators.map((nomenclator: INomenclator) => {
    if (nomenclator.category === "Categoría de material") {
      categoryFilter.push({
        text: `${nomenclator.code}`,
        value: `${nomenclator.code}`
      });
    }
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
        title: "Seleccione un material para añadir"
      });
    }
  };

  const handleMinus = (): void => {
    if (selectedRow) {
      setMinusModal(true);
    } else {
      Toast.fire({
        icon: "error",
        title: "Seleccione un material para sustraer"
      });
    }
  };

  const handleShowOperations = (): void => {
    if (selectedRow) {
      setShowOperationModal(true);
    } else {
      Toast.fire({
        icon: "error",
        title: "Seleccione el material que desea ver sus operaciones"
      });
    }
  };

  const handleEditMaterial = (): void => {
    if (selectedRow) {
      setEditMaterialModal(true);
    } else {
      Toast.fire({
        icon: "error",
        title: "Seleccione un material a editar"
      });
    }
  };

  const handleRefresh = (): void => {
    dispatch(materialsStartLoading(selectedWarehouse));
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

  const handleDelete = (): void => {
    if (selectedRow) {
      Swal.fire({
        title: "Eliminar Material",
        text: "El material seleccionado se borrará de forma permanente",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        cancelButtonText: "Cancelar",
        confirmButtonText: "Eliminar"
      }).then((result) => {
        if (result.isConfirmed) {
          dispatch(startDeleteMaterial(selectedRow?.code, selectedWarehouse));
        }
      });
    } else {
      Toast.fire({
        icon: "error",
        title: "Seleccione un material a eliminar"
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
      amount: values.unitsTotal
    };

    dispatch(
      startAddMaterial({
        category: values.category,
        costPerUnit: values.costPerUnit,
        description: values.description,
        enterDate: values.enterDate.format("MM/DD/YYYY"),
        materialName: values.materialName,
        minimumExistence: values.minimumExistence,
        operation: operation,
        provider: values.provider,
        unitMeasure: values.unitMeasure,
        warehouse: selectedWarehouse
      })
    );
    setCreateNewModal(false);
  };

  const onAdd = (values: any): void => {
    let operation: IOperation = {
      date: currentDate,
      tipo: "Añadir",
      amount: values.unitsTotal
    };
    dispatch(
      startAddMaterial({
        category: values.category,
        costPerUnit: values.costPerUnit,
        description: values.description,
        currentDate: currentDate,
        materialName: values.materialName,
        minimumExistence: values.minimumExistence,
        operation: operation,
        provider: values.provider,
        unitMeasure: values.unitMeasure,
        warehouse: selectedWarehouse
      })
    );
    setAddModal(false);
  };

  const onMinus = (values: any): void => {
    let operation: IOperation = {
      date: currentDate,
      tipo: "Sustraer",
      amount: values.unitsTotal
    };
    dispatch(
      startAddMaterial({
        category: values.category,
        costPerUnit: values.costPerUnit,
        description: values.description,
        currentDate: currentDate,
        materialName: values.materialName,
        minimumExistence: values.minimumExistence,
        operation: operation,
        provider: values.provider,
        unitMeasure: values.unitMeasure,
        warehouse: selectedWarehouse
      })
    );
    setMinusModal(false);
  };

  const onEditMaterial = (values: any): void => {
    dispatch(
      editMaterial(
        selectedRow?.category!,
        values.code,
        values.description,
        values.materialName,
        values.minimumExistence,
        selectedWarehouse
      )
    );
    setEditMaterialModal(false);
  };

  const onChange: TableProps<DataType>["onChange"] = (pagination, filters, sorter, extra) => {
    setFilteredData(extra.currentDataSource);
  };

  const rowSelection: TableRowSelection<DataType> = {
    onChange: async (selectedRowKeys: React.Key[], selectedRows: DataType[]) => {
      setSelectedRow(selectedRows[0]);
    }
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

  const columns: ColumnsType<DataType> = [
    {
      title: <span className="font-bold">Código</span>,
      dataIndex: "code",
      key: "code",
      width: "5%"
    },
    {
      title: <span className="font-bold">Categoría</span>,
      dataIndex: "category",
      key: "category",
      filters: categoryFilter,
      onFilter: (value: any, record: any) => record.category.startsWith(value),
      filterSearch: true,
      width: "15%"
    },
    {
      title: <span className="font-bold">Nombre</span>,
      dataIndex: "materialName",
      key: "materialName",
      width: "15%",
      ...getColumnSearchProps("materialName")
    },
    {
      title: <span className="font-bold">Descripción</span>,
      dataIndex: "description",
      key: "description",
      width: "15%"
    },
    {
      title: <span className="font-bold">Coste Unitario</span>,
      dataIndex: "costPerUnit",
      key: "costPerUnit",
      width: "10%",
      sorter: {
        compare: (a, b) => a.costPerUnit - b.costPerUnit
      },
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
      title: <span className="font-bold">Existencias</span>,
      dataIndex: "unitsTotal",
      key: "unitsTotal",
      width: "5%",
      render: (value) => (
        <span>
          {value.toLocaleString("DE", {
            maximumFractionDigits: 2,
            minimumFractionDigits: 2
          })}
        </span>
      ),
      sorter: {
        compare: (a, b) => a.unitsTotal - b.unitsTotal
      }
    },
    {
      title: <span className="font-bold">Unidad de Medida</span>,
      dataIndex: "unitMeasure",
      key: "unitMeasure",
      width: "10%"
    },
    {
      title: <span className="font-bold">Existencias Mínimas</span>,
      dataIndex: "minimumExistence",
      key: "minimumExistence",
      width: "5%",
      render: (value) => (
        <span>
          {value.toLocaleString("DE", {
            maximumFractionDigits: 2,
            minimumFractionDigits: 2
          })}
        </span>
      )
    },
    {
      title: <span className="font-bold">Proveedor</span>,
      dataIndex: "provider",
      key: "provider",
      width: "10%",
      sorter: (a: any, b: any) => a.provider.localeCompare(b.provider),
      ...getColumnSearchProps("provider")
    },
    {
      title: <span className="font-bold">Fecha de Entrada</span>,
      dataIndex: "enterDate",
      key: "enterDate",
      width: "8%",
      ...getColumnSearchProps("enterDate")
    }
  ];

  return (
    <>
      <div className="flex h-16 w-full bg-white-100 rounded-md shadow-md mb-4 items-center pl-4 gap-4">
        <div className="flex gap-2">
          <button disabled={!canAdd} onClick={handleAdd} className="toolbar-primary-icon-btn ">
            <PlusSvg />
            Añadir
          </button>
          <button disabled={!canMinus} onClick={handleMinus} className="toolbar-danger-icon-btn ">
            <MinusSvg />
            Sustraer
          </button>
        </div>
        <div className="flex">
          <Tooltip placement="top" title={"Nuevo Material"} arrow={{ pointAtCenter: true }}>
            <button
              disabled={!canCreate}
              className={`${
                canCreate
                  ? "cursor-pointer hover:bg-white-600 ease-in-out duration-300"
                  : "opacity-20 pt-2 pl-2"
              } flex justify-center items-center w-[2.5rem] h-[2.5rem] text-xl rounded-full`}
              onClick={handleNew}
            >
              <PlusSvg />
            </button>
          </Tooltip>
          <Tooltip placement="top" title={"Editar Material"} arrow={{ pointAtCenter: true }}>
            <button
              disabled={!canEditMaterial}
              className={`${
                canEditMaterial
                  ? "cursor-pointer hover:bg-white-600 ease-in-out duration-300"
                  : "opacity-20 pt-2 pl-2"
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
                canDelete
                  ? "cursor-pointer hover:bg-white-600 ease-in-out duration-300"
                  : "opacity-20 pt-2 pl-2"
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
                canList
                  ? "cursor-pointer hover:bg-white-600 ease-in-out duration-300"
                  : "opacity-20 pt-2 pl-2"
              } flex justify-center items-center w-[2.5rem] h-[2.5rem] text-xl rounded-full`}
              onClick={handleRefresh}
            >
              <RefreshSvg />
            </button>
          </Tooltip>
          <Tooltip
            placement="top"
            title={"Historial de Operaciones"}
            arrow={{ pointAtCenter: true }}
          >
            <button
              disabled={!canList}
              className={`${
                canList
                  ? "cursor-pointer hover:bg-white-600 ease-in-out duration-300"
                  : "opacity-20 pt-2 pl-2"
              } flex justify-center items-center w-[2.5rem] h-[2.5rem] text-xl rounded-full`}
              onClick={handleShowOperations}
            >
              <ListSvg />
            </button>
          </Tooltip>
          <Tooltip placement="top" title={"Generar Reporte"} arrow={{ pointAtCenter: true }}>
            <PDFDownloadLink
              document={
                <PDFReport fields={fields} data={PDFReportData} title={"REPORTE DE ALMACÉN "} />
              }
              fileName={`Reporte de almacén (${currentDate})`}
            >
              {({ blob, url, loading, error }) =>
                !canList ? (
                  <button
                    disabled
                    className={`opacity-20 pt-2 pl-2" flex justify-center items-center w-[2.5rem] h-[2.5rem] text-xl rounded-full`}
                  >
                    <PDFSvg />
                  </button>
                ) : (
                  <button
                    disabled={!canList}
                    className={`${
                      canList
                        ? "cursor-pointer hover:bg-white-600 ease-in-out duration-300"
                        : "opacity-20 pt-2 pl-2"
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

      <NewMaterialForm
        open={createNewModal}
        onCancel={() => setCreateNewModal(false)}
        onCreate={onCreate}
      />
      <AddMaterialForm
        open={addModal}
        onCancel={() => setAddModal(false)}
        onCreate={onAdd}
        defaultValues={selectedRow}
      />
      <MinusMaterialForm
        open={minusModal}
        onCancel={() => setMinusModal(false)}
        onCreate={onMinus}
        defaultValues={selectedRow}
      />
      <EditMaterialForm
        open={editMaterialModal}
        onCancel={() => setEditMaterialModal(false)}
        onCreate={onEditMaterial}
        defaultValues={selectedRow}
      />
      <OperationsList
        open={showOperationsModal}
        onCancel={() => setShowOperationModal(false)}
        onCreate={onMinus}
        defaultValues={selectedRow}
      />

      <Table
        size="small"
        columns={columns}
        dataSource={data}
        pagination={{ position: ["bottomCenter"], defaultPageSize: 20 }}
        onChange={onChange}
        rowSelection={{
          type: "radio",
          ...rowSelection
        }}
        className="shadow-md"
      />
    </>
  );
};

export default MaterialsTable;

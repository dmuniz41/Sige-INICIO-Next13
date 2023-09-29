"use client";

import Highlighter from "react-highlight-words";
import React, { useEffect, useMemo, useRef, useState } from "react";
import moment from "moment";
import Swal from "sweetalert2";
import { Button, Input, Space, Table, Tooltip } from "antd";
import { DeleteOutlined, MinusOutlined, OrderedListOutlined, PlusOutlined, ReloadOutlined, SearchOutlined, UnorderedListOutlined } from "@ant-design/icons";
import type { InputRef } from "antd";
import type { ColumnType, ColumnsType } from "antd/es/table";
import type { FilterConfirmProps, TableRowSelection } from "antd/es/table/interface";

import { useAppDispatch } from "@/hooks/hooks";
import { RootState, useAppSelector } from "@/store/store";
import { Toast } from "@/helpers/customAlert";
import { editMinimumExistences, materialsStartLoading, startAddMaterial, startDeleteMaterial } from "@/actions/material";
import { NewMaterialForm } from "./NewMaterialForm";
import { AddMaterialForm } from "./AddMaterialForm";
import { IOperation } from "@/models/operation";
import { MinusMaterialForm } from "./MinusMaterialForm";
import { OperationsList } from "./OperationsListModal";
import { usePathname } from "next/navigation";
import { nomenclatorsStartLoading } from "@/actions/nomenclator";
import { EditMinimumExistencesForm } from "./EditMinimumExistencesForm";
import { useSession } from "next-auth/react";
import { PlusSvg } from "../../../global/PlusSvg";
import { MinusSvg } from "../../../global/MinusSvg";
import { EditSvg } from "../../../global/EditSvg";
import { DeleteSvg } from "../../../global/DeleteSvg";
import { RefreshSvg } from "../../../global/RefreshSvg";
import { ListSvg } from "../../../global/ListSvg";
interface DataType {
  _id: string;
  code: string;
  key: string;
  materialName: string;
  enterDate: string;
  category: string;
  costPerUnit: number;
  unitsTotal: number;
  minimumExistence: number;
  unitMeasure: string;
  operations: [IOperation];
}

type DataIndex = keyof DataType;

let date = moment();
let currentDate = date.format("L");

const MaterialsTable: React.FC = () => {
  const dispatch = useAppDispatch();
  const [searchText, setSearchText] = useState("");
  const [searchedColumn, setSearchedColumn] = useState("");
  const [createNewModal, setCreateNewModal] = useState(false);
  const [editMinimumExistencesModal, setEditMinimumExistencesModal] = useState(false);
  const [addModal, setAddModal] = useState(false);
  const [minusModal, setMinusModal] = useState(false);
  const [showOperationsModal, setShowOperationModal] = useState(false);
  const [selectedRow, setSelectedRow] = useState<DataType>();
  const searchInput = useRef<InputRef>(null);
  const { data: sessionData } = useSession();

  const canList = sessionData?.user.role.includes("Listar Materiales");
  const canCreate = sessionData?.user.role.includes("Nuevo Material");
  const canEditMinimumExistences = sessionData?.user.role.includes("Editar Existencias Mínimas");
  const canDelete = sessionData?.user.role.includes("Eliminar Material");
  const canAdd = sessionData?.user.role.includes("Añadir Material");
  const canMinus = sessionData?.user.role.includes("Sustraer Material");

  const { materials } = useAppSelector((state: RootState) => state?.material);
  let data: DataType[] = useMemo(() => materials, [materials]);
  if (!canList) {
    data = [];
  }

  const url = usePathname().split("/");
  const selectedWarehouse: string = url[3];

  useEffect(() => {
    dispatch(materialsStartLoading(selectedWarehouse));
    dispatch(nomenclatorsStartLoading());
  }, [dispatch, selectedWarehouse]);

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

  const handleEditMinimumExistences = (): void => {
    if (selectedRow) {
      setEditMinimumExistencesModal(true);
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
    dispatch(startAddMaterial(selectedWarehouse, operation, values.materialName, values.category, values.unitMeasure, values.costPerUnit, values.minimumExistence));
    setCreateNewModal(false);
  };

  const onAdd = (values: any): void => {
    let operation: IOperation = {
      date: currentDate,
      tipo: "Añadir",
      amount: values.unitsTotal,
    };
    dispatch(startAddMaterial(selectedWarehouse, operation, values.materialName, values.category, values.unitMeasure, values.costPerUnit, values.minimumExistence));
    setAddModal(false);
  };

  const onMinus = (values: any): void => {
    let operation: IOperation = {
      date: currentDate,
      tipo: "Sustraer",
      amount: values.unitsTotal,
    };
    dispatch(startAddMaterial(selectedWarehouse, operation, values.materialName, values.category, values.unitMeasure, values.costPerUnit, values.minimumExistence));
    setMinusModal(false);
  };
  const onEditMinimumExistences = (values: any): void => {
    dispatch(editMinimumExistences(values.code, values.minimumExistence, selectedWarehouse));
    console.log("🚀 ~ file: MaterialsTable.tsx:147 ~ onEditMinimumExistences ~ values.code, values.minimumExistence:", values.code, values.minimumExistence);
    // setSelectedRow(undefined);
    setEditMinimumExistencesModal(false);
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
      width: "20%",
      ...getColumnSearchProps("code"),
    },
    {
      title: "Categoría",
      dataIndex: "category",
      key: "category",
      width: "15%",
      ...getColumnSearchProps("category"),
    },
    {
      title: "Nombre",
      dataIndex: "materialName",
      key: "materialName",
      width: "15%",
      ...getColumnSearchProps("materialName"),
    },
    {
      title: "Coste Unitario",
      dataIndex: "costPerUnit",
      key: "costPerUnit",
      width: "10%",
      sorter: {
        compare: (a, b) => a.costPerUnit - b.costPerUnit,
      },
      ...getColumnSearchProps("costPerUnit"),
    },
    {
      title: "Existencias",
      dataIndex: "unitsTotal",
      key: "unitsTotal",
      width: "10%",
      sorter: {
        compare: (a, b) => a.unitsTotal - b.unitsTotal,
      },
      ...getColumnSearchProps("unitsTotal"),
    },
    {
      title: "Existencias Mínimas",
      dataIndex: "minimumExistence",
      key: "minimumExistence",
      width: "10%",
      ...getColumnSearchProps("minimumExistence"),
    },

    {
      title: "Unidad de Medida",
      dataIndex: "unitMeasure",
      key: "unitMeasure",
      width: "10%",
      ...getColumnSearchProps("unitMeasure"),
    },
    {
      title: "Fecha de Entrada",
      dataIndex: "enterDate",
      key: "enterDate",
      width: "20%",
      ...getColumnSearchProps("enterDate"),
    },
  ];

  return (
    <>
      <div className="flex h-14 w-full bg-white-100 rounded-md shadow-md mb-4 items-center pl-4 gap-4">
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
            } w-[6rem] h-[2.5rem] flex items-center p-1 text-base font-bold text-white-100  justify-center gap-2 rounded-md `}
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
          <Tooltip placement="top" title={"Editar existencias mínimas"} arrow={{ pointAtCenter: true }}>
            <button
              disabled={!canEditMinimumExistences}
              className={`${
                canEditMinimumExistences ? "cursor-pointer hover:bg-white-600 ease-in-out duration-300" : "opacity-20 pt-2 pl-2"
              } flex justify-center items-center w-[2.5rem] h-[2.5rem] text-xl rounded-full`}
              onClick={handleEditMinimumExistences}
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
        </div>
      </div>

      <NewMaterialForm open={createNewModal} onCancel={() => setCreateNewModal(false)} onCreate={onCreate} />
      <AddMaterialForm open={addModal} onCancel={() => setAddModal(false)} onCreate={onAdd} defaultValues={selectedRow} />
      <MinusMaterialForm open={minusModal} onCancel={() => setMinusModal(false)} onCreate={onMinus} defaultValues={selectedRow} />
      <EditMinimumExistencesForm open={editMinimumExistencesModal} onCancel={() => setEditMinimumExistencesModal(false)} onCreate={onEditMinimumExistences} defaultValues={selectedRow} />
      <OperationsList open={showOperationsModal} onCancel={() => setShowOperationModal(false)} onCreate={onMinus} defaultValues={selectedRow} />

      <Table
        size="small"
        columns={columns}
        dataSource={data}
        pagination={{ position: ["bottomCenter"], pageSize: 10 }}
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

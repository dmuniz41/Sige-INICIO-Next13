"use client";

import Highlighter from "react-highlight-words";
import React, { useEffect, useMemo, useRef, useState } from "react";
import moment from "moment";
import Swal from "sweetalert2";
import { Button, Input, Space, Table } from "antd";
import { DeleteOutlined, MinusOutlined, OrderedListOutlined, PlusOutlined, ReloadOutlined, SearchOutlined, UnorderedListOutlined } from "@ant-design/icons";
import type { InputRef } from "antd";
import type { ColumnType, ColumnsType } from "antd/es/table";
import type { FilterConfirmProps, TableRowSelection } from "antd/es/table/interface";

import { useAppDispatch } from "@/hooks/hooks";
import { RootState, useAppSelector } from "@/store/store";
import { Toast } from "@/helpers/customAlert";
import { materialsStartLoading, startAddMaterial, startDeleteMaterial } from "@/actions/material";
import { NewMaterialForm } from "./NewMaterialForm";
import { AddMaterialForm } from "./AddMaterialForm";
import { IOperation } from "@/models/operation";
import { MinusMaterialForm } from "./MinusMaterialForm";
import { OperationsList } from "./OperationsListModal";
import { usePathname } from "next/navigation";
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
let currentDate = date.format("MMMM Do YYYY, h:mm:ss a");

const MaterialsTable: React.FC = () => {
  const dispatch = useAppDispatch();
  const [searchText, setSearchText] = useState("");
  const [searchedColumn, setSearchedColumn] = useState("");
  const [createNewModal, setCreateNewModal] = useState(false);
  // const [editModal, setEditModal] = useState(false);
  const [addModal, setAddModal] = useState(false);
  const [minusModal, setMinusModal] = useState(false);
  const [showOperationsModal, setShowOperationModal] = useState(false);
  const [selectedRow, setSelectedRow] = useState<DataType>();
  const searchInput = useRef<InputRef>(null);

  const { materials } = useAppSelector((state: RootState) => state?.material);
  const data: DataType[] = useMemo(() => materials, [materials]);

  const url = usePathname().split("/");
  const selectedWarehouse: string = url[3];

  useEffect(() => {
    dispatch(materialsStartLoading(selectedWarehouse));
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

  // const handleEdit = (): void => {
  //   if (selectedRow) {
  //     setEditModal(true);
  //   } else {
  //     Toast.fire({
  //       icon: "error",
  //       title: "Seleccione un material a editar",
  //     });
  //   }
  // };

  const handleRefresh = () => {
    dispatch(materialsStartLoading(selectedWarehouse));
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
    setSelectedRow(undefined);
    setAddModal(false);
  };

  const onMinus = (values: any): void => {
    let operation: IOperation = {
      date: currentDate,
      tipo: "Sustraer",
      amount: values.unitsTotal,
    };
    dispatch(startAddMaterial(selectedWarehouse, operation, values.materialName, values.category, values.unitMeasure, values.costPerUnit, values.minimumExistence));
    setSelectedRow(undefined);
    setMinusModal(false);
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
            onClick={handleAdd}
            className="bg-success-500 w-[6rem] h-[2.5rem] flex items-center p-2 text-base font-bold text-white-100 cursor-pointer justify-center gap-2 rounded-md hover:bg-success-600 ease-in-out duration-300"
          >
            <svg width="25" height="25" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round">
              <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
              <path d="M12 5l0 14"></path>
              <path d="M5 12l14 0"></path>
            </svg>
            Añadir
          </button>
          <button
            onClick={handleMinus}
            className="bg-danger-500 w-[6rem] h-[2.5rem] flex items-center p-2 text-base font-bold text-white-100 cursor-pointer justify-center gap-2 rounded-md hover:bg-danger-600 ease-in-out duration-300"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round">
              <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
              <path d="M5 12l14 0"></path>
            </svg>
            Sustraer
          </button>
        </div>
        <div className="flex">
          <button
            className="cursor-pointer flex justify-center items-center w-[2.5rem] h-[2.5rem] text-xl rounded-full hover:bg-white-600 ease-in-out duration-300"
            id="edit_user_btn"
            onClick={handleNew}
          >
            <svg width="25" height="25" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round">
              <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
              <path d="M12 5l0 14"></path>
              <path d="M5 12l14 0"></path>
            </svg>
          </button>
          {/* <button className="cursor-pointer" id="edit_material_btn" onClick={handleEdit}>
          <EditOutlined className="w-[2rem] h-[2rem] text-xl rounded-full hover:bg-white-600 ease-in-out duration-300" />
        </button> */}
          <button
            className="cursor-pointer flex justify-center items-center w-[2.5rem] h-[2.5rem] text-xl rounded-full hover:bg-white-600 ease-in-out duration-300"
            id="delete_user_btn"
            onClick={handleDelete}
          >
            <svg width="24" height="24" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round">
              <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
              <path d="M4 7l16 0"></path>
              <path d="M10 11l0 6"></path>
              <path d="M14 11l0 6"></path>
              <path d="M5 7l1 12a2 2 0 0 0 2 2h8a2 2 0 0 0 2 -2l1 -12"></path>
              <path d="M9 7v-3a1 1 0 0 1 1 -1h4a1 1 0 0 1 1 1v3"></path>
            </svg>
          </button>
          <button className="cursor-pointer flex justify-center items-center w-[2.5rem] h-[2.5rem] text-xl rounded-full hover:bg-white-600 ease-in-out duration-300" onClick={handleRefresh}>
            <svg width="24" height="24" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round">
              <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
              <path d="M20 11a8.1 8.1 0 0 0 -15.5 -2m-.5 -4v4h4"></path>
              <path d="M4 13a8.1 8.1 0 0 0 15.5 2m.5 4v-4h-4"></path>
            </svg>
          </button>
          <button className="cursor-pointer flex justify-center items-center w-[2.5rem] h-[2.5rem] text-xl rounded-full hover:bg-white-600 ease-in-out duration-300" onClick={handleShowOperations}>
            <svg width="24" height="24" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round">
              <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
              <path d="M13 5h8"></path>
              <path d="M13 9h5"></path>
              <path d="M13 15h8"></path>
              <path d="M13 19h5"></path>
              <path d="M3 4m0 1a1 1 0 0 1 1 -1h4a1 1 0 0 1 1 1v4a1 1 0 0 1 -1 1h-4a1 1 0 0 1 -1 -1z"></path>
              <path d="M3 14m0 1a1 1 0 0 1 1 -1h4a1 1 0 0 1 1 1v4a1 1 0 0 1 -1 1h-4a1 1 0 0 1 -1 -1z"></path>
            </svg>
          </button>
        </div>
      </div>

      <NewMaterialForm open={createNewModal} onCancel={() => setCreateNewModal(false)} onCreate={onCreate} />
      <AddMaterialForm open={addModal} onCancel={() => setAddModal(false)} onCreate={onAdd} defaultValues={selectedRow} />
      <MinusMaterialForm open={minusModal} onCancel={() => setMinusModal(false)} onCreate={onMinus} defaultValues={selectedRow} />
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

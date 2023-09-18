"use client";

import Highlighter from "react-highlight-words";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { DeleteOutlined, EditOutlined, EyeOutlined, PlusOutlined, ReloadOutlined, SearchOutlined } from "@ant-design/icons";
import { Button, Input, Space, Table } from "antd";
import type { InputRef } from "antd";
import type { ColumnType, ColumnsType } from "antd/es/table";
import type { FilterConfirmProps, TableRowSelection } from "antd/es/table/interface";

import { useAppDispatch } from "@/hooks/hooks";
import { RootState, useAppSelector } from "@/store/store";
import { Toast } from "@/helpers/customAlert";
import { startAddWarehouse, startDeleteWarehouse, startUpdateWarehouse, warehousesStartLoading, selectedWarehouse } from "@/actions/warehouse";
import { CreateWarehouseForm } from "./CreateWarehouseForm";
import { EditWarehouseForm } from "./EditWarehouseForm";
import Link from "next/link";
import { materialsStartLoading } from "@/actions/material";
import Swal from "sweetalert2";
interface DataType {
  _id: string;
  key: string;
  name: string;
  totalValue: number;
}

type DataIndex = keyof DataType;

const WarehousesTable: React.FC = () => {
  const dispatch = useAppDispatch();
  const [searchText, setSearchText] = useState("");
  const [searchedColumn, setSearchedColumn] = useState("");
  const [createNewModal, setCreateNewModal] = useState(false);
  const [editModal, setEditModal] = useState(false);
  const [selectedRow, setSelectedRow] = useState<DataType>();
  const searchInput = useRef<InputRef>(null);

  useEffect(() => {
    dispatch(warehousesStartLoading());
  }, [dispatch]);

  const { warehouses } = useAppSelector((state: RootState) => state?.warehouse);
  const data: DataType[] = useMemo(() => warehouses, [warehouses]);

  const handleNew = (): void => {
    setCreateNewModal(true);
  };

  const handleEdit = (): void => {
    if (selectedRow) {
      setEditModal(true);
    } else {
      Toast.fire({
        icon: "error",
        title: "Seleccione un almacén a editar",
      });
    }
  };

  const onCreate = (values: any): void => {
    dispatch(startAddWarehouse(values.name));
    setCreateNewModal(false);
  };

  const onEdit = (values: any): void => {
    dispatch(startUpdateWarehouse(selectedRow?._id!, values.name));
    setSelectedRow(undefined);
    setEditModal(false);
  };

  const handleSearch = (selectedKeys: string[], confirm: (param?: FilterConfirmProps) => void, dataIndex: DataIndex) => {
    confirm();
    setSearchText(selectedKeys[0]);
    setSearchedColumn(dataIndex);
  };

  const handleView = async () => {
    if (selectedRow) {
      await dispatch(materialsStartLoading(selectedRow?._id!));
    } else {
      Toast.fire({
        icon: "error",
        title: "Seleccione un almacén a visualizar",
      });
    }
  };

  const handleDelete = () => {
    if (selectedRow) {
      Swal.fire({
        title: "Eliminar Almacén",
        text: "El Almacén seleccionado se borrará de forma permanente",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        cancelButtonText: "Cancelar",
        confirmButtonText: "Eliminar",
      }).then((result) => {
        if (result.isConfirmed) {
          dispatch(startDeleteWarehouse(selectedRow?.name));
        }
      });
    } else {
      Toast.fire({
        icon: "error",
        title: "Seleccione un almacén a eliminar",
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
      dispatch(selectedWarehouse(selectedRows[0]._id));
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
      title: "Nombre",
      dataIndex: "name",
      key: "name",
      width: "75%",
      ...getColumnSearchProps("name"),
    },
    {
      title: "Valor Total",
      dataIndex: "totalValue",
      key: "totalValue",
      width: "25%",
      ...getColumnSearchProps("totalValue"),
    },
  ];

  return (
    <>
      <div className="flex h-14 w-full bg-white-100 rounded-md shadow-md mb-4 items-center pl-4 gap-4">
        <div className="flex gap-2">
          <button
            onClick={handleNew}
            className="bg-success-500 w-[6rem] h-[2.5rem] flex items-center p-1 text-base font-bold text-white-100 cursor-pointer justify-center gap-2 rounded-md hover:bg-success-600 ease-in-out duration-300"
          >
            <svg width="25" height="25" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round">
              <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
              <path d="M12 5l0 14"></path>
              <path d="M5 12l14 0"></path>
            </svg>
            Nuevo
          </button>
          <div onClick={handleView}>
            <Link
              href={`/dashboard/warehouse/${selectedRow === undefined ? " " : selectedRow?._id}`}
              className="bg-secondary-500 w-[6rem] h-[2.5rem] flex items-center p-1 font-black text-white-100 cursor-pointer justify-center gap-2 rounded-md hover:bg-secondary-600 ease-in-out duration-300"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round">
                <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
                <path d="M10 12a2 2 0 1 0 4 0a2 2 0 0 0 -4 0"></path>
                <path d="M21 12c-2.4 4 -5.4 6 -9 6c-3.6 0 -6.6 -2 -9 -6c2.4 -4 5.4 -6 9 -6c3.6 0 6.6 2 9 6"></path>
              </svg>
              Ver
            </Link>
          </div>
        </div>
        <div className="flex">
          <button
            className="cursor-pointer flex justify-center items-center w-[2.5rem] h-[2.5rem] text-xl rounded-full hover:bg-white-600 ease-in-out duration-300"
            id="edit_user_btn"
            onClick={handleEdit}
          >
            <svg width="24" height="24" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round">
              <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
              <path d="M7 7h-1a2 2 0 0 0 -2 2v9a2 2 0 0 0 2 2h9a2 2 0 0 0 2 -2v-1"></path>
              <path d="M20.385 6.585a2.1 2.1 0 0 0 -2.97 -2.97l-8.415 8.385v3h3l8.385 -8.415z"></path>
              <path d="M16 5l3 3"></path>
            </svg>
          </button>
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
          <button
            className="cursor-pointer flex justify-center items-center w-[2.5rem] h-[2.5rem] text-xl rounded-full hover:bg-white-600 ease-in-out duration-300"
            onClick={() => dispatch(warehousesStartLoading())}
          >
            <svg width="24" height="24" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round">
              <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
              <path d="M20 11a8.1 8.1 0 0 0 -15.5 -2m-.5 -4v4h4"></path>
              <path d="M4 13a8.1 8.1 0 0 0 15.5 2m.5 4v-4h-4"></path>
            </svg>
          </button>
        </div>
      </div>

      <CreateWarehouseForm open={createNewModal} onCancel={() => setCreateNewModal(false)} onCreate={onCreate} />
      <EditWarehouseForm open={editModal} onCancel={() => setEditModal(false)} onCreate={onEdit} defaultValues={selectedRow} />

      <Table
        size="middle"
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

export default WarehousesTable;

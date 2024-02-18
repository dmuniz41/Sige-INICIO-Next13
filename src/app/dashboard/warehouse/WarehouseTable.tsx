"use client";

import Highlighter from "react-highlight-words";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { SearchOutlined } from "@ant-design/icons";
import { Button, Input, Space, Table, Tooltip } from "antd";
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
import { useSession } from "next-auth/react";
import { PlusSvg } from "../../global/PlusSvg";
import { SeeSvg } from "../../global/SeeSvg";
import { EditSvg } from "../../global/EditSvg";
import { DeleteSvg } from "../../global/DeleteSvg";
import { RefreshSvg } from "@/app/global/RefreshSvg";
import { useRouter } from "next/navigation";
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
  const router = useRouter()
  const { data: sessionData } = useSession();

  const canList = sessionData?.user.role.includes("Listar Almacén");
  const canCreate = sessionData?.user.role.includes("Crear Almacén");
  const canEdit = sessionData?.user.role.includes("Editar Almacén");
  const canDelete = sessionData?.user.role.includes("Eliminar Almacén");

  useEffect(() => {
    dispatch(warehousesStartLoading());
  }, [dispatch]);

  const { warehouses } = useAppSelector((state: RootState) => state?.warehouse);
  let data: DataType[] = useMemo(() => warehouses, [warehouses]);
  if (!canList) {
    data = [];
  }
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

  const handleRowClick = async(record: any)=>{
    await dispatch(materialsStartLoading(selectedRow?._id!));
    router.push(`/dashboard/warehouse/${record === undefined ? " " : record?._id}`)
  }
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
      render: (text) => <span>$ {parseFloat(text).toFixed(2)}</span>,
    },
  ];

  return (
    <>
      <div className="flex h-14 w-full bg-white-100 rounded-md shadow-md mb-4 items-center pl-4 gap-4">
        <div className="flex gap-2">
          <button disabled={!canCreate} onClick={handleNew} className="toolbar-primary-icon-btn">
            <PlusSvg />
            Nuevo
          </button>
          <Link href={`/dashboard/warehouse/${selectedRow === undefined ? " " : selectedRow?._id}`} className="cursor-default">
            <button disabled={!canList} onClick={handleView} className="toolbar-secondary-icon-btn">
              <SeeSvg />
              Ver
            </button>
          </Link>
        </div>
        <div className="flex">
          <Tooltip placement="top" title={"Editar"} arrow={{ pointAtCenter: true }}>
            <button
              disabled={!canEdit}
              className={`${
                canEdit ? "cursor-pointer hover:bg-white-600 ease-in-out duration-300" : "opacity-20 pt-2 pl-2"
              } flex justify-center items-center w-[2.5rem] h-[2.5rem] text-xl rounded-full`}
              onClick={handleEdit}
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
              onClick={() => dispatch(warehousesStartLoading())}
            >
              <RefreshSvg />
            </button>
          </Tooltip>
        </div>
      </div>

      <CreateWarehouseForm open={createNewModal} onCancel={() => setCreateNewModal(false)} onCreate={onCreate} />
      <EditWarehouseForm open={editModal} onCancel={() => setEditModal(false)} onCreate={onEdit} defaultValues={selectedRow} />

      <Table
        size="middle"
        columns={columns}
        dataSource={data}
        pagination={{ position: ["bottomCenter"], pageSize: 10 }}
        // rowSelection={{
        //   type: "radio",
        //   ...rowSelection,
        // }}
        onRow={(record=>({
          onClick: () => handleRowClick(record),
    
        }))}
        className="shadow-md"
      />
    </>
  );
};

export default WarehousesTable;

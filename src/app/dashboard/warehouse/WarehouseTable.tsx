"use client";

import Highlighter from "react-highlight-words";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { DeleteOutlined, EditOutlined, PlusOutlined, ReloadOutlined, SearchOutlined } from "@ant-design/icons";
import { Button, Input, Space, Table } from "antd";
import type { InputRef } from "antd";
import type { ColumnType, ColumnsType } from "antd/es/table";
import type { FilterConfirmProps, TableRowSelection } from "antd/es/table/interface";

import { useAppDispatch } from "@/hooks/hooks";
import { RootState, useAppSelector } from "@/store/store";
import { Toast } from "@/helpers/customAlert";
import { startAddWarehouse, startDeleteWarehouse, startUpdateWarehouse, warehousesStartLoading } from "@/actions/warehouse";
import { CreateWarehouseForm } from "./CreateWarehouseForm";
interface DataType {
  _id: string,
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
    dispatch(startUpdateWarehouse(selectedRow?._id!,values.name));
    setSelectedRow(undefined);
    setEditModal(false);
  };

  const handleSearch = (selectedKeys: string[], confirm: (param?: FilterConfirmProps) => void, dataIndex: DataIndex) => {
    confirm();
    setSearchText(selectedKeys[0]);
    setSearchedColumn(dataIndex);
  };

  const handleDelete = () => {
    if (selectedRow) {
      dispatch(startDeleteWarehouse(selectedRow?.name));
    } else {
      Toast.fire({
        icon: "error",
        title: "Seleccione un almacén a eliminar",
      });
    }
    console.log('Delete warehouse');
    
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
        <Highlighter
          highlightStyle={{ backgroundColor: "#ffc069", padding: 0 }}
          searchWords={[searchText]}
          autoEscape
          textToHighlight={text ? text.toString() : ""}
        />
      ) : (
        text
      ),
  });

  const columns: ColumnsType<DataType> = [
    {
      title: "Nombre",
      dataIndex: "name",
      key: "name",
      width: "70%",
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
      <div className="flex h-14 w-full bg-white rounded-md shadow-md mb-4 items-center pl-4 gap-2">
        <div
          onClick={handleNew}
          className="bg-success-500 w-[6rem] h-[2.5rem] flex items-center p-1 font-black text-white cursor-pointer justify-center gap-2 rounded-md hover:bg-success-600 ease-in-out duration-300"
        >
          <PlusOutlined />
          Nuevo
        </div>
        <button className="cursor-pointer" id="edit_warehouse_btn" onClick={handleEdit}>
          <EditOutlined className="w-[2rem] h-[2rem] text-xl rounded-full hover:bg-background_light ease-in-out duration-300" />
        </button>
        <button className="cursor-pointer" id="delete_warehouse_btn" onClick={handleDelete}>
          <DeleteOutlined className="w-[2rem] h-[2rem] text-xl rounded-full hover:bg-background_light ease-in-out duration-300" />
        </button>
        <ReloadOutlined
          onClick={() => dispatch(warehousesStartLoading())}
          className="w-[2rem] h-[2rem] text-xl rounded-full hover:bg-background_light ease-in-out duration-300"
        />
      </div>

      <CreateWarehouseForm open={createNewModal} onCancel={() => setCreateNewModal(false)} onCreate={onCreate} />
      {/* <EditWarehouseForm open={editModal} onCancel={() => setEditModal(false)} onCreate={onEdit} defaultValues={selectedRow} />  */}

      <Table
        size="middle"
        columns={columns}
        dataSource={data}
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

export default WarehousesTable;

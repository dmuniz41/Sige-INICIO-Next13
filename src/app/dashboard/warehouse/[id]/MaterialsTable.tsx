"use client";

import Highlighter from "react-highlight-words";
import React, { useEffect, useMemo, useRef, useState } from "react";
import moment from "moment";
import Swal from "sweetalert2";
import { Button, Input, Space, Table } from "antd";
import { DeleteOutlined, EditOutlined, MinusOutlined, OrderedListOutlined, PlusOutlined, ReloadOutlined, SearchOutlined } from "@ant-design/icons";
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
  const [selectedRow, setSelectedRow] = useState<DataType>();
  const searchInput = useRef<InputRef>(null);

  const { materials } = useAppSelector((state: RootState) => state?.material);
  const { selectedWarehouse }: {selectedWarehouse: {id: string}} = useAppSelector((state: RootState) => state?.warehouse);
  const data: DataType[] = useMemo(() => materials, [materials]);

  useEffect(() => {
    dispatch(materialsStartLoading(selectedWarehouse.id));
  }, [dispatch, selectedWarehouse]);

  const handleNew = (): void => {
    setCreateNewModal(true);
  };
  const handleAdd = (): void => {
    setAddModal(true);
  };
  const handleMinus = (): void => {
    setMinusModal(true);
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
    dispatch(materialsStartLoading(selectedWarehouse.id));
  };

  const onCreate = (values: any): void => {
    let operation: IOperation = {
      date: currentDate,
      tipo: "Añadir",
      amount: values.unitsTotal,
    };
    dispatch(
      startAddMaterial(
        selectedWarehouse.id,
        operation,
        values.materialName,
        values.category,
        values.unitMeasure,
        values.costPerUnit,
        values.minimumExistence,
      )
    );
    setCreateNewModal(false);
  };

  const onAdd = (values: any): void => {
    let operation: IOperation = {
      date: currentDate,
      tipo: "Añadir",
      amount: values.unitsTotal,
    };
    dispatch(startAddMaterial(selectedWarehouse.id,
      operation,
      values.materialName,
      values.category,
      values.unitMeasure,
      values.costPerUnit,
      values.minimumExistence,));
    setSelectedRow(undefined);
    setAddModal(false);
  };

  const onMinus = (values: any): void => {
    let operation: IOperation = {
      date: currentDate,
      tipo: "Sustraer",
      amount: values.unitsTotal,
    };
    dispatch(startAddMaterial(selectedWarehouse.id,
      operation,
      values.materialName,
      values.category,
      values.unitMeasure,
      values.costPerUnit,
      values.minimumExistence,));
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
        title: 'Eliminar Material',
        text: "El material seleccionado se borrará de forma permanente",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        cancelButtonText: 'Cancelar',
        confirmButtonText: 'Eliminar'
      }).then((result) => {
        if (result.isConfirmed) {
          dispatch(startDeleteMaterial(selectedRow?.code, selectedWarehouse?.id));
        }
      })
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
      key: "totalValue",
      width: "15%",
      ...getColumnSearchProps("materialName"),
    },
    {
      title: "Existencias",
      dataIndex: "unitsTotal",
      key: "unitsTotal",
      width: "10%",
      sorter:{
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
      title: "Fecha de Entrada",
      dataIndex: "enterDate",
      key: "totalValue",
      width: "20%",
      ...getColumnSearchProps("enterDate"),
    },
    {
      title: "Coste Unitario",
      dataIndex: "costPerUnit",
      key: "totalValue",
      width: "10%",
      sorter:{
        compare: (a, b) => a.costPerUnit - b.costPerUnit,
      },
      ...getColumnSearchProps("costPerUnit"),
    },
    {
      title: "Existencias Mínimas",
      dataIndex: "minimumExistence",
      key: "totalValue",
      width: "10%",
      ...getColumnSearchProps("minimumExistence"),
    },
  ];

  return (
    <>
      <div className="flex h-14 w-full bg-white-100 rounded-md shadow-md mb-4 items-center pl-4 gap-2">
        <button
          onClick={handleNew}
          className="bg-success-500 w-[6rem] h-[2.5rem] flex items-center p-1 font-black text-white-100 cursor-pointer justify-center gap-2 rounded-md hover:bg-success-600 ease-in-out duration-300"
        >
          <PlusOutlined />
          Nuevo
        </button>
        <button
          onClick={handleAdd}
          className="bg-secondary-500 w-[6rem] h-[2.5rem] flex items-center p-1 font-black text-white-100 cursor-pointer justify-center gap-2 rounded-md hover:bg-secondary-600 ease-in-out duration-300"
        >
          <PlusOutlined />
          Añadir
        </button>
        <button
          onClick={handleMinus}
          className="bg-danger-500 w-[6rem] h-[2.5rem] flex items-center p-1 font-black text-white-100 cursor-pointer justify-center gap-2 rounded-md hover:bg-danger-600 ease-in-out duration-300"
        >
          <MinusOutlined  />
          Sustraer
        </button>
        {/* <button className="cursor-pointer" id="edit_material_btn" onClick={handleEdit}>
          <EditOutlined className="w-[2rem] h-[2rem] text-xl rounded-full hover:bg-white-600 ease-in-out duration-300" />
        </button> */}
        <button className="cursor-pointer" onClick={handleDelete} id="delete_material_btn">
          <DeleteOutlined className="w-[2rem] h-[2rem] text-xl rounded-full hover:bg-white-600 ease-in-out duration-300" />
        </button>
        <button className="cursor-pointer">
          <ReloadOutlined onClick={handleRefresh} className="w-[2rem] h-[2rem] text-xl rounded-full hover:bg-white-600 ease-in-out duration-300" />
        </button>
        <button className="cursor-pointer">
          <OrderedListOutlined className="w-[2rem] h-[2rem] text-xl rounded-full hover:bg-white-600 ease-in-out duration-300" />
        </button>
      </div>

      <NewMaterialForm open={createNewModal} onCancel={() => setCreateNewModal(false)} onCreate={onCreate} />
      <AddMaterialForm open={addModal} onCancel={() => setAddModal(false)} onCreate={onAdd} defaultValues={selectedRow} />
      <MinusMaterialForm open={minusModal} onCancel={() => setMinusModal(false)} onCreate={onMinus} defaultValues={selectedRow} />

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

export default MaterialsTable;
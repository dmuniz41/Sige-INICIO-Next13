"use client";

import { Button, Input, Space, Table, Tooltip } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import Highlighter from "react-highlight-words";
import React, { useEffect, useMemo, useRef, useState } from "react";
import type { ColumnType, ColumnsType } from "antd/es/table";
import type { FilterConfirmProps, TableRowSelection } from "antd/es/table/interface";
import type { InputRef } from "antd";

import { CreateNomenclatorForm } from "./CreateNomenclatorForm";
import { DeleteSvg } from "@/app/global/DeleteSvg";
import { EditNomenclatorForm } from "./EditNomenclatorForm";
import { EditSvg } from "@/app/global/EditSvg";
import { nomenclatorsStartLoading, startAddNomenclator, startDeleteNomenclator, startUpdateNomenclator } from "@/actions/nomenclator";
import { PlusSvg } from "@/app/global/PlusSvg";
import { RefreshSvg } from "@/app/global/RefreshSvg";
import { RootState, useAppSelector } from "@/store/store";
import { selectedWarehouse } from "@/actions/warehouse";
import { Toast } from "@/helpers/customAlert";
import { useAppDispatch } from "@/hooks/hooks";
import { useSession } from "next-auth/react";
import Swal from "sweetalert2";
import { INomenclator } from "../../../models/nomenclator";

type DataIndex = keyof INomenclator;

const NomenclatorsTable: React.FC = () => {
  const dispatch = useAppDispatch();
  const [searchText, setSearchText] = useState("");
  const [searchedColumn, setSearchedColumn] = useState("");
  const [createNewModal, setCreateNewModal] = useState(false);
  const [editModal, setEditModal] = useState(false);
  const [selectedRow, setSelectedRow] = useState<INomenclator>();
  const searchInput = useRef<InputRef>(null);
  const { data: sessionData } = useSession();

  const canList = sessionData?.user.role.includes("Listar Nomencladores");
  const canCreate = sessionData?.user.role.includes("Crear Nomenclador");
  const canEdit = sessionData?.user.role.includes("Editar Nomenclador");
  const canDelete = sessionData?.user.role.includes("Eliminar Nomenclador");

  useEffect(() => {
    dispatch(nomenclatorsStartLoading());
  }, [dispatch]);

  const { nomenclators }: any = useAppSelector((state: RootState) => state?.nomenclator);
  let data: INomenclator[] = useMemo(() => nomenclators, [nomenclators]);
  if (!canList) {
    data = [];
  }
  const handleEdit = (): void => {
    if (selectedRow) {
      setEditModal(true);
    } else {
      Toast.fire({
        icon: "error",
        title: "Seleccione un nomenclador a editar",
      });
    }
  };

  const onCreate = (values: any): void => {
    dispatch(startAddNomenclator(values.category, values.code));
    setCreateNewModal(false);
  };

  const onEdit = (values: any): void => {
    dispatch(startUpdateNomenclator(selectedRow?._id!, values.code, values.category));
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
      Swal.fire({
        title: "Eliminar Nomenclador",
        text: "El Nomenclador seleccionado se borrará de forma permanente",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        cancelButtonText: "Cancelar",
        confirmButtonText: "Eliminar",
      }).then((result) => {
        if (result.isConfirmed) {
          dispatch(startDeleteNomenclator(selectedRow?._id));
        }
      });
    } else {
      Toast.fire({
        icon: "error",
        title: "Seleccione un nomenclador a eliminar",
      });
    }
  };

  const handleReset = (clearFilters: () => void) => {
    clearFilters();
    setSearchText("");
  };

  const rowSelection: TableRowSelection<INomenclator> = {
    onChange: async (selectedRowKeys: React.Key[], selectedRows: INomenclator[]) => {
      setSelectedRow(selectedRows[0]);
      dispatch(selectedWarehouse(selectedRows[0]._id));
      console.log(`selectedRowKeys: ${selectedRowKeys}`, "selectedRow: ", selectedRows);
    },
  };

  const getColumnSearchProps = (dataIndex: DataIndex): ColumnType<INomenclator> => ({
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
    onFilter: (value, record: any) =>
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

  const columns: ColumnsType<INomenclator> = [
    {
      title: "Categoría",
      dataIndex: "category",
      key: "category",
      filters: [
        {
          text: "Area de usuario",
          value: "Area de usuario",
        },
        {
          text: "Cargo de trabajador",
          value: "Cargo de trabajador",
        },
        {
          text: "Categoría de material",
          value: "Categoría de material",
        },
        {
          text: "Unidad de medida",
          value: "Unidad de medida",
        },
        {
          text: "Proveedor",
          value: "Proveedor",
        },
        {
          text: "Categoría de ficha de costo",
          value: "Categoría de ficha de costo",
        },
        {
          text: "Precio/UM en ficha de costo",
          value: "Precio/UM en ficha de costo",
        },
        {
          text: "Ficha de costo",
          value: "Ficha de costo",
        },
      ],
      onFilter: (value: any, record: any) => record.category.startsWith(value),
      filterSearch: true,
      width: "50%",
      sorter: (a: any, b: any) => a.category.localeCompare(b.category),
    },
    {
      title: "Código",
      dataIndex: "code",
      key: "code",
      width: "40%",
      ...getColumnSearchProps("code"),
    },
    {
      title: "Valor",
      dataIndex: "value",
      key: "value",
      width: "35%",
      render: (text) => text && <span>$ {parseFloat(text).toFixed(2)}</span>,
      // ...getColumnSearchProps("value"),
    },
  ];

  return (
    <>
      <div className="flex h-16 w-full bg-white-100 rounded-md shadow-md mb-4 items-center pl-4 gap-4">
        <div className="flex gap-2">
          <button
            disabled={!canCreate}
            onClick={() => {
              setCreateNewModal(true);
            }}
            className={`${
              canCreate ? "bg-success-500 cursor-pointer hover:bg-success-600 ease-in-out duration-300" : "bg-success-200"
            } w-[6rem] h-[2.5rem] flex items-center p-1 text-base font-bold text-white-100  justify-center gap-2 rounded-md `}
          >
            <PlusSvg />
            Nuevo
          </button>
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
              onClick={() => dispatch(nomenclatorsStartLoading())}
            >
              <RefreshSvg />
            </button>
          </Tooltip>
        </div>
      </div>

      <CreateNomenclatorForm open={createNewModal} onCancel={() => setCreateNewModal(false)} onCreate={onCreate} />
      <EditNomenclatorForm open={editModal} onCancel={() => setEditModal(false)} onCreate={onEdit} defaultValues={selectedRow} />

      <Table
        size="small"
        columns={columns}
        dataSource={data}
        pagination={{ position: ["bottomCenter"], pageSize: 15 }}
        rowSelection={{
          type: "radio",
          ...rowSelection,
        }}
        className="shadow-md"
        sortDirections={["ascend"]}
      />
    </>
  );
};

export default NomenclatorsTable;

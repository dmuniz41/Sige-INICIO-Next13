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
import Swal from "sweetalert2";
import { useSession } from "next-auth/react";
import { DeleteSvg } from "@/app/global/DeleteSvg";
import { PlusSvg } from '@/app/global/PlusSvg';
import { RefreshSvg } from '@/app/global/RefreshSvg';
import { ICostSheet } from "@/models/costSheet";
import { costSheetsStartLoading, loadSelectedCostSheet, startDeleteCostSheet } from "@/actions/costSheet";
import { useRouter } from "next/navigation";
import { SeeSvg } from "@/app/global/SeeSvg";
import { EditSvg } from "@/app/global/EditSvg";


type DataIndex = keyof ICostSheet;

const CostSheetsTable: React.FC = () => {
  const dispatch = useAppDispatch();
  const [searchText, setSearchText] = useState("");
  const [searchedColumn, setSearchedColumn] = useState("");
  const [selectedRow, setSelectedRow] = useState<ICostSheet>();
  const searchInput = useRef<InputRef>(null);
  const router = useRouter();
  const { data: sessionData } = useSession();

  const canList = sessionData?.user.role.includes("Listar Ficha de Costo");
  const canCreate = sessionData?.user.role.includes("Crear Ficha de Costo");
  const canEdit = sessionData?.user.role.includes("Editar Ficha de Costo");
  const canDelete = sessionData?.user.role.includes("Eliminar Ficha de Costo");

  useEffect(() => {
    dispatch(costSheetsStartLoading());
  }, [dispatch]);

  const { costSheets } = useAppSelector((state: RootState) => state?.costSheet);
  let data: ICostSheet[] = useMemo(() => costSheets, [costSheets]);
  if (!canList) {
    data = [];
  }

  const handleView = (): void => {
    if (selectedRow) {
      dispatch(loadSelectedCostSheet(selectedRow._id))
      router.push(`/dashboard/costSheets/${selectedRow._id}`)
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

  const handleEdit = (): void => {
    if (selectedRow) {
      router.push(`/dashboard/costSheets/editCostSheet`)
    } else {
      Toast.fire({
        icon: "error",
        title: "Seleccione una ficha de costo a editar",
      });
    }
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
      width: "100%",
      ...getColumnSearchProps("taskName"),
    },
  ];

  return (
    <>
      <div className="flex h-14 w-full bg-white-100 rounded-md shadow-md mb-4 items-center pl-4 gap-4">
        <div className="flex gap-2">
          <button
            disabled={!canCreate}
            onClick={ ()=> router.push('/dashboard/costSheets/createCostSheet')}
            className={`${
              canCreate ? "bg-success-500 cursor-pointer hover:bg-success-600 ease-in-out duration-300" : "bg-success-200"
            } w-[6rem] h-[2.5rem] flex items-center p-1 text-base font-bold text-white-100  justify-center gap-2 rounded-md `}
          >
            <PlusSvg />
            Nuevo
          </button>
            <button
              disabled={!canList}
              onClick={handleView}
              className={`${
                canList ? "bg-secondary-500 cursor-pointer hover:bg-secondary-600 ease-in-out duration-300" : "bg-secondary-200"
              } w-[6rem] h-[2.5rem] flex items-center p-1 text-base font-bold text-white-100  justify-center gap-2 rounded-md `}
            >
              <SeeSvg />
              Ver
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
              onClick={() => dispatch(costSheetsStartLoading())}
            >
              <RefreshSvg />
            </button>
          </Tooltip>
        </div>
      </div>

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
        sortDirections={["ascend"]}
      />
    </>
  );
};

export default CostSheetsTable;


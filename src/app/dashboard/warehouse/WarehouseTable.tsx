"use client";
import { Button, Input, Space, Table, Tooltip } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import Highlighter from "react-highlight-words";
import React, { useEffect, useMemo, useRef, useState } from "react";
import Swal from "sweetalert2";
import type { ColumnType, ColumnsType } from "antd/es/table";
import type { FilterConfirmProps } from "antd/es/table/interface";
import type { InputRef } from "antd";

import { useAppDispatch } from "@/hooks/hooks";
import { RootState, useAppSelector } from "@/store/store";
import {
  startAddWarehouse,
  startDeleteWarehouse,
  startUpdateWarehouse,
  warehousesStartLoading
} from "@/actions/warehouse";
import { CreateWarehouseForm } from "./CreateWarehouseForm";
import { DeleteSvg } from "../../global/DeleteSvg";
import { EditSvg } from "../../global/EditSvg";
import { EditWarehouseForm } from "./EditWarehouseForm";
import { IWarehouse } from "@/models/warehouse";
import { materialsStartLoading } from "@/actions/material";
import { PlusSvg } from "../../global/PlusSvg";
import { RefreshSvg } from "@/app/global/RefreshSvg";
import { SeeSvg } from "../../global/SeeSvg";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";

type DataIndex = keyof IWarehouse;

const WarehousesTable: React.FC = () => {
  const [createNewModal, setCreateNewModal] = useState(false);
  const [editModal, setEditModal] = useState(false);
  const [searchedColumn, setSearchedColumn] = useState("");
  const [searchText, setSearchText] = useState("");
  const [selectedWarehouse, setSelectedWarehouse] = useState<IWarehouse>();
  const { data: sessionData } = useSession();
  const dispatch = useAppDispatch();
  const router = useRouter();
  const searchInput = useRef<InputRef>(null);

  const canList = sessionData?.user.role.includes("Listar Almacén");
  const canCreate = sessionData?.user.role.includes("Crear Almacén");
  const canEdit = sessionData?.user.role.includes("Editar Almacén");
  const canDelete = sessionData?.user.role.includes("Eliminar Almacén");

  useEffect(() => {
    dispatch(warehousesStartLoading());
  }, [dispatch]);

  const { warehouses } = useAppSelector((state: RootState) => state?.warehouse);
  let data: IWarehouse[] = useMemo(() => warehouses, [warehouses]);
  if (!canList) {
    data = [];
  }
  
  const handleNew = (): void => {
    setCreateNewModal(true);
  };

  const handleEdit = (record: IWarehouse): void => {
    setSelectedWarehouse(record);
    setEditModal(true);
  };

  const onCreate = (values: any): void => {
    dispatch(startAddWarehouse(values.name));
    setCreateNewModal(false);
  };

  const onEdit = (values: any): void => {
    dispatch(startUpdateWarehouse(selectedWarehouse?._id!, values.name));
    setEditModal(false);
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

  const handleView = async (record: IWarehouse) => {
    await dispatch(materialsStartLoading(record?._id!));
    router.push(`/dashboard/warehouse/${record === undefined ? " " : record?._id}`);
  };

  const handleDelete = (record: IWarehouse) => {
    Swal.fire({
      title: "Eliminar Almacén",
      text: "El almacén seleccionado se borrará de forma permanente",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      cancelButtonText: "Cancelar",
      confirmButtonText: "Eliminar"
    }).then((result) => {
      if (result.isConfirmed) {
        dispatch(startDeleteWarehouse(record?._id));
      }
    });
  };

  const handleReset = (clearFilters: () => void) => {
    clearFilters();
    setSearchText("");
  };

  const getColumnSearchProps = (dataIndex: DataIndex): ColumnType<IWarehouse> => ({
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
            className="flex items-center bg-blue-500"
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
      record[dataIndex]!.toString()
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

  const columns: ColumnsType<IWarehouse> = [
    {
      title: <span className="font-bold">Nombre</span>,
      dataIndex: "name",
      key: "name",
      width: "75%",
      ...getColumnSearchProps("name")
    },
    {
      title: <span className="font-bold">Valor Total</span>,
      dataIndex: "totalValue",
      key: "totalValue",
      width: "25%",
      render: (value) => (
        <span>
          ${" "}
          {value?.toLocaleString("DE", {
            maximumFractionDigits: 2,
            minimumFractionDigits: 2
          })}
        </span>
      )
    },
    {
      title: <span className="font-bold">Acciones</span>,
      key: "actions",
      width: "5%",
      render: (_, { ...record }) => (
        <div className="flex justify-center gap-1">
          {!canList ? (
            <></>
          ) : (
            <Tooltip placement="top" title={"Ver Almacén"} arrow={{ pointAtCenter: true }}>
              <button
                disabled={!canList}
                onClick={() => handleView(record)}
                className="table-see-action-btn"
              >
                <SeeSvg width={20} height={20} />
              </button>
            </Tooltip>
          )}
          {canEdit ? (
            <>
              <Tooltip placement="top" title={"Editar Almacén"} arrow={{ pointAtCenter: true }}>
                <button onClick={() => handleEdit(record)} className="table-see-offer-action-btn">
                  <EditSvg width={20} height={20} />
                </button>
              </Tooltip>
            </>
          ) : (
            <></>
          )}
          {canDelete ? (
            <Tooltip placement="top" title={"Eliminar Almacén"} arrow={{ pointAtCenter: true }}>
              <button onClick={() => handleDelete(record)} className="table-delete-action-btn">
                <DeleteSvg width={20} height={20} />
              </button>
            </Tooltip>
          ) : (
            <></>
          )}
        </div>
      )
    }
  ];

  return (
    <>
      <div className="flex items-center w-full h-16 gap-4 pl-4 mb-4 rounded-md shadow-md bg-white-100">
        <div className="flex gap-2">
          <button disabled={!canCreate} onClick={handleNew} className="toolbar-primary-icon-btn">
            <PlusSvg />
            Nuevo
          </button>
        </div>
        <div className="flex">
          <Tooltip placement="top" title={"Refrescar"} arrow={{ pointAtCenter: true }}>
            <button
              disabled={!canList}
              className={`${
                canList
                  ? "cursor-pointer hover:bg-white-600 ease-in-out duration-300"
                  : "opacity-20 pt-2 pl-2"
              } flex justify-center items-center w-[2.5rem] h-[2.5rem] text-xl rounded-full`}
              onClick={() => dispatch(warehousesStartLoading())}
            >
              <RefreshSvg />
            </button>
          </Tooltip>
        </div>
      </div>

      <CreateWarehouseForm
        open={createNewModal}
        onCancel={() => setCreateNewModal(false)}
        onCreate={onCreate}
      />
      <EditWarehouseForm
        open={editModal}
        onCancel={() => setEditModal(false)}
        onCreate={onEdit}
        defaultValues={selectedWarehouse}
      />

      <Table
        size="middle"
        columns={columns}
        dataSource={data}
        pagination={{ position: ["bottomCenter"], pageSize: 10 }}
        className="shadow-md"
      />
    </>
  );
};

export default WarehousesTable;

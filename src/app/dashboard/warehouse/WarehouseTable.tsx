"use client";
import { Button, Input, Space, Spin, Table, Tooltip } from "antd";
import { LoadingOutlined, SearchOutlined } from "@ant-design/icons";
import Highlighter from "react-highlight-words";
import React, { useEffect, useMemo, useRef, useState } from "react";
import Swal from "sweetalert2";
import type { ColumnType, ColumnsType } from "antd/es/table";
import type { FilterConfirmProps } from "antd/es/table/interface";
import type { InputRef } from "antd";

import { CreateWarehouseForm } from "./CreateWarehouseForm";
import { DeleteSvg } from "../../global/DeleteSvg";
import { EditSvg } from "../../global/EditSvg";
import { EditWarehouseForm } from "./EditWarehouseForm";
import { materialsStartLoading } from "@/actions/material";
import { PlusSvg } from "../../global/PlusSvg";
import { RefreshSvg } from "@/app/global/RefreshSvg";
import { SeeSvg } from "../../global/SeeSvg";
import { useAppDispatch } from "@/hooks/hooks";
import { useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { useWarehouse } from "@/hooks/warehouse/useWarehouse";
import { Warehouse } from "@/db/migrations/schema";

type DataIndex = keyof Warehouse;

const WarehousesTable: React.FC = () => {
  const [createNewModal, setCreateNewModal] = useState(false);
  const [editModal, setEditModal] = useState(false);
  const [searchedColumn, setSearchedColumn] = useState("");
  const [searchText, setSearchText] = useState("");
  const [selectedWarehouse, setSelectedWarehouse] = useState<Warehouse>();
  const { data: sessionData } = useSession();
  const router = useRouter();
  const searchInput = useRef<InputRef>(null);
  const queryClient = useQueryClient();

  const [limit, setLimit] = useState<number>(10);
  const [page, setPage] = useState<number>(1);

  const canList = sessionData?.user.role.includes("Listar Almacén");
  const canCreate = sessionData?.user.role.includes("Crear Almacén");
  const canEdit = sessionData?.user.role.includes("Editar Almacén");
  const canDelete = sessionData?.user.role.includes("Eliminar Almacén");

  const { useGetWarehouses, useDeleteWarehouse } = useWarehouse();
  const deleteMutation = useDeleteWarehouse();
  const { data: warehouseQuery, isLoading, isError } = useGetWarehouses(page, limit);

  const handleNew = (): void => {
    setCreateNewModal(true);
  };

  const handleRefresh = () => {
    queryClient.invalidateQueries({ queryKey: ["GetWarehouses"] });
  };

  const handleEdit = (record: Warehouse): void => {
    setSelectedWarehouse(record);
    setEditModal(true);
  };

  // const onEdit = (values: any): void => {
  //   dispatch(startUpdateWarehouse(selectedWarehouse?._id!, values.name));
  //   setEditModal(false);
  // };

  const handleSearch = (selectedKeys: string[], confirm: (param?: FilterConfirmProps) => void, dataIndex: DataIndex) => {
    confirm();
    setSearchText(selectedKeys[0]);
    setSearchedColumn(dataIndex);
  };

  const handleView = async (record: Warehouse) => {
    router.push(`/dashboard/warehouse/${record === undefined ? " " : record?.id}`);
  };

  const handleDelete = (record: Warehouse) => {
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
        deleteMutation.mutate(record.id);
      }
    });
  };

  const handleReset = (clearFilters: () => void) => {
    clearFilters();
    setSearchText("");
  };

  const getColumnSearchProps = (dataIndex: DataIndex): ColumnType<Warehouse> => ({
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

  const columns: ColumnsType<Warehouse> = [
    {
      title: <span className="font-bold">Nombre</span>,
      dataIndex: "name",
      width: "75%",
      ...getColumnSearchProps("name")
    },
    {
      title: <span className="font-bold">Valor Total</span>,
      dataIndex: "totalValue",
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
        <div className="flex gap-1 justify-center">
          {!canList ? (
            <></>
          ) : (
            <Tooltip placement="top" title={"Ver Almacén"} arrow={{ pointAtCenter: true }}>
              <button disabled={!canList} onClick={() => handleView(record)} className="table-see-offer-action-btn">
                <SeeSvg width={20} height={20} />
              </button>
            </Tooltip>
          )}
          {canEdit ? (
            <>
              <Tooltip placement="top" title={"Editar Almacén"} arrow={{ pointAtCenter: true }}>
                <button onClick={() => handleEdit(record)} className="table-see-action-btn">
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

  if (isLoading)
    return (
      <section className="flex h-full w-full items-center justify-center">
        <Spin indicator={<LoadingOutlined style={{ fontSize: 70, color: "#ff8533" }} spin />} />
      </section>
    );

  if (isError) {
    Swal.fire({
      icon: "error",
      title: "Error",
      text: "Ocurrió un error al obtener los representantes"
    });
  }

  return (
    <>
      <div className="flex h-16 w-full bg-white-100 rounded-md shadow-md mb-4 items-center pl-4 gap-4">
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
                canList ? "cursor-pointer hover:bg-white-600 ease-in-out duration-300" : "opacity-20 pt-2 pl-2"
              } flex justify-center items-center w-[2.5rem] h-[2.5rem] text-xl rounded-full`}
              onClick={handleRefresh}
            >
              <RefreshSvg />
            </button>
          </Tooltip>
        </div>
      </div>

      <CreateWarehouseForm open={createNewModal} onCancel={() => setCreateNewModal(false)} />
      <EditWarehouseForm open={editModal} onCancel={() => setEditModal(false)} initialValues={selectedWarehouse!} />

      <Table
        size="middle"
        columns={columns}
        dataSource={warehouseQuery?.data}
        pagination={{ position: ["bottomCenter"], defaultPageSize: 10 }}
        onChange={(pagination) => {
          setPage(pagination?.current ?? 1);
          setLimit(pagination?.pageSize ?? 10);
        }}
        className="shadow-md"
      />
    </>
  );
};

export default WarehousesTable;

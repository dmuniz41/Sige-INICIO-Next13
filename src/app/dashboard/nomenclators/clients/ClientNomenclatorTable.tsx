"use client";
import { Button, Input, Space, Spin, Table, Tag, Tooltip } from "antd";
import { LoadingOutlined, SearchOutlined } from "@ant-design/icons";
import { useSession } from "next-auth/react";
import Highlighter from "react-highlight-words";
import React, { useRef, useState } from "react";
import Swal from "sweetalert2";
import type { ColumnType, ColumnsType } from "antd/es/table";
import type { FilterConfirmProps } from "antd/es/table/interface";
import type { InputRef } from "antd";

import { CreateClientNomenclatorForm } from "./CreateClientNomenclatorForm";
import { DeleteSvg } from "@/app/global/DeleteSvg";
import { EditClientNomenclatorForm } from "./EditClientNomenclatorForm";
import { EditSvg } from "@/app/global/EditSvg";
import { PlusSvg } from "@/app/global/PlusSvg";
import { RefreshSvg } from "@/app/global/RefreshSvg";
import { useClient } from "@/hooks/nomenclators/clients/useClient";
import { ClientNomenclator } from "@/db/migrations/schema";
import { useQueryClient } from "@tanstack/react-query";

type DataIndex = keyof ClientNomenclator;

const ClientNomenclatorsTable: React.FC = () => {
  const [createNewModal, setCreateNewModal] = useState(false);
  const [editModal, setEditModal] = useState(false);
  const [searchedColumn, setSearchedColumn] = useState("");
  const [searchText, setSearchText] = useState("");
  const [page, setPage] = useState<number>(1);
  const [limit, setLimit] = useState<number>(10);
  const [selectedNomenclator, setSelectedNomenclator] = useState<ClientNomenclator>();
  const { data: sessionData } = useSession();
  const queryClient = useQueryClient();
  const searchInput = useRef<InputRef>(null);

  const { useGetClients, useDeleteClient } = useClient();
  const deleteMutation = useDeleteClient();
  const { data: clientsQuery, isLoading, isError } = useGetClients(page, limit);

  const canList = sessionData?.user.role.includes("Listar Nomencladores");
  const canCreate = sessionData?.user.role.includes("Crear Nomenclador");
  const canEdit = sessionData?.user.role.includes("Editar Nomenclador");
  const canDelete = sessionData?.user.role.includes("Eliminar Nomenclador");

  const handleSearch = (selectedKeys: string[], confirm: (param?: FilterConfirmProps) => void, dataIndex: DataIndex) => {
    confirm();
    setSearchText(selectedKeys[0]);
    setSearchedColumn(dataIndex);
  };

  const handleDelete = (idNumber: number) => {
    Swal.fire({
      title: "Eliminar Cliente",
      text: "El cliente seleccionado se borrará de forma permanente",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      cancelButtonText: "Cancelar",
      confirmButtonText: "Eliminar"
    }).then((result) => {
      if (result.isConfirmed) {
        deleteMutation.mutate(idNumber);
      }
    });
  };

  const handleRefresh = () => {
    queryClient.invalidateQueries({ queryKey: ["GetClients"] });
  };

  const handleReset = (clearFilters: () => void) => {
    clearFilters();
    setSearchText("");
  };

  const handleEdit = (record: ClientNomenclator) => {
    setSelectedNomenclator(record);
    setEditModal(true);
  };

  const getColumnSearchProps = (dataIndex: DataIndex): ColumnType<ClientNomenclator> => ({
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

  const columns: ColumnsType<ClientNomenclator> = [
    {
      title: <span className="font-bold">Nombre</span>,
      dataIndex: "name",
      width: "30%",
      sorter: (a: any, b: any) => a.name.localeCompare(b.name),
      ...getColumnSearchProps("name")
    },
    {
      title: <span className="font-bold">Número de Cliente</span>,
      dataIndex: "idNumber",
      width: "10%"
    },
    {
      title: <span className="font-bold">Contacto</span>,
      dataIndex: "contact",
      width: "15%",
      sorter: (a: any, b: any) => a.contactPerson.localeCompare(b.contactPerson),
      ...getColumnSearchProps("contact")
    },
    {
      title: <span className="font-bold">Teléfono</span>,
      dataIndex: "phoneNumber",
      width: "10%"
    },
    {
      title: <span className="font-bold">Dirección</span>,
      dataIndex: "address",
      width: "20%",
      sorter: (a: any, b: any) => a.address.localeCompare(b.address),
      ...getColumnSearchProps("address")
    },
    {
      title: <span className="font-bold">Correo</span>,
      dataIndex: "email",
      width: "20%",
      sorter: (a: any, b: any) => a.email.localeCompare(b.email),
      ...getColumnSearchProps("email")
    },
    {
      title: <span className="font-bold">Acciones</span>,
      key: "actions",
      width: "5%",
      render: (_, { ...record }) => (
        <div className="flex gap-1">
          {canEdit ? (
            <Tooltip placement="top" title={"Editar"} arrow={{ pointAtCenter: true }}>
              <button disabled={!canList} onClick={() => handleEdit(record)} className="table-see-action-btn">
                <EditSvg width={20} height={20} />
              </button>
            </Tooltip>
          ) : (
            <></>
          )}

          <Tooltip placement="top" title={"Eliminar"} arrow={{ pointAtCenter: true }}>
            <button disabled={!canDelete} onClick={() => handleDelete(record.idNumber)} className="table-delete-action-btn">
              <DeleteSvg width={20} height={20} />
            </button>
          </Tooltip>
        </div>
      )
    }
  ];

  if (isLoading)
    return (
      <section className="flex h-full w-full items-center justify-center">
        <Spin indicator={<LoadingOutlined style={{ fontSize: 48 }} spin />} />
      </section>
    );

  if (isError) {
    Swal.fire({
      icon: "error",
      title: "Error",
      text: "Ocurrió un error al obtener los clientes"
    });
  }

  return (
    <>
      <div className="flex h-16 w-full bg-white-100 rounded-md shadow-md mb-4 items-center pl-4 gap-4">
        <div className="flex gap-2">
          <button onClick={() => setCreateNewModal(true)} className={`${canCreate ? "toolbar-primary-icon-btn" : "bg-success-200"} `}>
            <PlusSvg />
            Nuevo
          </button>
        </div>
        <div className="flex">
          <Tooltip placement="top" title={"Refrescar"} arrow={{ pointAtCenter: true }}>
            <button
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
      <Table
        size="small"
        columns={columns}
        dataSource={clientsQuery.data}
        pagination={{ position: ["bottomCenter"], defaultPageSize: 20 }}
        className="shadow-md"
        rowKey={(record) => record.idNumber}
      />
      <CreateClientNomenclatorForm open={createNewModal} onCancel={() => setCreateNewModal(false)} />
      <EditClientNomenclatorForm open={editModal} onCancel={() => setEditModal(false)} initialValues={selectedNomenclator!} />
    </>
  );
};

export default ClientNomenclatorsTable;

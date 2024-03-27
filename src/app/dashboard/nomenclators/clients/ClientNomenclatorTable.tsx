"use client";
import { Button, Input, Space, Table, Tag, Tooltip } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import Highlighter from "react-highlight-words";
import React, { useEffect, useMemo, useRef, useState } from "react";
import Swal from "sweetalert2";
import type { ColumnType, ColumnsType } from "antd/es/table";
import type { FilterConfirmProps } from "antd/es/table/interface";
import type { InputRef } from "antd";

import {
  clientNomenclatorsStartLoading,
  startAddClientNomenclator,
  startDeleteClientNomenclator,
  startUpdateClientNomenclator
} from "@/actions/nomenclators/client";
import { DeleteSvg } from "@/app/global/DeleteSvg";
import { EditSvg } from "@/app/global/EditSvg";
import { IClientNomenclator } from "@/models/nomenclators/client";
import { PlusSvg } from "@/app/global/PlusSvg";
import { RefreshSvg } from "@/app/global/RefreshSvg";
import { RootState, useAppSelector } from "@/store/store";
import { Toast } from "@/helpers/customAlert";
import { useAppDispatch } from "@/hooks/hooks";
import { CreateClientNomenclatorForm } from "./CreateClientNomenclaorForm";
import { EditClientNomenclatorForm } from "./EditClientNomenclatorForm";

type DataIndex = keyof IClientNomenclator;

const ClientNomenclatorsTable: React.FC = () => {
  const dispatch = useAppDispatch();
  const [searchText, setSearchText] = useState("");
  const [searchedColumn, setSearchedColumn] = useState("");
  const [createNewModal, setCreateNewModal] = useState(false);
  const [editModal, setEditModal] = useState(false);
  const [selectedNomenclator, setSelectedNomenclator] = useState<IClientNomenclator>();
  const searchInput = useRef<InputRef>(null);
  const { data: sessionData } = useSession();

  const canList = sessionData?.user.role.includes("Listar Nomencladores");
  const canCreate = sessionData?.user.role.includes("Crear Nomenclador");
  const canEdit = sessionData?.user.role.includes("Editar Nomenclador");
  const canDelete = sessionData?.user.role.includes("Eliminar Nomenclador");

  useEffect(() => {
    dispatch(clientNomenclatorsStartLoading());
  }, [dispatch]);

  const { clientNomenclators }: { clientNomenclators: IClientNomenclator[] } = useAppSelector(
    (state: RootState) => state?.nomenclator
  );
  let data: IClientNomenclator[] = useMemo(() => clientNomenclators, [clientNomenclators]);

  const handleSearch = (
    selectedKeys: string[],
    confirm: (param?: FilterConfirmProps) => void,
    dataIndex: DataIndex
  ) => {
    confirm();
    setSearchText(selectedKeys[0]);
    setSearchedColumn(dataIndex);
  };

  const onCreate = (values: IClientNomenclator) => {
    dispatch(startAddClientNomenclator(values));
    setCreateNewModal(false);
  };
  const onEdit = (values: IClientNomenclator) => {
    dispatch(startUpdateClientNomenclator({ ...values, _id: selectedNomenclator?._id }));
    setEditModal(false);
  };

  const handleDelete = (id: string) => {
      Swal.fire({
        title: "Eliminar Nomenclador",
        text: "El nomenclador seleccionado se borrará de forma permanente",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        cancelButtonText: "Cancelar",
        confirmButtonText: "Eliminar"
      }).then((result) => {
        if (result.isConfirmed) {
          dispatch(startDeleteClientNomenclator(id));
        }
      });
  };

  const handleReset = (clearFilters: () => void) => {
    clearFilters();
    setSearchText("");
  };
  const handleEdit = (record: IClientNomenclator) => {
    setSelectedNomenclator(record);
    setEditModal(true);
  };

  const getColumnSearchProps = (dataIndex: DataIndex): ColumnType<IClientNomenclator> => ({
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

  const columns: ColumnsType<IClientNomenclator> = [
    {
      title: "Nombre",
      dataIndex: "name",
      key: "name",
      width: "30%",
      sorter: (a: any, b: any) => a.name.localeCompare(b.name),
      ...getColumnSearchProps("name")
    },
    {
      title: "Número de Cliente",
      dataIndex: "idNumber",
      key: "idNumber",
      width: "10%"
    },
    {
      title: "Teléfono",
      dataIndex: "phoneNumber",
      key: "phoneNumber",
      width: "10%"
    },
    {
      title: "Dirección",
      dataIndex: "address",
      key: "address",
      width: "20%",
      sorter: (a: any, b: any) => a.address.localeCompare(b.address),
      ...getColumnSearchProps("address")
    },
    {
      title: "Correo",
      dataIndex: "email",
      key: "email",
      width: "20%",
      sorter: (a: any, b: any) => a.email.localeCompare(b.email),
      ...getColumnSearchProps("email")
    },
    {
      title: "Acciones",
      key: "actions",
      width: "5%",
      render: (_, { ...record }) => (
        <div className="flex gap-1">
          {canEdit ? (
            <Tooltip placement="top" title={"Editar"} arrow={{ pointAtCenter: true }}>
              <button
                disabled={!canList}
                onClick={() => handleEdit(record)}
                className="table-see-action-btn"
              >
                <EditSvg width={20} height={20} />
              </button>
            </Tooltip>
          ) : (
            <></>
          )}

          <Tooltip placement="top" title={"Eliminar"} arrow={{ pointAtCenter: true }}>
            <button
              disabled={!canDelete}
              onClick={() => handleDelete(record._id)}
              className="table-delete-action-btn"
            >
              <DeleteSvg width={20} height={20} />
            </button>
          </Tooltip>
        </div>
      )
    }
  ];

  return (
    <>
      <div className="flex h-16 w-full bg-white-100 rounded-md shadow-md mb-4 items-center pl-4 gap-4">
        <div className="flex gap-2">
          <button
            onClick={() => setCreateNewModal(true)}
            className={`${canCreate ? "toolbar-primary-icon-btn" : "bg-success-200"} `}
          >
            <PlusSvg />
            Nuevo
          </button>
        </div>
        <div className="flex">
          <Tooltip placement="top" title={"Refrescar"} arrow={{ pointAtCenter: true }}>
            <button
              className={`${
                canList
                  ? "cursor-pointer hover:bg-white-600 ease-in-out duration-300"
                  : "opacity-20 pt-2 pl-2"
              } flex justify-center items-center w-[2.5rem] h-[2.5rem] text-xl rounded-full`}
              onClick={() => dispatch(clientNomenclatorsStartLoading())}
            >
              <RefreshSvg />
            </button>
          </Tooltip>
        </div>
      </div>
      <Table
        size="small"
        columns={columns}
        dataSource={data}
        pagination={{ position: ["bottomCenter"], defaultPageSize: 20 }}
        className="shadow-md"
      />

      <CreateClientNomenclatorForm
        open={createNewModal}
        onCancel={() => setCreateNewModal(false)}
        onCreate={onCreate}
      />
      <EditClientNomenclatorForm
        open={editModal}
        onCancel={() => setEditModal(false)}
        onCreate={onEdit}
        defaultValues={selectedNomenclator!}
      />
    </>
  );
};

export default ClientNomenclatorsTable;

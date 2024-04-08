"use client";

import { Button, Input, Space, Table, Tag, Tooltip } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import Highlighter from "react-highlight-words";
import React, { useEffect, useMemo, useRef, useState } from "react";
import type { ColumnType, ColumnsType } from "antd/es/table";
import type { FilterConfirmProps, TableRowSelection } from "antd/es/table/interface";
import type { InputRef } from "antd";

import { RootState, useAppSelector } from "@/store/store";
import { useAppDispatch } from "@/hooks/hooks";
import {
  startAddWorker,
  startDeleteWorker,
  startUpdateWorker,
  workersStartLoading
} from "@/actions/workers";
import { CreateWorkerForm } from "./CreateWorkerForm";
import { DeleteSvg } from "@/app/global/DeleteSvg";
import { EditSvg } from "@/app/global/EditSvg";
import { EditWorkerForm } from "./EditWorkerForm";
import { IWorker } from "@/models/worker";
import { nomenclatorsStartLoading } from "@/actions/nomenclator";
import { PlusSvg } from "@/app/global/PlusSvg";
import { useSession } from "next-auth/react";
import Swal from "sweetalert2";

type DataIndex = keyof IWorker;

const WorkersTable: React.FC = () => {
  const dispatch = useAppDispatch();
  const [searchText, setSearchText] = useState("");
  const [searchedColumn, setSearchedColumn] = useState("");
  const [createNewModal, setCreateNewModal] = useState(false);
  const [editModal, setEditModal] = useState(false);
  const [selectedWorker, setSelectedWorker] = useState<IWorker>();

  const searchInput = useRef<InputRef>(null);

  const { data: sessionData } = useSession();

  const canList = sessionData?.user.role.includes("Listar Trabajadores");
  const canCreate = sessionData?.user.role.includes("Crear Trabajador");
  const canEdit = sessionData?.user.role.includes("Editar Trabajador");
  const canDelete = sessionData?.user.role.includes("Eliminar Trabajador");

  useEffect(() => {
    dispatch(workersStartLoading());
    dispatch(nomenclatorsStartLoading());
  }, [dispatch]);

  const { workers } = useAppSelector((state: RootState) => state?.worker);
  let data: IWorker[] = useMemo(() => workers, [workers]);
  if (!canList) {
    data = [];
  }

  const handleNew = () => {
    setCreateNewModal(true);
  };

  const handleEdit = (record: IWorker) => {
    setSelectedWorker(record);
    setEditModal(true);
  };

  const onCreate = (values: any) => {
    dispatch(startAddWorker(values));
    setCreateNewModal(false);
  };

  const onEdit = (values: any) => {
    console.log("🚀 ~ onEdit ~ values:", values)
    dispatch(startUpdateWorker({ _id: selectedWorker?._id, ...values }));
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

  const handleDelete = (record: IWorker) => {
    Swal.fire({
      title: "Eliminar Trabajador",
      text: "El trabajador seleccionado se borrará de forma permanente",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      cancelButtonText: "Cancelar",
      confirmButtonText: "Eliminar"
    }).then((result) => {
      if (result.isConfirmed) {
        dispatch(startDeleteWorker(record._id));
      }
    });
  };

  const handleReset = (clearFilters: () => void) => {
    clearFilters();
    setSearchText("");
  };

  const getColumnSearchProps = (dataIndex: DataIndex): ColumnType<IWorker> => ({
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

  const columns: ColumnsType<IWorker> = [
    {
      title: <span className="font-bold">Nombre</span>,
      dataIndex: "name",
      key: "name",
      width: "25%",
      ...getColumnSearchProps("name")
    },
    {
      title: <span className="font-bold">CI</span>,
      dataIndex: "CI",
      key: "CI",
      width: "10%",
      ...getColumnSearchProps("CI")
    },
    {
      title: <span className="font-bold">Cargo</span>,
      dataIndex: "role",
      key: "role",
      width: "30%",
      ...getColumnSearchProps("role"),
      render: (_, { role }) => (
        <>
          {role.map((role) => {
            return <Tag key={role}>{role}</Tag>;
          })}
        </>
      )
    },
    {
      title: <span className="font-bold">Dirección</span>,
      dataIndex: "address",
      key: "address",
      width: "25%",
      ...getColumnSearchProps("address")
    },
    {
      title: <span className="font-bold">Cuenta Bancaria</span>,
      dataIndex: "bankAccount",
      key: "bankAccount",
      width: "20%",
      ...getColumnSearchProps("bankAccount")
    },
    {
      title: <span className="font-bold">Teléfono</span>,
      dataIndex: "phoneNumber",
      key: "phoneNumber",
      width: "10%",
      ...getColumnSearchProps("phoneNumber")
    },
    {
      title: <span className="font-bold">Acciones</span>,
      key: "actions",
      width: "5%",
      render: (_, { ...record }) => (
        <div className="flex gap-1">
          {canEdit ? (
            <>
              <Tooltip placement="top" title={"Editar"} arrow={{ pointAtCenter: true }}>
                <button onClick={() => handleEdit(record)} className="table-see-action-btn">
                  <EditSvg width={20} height={20} />
                </button>
              </Tooltip>
            </>
          ) : (
            <></>
          )}
          {canDelete ? (
            <Tooltip placement="top" title={"Eliminar"} arrow={{ pointAtCenter: true }}>
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
      <div className="flex h-16 w-full bg-white-100 rounded-md shadow-md mb-4 items-center pl-4 gap-4">
        <button disabled={!canCreate} onClick={handleNew} className="toolbar-primary-icon-btn">
          <PlusSvg />
          Nuevo
        </button>
      </div>

      <CreateWorkerForm
        open={createNewModal}
        onCancel={() => setCreateNewModal(false)}
        onCreate={onCreate}
      />
      <EditWorkerForm
        open={editModal}
        onCancel={() => setEditModal(false)}
        onCreate={onEdit}
        defaultValues={selectedWorker}
      />

      <Table
        size="middle"
        columns={columns}
        dataSource={data}
        pagination={{ position: ["bottomCenter"], defaultPageSize: 20 }}
        className="shadow-md"
      />
    </>
  );
};

export default WorkersTable;

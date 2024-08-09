"use client";

import { Button, Input, Space, Table, Tag, Tooltip } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import Highlighter from "react-highlight-words";
import React, { useEffect, useMemo, useRef, useState } from "react";
import type { ColumnType, ColumnsType } from "antd/es/table";
import type { FilterConfirmProps } from "antd/es/table/interface";
import type { InputRef } from "antd";

import { costSheetsStartLoading } from "@/actions/costSheet";
import { CreateUserForm } from "./CreateUserForm";
import { DeleteSvg } from "../../global/DeleteSvg";
import { EditSvg } from "../../global/EditSvg";
import { EditUserForm } from "./EditUserForm";
import { IUser } from "@/models/user";
import { nomenclatorsStartLoading } from "@/actions/nomenclator";
import { PlusSvg } from "../../global/PlusSvg";
import { PrivilegesForm } from "./PrivilegesForm";
import { RefreshSvg } from "../../global/RefreshSvg";
import { RootState, useAppSelector } from "@/store/store";
import { ShieldSvg } from "@/app/global/ShieldSvg";
import { startAddUser, startDeleteUser, startUpdateUser, usersStartLoading } from "@/actions/users";
import { useAppDispatch } from "@/hooks/hooks";
import { useSession } from "next-auth/react";
import Swal from "sweetalert2";

type DataIndex = keyof IUser;

const UserTable: React.FC = () => {
  const dispatch = useAppDispatch();
  const [searchText, setSearchText] = useState("");
  const [searchedColumn, setSearchedColumn] = useState("");
  const [createNewModal, setCreateNewModal] = useState(false);
  const [editModal, setEditModal] = useState(false);
  const [privilegesModal, setPrivilegesModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState<IUser>();
  const searchInput = useRef<InputRef>(null);
  const { data: sessionData } = useSession();

  const canList = sessionData?.user.role.includes("Listar Usuarios");
  const canCreate = sessionData?.user.role.includes("Crear Usuario");
  const canEdit = sessionData?.user.role.includes("Editar Usuario");
  const canDelete = sessionData?.user.role.includes("Eliminar Usuario");

  useEffect(() => {
    dispatch(usersStartLoading());
    dispatch(nomenclatorsStartLoading());
    dispatch(costSheetsStartLoading());
  }, [dispatch]);

  const { users }: { users: IUser[] } = useAppSelector((state: RootState) => state?.user);
  let data: IUser[] = useMemo(() => users, [users]);
  if (!canList) {
    data = [];
  }

  const handleNew = () => {
    setCreateNewModal(true);
  };

  const handleEdit = (record: IUser) => {
    setSelectedUser(record);
    setEditModal(true);
  };

  const handleEditPrivileges = (record: IUser) => {
    setSelectedUser(record);
    setPrivilegesModal(true);
  };

  const onCreate = (values: any) => {
    dispatch(startAddUser(values));
    setCreateNewModal(false);
    dispatch(usersStartLoading());
  };

  const onEdit = (values: any) => {
    dispatch(startUpdateUser({ _id: selectedUser?._id, ...values }));
    setEditModal(false);
  };

  const onEditPrivileges = (values: any) => {
    const privileges = values.humanResourcesPrivileges.concat(
      values.materialPrivileges,
      values.nomenclatorPrivileges,
      values.securityPrivileges,
      values.warehousePrivileges,
      values.costSheetPrivileges,
      values.serviceFeePrivileges,
      values.projectPrivileges
    );
    dispatch(startUpdateUser({ _id: selectedUser?._id, privileges: privileges }));
    setPrivilegesModal(false);
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

  const handleDelete = (record: IUser) => {
    Swal.fire({
      title: "Eliminar Usuario",
      text: "El usuario seleccionado se borrará de forma permanente",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      cancelButtonText: "Cancelar",
      confirmButtonText: "Eliminar"
    }).then((result) => {
      if (result.isConfirmed) {
        dispatch(startDeleteUser(record?._id!));
      }
    });
  };

  const handleReset = (clearFilters: () => void) => {
    clearFilters();
    setSearchText("");
  };

  const getColumnSearchProps = (dataIndex: DataIndex): ColumnType<IUser> => ({
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

  const columns: ColumnsType<IUser> = [
    {
      title: <span className="font-semibold">Usuario</span>,
      dataIndex: "user",
      key: "user",
      width: "10%",
      ...getColumnSearchProps("user")
    },
    {
      title: <span className="font-semibold">Nombre</span>,
      dataIndex: "userName",
      key: "userName",
      width: "10%",
      ...getColumnSearchProps("lastName")
    },
    {
      title: <span className="font-semibold">Apellidos</span>,
      dataIndex: "lastName",
      key: "lastName",
      width: "10%",
      ...getColumnSearchProps("lastName")
    },
    {
      title: <span className="font-semibold">Privilegios</span>,
      dataIndex: "privileges",
      key: "privileges",
      width: "60%",
      ...getColumnSearchProps("privileges"),
      render: (_, { privileges }) => (
        <>
          {privileges?.map((privilege) => {
            return <Tag key={privilege}>{privilege}</Tag>;
          })}
        </>
      )
    },
    {
      title: <span className="font-semibold">Area</span>,
      dataIndex: "area",
      key: "area",
      width: "15%",
      ...getColumnSearchProps("area"),
      render: (_, { area }) => (
        <>
          {area?.map((a) => {
            return <Tag key={a}>{a}</Tag>;
          })}
        </>
      )
    },
    {
      title: <span className="font-semibold">Acciones</span>,
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
              <Tooltip
                placement="top"
                title={"Cambiar Privilegios"}
                arrow={{ pointAtCenter: true }}
              >
                <button
                  onClick={() => handleEditPrivileges(record)}
                  className="table-see-offer-action-btn"
                >
                  <ShieldSvg width={20} height={20} />
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
        <button disabled={!canCreate} onClick={handleNew} className={"toolbar-primary-icon-btn"}>
          <PlusSvg />
          Nuevo
        </button>
        <div className="flex">
          <Tooltip placement="top" title={"Refrescar"} arrow={{ pointAtCenter: true }}>
            <button
              disabled={!canList}
              className={`${
                canList
                  ? "cursor-pointer hover:bg-white-600 ease-in-out duration-300"
                  : "opacity-20 pt-2 pl-2"
              } flex justify-center items-center w-[2.5rem] h-[2.5rem] text-xl rounded-full`}
              onClick={() => dispatch(usersStartLoading())}
            >
              <RefreshSvg />
            </button>
          </Tooltip>
        </div>
      </div>

      <CreateUserForm
        open={createNewModal}
        onCancel={() => setCreateNewModal(false)}
        onCreate={onCreate}
      />
      <EditUserForm
        open={editModal}
        onCancel={() => setEditModal(false)}
        onCreate={onEdit}
        defaultValues={selectedUser!}
      />
      <PrivilegesForm
        open={privilegesModal}
        onCancel={() => setPrivilegesModal(false)}
        onCreate={onEditPrivileges}
        defaultValues={selectedUser!}
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

export default UserTable;

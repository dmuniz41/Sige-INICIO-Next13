"use client";

import { Button, Input, Space, Table, Tag, Tooltip } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import Highlighter from "react-highlight-words";
import React, { useEffect, useMemo, useRef, useState } from "react";
import type { ColumnType, ColumnsType } from "antd/es/table";
import type { FilterConfirmProps, TableRowSelection } from "antd/es/table/interface";
import type { InputRef } from "antd";

import { costSheetsStartLoading, startSetCurrencyChange } from "@/actions/costSheet";
import { CreateUserForm } from "./CreateUserForm";
import { DeleteSvg } from "../../global/DeleteSvg";
import { EditSvg } from "../../global/EditSvg";
import { EditUserForm } from "./EditUserForm";
import { nomenclatorsStartLoading } from "@/actions/nomenclator";
import { PlusSvg } from "../../global/PlusSvg";
import { PrivilegesForm } from "./PrivilegesForm";
import { RefreshSvg } from "../../global/RefreshSvg";
import { RootState, useAppSelector } from "@/store/store";
import { SetCurrencyChangeForm } from "./SetCurrencyChangeForm";
import { ShieldSvg } from "@/app/global/ShieldSvg";
import { startAddUser, startDeleteUser, startUpdateUser, usersStartLoading } from "@/actions/users";
import { Toast } from "@/helpers/customAlert";
import { useAppDispatch } from "@/hooks/hooks";
import { useSession } from "next-auth/react";
import Swal from "sweetalert2";

interface DataType {
  _id: string;
  key: string;
  user: string;
  userName: string;
  lastName: string;
  privileges: string[];
  area: string[];
}

type DataIndex = keyof DataType;

const UserTable: React.FC = () => {
  const dispatch = useAppDispatch();
  const [searchText, setSearchText] = useState("");
  const [searchedColumn, setSearchedColumn] = useState("");
  const [createNewModal, setCreateNewModal] = useState(false);
  const [editModal, setEditModal] = useState(false);
  const [privilegesModal, setPrivilegesModal] = useState(false);
  // const [currencyChangeModal, setCurrencyChangeModal] = useState(false);
  const [selectedRow, setSelectedRow] = useState<DataType>();
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

  const { users }: any = useAppSelector((state: RootState) => state?.user);
  let data: DataType[] = useMemo(() => users, [users]);
  if (!canList) {
    data = [];
  }

  const handleNew = (): void => {
    setCreateNewModal(true);
  };

  const handleEdit = (): void => {
    if (selectedRow) {
      setEditModal(true);
    } else {
      Toast.fire({
        icon: "error",
        title: "Seleccione un usuario a editar",
      });
    }
  };

  const handleEditPrivileges = (): void => {
    if (selectedRow) {
      setPrivilegesModal(true);
    } else {
      Toast.fire({
        icon: "error",
        title: "Seleccione un usuario para cambiar sus permisos",
      });
    }
  };

  const onCreate = (values: any): void => {
    dispatch(startAddUser(values.user, values.userName, values.lastName, values.privileges, values.password, values.area));
    setCreateNewModal(false);
    dispatch(usersStartLoading());
  };

  const onEdit = (values: any): void => {
    console.log(values);
    dispatch(startUpdateUser(selectedRow?._id!, values.user, values.userName, values.lastName, values.privileges, values.area));
    setSelectedRow(undefined);
    setEditModal(false);
  };
  const onEditPrivileges = (values: any): void => {
    console.log(values);
    const privileges = values.humanResourcesPrivileges.concat(
      values.materialPrivileges,
      values.nomenclatorPrivileges,
      values.securityPrivileges,
      values.warehousePrivileges,
      values.costSheetPrivileges,
      values.serviceFeePrivileges,
      values.projectPrivileges
    );
    dispatch(startUpdateUser(selectedRow?._id!, values.user, values.userName, values.lastName, privileges, values.area));
    setSelectedRow(undefined);
    setPrivilegesModal(false);
  };
  // const onSetCurrencyChange = (values: any): void => {
  //   dispatch(startSetCurrencyChange(values.currencyChange, costSheets));
  //   setCurrencyChangeModal(false);
  // };

  const handleSearch = (selectedKeys: string[], confirm: (param?: FilterConfirmProps) => void, dataIndex: DataIndex) => {
    confirm();
    setSearchText(selectedKeys[0]);
    setSearchedColumn(dataIndex);
  };

  const handleDelete = () => {
    if (selectedRow) {
      Swal.fire({
        title: "Eliminar Usuario",
        text: "El usuario seleccionado se borrará de forma permanente",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        cancelButtonText: "Cancelar",
        confirmButtonText: "Eliminar",
      }).then((result) => {
        if (result.isConfirmed) {
          dispatch(startDeleteUser(selectedRow?.user));
        }
      });
    } else {
      Toast.fire({
        icon: "error",
        title: "Seleccione un usuario a eliminar",
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
      console.log(`selectedRowKeys: ${selectedRowKeys}`, "selectedRow: ", selectedRows, selectedRows);
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
        <Highlighter highlightStyle={{ backgroundColor: "#ffc069", padding: 0 }} searchWords={[searchText]} autoEscape textToHighlight={text ? text.toString() : ""} />
      ) : (
        text
      ),
  });

  const columns: ColumnsType<DataType> = [
    {
      title: "Usuario",
      dataIndex: "user",
      key: "user",
      width: "10%",
      ...getColumnSearchProps("user"),
    },
    {
      title: "Nombre",
      dataIndex: "userName",
      key: "userName",
      width: "10%",
      ...getColumnSearchProps("lastName"),
    },
    {
      title: "Apellidos",
      dataIndex: "lastName",
      key: "lastName",
      width: "10%",
      ...getColumnSearchProps("lastName"),
    },
    {
      title: "Privilegios",
      dataIndex: "privileges",
      key: "privileges",
      width: "60%",
      ...getColumnSearchProps("privileges"),
      render: (_, { privileges }) => (
        <>
          {privileges.map((privilege) => {
            return <Tag key={privilege}>{privilege}</Tag>;
          })}
        </>
      ),
    },
    {
      title: "Area",
      dataIndex: "area",
      key: "area",
      width: "15%",
      ...getColumnSearchProps("area"),
      render: (_, { area }) => (
        <>
          {area.map((a) => {
            return <Tag key={a}>{a}</Tag>;
          })}
        </>
      ),
    },
  ];

  // !TODO: Pasar la opcion de establecer la tasa de cambio completamente hacia la hoja de auxiliares de las tarifas de servicio

  return (
    <>
      <div className="flex h-16 w-full bg-white-100 rounded-md shadow-md mb-4 items-center pl-4 gap-4">
        <button disabled={!canCreate} onClick={handleNew} className={"toolbar-primary-icon-btn"}>
          <PlusSvg />
          Nuevo
        </button>
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
          <Tooltip placement="top" title={"Cambiar Permisos"} arrow={{ pointAtCenter: true }}>
            <button
              disabled={!canEdit}
              className={`${
                canEdit ? "cursor-pointer hover:bg-white-600 ease-in-out duration-300" : "opacity-20 pt-2 pl-2"
              } flex justify-center items-center w-[2.5rem] h-[2.5rem] text-xl rounded-full`}
              onClick={handleEditPrivileges}
            >
              <ShieldSvg />
            </button>
          </Tooltip>
          {/* <Tooltip placement="top" title={"Establecer Tasa de Cambio"} arrow={{ pointAtCenter: true }}>
            <button
              disabled={!canEdit}
              className={`${
                canEdit ? "cursor-pointer hover:bg-white-600 ease-in-out duration-300" : "opacity-20 pt-2 pl-2"
              } flex justify-center items-center w-[2.5rem] h-[2.5rem] text-xl rounded-full`}
              onClick={handleSetCurrencyChange}
            >
              <CurrencySvg />
            </button>
          </Tooltip> */}
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
              onClick={() => dispatch(usersStartLoading())}
            >
              <RefreshSvg />
            </button>
          </Tooltip>
        </div>
      </div>

      <CreateUserForm open={createNewModal} onCancel={() => setCreateNewModal(false)} onCreate={onCreate} />
      <EditUserForm open={editModal} onCancel={() => setEditModal(false)} onCreate={onEdit} defaultValues={selectedRow} />
      <PrivilegesForm open={privilegesModal} onCancel={() => setPrivilegesModal(false)} onCreate={onEditPrivileges} defaultValues={selectedRow} />
      {/* <SetCurrencyChangeForm open={currencyChangeModal} onCancel={() => setCurrencyChangeModal(false)} onCreate={onSetCurrencyChange} defaultValues={currencyChange} /> */}

      <Table
        size="middle"
        columns={columns}
        dataSource={data}
        pagination={{ position: ["bottomCenter"], defaultPageSize: 20 }}
        rowSelection={{
          type: "radio",
          ...rowSelection,
        }}
        className="shadow-md"
      />
    </>
  );
};

export default UserTable;

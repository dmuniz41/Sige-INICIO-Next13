"use client";

import { Table, Tag, Tooltip } from "antd";
import React, { useState } from "react";
import Swal from "sweetalert2";
import type { ColumnsType } from "antd/es/table";

import { CreateUserForm } from "./CreateUserForm";
import { DeleteSvg } from "../../global/DeleteSvg";
import { EditSvg } from "../../global/EditSvg";
import { EditUserForm } from "./EditUserForm";
import { PlusSvg } from "../../global/PlusSvg";
import { PrivilegesForm } from "./PrivilegesForm";
import { RefreshSvg } from "../../global/RefreshSvg";
import { ShieldSvg } from "@/app/global/ShieldSvg";
import { User } from "@/db/migrations/schema";
import { useUser } from "@/hooks/users/useUsers";

const UserTable: React.FC = () => {
  const [createNewModal, setCreateNewModal] = useState(false);
  const [editModal, setEditModal] = useState(false);
  const [privilegesModal, setPrivilegesModal] = useState(false);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [selectedUser, setSelectedUser] = useState<User>();

  const { useGetUsers, useDeleteUser } = useUser();
  const { mutateAsync: deleteUser } = useDeleteUser();
  const { data: users, isLoading: isUsersLoading } = useGetUsers(page, limit);

  const handleNew = () => {
    setCreateNewModal(true);
  };

  const handleEdit = (record: User) => {
    setSelectedUser(record);
    setEditModal(true);
  };

  const handleEditPrivileges = (record: User) => {
    setSelectedUser(record);
    setPrivilegesModal(true);
  };

  const onCreate = (values: any) => {
    setCreateNewModal(false);
  };

  const onEdit = (values: any) => {
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
    setPrivilegesModal(false);
  };

  const handleDelete = (record: User) => {
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
        deleteUser(record.id);
      }
    });
  };

  const columns: ColumnsType<User> = [
    {
      title: <span className="font-bold">Usuario</span>,
      dataIndex: "userName",
      width: "10%"
    },
    {
      title: <span className="font-bold">Nombre</span>,
      dataIndex: "name",
      width: "10%"
    },
    {
      title: <span className="font-bold">Apellidos</span>,
      dataIndex: "lastName",
      width: "10%"
    },
    {
      title: <span className="font-bold">Privilegios</span>,
      dataIndex: "privileges",
      width: "60%",
      render: (_, { privileges }) => (
        <>
          {privileges?.map((privilege) => {
            return <Tag key={privilege}>{privilege}</Tag>;
          })}
        </>
      )
    },
    {
      title: <span className="font-bold">Area</span>,
      dataIndex: "area",
      width: "15%",
      render: (_, { area }) => (
        <>
          {area?.map((area) => {
            return <Tag key={area}>{area}</Tag>;
          })}
        </>
      )
    },
    {
      title: <span className="font-bold">Acciones</span>,
      key: "actions",
      width: "5%",
      render: (_, { ...record }) => (
        <div className="flex gap-1">
          <>
            <Tooltip placement="top" title={"Editar"} arrow={{ pointAtCenter: true }}>
              <button onClick={() => handleEdit(record)} className="table-see-action-btn">
                <EditSvg width={20} height={20} />
              </button>
            </Tooltip>
            <Tooltip placement="top" title={"Cambiar Privilegios"} arrow={{ pointAtCenter: true }}>
              <button onClick={() => handleEditPrivileges(record)} className="table-see-offer-action-btn">
                <ShieldSvg width={20} height={20} />
              </button>
            </Tooltip>
          </>
          <Tooltip placement="top" title={"Eliminar"} arrow={{ pointAtCenter: true }}>
            <button onClick={() => handleDelete(record)} className="table-delete-action-btn">
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
        <button onClick={handleNew} className={"toolbar-primary-icon-btn"}>
          <PlusSvg />
          Nuevo
        </button>
        <div className="flex">
          <Tooltip placement="top" title={"Refrescar"} arrow={{ pointAtCenter: true }}>
            <button
              className={`${"cursor-pointer hover:bg-white-600 ease-in-out duration-300 opacity-20 pt-2 pl-2"} flex justify-center items-center w-[2.5rem] h-[2.5rem] text-xl rounded-full`}
            >
              <RefreshSvg />
            </button>
          </Tooltip>
        </div>
      </div>

      <CreateUserForm open={createNewModal} onCancel={() => setCreateNewModal(false)} onCreate={onCreate} />
      <EditUserForm open={editModal} onCancel={() => setEditModal(false)} onCreate={onEdit} defaultValues={selectedUser!} />
      <PrivilegesForm
        open={privilegesModal}
        onCancel={() => setPrivilegesModal(false)}
        onCreate={onEditPrivileges}
        defaultValues={selectedUser!}
      />

      <Table
        size="middle"
        columns={columns}
        dataSource={users}
        pagination={{ position: ["bottomCenter"], defaultPageSize: 20 }}
        className="shadow-md"
        rowKey={"id"}
      />
    </>
  );
};

export default UserTable;

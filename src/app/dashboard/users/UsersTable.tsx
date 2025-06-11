"use client";

import { Table, Tag, Tooltip } from "antd";
import { useQueryClient } from "@tanstack/react-query";
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
import { UserFilters } from "@/types/DTOs/users/users";
import FilterDrawer from "./FiltersDrawer";
import { FilterSvg } from "@/app/global/FilterSvg";

const UserTable: React.FC = () => {
  const queryClient = useQueryClient();
  const [createNewModal, setCreateNewModal] = useState(false);
  const [editModal, setEditModal] = useState(false);
  const [privilegesModal, setPrivilegesModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User>();
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState<UserFilters>({});
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const { useGetUsers, useDeleteUser } = useUser();
  const { mutateAsync: deleteUser } = useDeleteUser();
  const { data: users, isLoading: isUsersLoading } = useGetUsers(currentPage,pageSize, filters);
  console.log("🚀 ~ users:", users)

  const handleFilterSubmit = (filters: any) => {
    setCurrentPage(1); // Reset to first page when filters change
    setFilters(filters);
  };

  const handleFilterReset = () => {
    setCurrentPage(1);
    setFilters({});
  };

  const handleShowFilters = () => {
    setShowFilters(true);
  };

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

  const handleRefresh = () => {
    queryClient.invalidateQueries({ queryKey: ["GetUsers", currentPage, pageSize] }); 
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
          <Tooltip placement="top" title={"Filtrar"} arrow={{ pointAtCenter: true }}>
            <button
              className="cursor-pointer hover:bg-white-600 ease-in-out duration-300 p-2 flex justify-center items-center text-xl rounded-full"
              onClick={handleShowFilters}
            >
              <FilterSvg width={25} height={25} />
            </button>
          </Tooltip>
          <Tooltip placement="top" title={"Refrescar"} arrow={{ pointAtCenter: true }}>
            <button
              className="cursor-pointer hover:bg-white-600 ease-in-out duration-300 p-2 flex justify-center items-center text-xl rounded-full"
              onClick={handleRefresh}
            >
              <RefreshSvg width={25} height={25} />
            </button>
          </Tooltip>
        </div>
      </div>

      <CreateUserForm open={createNewModal} onCancel={() => setCreateNewModal(false)} />
      <EditUserForm open={editModal} onCancel={() => setEditModal(false)} defaultValues={selectedUser!} />
      <PrivilegesForm
        open={privilegesModal}
        onCancel={() => setPrivilegesModal(false)}
        onCreate={onEditPrivileges}
        defaultValues={selectedUser!}
      />

      <Table
        size="middle"
        loading={isUsersLoading}
        columns={columns}
        dataSource={users}
        pagination={{
          defaultCurrent: 1,
          defaultPageSize: 10,
          showSizeChanger: true,
          showQuickJumper: true,
          onChange(page, pageSize) {
            setCurrentPage(page);
            setPageSize(pageSize);
          },
          position: ["bottomCenter"],
          pageSizeOptions: ["10", "15", "20", "25"],
          showTotal: (total, range) => `${range[0]}-${range[1]} of ${total}`,
        }}
        
        className="shadow-md"
        rowKey={"id"}
      />
      <FilterDrawer open={showFilters} onCancel={() => setShowFilters(false)} onFilter={handleFilterSubmit} onReset={handleFilterReset} />
    </>
  );
};

export default UserTable;

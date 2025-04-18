"use client";
import { Badge, Button, Input, Space, Spin, Table, Tag, Tooltip } from "antd";
import { LoadingOutlined, SearchOutlined } from "@ant-design/icons";
import { useQueryClient } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import Highlighter from "react-highlight-words";
import React, { useRef, useState } from "react";
import Swal from "sweetalert2";
import type { ColumnType, ColumnsType } from "antd/es/table";
import type { FilterConfirmProps } from "antd/es/table/interface";
import type { InputRef } from "antd";

import { CreateMaterialNomenclatorForm } from "./CreateMaterialNomenclatorForm";
import { DeleteSvg } from "@/app/global/DeleteSvg";
import { EditMaterialNomenclatorForm } from "./EditMaterialNomenclatorForm";
import { EditSvg } from "@/app/global/EditSvg";
import { InfoCircleSvg } from "@/app/global/InfoCircleSvg";
import { MaterialNomenclators } from "@/db/migrations/schema";
import { PlusSvg } from "@/app/global/PlusSvg";
import { RefreshSvg } from "@/app/global/RefreshSvg";
import { useMaterialNomenclator } from "@/hooks/nomenclators/material/useMaterialNomenclator";
import { MaterialsNomenclatorsFilters } from "./MaterialsNomenclatorsFilters";
import { FilterSvg } from "@/app/global/FilterSvg";

type DataIndex = keyof MaterialNomenclators;

const MaterialsNomenclatorsTable: React.FC = () => {
  const { data: sessionData } = useSession();
  const queryClient = useQueryClient();
  const [createNewModal, setCreateNewModal] = useState(false);
  const [editModal, setEditModal] = useState(false);
  const [page, setPage] = useState<number>(1);
  const [limit, setLimit] = useState<number>(15);
  const [filters, setFilters] = useState<MaterialsNomenclatorsFilters>({});
  const [showFilters, setShowFilters] = useState(false);
  const [selectedNomenclator, setSelectedNomenclator] = useState<MaterialNomenclators>();

  const { useGetMaterialNomenclator, useDeleteMaterialNomenclator } = useMaterialNomenclator();
  const deleteMutation = useDeleteMaterialNomenclator();
  const { data: materialsNomenclators, isLoading, isError } = useGetMaterialNomenclator(page, limit, filters);

  const canList = sessionData?.user.role.includes("Listar Nomencladores");
  const canCreate = sessionData?.user.role.includes("Crear Nomenclador");
  const canEdit = sessionData?.user.role.includes("Editar Nomenclador");
  const canDelete = sessionData?.user.role.includes("Eliminar Nomenclador");

  const handleDelete = (code: number) => {
    Swal.fire({
      title: "Eliminar Nomenclador de Material",
      text: "El nomenclador seleccionado se borrará de forma permanente",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      cancelButtonText: "Cancelar",
      confirmButtonText: "Eliminar"
    }).then((result) => {
      if (result.isConfirmed) {
        deleteMutation.mutate(code);
      }
    });
  };

  const handleRefresh = () => {
    queryClient.invalidateQueries({ queryKey: ["GetMaterialNomenclators", page, limit] });
  };

  const handleOpenFilters = () => {
    setShowFilters(!showFilters);
  };

  const handleEdit = (record: MaterialNomenclators) => {
    setSelectedNomenclator(record);
    setEditModal(true);
  };

  const handleFilter = (filters: MaterialsNomenclatorsFilters) => {
    setFilters(filters);
    queryClient.invalidateQueries({ queryKey: ["GetMaterialNomenclators", page, limit, filters] });
  };

  const columns: ColumnsType<MaterialNomenclators> = [
    {
      title: (
        <Tooltip placement="top" title={"Identifica la categoría del material (Ej: PVC, Acrilico, Lona, etc...)"}>
          <div className="flex w-fit gap-2 items-center">
            <span className="font-bold">Categoría</span>
            <InfoCircleSvg width={20} height={20} />
          </div>
        </Tooltip>
      ),
      dataIndex: "material_category",
      width: "30%"
    },
    {
      title: (
        <Tooltip placement="top" title={"Identifica la variante de la categoría seleccionada (Ej: 3mm, 6mm, Transparente, Mate, etc...)"}>
          <div className="flex w-fit gap-2 items-center">
            <span className="font-bold">Nombre</span>
            <InfoCircleSvg width={20} height={20} />
          </div>
        </Tooltip>
      ),
      dataIndex: "material_name",
      width: "30%"
    },
    {
      title: (
        <Tooltip
          placement="top"
          title={"Si el material es gastable se le aplica un coeficiente de merma durante el calculo de la ficha de costo"}
        >
          <div className="flex w-fit gap-2 items-center">
            <span className="font-bold">Gastable</span>
            <InfoCircleSvg width={20} height={20} />
          </div>
        </Tooltip>
      ),
      dataIndex: "isDecrease",
      width: "5%",
      render: (_, { ...record }) => (
        <div className="flex gap-1 ">
          {record.isDecrease ? (
            <Tag color="#ffa426" className="text-lg font-semibold">
              Gastable
            </Tag>
          ) : (
            <Tag color="#34b042" className="text-lg font-semibold">
              No Gastable
            </Tag>
          )}
        </div>
      )
    },
    {
      title: <span className="font-bold">Acciones</span>,
      width: "5%",
      align: "center",
      render: (_, { ...record }) => (
        <div className="flex gap-1 justify-center">
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
            <button disabled={!canDelete} onClick={() => handleDelete(record.code)} className="table-delete-action-btn">
              <DeleteSvg width={20} height={20} />
            </button>
          </Tooltip>
        </div>
      )
    }
  ];

  if (isError) {
    Swal.fire({
      icon: "error",
      title: "Error",
      text: "Ocurrió un error al obtener los nomencladores de materiales"
    });
  }

  return (
    <>
      <section className="flex h-16 w-full bg-white-100 rounded-md shadow-md mb-4 items-center pl-4 gap-4 animater-fade-in">
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
          <Tooltip placement="top" title={"Filtrar"} arrow={{ pointAtCenter: true }}>
            <button
              className={`${
                canList ? "cursor-pointer hover:bg-white-600 ease-in-out duration-300" : "opacity-20 pt-2 pl-2"
              } flex justify-center items-center w-[2.5rem] h-[2.5rem] text-xl rounded-full`}
              onClick={handleOpenFilters}
            >
              <FilterSvg />
            </button>
          </Tooltip>
        </div>
      </section>
      <MaterialsNomenclatorsFilters open={showFilters} onCancel={() => setShowFilters(false)} onFilter={handleFilter} />
      <Table
        size="small"
        columns={columns}
        dataSource={materialsNomenclators?.data}
        loading={{
          spinning: isLoading,
          indicator: <Spin indicator={<LoadingOutlined style={{ fontSize: 50, color: "#ff8533" }} spin />} />
        }}
        pagination={{
          position: ["bottomCenter"],
          defaultPageSize: 15,
          total: materialsNomenclators?.total,
          onChange: (page, limit) => {
            setPage(page);
            setLimit(limit);
          }
        }}
        className="shadow-md"
        rowKey={(record) => record.code}
      />
      <CreateMaterialNomenclatorForm open={createNewModal} onCancel={() => setCreateNewModal(false)} />
      <EditMaterialNomenclatorForm
        open={editModal}
        onCancel={() => {
          setEditModal(false);
        }}
        initialValues={selectedNomenclator!}
      />
    </>
  );
};

export default MaterialsNomenclatorsTable;

"use client";
import { LoadingOutlined } from "@ant-design/icons";
import { Spin, Table, Tag, Tooltip } from "antd";
import { useQueryClient } from "@tanstack/react-query";
import React, { useState } from "react";
import Swal from "sweetalert2";
import type { ColumnsType } from "antd/es/table";

import { CreateMaterialNomenclatorForm } from "./CreateMaterialNomenclatorForm";
import { DeleteSvg } from "@/app/global/DeleteSvg";
import { EditMaterialNomenclatorForm } from "./EditMaterialNomenclatorForm";
import { EditSvg } from "@/app/global/EditSvg";
import { InfoCircleSvg } from "@/app/global/InfoCircleSvg";
import { MaterialNomenclators } from "@/db/migrations/schema";
import { PlusSvg } from "@/app/global/PlusSvg";
import { RefreshSvg } from "@/app/global/RefreshSvg";
import { useMaterialNomenclator } from "@/hooks/nomenclators/material/useMaterialNomenclator";
import { FilterSvg } from "@/app/global/FilterSvg";
import { MaterialNomenclatorsFilters } from "@/types/DTOs/nomenclators/materials";
import FilterDrawer from "./FiltersDrawer";

const MaterialsNomenclatorsTable: React.FC = () => {
  const queryClient = useQueryClient();
  const [createNewModal, setCreateNewModal] = useState(false);
  const [editModal, setEditModal] = useState(false);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [limit, setLimit] = useState<number>(15);
  const [filters, setFilters] = useState<MaterialNomenclatorsFilters>({});
  const [showFilters, setShowFilters] = useState(false);
  const [selectedNomenclator, setSelectedNomenclator] = useState<MaterialNomenclators>();

  const { useGetMaterialNomenclator, useDeleteMaterialNomenclator } = useMaterialNomenclator();
  const { mutateAsync: deleteMaterialNomenclator } = useDeleteMaterialNomenclator();
  const { data: materialsNomenclators, isLoading, isError } = useGetMaterialNomenclator(currentPage, limit, filters);

  const handleFilterSubmit = (filters: any) => {
    setCurrentPage(1);
    setFilters(filters);
  };

  const handleFilterReset = () => {
    setCurrentPage(1);
    setFilters({});
  };

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
        deleteMaterialNomenclator(code);
      }
    });
  };

  const handleRefresh = () => {
    queryClient.invalidateQueries({ queryKey: ["GetMaterialNomenclators", currentPage, limit, filters] });
  };

  const handleNew = () => {
    setCreateNewModal(true);
  };

    const handleShowFilters = () => {
      setShowFilters(!showFilters);
    };

  const handleEdit = (record: MaterialNomenclators) => {
    setSelectedNomenclator(record);
    setEditModal(true);
  };

  const columns: ColumnsType<MaterialNomenclators> = [
    {
      title: (
        <Tooltip placement="top" title={"Identifica la categoría del material (Ej: PVC, Acrilico, Lona, etc...)"}>
          <div className="flex w-fit gap-2 items-center">
            <span className="text-base font-bold">Categoría</span>
            <InfoCircleSvg width={20} height={20} />
          </div>
        </Tooltip>
      ),
      dataIndex: "material_category",
      width: "30%",
      render(value) {
        return <span className="text-base">{value}</span>;
      }
    },
    {
      title: (
        <Tooltip placement="top" title={"Identifica la variante de la categoría seleccionada (Ej: 3mm, 6mm, Transparente, Mate, etc...)"}>
          <div className="flex w-fit gap-2 items-center">
            <span className="text-base font-bold">Nombre</span>
            <InfoCircleSvg width={20} height={20} />
          </div>
        </Tooltip>
      ),
      dataIndex: "material_name",
      width: "30%",
      render(value) {
        return <span className="text-base">{value}</span>;
      }
    },
    {
      title: (
        <Tooltip
          placement="top"
          title={"Si el material es gastable se le aplica un coeficiente de merma durante el calculo de la ficha de costo"}
        >
          <div className="flex w-fit gap-2 items-center">
            <span className="text-base font-bold">Gastable</span>
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
      title: <span className="text-base font-bold">Acciones</span>,
      width: "5%",
      align: "center",
      render: (_, { ...record }) => (
        <div className="flex gap-1 justify-center">
          <Tooltip placement="top" title={"Editar"} arrow={{ pointAtCenter: true }}>
            <button onClick={() => handleEdit(record)} className="table-see-action-btn">
              <EditSvg width={20} height={20} />
            </button>
          </Tooltip>

          <Tooltip placement="top" title={"Eliminar"} arrow={{ pointAtCenter: true }}>
            <button onClick={() => handleDelete(record.code)} className="table-delete-action-btn">
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
      <section className="flex h-16 w-full bg-white-100 rounded-md shadow-md mb-4 items-center pl-4 gap-4">
        <button className={"toolbar-primary-icon-btn"} onClick={handleNew}>
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
      </section>
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
            setCurrentPage(page);
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
        defaultValues={selectedNomenclator!}
      />
      <FilterDrawer open={showFilters} onCancel={() => setShowFilters(false)} onFilter={handleFilterSubmit} onReset={handleFilterReset} />
    </>
  );
};

export default MaterialsNomenclatorsTable;

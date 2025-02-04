"use client";
import { Badge, Button, Input, Space, Spin, Table, Tooltip } from "antd";
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
import { MaterialCategoryNomenclators } from "@/db/migrations/schema";
import { PlusSvg } from "@/app/global/PlusSvg";
import { RefreshSvg } from "@/app/global/RefreshSvg";
import { useMaterialCategoryNomenclator } from "@/hooks/nomenclators/materialCategory/useMaterialCategoryNomenclator";

type DataIndex = keyof MaterialCategoryNomenclators;

const MaterialsNomenclatorsTable: React.FC = () => {
  const { data: sessionData } = useSession();
  const searchInput = useRef<InputRef>(null);
  const queryClient = useQueryClient();
  const [createNewModal, setCreateNewModal] = useState(false);
  const [editModal, setEditModal] = useState(false);
  const [page, setPage] = useState<number>(1);
  const [limit, setLimit] = useState<number>(10);
  const [searchedColumn, setSearchedColumn] = useState("");
  const [searchText, setSearchText] = useState("");
  const [selectedNomenclator, setSelectedNomenclator] = useState<MaterialCategoryNomenclators>();
  
  const { useGetMaterialCategoryNomenclator, useDeleteMaterialCategoryNomenclator } = useMaterialCategoryNomenclator();
  const deleteMutation = useDeleteMaterialCategoryNomenclator();
  const { data: materialsCategoryNomenclatorsQuery, isLoading, isError } = useGetMaterialCategoryNomenclator(page, limit);

  const canList = sessionData?.user.role.includes("Listar Nomencladores");
  const canCreate = sessionData?.user.role.includes("Crear Nomenclador");
  const canEdit = sessionData?.user.role.includes("Editar Nomenclador");
  const canDelete = sessionData?.user.role.includes("Eliminar Nomenclador");

  const handleSearch = (selectedKeys: string[], confirm: (param?: FilterConfirmProps) => void, dataIndex: DataIndex) => {
    confirm();
    setSearchText(selectedKeys[0]);
    setSearchedColumn(dataIndex);
  };

  const handleDelete = (code: string) => {
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
    queryClient.invalidateQueries({queryKey: ["GetMaterialCategoryNomenclators"]});
  };

  const handleReset = (clearFilters: () => void) => {
    clearFilters();
    setSearchText("");
  };

  const handleEdit = (record: MaterialCategoryNomenclators) => {
    setSelectedNomenclator(record);
    setEditModal(true);
  };

  const getColumnSearchProps = (dataIndex: DataIndex): ColumnType<MaterialCategoryNomenclators> => ({
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

  const columns: ColumnsType<MaterialCategoryNomenclators> = [
    {
      title: <span className="font-bold">Nombre</span>,
      dataIndex: "value",
      width: "30%",
      ...getColumnSearchProps("value")
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
      width: "20%",
      render: (_, { ...record }) => (
        <div className="flex gap-1 ">
          {record.isDecrease ? <Badge status="warning" text="Gastable" /> : <Badge status="success" text="No Gastable" />}
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
      text: "Ocurrió un error al obtener las categorías de materiales" 
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
        dataSource={materialsCategoryNomenclatorsQuery?.data}
        pagination={{ position: ["bottomCenter"], defaultPageSize: 10 }}
        onChange={(pagination) => {
          setPage(pagination?.current ?? 1);
          setLimit(pagination?.pageSize ?? 10);
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

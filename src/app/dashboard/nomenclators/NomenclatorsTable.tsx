"use client";

import { Button, Input, Space, Table, Tooltip } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import Highlighter from "react-highlight-words";
import React, { useEffect, useMemo, useRef, useState } from "react";
import type { ColumnType, ColumnsType } from "antd/es/table";
import type { FilterConfirmProps } from "antd/es/table/interface";
import type { InputRef } from "antd";

import { CreateNomenclatorForm } from "./CreateNomenclatorForm";
import { DeleteSvg } from "@/app/global/DeleteSvg";
import { EditNomenclatorForm } from "./EditNomenclatorForm";
import { EditSvg } from "@/app/global/EditSvg";
import {
  nomenclatorsStartLoading,
  startAddNomenclator,
  startDeleteNomenclator,
  startUpdateNomenclator
} from "@/actions/nomenclator";
import { INomenclator } from "../../../models/nomenclator";
import { PlusSvg } from "@/app/global/PlusSvg";
import { RefreshSvg } from "@/app/global/RefreshSvg";
import { RootState, useAppSelector } from "@/store/store";
import { useAppDispatch } from "@/hooks/hooks";
import { useSession } from "next-auth/react";
import Swal from "sweetalert2";

type DataIndex = keyof INomenclator;

const NomenclatorsTable: React.FC = () => {
  const [createNewModal, setCreateNewModal] = useState(false);
  const [editModal, setEditModal] = useState(false);
  const [searchedColumn, setSearchedColumn] = useState("");
  const [searchText, setSearchText] = useState("");
  const [selectedNomenclator, setSelectedNomenclator] = useState<INomenclator>();
  const { data: sessionData } = useSession();
  const dispatch = useAppDispatch();
  const searchInput = useRef<InputRef>(null);

  const canList = sessionData?.user.role.includes("Listar Nomencladores");
  const canCreate = sessionData?.user.role.includes("Crear Nomenclador");
  const canEdit = sessionData?.user.role.includes("Editar Nomenclador");
  const canDelete = sessionData?.user.role.includes("Eliminar Nomenclador");

  useEffect(() => {
    dispatch(nomenclatorsStartLoading());
  }, [dispatch]);

  const { nomenclators }: { nomenclators: INomenclator[] } = useAppSelector(
    (state: RootState) => state?.nomenclator
  );
  let data: INomenclator[] = useMemo(
    () =>
      nomenclators.filter(
        (nomenclator) =>
          nomenclator.category !== "Tarifa de Servicio" &&
          nomenclator.category !== "Material" &&
          nomenclator.category !== "Ficha de costo"
      ),
    [nomenclators]
  );
  if (!canList) {
    data = [];
  }
  const handleEdit = (record: INomenclator): void => {
    setSelectedNomenclator(record);
    setEditModal(true);
  };

  const onCreate = (values: any): void => {
    dispatch(startAddNomenclator(values.category, values.code));
    setCreateNewModal(false);
  };

  const onEdit = (values: any): void => {
    dispatch(startUpdateNomenclator(selectedNomenclator?._id!, values.code, values.category));
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

  const handleDelete = (record: INomenclator) => {
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
        dispatch(startDeleteNomenclator(record?._id));
      }
    });
  };

  const handleReset = (clearFilters: () => void) => {
    clearFilters();
    setSearchText("");
  };

  const getColumnSearchProps = (dataIndex: DataIndex): ColumnType<INomenclator> => ({
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
    onFilter: (value, record: any) =>
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

  const columns: ColumnsType<INomenclator> = [
    {
      title: <span className="font-bold">Categoría</span>,
      dataIndex: "category",
      key: "category",
      filters: [
        {
          text: "Area de usuario",
          value: "Area de usuario"
        },
        {
          text: "Cargo de trabajador",
          value: "Cargo de trabajador"
        },
        {
          text: "Unidad de medida",
          value: "Unidad de medida"
        },
        {
          text: "Proveedor",
          value: "Proveedor"
        },
        {
          text: "Categoría de ficha de costo",
          value: "Categoría de ficha de costo"
        },
        {
          text: "Precio/UM en ficha de costo",
          value: "Precio/UM en ficha de costo"
        },
        {
          text: "Categoría de tarea",
          value: "Categoría de tarea"
        },
        {
          text: "Moneda",
          value: "Moneda"
        }
      ],
      onFilter: (value: any, record: any) => record.category.startsWith(value),
      filterSearch: true,
      width: "50%"
    },
    {
      title: <span className="font-bold">Código</span>,
      dataIndex: "code",
      key: "code",
      width: "40%",
      ...getColumnSearchProps("code")
    },
    {
      title: <span className="font-bold">Valor</span>,
      dataIndex: "value",
      key: "value",
      width: "35%",
      render: (text) => text && <span>$ {parseFloat(text).toFixed(2)}</span>
    },
    {
      title: <span className="font-bold">Acciones</span>,
      key: "actions",
      width: "5%",
      render: (_, { ...record }) => (
        <div className="flex gap-1 justify-center">
          {canEdit ? (
            <>
              <Tooltip placement="top" title={"Editar Nomenclador"} arrow={{ pointAtCenter: true }}>
                <button onClick={() => handleEdit(record)} className="table-see-action-btn">
                  <EditSvg width={20} height={20} />
                </button>
              </Tooltip>
            </>
          ) : (
            <></>
          )}
          {canDelete ? (
            <Tooltip placement="top" title={"Eliminar Nomenclador"} arrow={{ pointAtCenter: true }}>
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
        <div className="flex gap-2">
          <button
            disabled={!canCreate}
            onClick={() => {
              setCreateNewModal(true);
            }}
            className="toolbar-primary-icon-btn"
          >
            <PlusSvg />
            Nuevo
          </button>
        </div>
        <div className="flex">
          <Tooltip placement="top" title={"Refrescar"} arrow={{ pointAtCenter: true }}>
            <button
              disabled={!canList}
              className={`${
                canList
                  ? "cursor-pointer hover:bg-white-600 ease-in-out duration-300"
                  : "opacity-20 pt-2 pl-2"
              } flex justify-center items-center w-[2.5rem] h-[2.5rem] text-xl rounded-full`}
              onClick={() => dispatch(nomenclatorsStartLoading())}
            >
              <RefreshSvg />
            </button>
          </Tooltip>
        </div>
      </div>

      <CreateNomenclatorForm
        open={createNewModal}
        onCancel={() => setCreateNewModal(false)}
        onCreate={onCreate}
      />
      <EditNomenclatorForm
        open={editModal}
        onCancel={() => setEditModal(false)}
        onCreate={onEdit}
        defaultValues={selectedNomenclator}
      />

      <Table
        size="small"
        columns={columns}
        dataSource={data}
        pagination={{ position: ["bottomCenter"], defaultPageSize: 20 }}
        className="shadow-md"
        sortDirections={["ascend"]}
      />
    </>
  );
};

export default NomenclatorsTable;

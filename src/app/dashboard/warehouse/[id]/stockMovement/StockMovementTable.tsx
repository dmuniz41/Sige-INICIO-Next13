"use client";
import { Button, Input, Space, Spin, Table, Tag, Tooltip } from "antd";
import { LoadingOutlined, SearchOutlined } from "@ant-design/icons";
import Highlighter from "react-highlight-words";
import React, { useRef, useState } from "react";
import Swal from "sweetalert2";
import type { ColumnType, ColumnsType } from "antd/es/table";
import type { FilterConfirmProps } from "antd/es/table/interface";
import type { InputRef } from "antd";

import { RefreshSvg } from "@/app/global/RefreshSvg";
import { useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { StockMovement } from "@/db/migrations/schema";
import { useStockMovements } from "@/hooks/warehouse/useStockMovements";

type DataIndex = keyof StockMovement;

const StockMovementsTable = ({ warehouseId }: { warehouseId: string }) => {
  const [searchedColumn, setSearchedColumn] = useState("");
  const [searchText, setSearchText] = useState("");
  const { data: sessionData } = useSession();
  const router = useRouter();
  const searchInput = useRef<InputRef>(null);
  const queryClient = useQueryClient();

  const [limit, setLimit] = useState<number>(10);
  const [page, setPage] = useState<number>(1);

  const canList = sessionData?.user.role.includes("Listar Almacén");

  const { useGetStockMovements } = useStockMovements();
  const { data: stockMovementsQuery, isLoading, isError } = useGetStockMovements(Number(warehouseId), page, limit);
  console.log("🚀 ~ StockMovementsTable ~ stockMovementsQuery:", stockMovementsQuery?.data);

  const handleRefresh = () => {
    queryClient.invalidateQueries({ queryKey: ["GetStockMovements"] });
  };

  const handleSearch = (selectedKeys: string[], confirm: (param?: FilterConfirmProps) => void, dataIndex: DataIndex) => {
    confirm();
    setSearchText(selectedKeys[0]);
    setSearchedColumn(dataIndex);
  };

  const handleView = async (record: StockMovement) => {
    router.push(`/dashboard/warehouse/${record === undefined ? " " : record?.id}`);
  };

  const handleReset = (clearFilters: () => void) => {
    clearFilters();
    setSearchText("");
  };

  const getColumnSearchProps = (dataIndex: DataIndex): ColumnType<StockMovement> => ({
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

  const columns: ColumnsType<StockMovement> = [
    {
      title: <span className="font-bold">Id de Material</span>,
      dataIndex: "materialId",
      ...getColumnSearchProps("materialId")
    },
    {
      title: <span className="font-bold">Fecha de Movimiento</span>,
      dataIndex: "movementDate",
      ...getColumnSearchProps("movementDate")
    },
    {
      title: <span className="font-bold">Tipo de Movimiento</span>,
      dataIndex: "movementType",
      render: (value: string) => <Tag color={value === "ADDED" ? "green" : "red"}>{value === "ADDED" ? "ENTRADA" : "SALIDA"}</Tag>
    },
    {
      title: <span className="font-bold">Cantidad</span>,
      dataIndex: "quantityChange"
    },
    {
      title: <span className="font-bold">Unidad de Medida</span>,
      dataIndex: "unitMeasure"
    },
    {
      title: <span className="font-bold">Usuario</span>,
      dataIndex: "userName"
    }

    // {
    //   title: <span className="font-bold">Acciones</span>,
    //   key: "actions",
    //   width: "5%",
    //   render: (_, { ...record }) => (
    //     <div className="flex gap-1 justify-center">
    //       {!canList ? (
    //         <></>
    //       ) : (
    //         <div className="flex gap-1">
    //           <Tooltip placement="top" title={"Ver Detalles"} arrow={{ pointAtCenter: true }}>
    //             <button disabled={!canList} onClick={() => handleView(record)} className="table-see-offer-action-btn">
    //               {/* <SeeSvg width={20} height={20} /> */}
    //             </button>
    //           </Tooltip>
    //         </div>
    //       )}
    //     </div>
    //   )
    // }
  ];

  if (isLoading)
    return (
      <section className="flex h-full w-full items-center justify-center">
        <Spin indicator={<LoadingOutlined style={{ fontSize: 70, color: "#ff8533" }} spin />} />
      </section>
    );

  if (isError) {
    Swal.fire({
      icon: "error",
      title: "Error",
      text: "Ocurrió un error al obtener los movimientos de inventario"
    });
  }

  return (
    <>
      <div className="flex h-16 w-full bg-white-100 rounded-md shadow-md mb-4 items-center pl-4 gap-4">
        <div className="flex">
          <Tooltip placement="top" title={"Refrescar"} arrow={{ pointAtCenter: true }}>
            <button
              disabled={!canList}
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
        size="middle"
        columns={columns}
        dataSource={stockMovementsQuery?.data}
        pagination={{ position: ["bottomCenter"], defaultPageSize: 10 }}
        onChange={(pagination) => {
          setPage(pagination?.current ?? 1);
          setLimit(pagination?.pageSize ?? 10);
        }}
        className="shadow-md"
      />
    </>
  );
};

export default StockMovementsTable;

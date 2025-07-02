"use client";
import { Spin, Table, Tooltip } from "antd";
import { LoadingOutlined } from "@ant-design/icons";
import React, { useState } from "react";
import Swal from "sweetalert2";
import type { ColumnsType } from "antd/es/table";

import { CreateWarehouseForm } from "./CreateWarehouseForm";
import { RefreshSvg } from "@/app/global/RefreshSvg";
import { SeeSvg } from "../../global/SeeSvg";
import { useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useWarehouse } from "@/hooks/warehouse/useWarehouse";
import { Warehouse } from "@/db/migrations/schema";
import { ListSvg } from "@/app/global/ListSvg";


const WarehousesTable: React.FC = () => {
  const [createNewModal, setCreateNewModal] = useState(false);
  const router = useRouter();
  const queryClient = useQueryClient();

  const [limit, setLimit] = useState<number>(10);
  const [page, setPage] = useState<number>(1);

  const { useGetWarehouses, useCreateWarehouse } = useWarehouse();
  const { data: warehouses, isLoading, isError } = useGetWarehouses(page, limit, {});
  const { mutateAsync: createWarehouse } = useCreateWarehouse();

  const handleRefresh = () => {
    queryClient.invalidateQueries({ queryKey: ["GetWarehouses"] });
  };

  const handleCreate = async (values: any) => {
    await createWarehouse({ ...values });
  };

  const handleView = async (record: Warehouse) => {
    router.push(`/dashboard/warehouse/${record === undefined ? " " : record?.id}`);
  };

  const handleViewStockMovements = (record: Warehouse) => {
    router.push(`/dashboard/warehouse/${record?.id}/stockMovement`);
  };

  const columns: ColumnsType<Warehouse> = [
    {
      title: <span className="font-bold">Nombre</span>,
      dataIndex: "name",
      width: "75%"
    },
    {
      title: <span className="font-bold">Valor Total</span>,
      dataIndex: "totalValue",
      width: "25%",
      render: (value) => (
        <span>
          ${" "}
          {value?.toLocaleString("DE", {
            maximumFractionDigits: 2,
            minimumFractionDigits: 2
          })}
        </span>
      )
    },
    {
      title: <span className="font-bold">Acciones</span>,
      key: "actions",
      width: "5%",
      render: (_, { ...record }) => (
        <div className="flex gap-1 justify-center">
          <div className="flex gap-1">
            <Tooltip placement="top" title={"Ver Almacén"} arrow={{ pointAtCenter: true }}>
              <button onClick={() => handleView(record)} className="table-see-offer-action-btn">
                <SeeSvg width={20} height={20} />
              </button>
            </Tooltip>
            <Tooltip placement="top" title={"Ver Movimientos de Inventario"} arrow={{ pointAtCenter: true }}>
              <button onClick={() => handleViewStockMovements(record)} className="table-stock-movement-action-btn">
                <ListSvg width={20} height={20} />
              </button>
            </Tooltip>
          </div>
        </div>
      )
    }
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
      text: "Ocurrió un error al obtener los alamcenes"
    });
  }

  return (
    <>
      <div className="flex h-16 w-full bg-white-100 rounded-md shadow-md mb-4 items-center pl-4 gap-4">
        <div className="flex">
          <Tooltip placement="top" title={"Refrescar"} arrow={{ pointAtCenter: true }}>
            <button className="flex justify-center items-center w-[2.5rem] h-[2.5rem] text-xl rounded-full" onClick={handleRefresh}>
              <RefreshSvg />
            </button>
          </Tooltip>
        </div>
      </div>

      <CreateWarehouseForm open={createNewModal} onCancel={() => setCreateNewModal(false)} onCreate={handleCreate} />

      <Table
        size="middle"
        columns={columns}
        dataSource={warehouses?.data}
        pagination={{ position: ["bottomCenter"], defaultPageSize: 10 }}
        onChange={(pagination) => {
          setPage(pagination?.current ?? 1);
          setLimit(pagination?.pageSize ?? 10);
        }}
        className="shadow-md"
        rowKey={'name'}
      />
    </>
  );
};

export default WarehousesTable;

"use client";
import { ColumnsType } from "antd/es/table";
import { Table } from "antd";
import { useParams } from "next/navigation";
import { useRouter } from "next/navigation";
import React, { useMemo } from "react";
import Title from "antd/es/typography/Title";

import { BookDowloadSvg } from "@/app/global/BookDowloadSvg";
import { useGetOfferById } from "@/hooks/offers/useDisaggregationByMaterials";
import { useGetProjectById } from "@/hooks/projects/useProject";
import useExpensesDischarge from "@/hooks/expensesDischarge/useExpensesDischarge";

export const ExpensesDischargeTable = () => {
  const { useGetExpensesDischarge } = useExpensesDischarge();
  const router = useRouter();

  const { projectId }: { projectId: string } = useParams();
  const { data: project } = useGetProjectById(projectId);
  const { data: offer } = useGetOfferById(project?.BDProject?.finalOfferId);
  const { data: expensesDischarge } = useGetExpensesDischarge(offer?.BDOffer?._id);

  const totalValue = useMemo(
    () =>
      expensesDischarge?.expensesDischarge[0]?.materials.reduce(
        (totalValue: any, expensesDischargeMaterials: any) =>
          totalValue + expensesDischargeMaterials.amount,
        0
      ),
    [expensesDischarge]
  );
  const totalCost = useMemo(
    () =>
      expensesDischarge?.expensesDischarge[0]?.materials.reduce(
        (totalValue: any, expensesDischargeMaterials: any) =>
          totalValue + expensesDischargeMaterials.amountReal,
        0
      ),
    [expensesDischarge]
  );

  const totalDifference = useMemo(() => totalValue - totalCost, [totalValue, totalCost]);

  const newDate = new Date(expensesDischarge?.expensesDischarge[0]?.updatedAt);
  const formattedDate = newDate?.toLocaleString("en-GB", {
    hour12: true,
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit"
  });

  const getRowClassName = (record: any) => {
    const amountReal = record.amountReal || 0;
    const difference = record.amount - amountReal;
    return difference < 0 ? "negative-row" : "positive-row";
  };

  const handleGoToEditExpensesDischarge = () => {
    router.push(`/dashboard/project/${projectId}/expensesDischarge/editExpensesDischarge`);
  };

  const handleGoBack = () => {
    router.push(`/dashboard/project`);
  };

  const columns: ColumnsType<{
    description: string;
    difference: number;
    unitMeasure: string;
    amount: number;
    amountReal: number;
  }> = [
    {
      title: <span className="font-bold">Nombre del Material</span>,
      dataIndex: "description",
      key: "description",
      width: "50%"
    },
    {
      title: <span className="font-bold">Planificado</span>,
      dataIndex: "amount",
      key: "amount",
      width: "10%"
    },
    {
      title: <span className="font-bold">Real</span>,
      dataIndex: "amountReal",
      width: "10%"
    },
    {
      title: <span className="font-bold">Diferencia</span>,
      dataIndex: "difference",
      width: "10%",
      render: (text, record: any) => {
        const amountReal = record.amountReal || 0;
        const difference = record.amount - amountReal;
        return <span>{difference}</span>;
      }
    },
    {
      title: <span className="font-bold">Unidad de Medida</span>,
      dataIndex: "unitMeasure",
      key: "unitMeasure",
      width: "20%"
    }
  ];

  return (
    <>
      <header className="font-normal text-2xl mb-4">
        <Title level={3}>Descargar Gastos</Title>
      </header>
      {/* BARRA SUPERIOR */}
      <section className="flex items-center w-full h-16 gap-4 pl-4 mb-4 rounded-md shadow-md bg-white-100">
        <div className="flex gap-2">
          <button onClick={handleGoToEditExpensesDischarge} className="toolbar-primary-icon-btn">
            <BookDowloadSvg />
            Descargar Gastos
          </button>
        </div>
      </section>
      <header className="flex items-center gap-2 mb-4">
        <p className="text-2xl font-bold">Proyecto: </p>
        <p className="text-2xl ">{project?.BDProject?.projectName}</p>
      </header>
      <header className="flex items-center gap-2 mb-4">
        <p className="text-2xl font-bold">Actualizado: </p>
        <p className="text-2xl ">{formattedDate}</p>
      </header>
      <section>
        <Table
          size="small"
          columns={columns}
          dataSource={expensesDischarge?.expensesDischarge[0]?.materials}
          bordered
          rowClassName={getRowClassName}
          rowKey={(record) => record.description}
          pagination={
            expensesDischarge?.expensesDischarge[0]?.materials?.length <= 10
              ? false
              : { pageSize: 10 }
          }
          footer={() => (
            <div className="w-full flex">
              <div className="w-[50%] text-start font-bold">Total</div>
              <div className="w-[10%] pl-2 font-bold"><span>{totalValue}</span></div>
              <div className="w-[10%] pl-2 font-bold"><span>{totalCost}</span></div>
              <div className="w-[10%] pl-2 font-bold"><span>{totalDifference}</span></div>
              <div className="w-[20%] font-bold"></div>
            </div>
          )}
        />
      </section>
      <section className="flex gap-2">
        <button
          onClick={handleGoBack}
          className="mt-4 select-none rounded-lg bg-danger-500 py-3 px-6 text-center align-middle text-sm font-semibold uppercase text-white-100 shadow-md shadow-danger-500/20 transition-all hover:shadow-lg hover:shadow-danger-500/40 focus:opacity-[0.85] focus:shadow-none active:opacity-[0.85] active:shadow-none disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"
        >
          Cancelar
        </button>
      </section>
    </>
  );
};

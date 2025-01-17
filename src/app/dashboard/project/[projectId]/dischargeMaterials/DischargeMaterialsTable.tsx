"use client";
import { ColumnsType } from "antd/es/table";
import { Table } from "antd";
import { useParams } from "next/navigation";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import Title from "antd/es/typography/Title";

import { useGetProjectById } from "@/hooks/projects/useProject";
import { BookDowloadSvg } from "@/app/global/BookDowloadSvg";
import { useGetOfferById } from "@/hooks/offers/useDisaggregationByMaterials";

export const DischargeMaterialsTable = () => {
  const { projectId }: { projectId: string } = useParams();
  const { data: project } = useGetProjectById(projectId);
  const { data: offer } = useGetOfferById(project?.BDProject?.finalOfferId);
  const router = useRouter();

  const [materials, setMaterials] = useState<any[]>([]);

  useEffect(() => {
    if (offer?.BDOffer?.materialsList) {
      setMaterials(offer.BDOffer.materialsList);
    }
  }, [offer]);

  const getRowClassName = (record: any) => {
    const inputValue = record.inputValue || 0;
    const difference = record.amount - inputValue;
    return difference < 0 ? "negative-row" : "positive-row";
  };

  const handleGoToEditDischargeMaterials = () => {
    router.push(
      `/dashboard/project/${projectId}/dischargeMaterials/editDischargeMaterials`
    );
  };

  const columns: ColumnsType<{
    description: string;
    input: any;
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
      key: "amountReal",
      width: "10%"
    },
    {
      title: <span className="font-bold">Diferencia</span>,
      key: "difference",
      width: "10%",
      render: (text, record: any) => {
        const inputValue = record.inputValue || 0; // Default to 0 if undefined
        const difference = record.amount - inputValue;
        return <span>{difference}</span>;
      }
    },
    {
      title: <span className="font-bold">Unidad de Medida</span>,
      dataIndex: "unitMeasure",
      key: "unitMeasure",
      width: "15%"
    }
  ];

  return (
    <>
      <header className="font-normal text-2xl mb-4">
        <Title level={3}>Descargar Materiales</Title>
      </header>
      {/* BARRA SUPERIOR */}
      <section className="flex items-center w-full h-16 gap-4 pl-4 mb-4 rounded-md shadow-md bg-white-100">
        <div className="flex gap-2">
          <button
            onClick={handleGoToEditDischargeMaterials}
            className="toolbar-primary-icon-btn"
          >
            <BookDowloadSvg />
            Descargar Materiales
          </button>
        </div>
      </section>
      <header>
        <Title level={3}>{project?.BDProject?.projectName}</Title>
      </header>
      <section>
        <Table
          size="small"
          columns={columns}
          dataSource={materials}
          bordered
          rowClassName={getRowClassName}
          pagination={materials.length <= 10 ? false : { pageSize: 10 }}
        />
      </section>
    </>
  );
};

"use client";
import { ColumnsType } from "antd/es/table";
import { Input, InputNumber, Table } from "antd";
import { useParams, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import Title from "antd/es/typography/Title";

import { useGetProjectById } from "@/hooks/projects/useProject";
import { useGetOfferById } from "@/hooks/offers/useDisaggregationByMaterials";
import useDischargeMaterials from "@/hooks/dischargeMaterials/useDischargeMaterials";

export const EditDischargeMaterials = () => {
  const [newMaterials, setNewMaterials] = useState<any[]>([]);
  const { useUpdateDischargeMaterials, useGetDischargeMaterials } =
    useDischargeMaterials();
  const router = useRouter();
  const { projectId }: { projectId: string } = useParams();
  const { data: project } = useGetProjectById(projectId);
  const { data: offer } = useGetOfferById(project?.BDProject?.finalOfferId);
  const { data: materials } = useGetDischargeMaterials(offer?.BDOffer?._id);

  const { mutateAsync } = useUpdateDischargeMaterials({
    offerId: project?.BDProject?.finalOfferId,
    updatedAt: new Date(),
    materials: newMaterials
  });

  useEffect(() => {
    if (materials?.dischargeMaterials[0]?.materials) {
      setNewMaterials(materials?.dischargeMaterials[0]?.materials);
    }
  }, [materials]);

  const handleInputChange = (key: any, value: any) => {
    const newData = newMaterials.map((item: any) => {
      if (item.description === key) {
        return { ...item, amountReal: value };
      }
      return item;
    });
    setNewMaterials(newData);
  };

  const getRowClassName = (record: any) => {
    const amountReal = record.amountReal || 0;
    const difference = record.amount - amountReal;
    return difference < 0 ? "negative-row" : "positive-row";
  };

  const handleGoBack = () => {
    router.push(`/dashboard/project/${projectId}/dischargeMaterials`);
  };

  const handleSave = () => {
    mutateAsync();
    handleGoBack();
  };

  const columns: ColumnsType<{
    description: string;
    amountReal: number;
    difference: number;
    unitMeasure: string;
    amount: number;
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
      key: "amountReal",
      width: "10%",
      render: (text, record) => {
        return (
          <InputNumber
            value={record?.amountReal ?? 0}
            min={0}
            onChange={(value) => handleInputChange(record.description, value)}
          />
        );
      }
    },
    {
      title: <span className="font-bold">Diferencia</span>,
      dataIndex: "difference",
      width: "10%",
      render: (text, record: any) => {
        const amountReal = record.amountReal || 0; // Default to 0 if undefined
        const difference = record.amount - amountReal;
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
        <Title level={2}>Descargar Materiales</Title>
      </header>
      <header className="flex items-center gap-2 mb-4">
        <p className="text-2xl font-bold">Proyecto: </p>
        <p className="text-2xl ">{project?.BDProject?.projectName}</p>
      </header>
      <section>
        <Table
          size="small"
          columns={columns}
          dataSource={newMaterials}
          pagination={newMaterials?.length <= 10 ? false : { pageSize: 10 }}
          bordered
          rowClassName={getRowClassName}
          rowKey={(record) => record.description}
        />
      </section>
      <section className="flex gap-2">
        <button
          onClick={handleSave}
          className="mt-4 select-none rounded-lg bg-success-500 py-3 px-6 text-center align-middle text-sm font-semibold uppercase text-white-100 shadow-md shadow-success-500/20 transition-all hover:shadow-lg hover:shadow-success-500/40 focus:opacity-[0.85] focus:shadow-none active:opacity-[0.85] active:shadow-none disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"
        >
          Guardar
        </button>
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

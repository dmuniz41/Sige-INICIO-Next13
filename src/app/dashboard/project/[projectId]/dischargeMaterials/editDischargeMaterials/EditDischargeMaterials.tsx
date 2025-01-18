
"use client";
import { ColumnsType } from "antd/es/table";
import { Input, Table } from "antd";
import { useParams, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import Title from "antd/es/typography/Title";

import { useGetProjectById } from "@/hooks/projects/useProject";
import { useGetOfferById } from "@/hooks/offers/useDisaggregationByMaterials";

export const EditDischargeMaterials = () => {
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

  const handleInputChange = (key: any, value: any) => {
    const newData = materials?.map((item: any) => {
      if (item.description === key) {
        return { ...item, inputValue: value };
      }
      return item;
    });
    setMaterials(newData);
  };

  const getRowClassName = (record: any) => {
    const inputValue = record.inputValue || 0;
    const difference = record.amount - inputValue;
    return difference < 0 ? "negative-row" : "positive-row";
  };

  const handleGoBack = () => {
    router.push(`/dashboard/project/${projectId}/dischargeMaterials`);
  };

  const handleSave = () => {
    console.log("Save");
  };

  const columns: ColumnsType<{
    description: string;
    input: any;
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
      key: "input",
      width: "10%",
      render: (text, record) => (
        <Input
          type="number"
          defaultValue={0}
          min={0}
          onChange={(e) =>
            handleInputChange(record.description, e.target.value)
          }
        />
      )
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
          dataSource={materials}
          pagination={materials.length <= 10 ? false : { pageSize: 10 }}
          bordered
          rowClassName={getRowClassName}
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

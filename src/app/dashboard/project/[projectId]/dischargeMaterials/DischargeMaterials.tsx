"use client";
import { useParams } from "next/navigation";
import React from "react";
import Title from "antd/es/typography/Title";

import { EditSvg } from "@/app/global/EditSvg";
import { useGetProjectById } from "@/hooks/projects/useProject";

export const DischargeMaterials = () => {
  const { projectId }: { projectId: string } = useParams();
  const { data } = useGetProjectById(projectId);

  return (
    <>
      <header className="font-normal text-2xl mb-4">
        <Title level={3}>Descargar Materiales</Title>
      </header>
      {/* BARRA SUPERIOR */}
      <section className="flex items-center w-full h-16 gap-4 pl-4 mb-4 rounded-md shadow-md bg-white-100">
        <div className="flex gap-2">
          <button className="toolbar-primary-icon-btn">
            <EditSvg />
            Editar
          </button>
        </div>
      </section>
      <header>
        <Title level={3}>
          {data?.BDProject?.projectName}
        </Title>
      </header>
    </>
  );
};

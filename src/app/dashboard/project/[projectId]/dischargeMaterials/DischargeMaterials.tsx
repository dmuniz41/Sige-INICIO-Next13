"use client";
import React from "react";
import { useParams } from "next/navigation";

export const DischargeMaterials = () => {
  const { projectId }: { projectId: string } = useParams();

  return <>DischargeMaterials {projectId}</>;
};

"use client";
import React, { useEffect } from "react";
import { Spin } from "antd";
import { useParams } from "next/navigation";

import { IProject } from "@/models/project";
import { ItemSection } from "./ItemSection";
import { RootState } from "@/store/store";
import { startLoadSelectedProject } from "@/actions/project";
import { useAppDispatch, useAppSelector } from "@/hooks/hooks";
import { useDisaggregationByMaterial } from "@/hooks/offers/useDisaggregationByMaterials";

interface IItemsListProps {
  itemId: string;
  itemDescription: string;
  activities: {
    description: string;
    amount: number;
    materials: any[];
  }[];
}

export const MaterialsPerItem = () => {
  const { projectId }: { projectId: string } = useParams();
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (projectId) {
      dispatch(startLoadSelectedProject(projectId));
    }
  }, [dispatch, projectId]);

  const { selectedProject }: { selectedProject: IProject } = useAppSelector(
    (state: RootState) => state?.project
  );
  const { data, error, isLoading } = useDisaggregationByMaterial(
    selectedProject.finalOfferId
  );

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  if (!data || isLoading) {
    return (
      <div className="w-full h-full justify-center items-center flex">
        <Spin tip="Cargando" size="large" />
      </div>
    );
  }

  return (
    <>
      <header className="font-normal text-2xl mb-4">
        <span>Desagregacion de Materiales por actividades</span>
      </header>
      {data?.groupedActivities?.map((item: IItemsListProps, index: number) => (
        <ItemSection index={index} key={item.itemId} item={item} />
      ))}
    </>
  );
};

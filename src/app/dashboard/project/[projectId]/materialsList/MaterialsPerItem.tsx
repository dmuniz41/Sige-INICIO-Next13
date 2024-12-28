"use client";
import { useParams } from "next/navigation";
import React, { useEffect, Suspense } from "react";

import { IProject } from "@/models/project";
import { ItemSection } from "./ItemSection";
import { RootState } from "@/store/store";
import { startLoadSelectedProject } from "@/actions/project";
import { useAppDispatch, useAppSelector } from "@/hooks/hooks";
import useDisaggregationByMaterialsAPI from "@/hooks/offers/useDisaggregationByMaterials";
import { Spin } from "antd";

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
  const { data, error, isLoading } = useDisaggregationByMaterialsAPI(
    selectedProject.finalOfferId
  );

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  if (!data || isLoading) {
    return <div className="w-full h-full  justify-center items-center flex"><Spin tip="Cargando" size="large"/></div>;
  }

  return (
    <>
      {data?.groupedActivities?.map(
        (item: {
          itemId: string;
          itemDescription: string;
          activities: {
            description: string;
            amount: number;
            materials: any[];
          }[];
        }) => <ItemSection key={item.itemId} item={item} />
      )}
    </>
  );
};

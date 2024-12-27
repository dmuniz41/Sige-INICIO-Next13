"use client";
import { useParams } from "next/navigation";
import React, { useEffect } from "react";

import { IProject } from "@/models/project";
import { RootState } from "@/store/store";
import { startLoadSelectedProject } from "@/actions/project";
import { useAppDispatch, useAppSelector } from "@/hooks/hooks";
import Loading from "./loading";
import useDisaggregationByMaterialsAPI from "@/hooks/offers/useDisaggregationByMaterials";

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

  if (isLoading) {
    return <Loading />;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  if (!data) {
    return <div>No data available.</div>;
  }
  return (
    <>
      <br />
      NEW ARRAY {JSON.stringify(data)}
    </>
  );
};

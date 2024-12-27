"use client";
import React, { useState } from "react";

import { useAppSelector } from "@/hooks/hooks";
import { IProject } from "@/models/project";
import { RootState } from "@/store/store";
import useDisaggregationByMaterialsAPI from "@/hooks/offers/useDisaggregationByMaterials";

export const MaterialsPerItem = () => {
  const { selectedProject }: { selectedProject: IProject } = useAppSelector(
    (state: RootState) => state?.project
  );
  const { data, error, isLoading } = useDisaggregationByMaterialsAPI(
    selectedProject.finalOfferId
  );

  return (
    <>
      <br />
      NEW ARRAY {JSON.stringify(data)}
    </>
  );
};

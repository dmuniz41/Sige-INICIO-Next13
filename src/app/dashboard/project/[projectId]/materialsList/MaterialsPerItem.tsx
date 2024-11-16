"use client";
import React, { useEffect } from "react";

import { useAppDispatch, useAppSelector } from "@/hooks/hooks";
import { IProject } from "@/models/project";
import { RootState } from "@/store/store";
import { loadSelectedOffer } from "@/actions/offer";
import { startLoadSelectedProject } from "@/actions/project";
import { IOffer } from "@/models/offer";

export const MaterialsPerItem = (props: { projectId: string }) => {
  const { projectId } = props;
  const dispatch = useAppDispatch();

  const { selectedProject }: { selectedProject: IProject } = useAppSelector((state: RootState) => state?.project);

  useEffect(() => {
    dispatch(loadSelectedOffer(selectedProject.finalOfferId));
  }, [dispatch]);

  const { selectedOffer }: { selectedOffer: IOffer } = useAppSelector((state: RootState) => state?.offer);

  return <>SECTION {JSON.stringify(selectedOffer.materialsList)}</>;
};

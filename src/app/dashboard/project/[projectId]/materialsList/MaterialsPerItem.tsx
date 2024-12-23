"use client";
import React, { useEffect } from "react";

import { useAppDispatch, useAppSelector } from "@/hooks/hooks";
import { IProject } from "@/models/project";
import { RootState } from "@/store/store";
import { loadSelectedOffer } from "@/actions/offer";
import { IOffer } from "@/models/offer";

export const MaterialsPerItem = () => {
  const dispatch = useAppDispatch();

  
  const { selectedProject }: { selectedProject: IProject } = useAppSelector((state: RootState) => state?.project);
  const { selectedOffer }: { selectedOffer: IOffer } = useAppSelector((state: RootState) => state?.offer);
  
  useEffect(() => {
    dispatch(loadSelectedOffer(selectedProject.finalOfferId));
  }, [selectedProject,dispatch]);


  const newArray = selectedOffer?.materialsList?.filter((material) => selectedOffer?.itemsList.some((item) => item.key === material.itemId))
    .map((material) => {
      const matchingItem = selectedOffer?.itemsList.find((item) => item.key === material.itemId);
      return { ...material, ItemDescription: matchingItem?.description };
    });

  return <>
  <br />
  NEW ARRAY {JSON.stringify(newArray)}
  </>;
};

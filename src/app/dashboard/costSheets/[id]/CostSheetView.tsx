'use client'

import { RootState, useAppSelector } from '@/store/store';
import React from 'react'

export const CostSheetView = () => {
  const { selectedCostSheet} = useAppSelector((state: RootState) => state?.costSheet);
  console.log("🚀 ~ file: CostSheetView.tsx:11 ~ CostSheetView ~ selectedCostSheet:", selectedCostSheet)


  return (
    <div></div>
  )
}

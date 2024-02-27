'use client'

import { usePathname } from 'next/navigation';
import React from 'react'

export const OfferView = () => {
  const url = usePathname().split("/");
  const projectName: string = url[3];
  return (
    <div>{projectName}</div>
  )
}

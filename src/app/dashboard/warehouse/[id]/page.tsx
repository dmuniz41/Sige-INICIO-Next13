"use client";

import MaterialsTable from "./MaterialsTable";

export default function Page({ params }: { params: { id: string } }) {
  return <MaterialsTable warehouseId={params.id} />;
}

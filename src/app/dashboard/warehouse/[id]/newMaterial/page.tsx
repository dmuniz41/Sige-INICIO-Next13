"use client";

import { NewMaterialForm } from "./NewMaterialForm";

export default function Page({ params }: { params: { id: string } }) {
  return (
        <NewMaterialForm warehouseId={params.id} />
  );
}

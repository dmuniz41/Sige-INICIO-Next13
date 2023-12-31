"use client";

import MaterialsTable from "./MaterialsTable";

export default function Page({ params }: { params: { id: string } }) {
  return (
    <section className="flex w-full h-[90%] pt-[3rem] pl-[250px] pr-[1rem] ">
      <section className="w-[80%] items-start justify-start flex-col gap-2 h-full p-4 animate-fade animate-once animate-duration-150 grow overflow-auto">
        <MaterialsTable />
      </section>
    </section>
  );
}

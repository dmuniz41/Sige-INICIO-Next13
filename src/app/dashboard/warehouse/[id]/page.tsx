'use client'

import MaterialsTable from "./MaterialsTable";

export default function Page({ params }: { params: { id: string } }) {

  return (
    <div id="userScreen-wrapper" className="flex w-full min-h-[90%] pt-[3rem] pl-[300px] pr-[3rem] overflow-hidden">
      <div
        id="userTable_wrapper"
        className="w-[80%] items-start justify-start flex-col gap-2 h-full p-4 animate-fade animate-once animate-duration-150 grow overflow-auto"
      >
        <MaterialsTable />
      </div>
    </div>
  )
}
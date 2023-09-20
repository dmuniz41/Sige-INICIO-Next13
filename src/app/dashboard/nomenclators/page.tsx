import React from "react";
import NomenclatorsTable from './NomenclatorsTable';

export default function page() {
  return (
    <div id="userScreen-wrapper" className="flex w-full min-h-[90%] pt-[3rem] pl-[250px] pr-[1rem] overflow-hidden">
      <div
        id="userTable_wrapper"
        className="w-[80%] items-start justify-start flex-col gap-2 h-full p-4 animate-fade animate-once animate-duration-150 grow overflow-auto"
      >
        <NomenclatorsTable />
      </div>
    </div>
  );
}

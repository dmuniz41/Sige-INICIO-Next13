import React from "react";
import WorkersTable from "./WorkersTable";

export default function page() {
  return (
    <div id="workerScreen-wrapper" className="flex w-full min-h-[90%] pt-[3rem] pl-[250px] pr-[1rem] overflow-hidden">
      <div
        id="workerSection-content"
        className="w-[80%] items-start justify-start flex-col gap-2 h-full p-4 animate-fade animate-once animate-duration-150 grow overflow-auto"
      >
        <WorkersTable />
      </div>
    </div>
  );
}

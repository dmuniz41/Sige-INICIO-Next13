import React from "react";

export default function page() {
  console.log("projectExpenses page");

  return (
    <div id="projectScreen-wrapper" className="flex w-full h-full items-center pt-[6rem] pl-[300px] pr-[3rem] overflow-hidden">
      <div
        id="projectSection-content"
        className="w-[80%] items-start justify-start mt-10 flex-col gap-2 h-full p-4 animate-fade animate-once animate-duration-150 grow overflow-auto"
      >
        <h1 className="text-2xl">Project Expenses Page</h1>
      </div>
    </div>
  );
}

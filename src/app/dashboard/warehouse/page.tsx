import React from "react";

export default function page() {
  console.log('warehouse page');
  
  
  return (
    <div id="workerScreen-wrapper" className="flex w-full h-full items-center pt-[6rem] pl-[300px] pr-[3rem] overflow-hidden">
      <div id="workerSection-content" className="w-[80%] items-start justify-start mt-10 flex-col gap-2 h-full p-4 animate-fade animate-once animate-duration-150 grow overflow-auto">
      {/* <WorkersTable /> */}
      </div>
    </div>
  );
}

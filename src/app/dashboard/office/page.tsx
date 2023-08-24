import React from "react";

export default function page() {
  console.log('office page');
  
  return (
    <div id="officeScreen-wrapper" className="flex w-full h-full items-center pt-[6rem] pl-[300px] pr-[3rem] overflow-hidden">
    <div
      id="officeSection-content"
      className="w-[80%] items-start justify-start mt-10 flex-col gap-2 h-full p-4 animate-fade animate-once animate-duration-150 grow overflow-auto"
    >
      <h1 className='text-2xl'>Office Page</h1>
    </div>
  </div>
  );
}

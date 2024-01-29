import React from "react";
import { AuxiliaryView } from "./AuxiliaryView";

export default function page() {
  return (
    <article className="flex w-full h-[90%] pt-[3rem] pl-[250px] overflow-hidden">
      <article className="w-[80%] items-start justify-start flex-col gap-2 flex flex-1 p-4 grow overflow-auto animate-fade animate-once animate-duration-150">
        <AuxiliaryView />
      </article>
    </article>
  );
}

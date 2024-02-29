import React from "react";
import { CreateItemForm } from "./CreateItemForm";

export default function page() {
  return (
    <section className="flex w-full h-[90%] pt-[3rem] pl-[250px] pr-[1rem] overflow-hidden">
      <article className="w-[80%] items-start justify-start flex-col gap-2 p-4 animate-fade animate-once animate-duration-150 grow overflow-auto">
        <h2 className="font-bold text-xl my-2">CREAR ITEM</h2>
        <CreateItemForm />
      </article>
    </section>
  );
}

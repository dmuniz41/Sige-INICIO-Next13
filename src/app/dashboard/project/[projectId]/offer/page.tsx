import React from "react";
import OfferTable from "./OfferTable";

export default function page({ params }: { params: { projectId: string } }) {
  return (
    <section className="flex w-full h-[90%] pt-[3rem] pl-[250px] pr-[1rem] overflow-hidden">
      <article className="w-[80%] items-start justify-start flex-col gap-2 p-4 animate-fade animate-once animate-duration-150 grow overflow-auto">
        <OfferTable projectId={params.projectId} />
      </article>
    </section>
  );
}

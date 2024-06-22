import { OfferView } from "./OfferView";

export default function page({ params }: { params: { offerId: string; projectId: string } }) {
  return (
    <section className="flex max-w-full h-[90%] pt-[3rem] pl-[250px]  ">
      <article className="w-full items-start justify-start flex-col gap-2 p-4 animate-fade animate-once animate-duration-150 overflow-auto">
        <OfferView offerId={params.offerId} projectId={params.projectId} />
      </article>
    </section>
  );
}

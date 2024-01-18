import { ServiceFeeView } from "./ServiceFeeView";

export default function page() {
  return (
    <section className="flex max-w-full h-[90%] pt-[3rem] pl-[250px]  ">
      <article className="w-full items-start justify-start flex-col gap-2 p-4 animate-fade animate-once animate-duration-150 overflow-auto">
        <ServiceFeeView />
      </article>
    </section>
  );
}

import { EditCostSheetForm } from "./EditCostSheetForm";

export default function page() {
  return (
    <section className="flex w-full max-h-[90%] pt-[3rem] pl-[250px] pr-[1rem] overflow-hidden">
      <article className="w-[80%] flex items-start justify-start flex-col gap-4 max-h-[90%] p-4 animate-fade animate-once animate-duration-150 grow overflow-auto ">
        <h2 className="font-semibold text-xl  mt-2">Editar Ficha de Costo</h2>
        <EditCostSheetForm />
      </article>
    </section>
  );
}

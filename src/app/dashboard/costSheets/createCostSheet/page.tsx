import { CreateCostSheetForm } from "./CreateCostSheetForm";

export default function page() {
  return (
    <section className="flex w-full min-h-[90%] pt-[3rem] pl-[250px] pr-[1rem] overflow-hidden">
      <article className="w-[80%] flex items-start justify-start flex-col gap-4 h-full p-4 animate-fade animate-once animate-duration-150 grow overflow-auto rounded-sm shadow-md">
        <h2 className="font-bold text-xl  mt-2">Crear Ficha de Costo</h2> 
        <CreateCostSheetForm />
      </article>
    </section>
  );
}

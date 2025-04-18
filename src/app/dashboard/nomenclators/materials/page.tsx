"use client";
import MaterialsNomenclatorsTable from "./MaterialsNomenclatorsTable";

export default function Page() {
  return (
    <section className="w-full bg-blue-100 h-full flex flex-col grow pt-[3rem] pl-[250px] pr-[1rem] overflow-hidden">
      <article className="w-full  items-start  justify-center  gap-2  p-4 animate-fade animate-once animate-duration-150 grow overflow-auto">
        {/* <MaterialsNomenclatorsTable /> */}
      </article>
      <div className="flex w-full h-2 bg-primary-200">FOOTER</div>
    </section>
  );
}

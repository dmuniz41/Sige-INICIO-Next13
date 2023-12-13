import React from "react";
import UserTable from "./UsersTable";

export default function page() {
  return (
    <section className="flex w-full h-[90%] pt-[3rem] pl-[250px] pr-[1rem] overflow-hidden">
      <section className="w-[80%] items-start justify-start flex-col gap-2 h-full p-4 animate-fade animate-once animate-duration-150 grow overflow-auto">
        <UserTable />
      </section>
    </section>
  );
}

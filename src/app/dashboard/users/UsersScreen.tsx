import React from "react";
import UserTable from "./UsersTable";

export default function UsersScreen() {
  return (
    <div
      id="userTable_wrapper"
      className="w-[80%] items-start justify-start mt-10 flex-col gap-2 h-full p-4 animate-fade animate-once animate-duration-150 grow overflow-auto"
    >
      <UserTable />
    </div>
  );
}

import React from "react";
import UserTable from "./UsersTable";

export default function UsersScreen() {
  return (
      <div className="w-[80%] items-center justify-center flex-col gap-2 h-full p-4 animate-fade animate-once animate-duration-150 grow"> 
        <UserTable />
      </div>
  );
}

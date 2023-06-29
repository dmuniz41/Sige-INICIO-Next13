import React from "react";
import UserTable from "./UsersTable";

export default function UsersScreen() {
  return (
    <div className=" flex-1 flex-col gap-2 w-full h-full p-4 overflow-auto animate-fade animate-once">
      <div className="h-[70rem] w-[140rem] items-center justify-center"> 
        <UserTable />
      </div>
    </div>
  );
}

import React from "react";
import UsersScreen from "./UsersScreen";

export default function page() {
  return (
    <div id="userScreen-wrapper" className="flex w-full h-full items-center pt-[6rem] pl-[300px] pr-[3rem] overflow-hidden">
      <UsersScreen />
    </div>
  );
}

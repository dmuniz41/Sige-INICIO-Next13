import React from "react";
import UsersScreen from "./UsersScreen";

export default function page() {
  console.log('users page');
  
  return (
    <div id="userScreen-wrapper" className="flex w-full h-80% items-center pt-[3rem] pl-[300px] pr-[3rem] overflow-hidden">
      <UsersScreen />
    </div>
  );
}

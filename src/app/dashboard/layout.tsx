import React from "react";
import { Sidebar } from "./Sidebar";
import { Navbar } from "./Navbar";

export default function layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="">
      <Sidebar />
      <Navbar />
      <div className="flex w-full h-screen items-center justify-center pl-[250px] pt-[4rem]">
        {children}
      </div>
    </div>
  );
}

import React from "react";
import { Sidebar } from "./Sidebar";
import { Navbar } from "./Navbar";

export default function layout({ children }: { children: React.ReactNode }) {
  const date: number = new Date().getFullYear()
  return (
    <div className="h-screen w-screen">
      <div className="h-full font-segoe bg-background_light font-semibold text-base absolute pt-[7rem]">
        <Sidebar />
      </div>
      <Navbar />
      <div className="flex items-center justify-center pl-[250px] pt-[4rem]">{children}</div>
      <footer className="w-full justify-center items-center text-center font-segoe text-base font-semibold text-border_input">
        Powered by Grupo INICIO {date}
      </footer>
    </div>
  );
}

'use client'

import React from "react";
import { Sidebar } from './Sidebar';
import { Navbar } from './Navbar';


export default function layout({ children }: { children: React.ReactNode }) {
  const date: number = new Date().getFullYear()
  return (
    <div className="h-screen w-screen animate-fade animate-once animate-duration-150">
      <div className="h-full font-segoe bg-background_light font-semibold text-base absolute pt-[7rem]">
        <Sidebar />
      </div>
      <Navbar />
      {children}
      <footer className="w-full justify-center items-center text-center font-segoe text-base font-semibold text-border_input absolute inset-x-0 bottom-5">
        Powered by Grupo INICIO {date}
      </footer>
    </div>
    
    );
}

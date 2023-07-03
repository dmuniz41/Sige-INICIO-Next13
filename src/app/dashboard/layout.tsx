'use client'

import React from "react";
import { Sidebar } from './Sidebar';
import { Navbar } from './Navbar';


export default function layout({ children }: { children: React.ReactNode }) {
  const date: number = new Date().getFullYear()
  return (
    <div id="dashboard_layout" className="h-screen w-screen animate-fade animate-once animate-duration-150 grid-cols-2">
      <div id="sidebar_wrapper" className="h-full font-segoe bg-background_light font-semibold text-base absolute pt-[7rem] flex">
        <Sidebar />
      </div>
      <Navbar />
      {children}
    </div>
    
    );
}

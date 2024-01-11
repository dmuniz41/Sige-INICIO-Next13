"use client";

import React, { useState } from "react";
import { Menu } from "antd";
import Link from "next/link";
import type { MenuProps } from "antd";

const items: MenuProps["items"] = [
  {
    label: "Seguridad",
    key: "security",
    children: [
      {
        label: <Link href="/dashboard/users">Usuarios</Link>,
        key: "users",
      },
    ],
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round">
        <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
        <path d="M5 13a2 2 0 0 1 2 -2h10a2 2 0 0 1 2 2v6a2 2 0 0 1 -2 2h-10a2 2 0 0 1 -2 -2v-6z"></path>
        <path d="M11 16a1 1 0 1 0 2 0a1 1 0 0 0 -2 0"></path>
        <path d="M8 11v-4a4 4 0 1 1 8 0v4"></path>
      </svg>
    ),
  },

  {
    label: "Recursos Humanos",
    key: "humanResources",
    children: [
      {
        label: <Link href="/dashboard/humanResources">Trabajador</Link>,
        key: "worker",
      },
    ],
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round">
        <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
        <path d="M9 7m-4 0a4 4 0 1 0 8 0a4 4 0 1 0 -8 0"></path>
        <path d="M3 21v-2a4 4 0 0 1 4 -4h4a4 4 0 0 1 4 4v2"></path>
        <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
        <path d="M21 21v-2a4 4 0 0 0 -3 -3.85"></path>
      </svg>
    ),
  },
  {
    label: "Oficina",
    key: "office",
    children: [
      {
        label: <Link href="/dashboard/office">Gastos de oficina</Link>,
        key: "officeExpenses",
      },
    ],
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round">
        <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
        <path d="M3 21l18 0"></path>
        <path d="M9 8l1 0"></path>
        <path d="M9 12l1 0"></path>
        <path d="M9 16l1 0"></path>
        <path d="M14 8l1 0"></path>
        <path d="M14 12l1 0"></path>
        <path d="M14 16l1 0"></path>
        <path d="M5 21v-16a2 2 0 0 1 2 -2h10a2 2 0 0 1 2 2v16"></path>
      </svg>
    ),
  },
  {
    label: "Almacén",
    key: "warehouse",
    children: [
      {
        label: <Link href="/dashboard/warehouse">Materiales</Link>,
        key: "warehouse1",
      },
      {
        label: <Link href="/dashboard/ticketsWarehouse">Almacén de Vales</Link>,
        key: "ticketsWarehouse",
      },
    ],
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round">
        <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
        <path d="M3 21v-13l9 -4l9 4v13"></path>
        <path d="M13 13h4v8h-10v-6h6"></path>
        <path d="M13 21v-9a1 1 0 0 0 -1 -1h-2a1 1 0 0 0 -1 1v3"></path>
      </svg>
    ),
  },
  {
    label: "Proyectos",
    key: "project",
    children: [
      {
        label: <Link href="/dashboard/project">Proyectos</Link>,
        key: "projects",
      },
      {
        label: <Link href="/dashboard/projectExpenses">Gastos de proyectos</Link>,
        key: "projectExpenses",
      },
      {
        label: <Link href="/dashboard/costSheets">Fichas de costo</Link>,
        key: "costSheets",
      },
    ],
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round">
        <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
        <path d="M9 4h3l2 2h5a2 2 0 0 1 2 2v7a2 2 0 0 1 -2 2h-10a2 2 0 0 1 -2 -2v-9a2 2 0 0 1 2 -2"></path>
        <path d="M17 17v2a2 2 0 0 1 -2 2h-10a2 2 0 0 1 -2 -2v-9a2 2 0 0 1 2 -2h2"></path>
      </svg>
    ),
  },
  {
    label: <Link href="/dashboard/serviceFees">Tarifas de Servicios</Link>,
    key: "serviceFees",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round">
        <path stroke="none" d="M0 0h24v24H0z" fill="none" />
        <path d="M4 3m0 2a2 2 0 0 1 2 -2h12a2 2 0 0 1 2 2v14a2 2 0 0 1 -2 2h-12a2 2 0 0 1 -2 -2z" />
        <path d="M8 7m0 1a1 1 0 0 1 1 -1h6a1 1 0 0 1 1 1v1a1 1 0 0 1 -1 1h-6a1 1 0 0 1 -1 -1z" />
        <path d="M8 14l0 .01" />
        <path d="M12 14l0 .01" />
        <path d="M16 14l0 .01" />
        <path d="M8 17l0 .01" />
        <path d="M12 17l0 .01" />
        <path d="M16 17l0 .01" />
      </svg>
    ),
  },
  {
    label: <Link href="/dashboard/nomenclators">Nomencladores</Link>,
    key: "nomenclator",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round">
        <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
        <path d="M10.325 4.317c.426 -1.756 2.924 -1.756 3.35 0a1.724 1.724 0 0 0 2.573 1.066c1.543 -.94 3.31 .826 2.37 2.37a1.724 1.724 0 0 0 1.065 2.572c1.756 .426 1.756 2.924 0 3.35a1.724 1.724 0 0 0 -1.066 2.573c.94 1.543 -.826 3.31 -2.37 2.37a1.724 1.724 0 0 0 -2.572 1.065c-.426 1.756 -2.924 1.756 -3.35 0a1.724 1.724 0 0 0 -2.573 -1.066c-1.543 .94 -3.31 -.826 -2.37 -2.37a1.724 1.724 0 0 0 -1.065 -2.572c-1.756 -.426 -1.756 -2.924 0 -3.35a1.724 1.724 0 0 0 1.066 -2.573c-.94 -1.543 .826 -3.31 2.37 -2.37c1 .608 2.296 .07 2.572 -1.065z"></path>
        <path d="M9 12a3 3 0 1 0 6 0a3 3 0 0 0 -6 0"></path>
      </svg>
    ),
  },
];

export const Sidebar: React.FC = () => {
  const [current, setCurrent] = useState("users");

  const onClick: MenuProps["onClick"] = (e) => {
    setCurrent(e.key);
  };

  return (
    <Menu
      id="sidebar"
      mode="inline"
      onClick={onClick}
      selectedKeys={[current]}
      style={{ width: "240px", backgroundColor: "#f4f6f9", fontWeight: "bold", fontSize: "16px", paddingTop: "45px" }}
      items={items}
    />
  );
};

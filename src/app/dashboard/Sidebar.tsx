"use client"

import React, { useState } from "react";
import { AppstoreOutlined, FolderOpenOutlined, LockOutlined, SettingOutlined, ShopOutlined, UserOutlined } from "@ant-design/icons";
import type { MenuProps } from "antd";
import { Menu } from "antd";
import Link from "next/link";

const items: MenuProps["items"] = [
  {
    label: "Seguridad",
    key: "security",
    children: [
      {
        label: <Link href="#">Usuarios</Link>,
        key: "users",
      },
    ],
    icon: <LockOutlined />,
  },
  {
    label: "Nomencladores",
    key: "nomenclator",
    children: [
      {
        label: <Link href="#">Nomencladores</Link>,
        key: "nomenclator1",
      },
    ],
    icon: <SettingOutlined />,
  },
  {
    label: "Recursos Humanos",
    key: "humanResources",
    children: [
      {
        label: <Link href="#">Trabajador</Link>,
        key: "worker",
      },
    ],
    icon: <UserOutlined />,
  },
  {
    label: "Oficina",
    key: "office",
    children: [
      {
        label: <Link href="#">Gastos de oficina</Link>,
        key: "officeExpenses",
      },
    ],
    icon: <ShopOutlined />,
  },
  {
    label: "Almacén",
    key: "warehouse",
    children: [
      {
        label: <Link href="#">Almacén</Link>,
        key: "warehouse1",
      },
      {
        label: <Link href="#">Almacen de Vales</Link>,
        key: "ticketsWarehouse",
      },
    ],
    icon: <AppstoreOutlined />,
  },
  {
    label: "Proyecto",
    key: "project",
    children: [
      {
        label: <Link href="#">Proyectos</Link>,
        key: "projects",
      },
      {
        label: <Link href="#">Gastos de proyectos</Link>,
        key: "projectExpenses",
      },
    ],
    icon: <FolderOpenOutlined />,
  },
];

export const Sidebar: React.FC = () => {
  const [current, setCurrent] = useState("users");

  const onClick: MenuProps["onClick"] = (e) => {
    setCurrent(e.key);
  };

  return <Menu 
    className="h-screen font-segoe bg-background_light font-semibold text-base" 
    mode="inline" 
    onClick={onClick} 
    selectedKeys={[current]} 
    style={{ width: 250}} 
    items={items} 
  />;
};

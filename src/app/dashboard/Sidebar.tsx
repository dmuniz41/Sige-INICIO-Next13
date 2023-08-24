"use client";

import React, { useState } from "react";
import { AppstoreOutlined, FolderOpenOutlined, LockOutlined, SettingOutlined, ShopOutlined, UserOutlined } from "@ant-design/icons";
import { Menu } from "antd";
import Link from "next/link";
import { useSession } from "next-auth/react";
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
    icon: <LockOutlined />,
  },
  {
    label: "Nomencladores",
    key: "nomenclator",
    children: [
      {
        label: <Link href="/dashboard/nomenclators">Nomencladores</Link>,
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
        label: <Link href="/dashboard/humanResources">Trabajador</Link>,
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
        label: <Link href="/dashboard/office">Gastos de oficina</Link>,
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
        label: <Link href="/dashboard/warehouse">Almacén</Link>,
        key: "warehouse1",
      },
      {
        label: <Link href="/dashboard/ticketsWarehouse">Almacen de Vales</Link>,
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
        label: <Link href="/dashboard/project">Proyectos</Link>,
        key: "projects",
      },
      {
        label: <Link href="/dashboard/projectExpenses">Gastos de proyectos</Link>,
        key: "projectExpenses",
      },
    ],
    icon: <FolderOpenOutlined />,
  },
];

export const Sidebar: React.FC = () => {
  const { data: sessionData } = useSession();
  const username = sessionData?.user.role;

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
      style={{ width: "240px", backgroundColor: "#f4f6f9", fontWeight: "bold", fontSize: "14px" }}
      items={items}
    />
  );
};

"use client";

import React from "react";
import { DownOutlined, LogoutOutlined, SettingOutlined } from "@ant-design/icons";
import type { MenuProps } from "antd";
import { Dropdown, Space } from "antd";

const items: MenuProps["items"] = [
  {
    key: "config",
    label: <a href="#">Configuración</a>,
    icon: <SettingOutlined />,
  },
  {
    key: "logout",
    label: <a href="/auth/login">Logout</a>,
    icon: <LogoutOutlined />,
  },
];

export const DropdownMenu: React.FC = () => (
  <Dropdown menu={{ items }}>
    <a onClick={(e) => e.preventDefault()}>
      <Space className="pb-1">
        <DownOutlined className="cursor-pointer"/>
      </Space>
    </a>
  </Dropdown>
);

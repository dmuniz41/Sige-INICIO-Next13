"use client";

import { Layout, Tooltip, Avatar, Typography, Breadcrumb, Space, Dropdown, MenuProps } from "antd";
import { UserOutlined, LogoutOutlined, ArrowLeftOutlined } from "@ant-design/icons";
import { usePathname, useRouter } from "next/navigation";
import { signOut, useSession } from "next-auth/react";
import { RootState, useAppSelector } from "@/store/store";
import { IWarehouse } from "@/models/warehouse";

const { Header } = Layout;
const { Title, Text } = Typography;

export const Navbar = () => {
  const pathname = usePathname();
  const router = useRouter();
  const { data: sessionData } = useSession();
  const { warehouses } = useAppSelector((state: RootState) => state.warehouse);

  // Get breadcrumb items from pathname
  const pathSegments = pathname.split("/").filter(Boolean);
  const breadcrumbItems = pathSegments.map((segment, index) => ({
    title: segment.charAt(0).toUpperCase() + segment.slice(1),
    href: `/${pathSegments.slice(0, index + 1).join("/")}`
  }));

  // Dropdown menu items
  const items: MenuProps["items"] = [
    {
      key: "logout",
      label: "Cerrar Sesión",
      icon: <LogoutOutlined />,
      onClick: () => signOut()
    }
  ];

  return (
    <Header
      style={{
        padding: "0 24px",
        background: "#fff",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        boxShadow: "0 2px 8px #f0f1f2",
        zIndex: 1
      }}
    >
      <Space>
        <Tooltip title="Volver">
          <ArrowLeftOutlined onClick={() => router.back()} style={{ fontSize: 18, cursor: "pointer" }} />
        </Tooltip>

        <Breadcrumb items={breadcrumbItems} />
      </Space>

      <Space align="center" size="middle">
        <Dropdown menu={{ items }} placement="bottomRight">
          <Space style={{ cursor: "pointer" }}>
            <Avatar icon={<UserOutlined />} style={{ backgroundColor: "#1890ff" }} />
            <Text strong>{sessionData?.user?.userName}</Text>
          </Space>
        </Dropdown>
      </Space>
    </Header>
  );
};

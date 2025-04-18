// components/AntDesignLayout.tsx
"use client";
import { Layout } from "antd";
import { Sidebar } from "./dashboard/Sidebar";
import { Navbar } from "./dashboard/Navbar";

const { Header, Content, Footer, Sider } = Layout;

export function AntDesignLayout({ children }: { children: React.ReactNode }) {
  return (
    <Layout style={{ minHeight: "100vh" }}>
        <Sidebar /> {/* Keep Sidebar here */}
      <Layout>
        <Navbar />
        <Content style={{ margin: "24px 16px 0" }}>
          <div style={{ padding: 24, minHeight: 360 }}>
            {children} {/* Only page content here */}
          </div>
        </Content>
        <Footer style={{ textAlign: "center" }}>Next.js + Ant Design ©{new Date().getFullYear()}</Footer>
      </Layout>
    </Layout>
  );
}

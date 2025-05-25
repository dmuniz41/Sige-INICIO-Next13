"use client";
import { Layout } from "antd";
import { Sidebar } from "./dashboard/Sidebar";
import { Navbar } from "./dashboard/Navbar";

const { Content, Footer } = Layout;

export function AntDesignLayout({ children }: { children: React.ReactNode }) {
  return (
    <Layout style={{ minHeight: "100vh" }}>
        <Sidebar /> 
      <Layout>
        <Navbar />
        <Content style={{ margin: "24px 16px 0" }}>
          <div style={{ padding: 24, minHeight: 360 }}>
            {children} 
          </div>
        </Content>
        <Footer style={{ textAlign: "center" }}>Grupo INICIO ©{new Date().getFullYear()}</Footer>
      </Layout>
    </Layout>
  );
}

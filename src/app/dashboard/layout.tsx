'use client'

import { Layout } from "antd";
import { Sidebar } from "./Sidebar";
import { Navbar } from "./Navbar";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Sidebar />
      <Layout>
        <Navbar />
        <Layout.Content style={{ margin: "24px 16px 0" }}>
          <div
            style={{
              padding: 24,
              minHeight: 360,
              background: "#fff",
              borderRadius: 8
            }}
          >
            {children}
          </div>
        </Layout.Content>
        <Layout.Footer style={{  textAlign: "center",borderTop: '1px solid #e8e8e8' }}>Grupo INICIO {new Date().getFullYear()}</Layout.Footer>
      </Layout>
    </Layout>
  );
}

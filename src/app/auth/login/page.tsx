"use client";

import { LockOutlined, UserOutlined } from "@ant-design/icons";
import { Form, Input, Layout, Row, Typography, notification } from "antd";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import React, { useState } from "react";

import logo from "../../../assets/inicio.svg";

const { Content, Footer } = Layout;
const { Title } = Typography;

export default function LoginPage() {
  const router = useRouter();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false); 

  const handleSubmit = async (values: { username: string; password: string }) => {
    setLoading(true); 
    const result = await signIn("credentials", {
      redirect: false,
      username: values.username,
      password: values.password
    });
    setLoading(false); 

    if (result?.error) {
      console.error("Login failed:", result.error);
      notification.error({
        message: "Error de inicio de sesión",
        description: "Credenciales inválidas. Por favor, intente de nuevo."
      });
      return;
    }

    // Use router.push for navigation
    router.push("/dashboard");
  };

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Content
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          background: "linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)"
        }}
      >
        <div
          style={{
            width: "100%",
            maxWidth: 400,
            padding: 40,
            background: "#ffffff",
            borderRadius: 8,
            boxShadow: "0 4px 12px rgba(0,0,0,0.1)"
          }}
        >
          <Row justify={"center"} align={"middle"}>
            <Image src={logo} width={180} height={80} alt="Inicio logo" style={{ marginBottom: 24 }} />
            <Title level={3} style={{ marginBottom: 0 }}>
              Bienvenido a SIGE-INICIO
            </Title>
            <p style={{ color: "#666" }}>Por favor inicie sesión</p>
          </Row>

          <Form form={form} name="login" initialValues={{ remember: true }} onFinish={handleSubmit} layout="vertical">
            <Form.Item name="username" rules={[{ required: true, message: "Por favor ingrese su usuario" }]}>
              <Input prefix={<UserOutlined />} placeholder="Usuario" size="large" />
            </Form.Item>

            <Form.Item name="password" rules={[{ required: true, message: "Por favor ingrese su contraseña" }]}>
              <Input.Password prefix={<LockOutlined />} placeholder="Contraseña" size="large" />
            </Form.Item>

            <Form.Item>
              {/* Disable button and show loading state */}
              <button className="login-btn" type="submit" disabled={loading}>
                {loading ? "Iniciando sesión..." : "Entrar"}
              </button>
            </Form.Item>
          </Form>
        </div>
      </Content>
    </Layout>
  );
}

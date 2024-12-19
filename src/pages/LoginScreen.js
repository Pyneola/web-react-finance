import React, { useState, useEffect } from "react";
import {
  Button,
  Checkbox,
  Form,
  Input,
  Alert,
  Typography,
  theme,
  Grid,
} from "antd";
import { LockOutlined, MailOutlined } from "@ant-design/icons";
import axios from "axios";

import { useLocation, useNavigate } from "react-router-dom";

const { Text, Title, Link } = Typography;
const { useToken } = theme;
const { useBreakpoint } = Grid;
const URL_AUTH = "/api/auth/local";

export default function LoginScreen(props) {
  const [isLoading, setIsLoading] = useState(false);
  const [errMsg, setErrMsg] = useState(null);
  const navigate = useNavigate();
  const { token } = useToken();
  const screens = useBreakpoint();
  const [remember, setRemember] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const savedToken =
      localStorage.getItem("token") || sessionStorage.getItem("token");

    if (savedToken) {
      // ตั้งค่า Authorization header
      axios.defaults.headers.common = { Authorization: `Bearer ${savedToken}` };

      // ตรวจสอบเฉพาะเมื่ออยู่ที่หน้า /login
      if (location.pathname === "/login") {
        navigate(sessionStorage.getItem("lastPath") || "/home"); // กลับไป path ล่าสุดที่บันทึกไว้
      }
    } else {
      // ไม่มี token ให้เปลี่ยนไปที่หน้า /login
      if (location.pathname !== "/login") {
        navigate("/login");
      }
    }

    // บันทึก path ล่าสุด
    if (savedToken && location.pathname !== "/login") {
      sessionStorage.setItem("lastPath", location.pathname);
    }
  }, [location.pathname, navigate]);

  const handleLogin = async (formData) => {
    try {
      setIsLoading(true);
      setErrMsg(null);
      const response = await axios.post(URL_AUTH, { ...formData });
      const token = response.data.jwt;

      if (remember) {
        localStorage.setItem("token", token); // จดจำถาวร
      } else {
        sessionStorage.setItem("token", token); // จดจำเฉพาะ session
      }
      axios.defaults.headers.common = { Authorization: `Bearer ${token}` };
      props.onLoginSuccess();
      navigate("/home");
    } catch (err) {
      console.log(err);
      setErrMsg("Invalid username or password.");
    } finally {
      setIsLoading(false);
    }
  };

  const styles = {
    container: {
      margin: "0 auto",
      padding: screens.md
        ? `${token.paddingXL}px`
        : `${token.sizeXXL}px ${token.padding}px`,
      width: "380px",
    },
    footer: {
      marginTop: token.marginLG,
      textAlign: "center",
      width: "100%",
    },
    forgotPassword: {
      float: "right",
    },
    header: {
      marginBottom: token.marginXL,
    },
    section: {
      alignItems: "center",
      backgroundColor: token.colorBgContainer,
      display: "flex",
      height: screens.sm ? "100%" : "auto",
      width: screens.sm ? "100%" : "auto",
      padding: screens.md ? `${token.sizeXXL}px 0px` : "0px",
    },
    text: {
      color: token.colorTextSecondary,
    },
    title: {
      fontSize: screens.md ? token.fontSizeHeading2 : token.fontSizeHeading3,
    },
  };

  return (
    <section style={styles.section}>
      <div style={styles.container}>
        <div style={styles.header}>
          <Title style={styles.title}>Sign in</Title>
          <Text style={styles.text}>
            Welcome back to Account of income and expenses
            <br />
            Please enter your details below to sign in.
          </Text>
        </div>

        <Form
          name="login_form"
          initialValues={{ remember: true }}
          onFinish={handleLogin}
          layout="vertical"
          requiredMark="optional"
        >
          {errMsg && (
            <Form.Item>
              <Alert message={errMsg} type="error" />
            </Form.Item>
          )}
          <Form.Item
            name="identifier"
            rules={[{ required: true, message: "Please input your Email!" }]}
          >
            <Input prefix={<MailOutlined />} placeholder="Username" />
          </Form.Item>
          <Form.Item
            name="password"
            rules={[{ required: true, message: "Please input your Password!" }]}
          >
            <Input.Password prefix={<LockOutlined />} placeholder="Password" />
          </Form.Item>
          <Form.Item>
            <Checkbox
              checked={remember}
              onChange={(e) => setRemember(e.target.checked)} // อัปเดตสถานะ remember
            >
              Remember me
            </Checkbox>
          </Form.Item>
          <Form.Item style={{ marginBottom: "0px" }}>
            <Button block type="primary" htmlType="submit" loading={isLoading}>
              Log in
            </Button>
          </Form.Item>
        </Form>
      </div>
    </section>
  );
}

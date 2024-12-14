// import { useState } from "react";
// import { Button, Form, Input, Alert } from "antd";
// import axios from "axios";
// const URL_AUTH = "/api/auth/local";
// export default function LoginScreen(props) {
//   const [isLoading, setIsLoading] = useState(false);
//   const [errMsg, setErrMsg] = useState(null);
//   const handleLogin = async (formData) => {
//     try {
//       setIsLoading(true);
//       setErrMsg(null);
//       const response = await axios.post(URL_AUTH, { ...formData });
//       const token = response.data.jwt;
//       axios.defaults.headers.common = { Authorization: `bearer ${token}` };
//       props.onLoginSuccess();
//     } catch (err) {
//       console.log(err);
//       setErrMsg("Invalid username or password."); //err.message);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   return (
//     <Form onFinish={handleLogin} autoComplete="off">
//       {errMsg && (
//         <Form.Item>
//           <Alert message={errMsg} type="error" />
//         </Form.Item>
//       )}
//       <Form.Item
//         label="Username"
//         name="identifier"
//         rules={[{ required: true }]}
//       >
//         <Input />
//       </Form.Item>

//       <Form.Item label="Password" name="password" rules={[{ required: true }]}>
//         <Input.Password />
//       </Form.Item>
//       <Form.Item>
//         <Button type="primary" htmlType="submit" loading={isLoading}>
//           Submit
//         </Button>
//       </Form.Item>
//     </Form>
//   );
// }
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

const { Text, Title, Link } = Typography;
const { useToken } = theme;
const { useBreakpoint } = Grid;
const URL_AUTH = "/api/auth/local";

export default function LoginScreen(props) {
  const [isLoading, setIsLoading] = useState(false);
  const [errMsg, setErrMsg] = useState(null);

  const { token } = useToken();
  const screens = useBreakpoint();

  useEffect(() => {
    // ตรวจสอบโทเค็นที่บันทึกไว้
    const savedToken =
      localStorage.getItem("token") || sessionStorage.getItem("token");
    if (savedToken) {
      axios.defaults.headers.common = { Authorization: `Bearer ${savedToken}` };
      props.onLoginSuccess(); // เปลี่ยนไปหน้าหลักทันที
    }
  }, [props]);

  const handleLogin = async (formData) => {
    try {
      setIsLoading(true);
      setErrMsg(null);
      const response = await axios.post(URL_AUTH, { ...formData });
      const token = response.data.jwt;

      if (formData.remember) {
        localStorage.setItem("token", token); // จดจำถาวร
      } else {
        sessionStorage.setItem("token", token); // จดจำเฉพาะ session
      }
      axios.defaults.headers.common = { Authorization: `Bearer ${token}` };
      props.onLoginSuccess();
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
      height: screens.sm ? "100vh" : "auto",
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
            <Form.Item name="remember" valuePropName="checked" noStyle>
              <Checkbox>Remember me</Checkbox>
            </Form.Item>
            <a style={styles.forgotPassword} href="">
              Forgot password?
            </a>
          </Form.Item>
          <Form.Item style={{ marginBottom: "0px" }}>
            <Button block type="primary" htmlType="submit" loading={isLoading}>
              Log in
            </Button>
            <div style={styles.footer}>
              <Text style={styles.text}>Don't have an account?</Text>{" "}
              <Link href="">Sign up now</Link>
            </div>
          </Form.Item>
        </Form>
      </div>
    </section>
  );
}

import { useState, useEffect } from "react";
import axios from "axios";
import { Button, Card, Typography } from "antd";
import { useNavigate } from "react-router-dom";
import { UserOutlined } from "@ant-design/icons";

const Profile = () => {
  const [user, setUser] = useState(null);
  const [email, setEmail] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    // เช็คว่าไม่มี token ใน localStorage หรือ sessionStorage
    if (!localStorage.getItem("token") && !sessionStorage.getItem("token")) {
      setError("กรุณาเข้าสู่ระบบเพื่อเข้าถึงข้อมูล");
      navigate("/login"); // เมื่อไม่มี token จะนำไปที่หน้า login
    }
  }, [navigate]); // การเพิ่ม `navigate` ใน dependencies

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setLoading(true);
        const token =
          localStorage.getItem("token") || sessionStorage.getItem("token");

        if (token) {
          const response = await axios.get(
            "http://localhost:1337/api/users/me",
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );

          const { username, email } = response.data;
          setUser(username);
          setEmail(email);
        } else {
          setError("No token found.");
        }
      } catch (err) {
        setError("Failed to fetch user data.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  const handleLogout = () => {
    // ลบ token จาก localStorage และ sessionStorage
    localStorage.removeItem("token");
    document.cookie = "token=; path=/; max-age=0;";
    sessionStorage.removeItem("token");

    // ลบ Authorization header ของ axios
    delete axios.defaults.headers.common["Authorization"];

    // นำทางไปยังหน้า Login
    navigate("/login"); // ใช้ navigate เพื่อนำทาง
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "80%",
        backgroundColor: "#f9f9f9",
        padding: "50px",
        width: "60%",
      }}
    >
      {/* กรอบหลัก */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          width: "120%",
          backgroundColor: "#fff", // สีพื้นหลังของกรอบหลัก
          borderRadius: "8px", // มุมโค้งมน
          padding: "50px",
          // boxShadow: "0 6px 12px rgba(0, 0, 0, 0.1)", // เพิ่มเงารอบๆ กรอบ
          //border: "2px solid rgb(175, 175, 175)", // ขอบกรอบหลัก
        }}
      >
        {/* Title Section */}
        <Typography.Title
          style={{
            backgroundColor: "#333", // สีพื้นหลัง
            color: "#fff", // สีตัวอักษร
            padding: "15px",
            borderRadius: "8px",
            textAlign: "center",
            fontSize: "30px",
            marginBottom: "30px", // ระยะห่างด้านล่าง
          }}
        >
          Profile
        </Typography.Title>

        {/* Card Section */}
        <Card
          title={
            <span>
              User Profile <UserOutlined /> {/* ไอคอนจะอยู่ติดกับคำใน title */}
            </span>
          }
          style={{
            width: 400,
            height: 270,
            textAlign: "center",
            boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)", // เพิ่มเงาให้กรอบของ card
            borderRadius: "8px", // มุมกรอบโค้ง
            backgroundColor: "#fff", // พื้นหลังกรอบเป็นสีขาว
            border: "2px solid rgb(170, 169, 169)", // ขอบกรอบให้ดูคมชัด
          }}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "column", // จัดข้อมูลในแนวตั้ง
              alignItems: "flex-start", // จัดให้ข้อมูลชิดซ้าย
              width: "100%", // ทำให้กว้างเต็ม
              marginBottom: "35px", // ระยะห่างระหว่างรายการ
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between", // ทำให้ข้อมูลอยู่ห่างกัน
                width: "98%", // ให้เต็มความกว้าง
                marginBottom: "20px", // ระยะห่างระหว่างบรรทัด
              }}
            >
              <strong
                style={{
                  color: "#555",
                  fontSize: "18px",
                }}
              >
                Username:
              </strong>
              <span
                style={{
                  color: "#1D1D1F",
                  fontWeight: "500",
                }}
              >
                {user}
              </span>
            </div>

            <div
              style={{
                display: "flex",
                justifyContent: "space-between", // ทำให้ข้อมูลอยู่ห่างกัน
                width: "98%", // ให้เต็มความกว้าง
              }}
            >
              <strong
                style={{
                  color: "#555",
                  fontSize: "18px",
                }}
              >
                Email:
              </strong>
              <span
                style={{
                  color: "#1D1D1F",
                  fontWeight: "500",
                }}
              >
                {email}
              </span>
            </div>
          </div>

          <Button
            type="primary"
            onClick={handleLogout}
            style={{
              width: "60%",
              backgroundColor: "#333", // สีพื้นหลังปุ่มเป็นสีดำ
              borderColor: "#333", // ขอบปุ่มสีดำ
              color: "#fff", // ตัวอักษรสีขาว
              borderRadius: "4px", // มุมโค้งมน
              fontWeight: "bold", // ทำให้ตัวอักษรหนาขึ้น
              fontSize: "16px", // ขนาดตัวอักษร
              padding: "10px 0", // ระยะห่างภายในปุ่ม
              transition: "background-color 0.3s", // เพิ่มการเปลี่ยนสีเมื่อ hover
            }}
          >
            Logout
          </Button>
        </Card>
      </div>
    </div>
  );
};

export default Profile;

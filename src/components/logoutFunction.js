import React from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const LogoutButton = () => {
  const navigate = useNavigate(); // useNavigate ควรอยู่ภายใน React component

  const handleLogout = () => {
    // ลบ token จาก localStorage และ sessionStorage
    localStorage.removeItem("token");
    sessionStorage.removeItem("token");

    // ลบ Authorization header ของ axios
    delete axios.defaults.headers.common["Authorization"];

    // นำทางไปยังหน้า Login
    navigate("/login"); // ใช้ navigate เพื่อนำทาง
  };

  return (
    <button
      onClick={handleLogout}
      style={{
        position: "fixed", // ทำให้ปุ่มคงที่
        bottom: "20px", // ระยะห่างจากขอบล่าง
        right: "20px", // ระยะห่างจากขอบขวา
        zIndex: 1000, // ให้ปุ่มอยู่ด้านบนขององค์ประกอบอื่นๆ
        padding: "10px 20px", // ขนาดของปุ่ม
        backgroundColor: "#f5222d", // สีพื้นหลังปุ่ม (สีแดง)
        color: "#fff", // สีตัวอักษร
        border: "none", // ไม่มีกรอบ
        borderRadius: "5px", // มุมโค้งมน
        cursor: "pointer", // ให้แสดงเป็นมือเมื่อ hover
        fontSize: "16px", // ขนาดฟอนต์
      }}
    >
      Logout
    </button>
  );
};

export default LogoutButton;

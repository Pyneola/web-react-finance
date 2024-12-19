import React from "react";
import { useNavigate } from "react-router-dom";
import { useState, useEffect, useRef } from "react";

function HomeScreen() {
  const navigate = useNavigate(); // ใช้สำหรับการนำทาง
  const [error, setError] = useState(null);

  useEffect(() => {
    // เช็คว่าไม่มี token ใน localStorage หรือ sessionStorage
    if (!localStorage.getItem("token") && !sessionStorage.getItem("token")) {
      setError("กรุณาเข้าสู่ระบบเพื่อเข้าถึงข้อมูล");
      navigate("/login"); // เมื่อไม่มี token จะนำไปที่หน้า login
    }
  }, [navigate]); // การเพิ่ม `navigate` ใน dependencies

  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundColor: "#ffffff",
        color: "#333",
        fontFamily: "'Roboto', sans-serif",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
      }}
    >
      {/* Header */}
      <header
        style={{
          backgroundColor: "#333",
          color: "#fff",
          padding: "40px 0",
          textAlign: "center",
          width: "100vw",
          margin: "0",
          position: "relative",
        }}
      >
        <h1 style={{ fontSize: "3rem", margin: 0 }}>Finance Tracker</h1>
        <p style={{ fontSize: "1.5rem", marginTop: "10px" }}>
          ระบบบันทึกรายรับรายจ่ายง่ายๆ เพื่อชีวิตที่ดีกว่า
        </p>
      </header>

      {/* Main Content */}
      <main
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          padding: "20px",
          boxSizing: "border-box",
        }}
      >
        <div
          style={{
            maxWidth: "900px",
            textAlign: "center",
            backgroundColor: "#f9f9f9",
            boxShadow: "0 8px 20px rgba(0, 0, 0, 0.2)",
            borderRadius: "16px",
            padding: "40px",
            width: "100%",
          }}
        >
          <h2
            style={{
              fontSize: "2.5rem",
              color: "#333",
              marginBottom: "20px",
            }}
          >
            ยินดีต้อนรับสู่ Finance Tracker
          </h2>
          <p
            style={{
              fontSize: "1.2rem",
              color: "#555",
              marginBottom: "30px",
            }}
          >
            จัดการรายรับรายจ่ายของคุณได้ง่ายๆ
            ด้วยระบบที่ออกแบบมาให้ใช้งานได้สะดวก
            สร้างนิสัยทางการเงินที่ดีวันนี้!
          </p>
        </div>
      </main>

      {/* Footer */}
      <footer
        style={{
          backgroundColor: "#333",
          color: "#fff",
          textAlign: "center",
          padding: "20px 0",
          width: "100vw",
          margin: "0",
          position: "relative",
        }}
      >
        <p style={{ margin: 0 }}>
          © 2024 Finance Tracker | จัดการการเงินอย่างมืออาชีพ
        </p>
      </footer>
    </div>
  );
}

export default HomeScreen;

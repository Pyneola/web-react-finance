import React, { useState } from "react";
import { Layout, Menu, Button } from "antd";
import {
  HomeOutlined,
  GlobalOutlined,
  MenuOutlined,
  CloseOutlined,
  UserOutlined,
  BarChartOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";

const { Sider } = Layout;

function Sidebar() {
  const [collapsed, setCollapsed] = useState(true); // สถานะเปิด/ปิด Sidebar
  const [showHamburger, setShowHamburger] = useState(true); // สถานะแสดงปุ่ม hamburger
  const navigate = useNavigate();

  // ฟังก์ชันสำหรับเปิด Sidebar
  const openSidebar = () => {
    setCollapsed(false);
    setShowHamburger(false); // ซ่อนปุ่ม hamburger เมื่อเปิด Sidebar
  };

  // ฟังก์ชันสำหรับปิด Sidebar
  const closeSidebar = () => {
    setCollapsed(true);
    setShowHamburger(true); // แสดงปุ่ม hamburger เมื่อปิด Sidebar
  };

  return (
    <div>
      {/* ปุ่ม Hamburger */}
      {showHamburger && (
        <Button
          type="primary"
          icon={<MenuOutlined />}
          style={{
            position: "fixed",
            top: "16px",
            left: "16px",
            zIndex: 1000,
            borderRadius: "8px",
            width: "48px",
            height: "48px",
            backgroundColor: "#001529",
            color: "#fff",
            border: "none",
            boxShadow: "0 4px 6px rgba(0, 0, 0, 0.2)",
          }}
          onClick={openSidebar} // เปิด Sidebar
        />
      )}

      {/* Sidebar */}
      {!collapsed && (
        <Sider
          width={220}
          className="site-layout-background"
          style={{
            height: "100vh",
            position: "fixed",
            left: "0",
            top: "0",
            borderRight: "2px solid #ccc",
            backgroundColor: "#333",
            boxShadow: "2px 0 8px rgba(0, 0, 0, 0.1)",
            zIndex: 999,
            display: "flex",
            flexDirection: "column", // วางเมนูในแนวตั้ง
            justifyContent: "center", // จัดตำแหน่งเมนูให้อยู่ตรงกลางแนวตั้ง
            padding: "16px 16px 0", // เพิ่ม padding ให้กับ Sider
            transition: "all 0.01s ease-in-out", // เพิ่ม transition ให้ Sidebar เคลื่อนไหวอย่างนุ่มนวล
            boxSizing: "border-box", // ใช้ boxSizing เพื่อลดปัญหาการหักล้าง padding
          }}
        >
          <Menu
            mode="inline"
            defaultSelectedKeys={["1"]}
            style={{
              border: "none",
              padding: "0", // กำหนด padding เป็น 0 เพื่อให้ทุกอย่างแนบสนิท
              flex: "1", // ใช้ flex: 1 เพื่อให้เมนูขยายเต็มพื้นที่ใน Sider
              display: "flex", // ใช้ flexbox ภายในเมนู
              flexDirection: "column", // วางรายการในแนวตั้ง
              justifyContent: "center", // จัดตำแหน่งรายการเมนูให้อยู่ตรงกลาง
              alignItems: "center", // จัดตำแหน่งรายการเมนูให้อยู่ตรงกลาง
              backgroundColor: "#333",
              boxShadow: "10px 0 8px rgba(72, 72, 72, 0.1)",
            }}
          >
            <Menu.Item
              key="1"
              icon={<HomeOutlined />}
              onClick={() => navigate("/home")}
              style={{
                borderRadius: "8px",
                margin: "8px 16px", // เพิ่ม margin ให้แต่ละรายการห่างกัน
                padding: "12px", // เพิ่ม padding ให้แต่ละรายการ
                backgroundColor: "#f5f5f5",
                boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
                transition: "all 0.2s ease-in-out",
                display: "flex",
                alignItems: "center",
                backgroundColor: "#e4e4e4",
              }}
            >
              Home
            </Menu.Item>
            <Menu.Item
              key="2"
              icon={<GlobalOutlined />}
              onClick={() => navigate("/finance")}
              style={{
                borderRadius: "8px",
                margin: "8px 16px", // เพิ่ม margin ให้แต่ละรายการห่างกัน
                padding: "12px", // เพิ่ม padding ให้แต่ละรายการ
                backgroundColor: "#f5f5f5",
                boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
                transition: "all 0.2s ease-in-out",
                display: "flex",
                alignItems: "center",
                backgroundColor: "#e4e4e4",
              }}
            >
              Finance
            </Menu.Item>
            <Menu.Item
              key="3"
              icon={<BarChartOutlined />}
              onClick={() => navigate("/chart")}
              style={{
                borderRadius: "8px",
                margin: "8px 16px", // เพิ่ม margin ให้แต่ละรายการห่างกัน
                padding: "12px", // เพิ่ม padding ให้แต่ละรายการ
                backgroundColor: "#f5f5f5",
                boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
                transition: "all 0.2s ease-in-out",
                display: "flex",
                alignItems: "center",
                backgroundColor: "#e4e4e4",
              }}
            >
              Chart
            </Menu.Item>
            <Menu.Item
              key="4"
              icon={<UserOutlined />}
              onClick={() => navigate("/profile")}
              style={{
                borderRadius: "8px",
                margin: "8px 16px", // เพิ่ม margin ให้แต่ละรายการห่างกัน
                padding: "12px", // เพิ่ม padding ให้แต่ละรายการ
                backgroundColor: "#f5f5f5",
                boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
                transition: "all 0.2s ease-in-out",
                display: "flex",
                alignItems: "center",
                backgroundColor: "#e4e4e4",
              }}
            >
              Profile
            </Menu.Item>
          </Menu>

          {/* ปุ่มปิด Sidebar ที่ด้านล่าง */}
          <Button
            icon={<CloseOutlined />}
            style={{
              position: "absolute",
              bottom: "16px", // ปรับให้ปุ่มอยู่ด้านล่าง
              left: "50%", // ทำให้ปุ่มอยู่ตรงกลาง
              transform: "translateX(-50%)", // ปรับให้อยู่ตรงกลางตามแกน X
              borderRadius: "8px",
              width: "48px",
              height: "48px",
              backgroundColor: "#fff",
              color: "#000",
              border: "1px solid #ccc",
              boxShadow: "0 4px 6px rgba(0, 0, 0, 0.2)",
              zIndex: 1001, // ให้ปุ่มปิดอยู่ด้านบนของ Sidebar
            }}
            onClick={closeSidebar} // ปิด Sidebar
          />
        </Sider>
      )}
    </div>
  );
}

export default Sidebar;

// logout.js
import axios from "axios";

export const handleLogout = () => {
  // ลบ token จาก localStorage และ sessionStorage
  localStorage.removeItem("token");
  sessionStorage.removeItem("token");

  // ลบ Authorization header ของ axios
  delete axios.defaults.headers.common["Authorization"];

  // รีไดเรกต์ไปยังหน้า Login
  window.location.href = "/login";
};

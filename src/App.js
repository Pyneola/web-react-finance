import "./App.css";
import axios from "axios";
// import {
//   BrowserRouter as Router,
//   Routes,
//   Route,
//   Navigate,
// } from "react-router-dom";
import LoginScreen from "./components/LoginScreen";
import FinanceScreen from "./components/FinanceScreen";
import { useState } from "react";

axios.defaults.baseURL =
  process.env.REACT_APP_BASE_URL || "http://localhost:1337";
function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const handleLoginSuccess = () => {
    setIsAuthenticated(true); // เมื่อล็อกอินสำเร็จ จะเปลี่ยนสถานะเป็น true
  };

  return (
    <div className="App">
      <header className="App-header">
        {isAuthenticated ? (
          <FinanceScreen />
        ) : (
          <LoginScreen onLoginSuccess={handleLoginSuccess} />
        )}
      </header>
    </div>
  );
}
export default App;

// import "./App.css";
// import axios from "axios";
// import {
//   BrowserRouter as Router,
//   Routes,
//   Route,
//   Navigate,
// } from "react-router-dom";
// import LoginScreen from "./components/LoginScreen";
// import FinanceScreen from "./components/FinanceScreen";
// import { useState, useEffect } from "react";

// // ตั้งค่า Base URL สำหรับ Axios
// axios.defaults.baseURL =
//   process.env.REACT_APP_BASE_URL || "http://localhost:1337";

// function App() {
//   const [isAuthenticated, setIsAuthenticated] = useState(false);

//   // ตรวจสอบสถานะการล็อกอินจาก localStorage เมื่อเริ่มต้นแอป
//   useEffect(() => {
//     const token = localStorage.getItem("token"); // ใช้ localStorage เพื่อเก็บสถานะการล็อกอิน
//     if (token) {
//       setIsAuthenticated(true); // ถ้ามี token หมายถึงผู้ใช้ล็อกอินแล้ว
//     }
//   }, []);

//   const handleLoginSuccess = (token) => {
//     localStorage.setItem("token", token); // เก็บ token ใน localStorage
//     setIsAuthenticated(true); // เมื่อล็อกอินสำเร็จ จะเปลี่ยนสถานะเป็น true
//   };

//   const handleLogout = () => {
//     localStorage.removeItem("token"); // ลบ token เมื่อทำการออกจากระบบ
//     setIsAuthenticated(false); // เปลี่ยนสถานะให้กลับไปเป็น false
//   };

//   return (
//     <Router>
//       <div className="App">
//         <Routes>
//           {/* เส้นทางสำหรับหน้า Login */}
//           <Route
//             path="/login"
//             element={<LoginScreen onLoginSuccess={handleLoginSuccess} />}
//           />

//           {/* เส้นทางสำหรับหน้า Finance */}
//           <Route
//             path="/finance"
//             element={
//               isAuthenticated ? (
//                 <FinanceScreen onLogout={handleLogout} />
//               ) : (
//                 <Navigate to="/login" replace />
//               )
//             }
//           />

//           {/* เส้นทางเริ่มต้น */}
//           <Route path="*" element={<Navigate to="/login" replace />} />
//         </Routes>
//       </div>
//     </Router>
//   );
// }

// export default App;

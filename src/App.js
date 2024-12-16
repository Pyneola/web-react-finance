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

// axios.defaults.baseURL =
//   process.env.REACT_APP_BASE_URL || "http://localhost:1337";
// function App() {
//   const [isAuthenticated, setIsAuthenticated] = useState(false);
//   const handleLoginSuccess = () => {
//     setIsAuthenticated(true); // เมื่อล็อกอินสำเร็จ จะเปลี่ยนสถานะเป็น true
//   };

//   useEffect(() => {
//     const token =
//       localStorage.getItem("token") || sessionStorage.getItem("token");
//     if (token) {
//       setIsAuthenticated(true); // หากมี token อยู่แล้ว ให้ถือว่าเข้าสู่ระบบแล้ว
//     }
//   }, []);

//   return (
//     <div className="App">
//       <header className="App-header">
//         <Routes>
//           {/* Path สำหรับหน้า Finance */}
//           <Route
//             path="/finance" // กำหนด path สำหรับหน้า Finance
//             element={
//               isAuthenticated ? (
//                 <FinanceScreen />
//               ) : (
//                 <Navigate to="/login" /> // ถ้าไม่ login ให้ไปหน้า login
//               )
//             }
//           />
//           {/* Path สำหรับหน้า Login */}
//           <Route
//             path="/login"
//             element={<LoginScreen onLoginSuccess={handleLoginSuccess} />}
//           />
//           {/* Path เริ่มต้นของแอป */}
//           <Route
//             path="/"
//             element={<Navigate to="/login" />} // เปลี่ยนไปหน้า login โดยอัตโนมัติ
//           />
//         </Routes>
//       </header>
//     </div>
//   );
// }

// export default App;

import "./App.css";
import axios from "axios";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useLocation,
} from "react-router-dom";
import LoginScreen from "./pages/LoginScreen";
import FinanceScreen from "./pages/FinanceScreen";
import HomeScreen from "./pages/HomeScreen";
import ProfileScreen from "./pages/ProfileScreen";
import Sidebar from "./components/SlideBar";
import { useState, useEffect } from "react";

axios.defaults.baseURL =
  process.env.REACT_APP_BASE_URL || "http://localhost:1337";

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const location = useLocation(); // ใช้ useLocation เพื่อตรวจสอบ path ปัจจุบัน

  const handleLoginSuccess = () => {
    setIsAuthenticated(true); // เมื่อล็อกอินสำเร็จ จะเปลี่ยนสถานะเป็น true
  };

  useEffect(() => {
    const token =
      localStorage.getItem("token") || sessionStorage.getItem("token");
    if (token) {
      setIsAuthenticated(true); // หากมี token อยู่แล้ว ให้ถือว่าเข้าสู่ระบบแล้ว
    }
  }, []);

  // ตรวจสอบให้แน่ใจว่า path ล่าสุดที่ผู้ใช้กำลังอยู่จะถูกเก็บใน sessionStorage
  useEffect(() => {
    if (isAuthenticated) {
      sessionStorage.setItem("lastPath", location.pathname);
    }
  }, [location, isAuthenticated]);

  return (
    <div className="App">
      {/* ตรวจสอบว่าไม่อยู่ในหน้า login จึงจะแสดง Sidebar */}
      {/* {location.pathname !== "/login" && <Sidebar />} */}
      {(location.pathname === "/home" ||
        location.pathname === "/finance" ||
        location.pathname === "/profile") && <Sidebar />}

      <header className="App-header">
        <Routes>
          {/* Path สำหรับหน้า Home */}
          <Route
            path="/home"
            element={
              isAuthenticated ? <HomeScreen /> : <Navigate to="/login" />
            }
          />
          {/* Path สำหรับหน้า Finance */}
          <Route
            path="/finance"
            element={
              isAuthenticated ? <FinanceScreen /> : <Navigate to="/login" />
            }
          />
          {/* Path สำหรับหน้า Login */}
          <Route
            path="/login"
            element={<LoginScreen onLoginSuccess={handleLoginSuccess} />}
          />
          <Route
            path="/profile"
            element={
              isAuthenticated ? <ProfileScreen /> : <Navigate to="/login" />
            }
          />
          {/* Path เริ่มต้นของแอป */}
          <Route
            path="/"
            element={
              <Navigate
                to={
                  isAuthenticated
                    ? sessionStorage.getItem("lastPath") || "/home" // หากมี lastPath จะไปหน้าเดิม
                    : "/login"
                }
              />
            }
          />
        </Routes>
      </header>
    </div>
  );
}

export default App;

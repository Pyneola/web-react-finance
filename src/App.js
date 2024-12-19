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
import DashboardScreen from "./pages/DashboardScreen";
import Sidebar from "./components/SlideBar";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

axios.defaults.baseURL =
  process.env.REACT_APP_BASE_URL || "http://localhost:1337";
function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const handleLoginSuccess = () => {
    setIsAuthenticated(true);
    // บันทึก path ล่าสุดหลังจากล็อกอินสำเร็จ
    sessionStorage.setItem("lastPath", "/home");
    navigate("/home");
  };

  useEffect(() => {
    const token =
      localStorage.getItem("token") || sessionStorage.getItem("token");
    setIsAuthenticated(!!token); // ตรวจสอบ token และตั้งค่า authenticated
  }, []);

  useEffect(() => {
    const token =
      localStorage.getItem("token") || sessionStorage.getItem("token");
    if (!token && location.pathname !== "/login") {
      // หากไม่มี token และ path ปัจจุบันไม่ใช่ /login
      navigate("/login");
    }
  }, [location, navigate]);

  return (
    <div className="App">
      {isAuthenticated &&
        (location.pathname === "/home" ||
          location.pathname === "/finance" ||
          location.pathname === "/dashboard" ||
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
          {/* Path สำหรับหน้า Profile */}
          <Route
            path="/profile"
            element={
              isAuthenticated ? <ProfileScreen /> : <Navigate to="/login" />
            }
          />
          {/* Path สำหรับหน้า Dashboard */}
          <Route
            path="/dashboard"
            element={
              isAuthenticated ? <DashboardScreen /> : <Navigate to="/login" />
            }
          />
          {/* Path สำหรับหน้า Login */}
          <Route
            path="/login"
            element={<LoginScreen onLoginSuccess={handleLoginSuccess} />}
          />
          {/* Path เริ่มต้นของแอป */}
          <Route
            path="/"
            element={
              isAuthenticated ? (
                <Navigate to={sessionStorage.getItem("lastPath") || "/home"} />
              ) : (
                <Navigate to="/login" />
              )
            }
          />
        </Routes>
      </header>
    </div>
  );
}

export default App;

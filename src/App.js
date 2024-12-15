import "./App.css";
import axios from "axios";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import LoginScreen from "./components/LoginScreen";
import FinanceScreen from "./components/FinanceScreen";
import { useState, useEffect } from "react";

axios.defaults.baseURL =
  process.env.REACT_APP_BASE_URL || "http://localhost:1337";
function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
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

  return (
    <Router>
      <div className="App">
        <header className="App-header">
          <Routes>
            {/* Path สำหรับหน้า Finance */}
            <Route
              path="/finance" // กำหนด path สำหรับหน้า Finance
              element={
                isAuthenticated ? (
                  <FinanceScreen />
                ) : (
                  <Navigate to="/login" /> // ถ้าไม่ login ให้ไปหน้า login
                )
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
              element={<Navigate to="/login" />} // เปลี่ยนไปหน้า login โดยอัตโนมัติ
            />
          </Routes>
        </header>
      </div>
    </Router>
  );
}

export default App;

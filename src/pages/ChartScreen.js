// import React, { useState, useEffect } from "react";
// import { Pie } from "react-chartjs-2";
// import axios from "axios";
// import { jwtDecode } from "jwt-decode";
// import { useNavigate } from "react-router-dom";
// import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
// import { Typography } from "antd";

// ChartJS.register(ArcElement, Tooltip, Legend);

// export default function ChartScreen() {
//   const [chartData, setChartData] = useState({
//     labels: [],
//     datasets: [],
//   });
//   const [username, setUsername] = useState(""); // สำหรับชื่อผู้ใช้
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const navigate = useNavigate();

//   const URL = "http://localhost:1337/api/txactions";
//   const USER_URL = "http://localhost:1337/api/users/me";

//   useEffect(() => {
//     const fetchUserData = async () => {
//       const token =
//         localStorage.getItem("token") || sessionStorage.getItem("token");

//       if (!token) {
//         setError("กรุณาเข้าสู่ระบบเพื่อเข้าถึงข้อมูล");
//         navigate("/login");
//         return;
//       }

//       try {
//         const response = await axios.get(USER_URL, {
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//         });
//         setUsername(response.data.username);
//       } catch (err) {
//         console.error(
//           "Error fetching user data:",
//           err.response?.data || err.message
//         );
//         setError("เกิดข้อผิดพลาดในการดึงข้อมูลผู้ใช้");
//       }
//     };

//     fetchUserData();
//   }, [navigate]);

//   const fetchTransactionData = async () => {
//     try {
//       setLoading(true);

//       const token =
//         localStorage.getItem("token") || sessionStorage.getItem("token");

//       if (!token) {
//         setError("กรุณาเข้าสู่ระบบก่อนเรียกข้อมูล");
//         setLoading(false);
//         return;
//       }

//       const response = await axios.get(
//         `${URL}?filters[creator][id][$eq]=${
//           jwtDecode(sessionStorage.getItem("token")).id ||
//           jwtDecode(localStorage.getItem("token")).id
//         }`,
//         {
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//         }
//       );

//       const transactions = response.data.data;

//       if (!transactions || transactions.length === 0) {
//         setError("ไม่มีข้อมูลที่จะแสดง");
//       } else {
//         const filteredTransactions = transactions.filter(
//           (item) =>
//             item.attributes.type === "income" ||
//             item.attributes.type === "expense"
//         );

//         const incomeTotal = filteredTransactions
//           .filter((item) => item.attributes.type === "income")
//           .reduce((sum, item) => sum + item.attributes.amount, 0);

//         const expenseTotal = filteredTransactions
//           .filter((item) => item.attributes.type === "expense")
//           .reduce((sum, item) => sum + item.attributes.amount, 0);

//         setChartData({
//           labels: ["รายรับ", "รายจ่าย"],
//           datasets: [
//             {
//               data: [incomeTotal, expenseTotal],
//               backgroundColor: [
//                 "rgba(75, 192, 192, 0.6)",
//                 "rgba(255, 99, 132, 0.6)",
//               ],
//               hoverBackgroundColor: [
//                 "rgba(75, 192, 192, 0.8)",
//                 "rgba(255, 99, 132, 0.8)",
//               ],
//             },
//           ],
//         });
//       }
//     } catch (err) {
//       console.error("Error fetching data:", err.response?.data || err.message);
//       setError("เกิดข้อผิดพลาดในการดึงข้อมูล");
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     if (username) {
//       fetchTransactionData();
//     }
//   }, [username]);

//   if (loading) return <p>กำลังโหลดข้อมูล...</p>;
//   if (error) return <p>{error}</p>;

//   return (
//     <div
//       style={{ display: "flex", flexDirection: "column", alignItems: "center" }}
//     >
//       <Typography.Title
//         style={{
//           backgroundColor: "#333", // สีพื้นหลัง
//           color: "#fff", // สีตัวอักษร
//           padding: "15px",
//           borderRadius: "8px",
//           textAlign: "center",
//           fontSize: "30px",
//         }}
//       >
//         กราฟวงกลม รายรับ-รายจ่าย
//       </Typography.Title>
//       <h3>ชื่อผู้ใช้: {username}</h3> {/* แสดงชื่อผู้ใช้ */}
//       <div style={{ position: "relative", width: "80%", height: "450px" }}>
//         <Pie
//           data={chartData}
//           options={{
//             responsive: true,
//             plugins: {
//               legend: {
//                 position: "top",
//               },
//               title: {
//                 display: true,
//                 text: `กราฟวงกลมของ ${username}`,
//               },
//             },
//           }}
//         />
//       </div>
//     </div>
//   );
// }

import React, { useState, useEffect } from "react";
import { Pie, Bar } from "react-chartjs-2";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale,
} from "chart.js";
import { Typography } from "antd";

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale
);

export default function ChartScreen() {
  const [chartData, setChartData] = useState({
    labels: ["รายรับ", "รายจ่าย"], // ใส่ labels สำหรับข้อมูลที่ต้องการแสดงในกราฟ
    datasets: [],
  });
  const [username, setUsername] = useState(""); // สำหรับชื่อผู้ใช้
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const URL = "http://localhost:1337/api/txactions";
  const USER_URL = "http://localhost:1337/api/users/me";

  useEffect(() => {
    const fetchUserData = async () => {
      const token =
        localStorage.getItem("token") || sessionStorage.getItem("token");

      if (!token) {
        setError("กรุณาเข้าสู่ระบบเพื่อเข้าถึงข้อมูล");
        navigate("/login");
        return;
      }

      try {
        const response = await axios.get(USER_URL, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setUsername(response.data.username);
      } catch (err) {
        console.error(
          "Error fetching user data:",
          err.response?.data || err.message
        );
        setError("เกิดข้อผิดพลาดในการดึงข้อมูลผู้ใช้");
      }
    };

    fetchUserData();
  }, [navigate]);

  const fetchTransactionData = async () => {
    try {
      setLoading(true);

      const token =
        localStorage.getItem("token") || sessionStorage.getItem("token");

      if (!token) {
        setError("กรุณาเข้าสู่ระบบก่อนเรียกข้อมูล");
        setLoading(false);
        return;
      }

      const response = await axios.get(
        `${URL}?filters[creator][id][$eq]=${
          jwtDecode(sessionStorage.getItem("token")).id ||
          jwtDecode(localStorage.getItem("token")).id
        }`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const transactions = response.data.data;

      if (!transactions || transactions.length === 0) {
        setError("ไม่มีข้อมูลที่จะแสดง");
      } else {
        const filteredTransactions = transactions.filter(
          (item) =>
            item.attributes.type === "income" ||
            item.attributes.type === "expense"
        );

        const incomeTotal = filteredTransactions
          .filter((item) => item.attributes.type === "income")
          .reduce((sum, item) => sum + item.attributes.amount, 0);

        const expenseTotal = filteredTransactions
          .filter((item) => item.attributes.type === "expense")
          .reduce((sum, item) => sum + item.attributes.amount, 0);

        setChartData({
          labels: ["รายรับ", "รายจ่าย"], // ใส่ labels สำหรับการแสดงในกราฟ (ไม่แสดงใน legend)
          datasets: [
            {
              data: [incomeTotal, expenseTotal],
              backgroundColor: [
                "rgba(75, 192, 192, 0.6)",
                "rgba(255, 99, 132, 0.6)",
              ],
              hoverBackgroundColor: [
                "rgba(75, 192, 192, 0.8)",
                "rgba(255, 99, 132, 0.8)",
              ],
              // ไม่ให้แสดง labels ใน legend
              label: "", // ใส่ค่าว่างให้กับ label
            },
            // Data สำหรับกราฟแท่ง
            {
              data: [incomeTotal, expenseTotal],
              backgroundColor: [
                "rgba(75, 192, 192, 0.6)",
                "rgba(255, 99, 132, 0.6)",
              ],
              label: "", // ใส่ค่าว่างให้กับ label
            },
          ],
        });
      }
    } catch (err) {
      console.error("Error fetching data:", err.response?.data || err.message);
      setError("เกิดข้อผิดพลาดในการดึงข้อมูล");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (username) {
      fetchTransactionData();
    }
  }, [username]);

  if (loading) return <p>กำลังโหลดข้อมูล...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        width: "100%",
        height: "80%",
        padding: "40px",
        backgroundColor: "white",
      }}
    >
      {/* ชื่อกราฟ */}
      <Typography.Title
        style={{
          backgroundColor: "#333",
          color: "#fff",
          padding: "15px",
          borderRadius: "8px",
          textAlign: "center",
          fontSize: "30px",
          marginBottom: "20px", // เพิ่มช่องว่างใต้ชื่อกราฟ
        }}
      >
        กราฟวงกลม รายรับ-รายจ่าย
      </Typography.Title>
      <h3>ชื่อผู้ใช้: {username}</h3> {/* แสดงชื่อผู้ใช้ */}
      <div
        style={{
          display: "flex",
          justifyContent: "center", // จัดให้กราฟทั้งสองอยู่ตรงกลาง
          alignItems: "center",
          width: "100%",
          marginTop: "20px",
          gap: "30px", // เพิ่มช่องว่างระหว่างกราฟ
        }}
      >
        {/* กราฟวงกลม */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            flex: 1,
          }}
        >
          <div style={{ position: "relative", width: "70%", height: "350px" }}>
            <Pie
              data={chartData}
              options={{
                responsive: true,
                plugins: {
                  legend: {
                    position: "top",
                    display: false, // ไม่แสดง legend
                  },
                  title: {
                    display: true,
                    text: `กราฟวงกลมของ ${username}`,
                  },
                },
              }}
            />
          </div>
        </div>

        {/* กราฟแท่ง */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            flex: 2,
          }}
        >
          <div style={{ position: "relative", width: "60%", height: "350px" }}>
            <Bar
              data={chartData}
              options={{
                responsive: true,
                plugins: {
                  legend: {
                    position: "top",
                    display: false, // ไม่แสดง legend
                  },
                  title: {
                    display: true,
                    text: `กราฟแท่งของ ${username}`,
                  },
                },
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

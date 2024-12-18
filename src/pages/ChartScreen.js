import React, { useState, useEffect } from "react";
import { Bar } from "react-chartjs-2";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

export default function ChartScreen() {
  const [chartData, setChartData] = useState({
    labels: [],
    datasets: [],
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const URL = "http://localhost:1337/api/txactions";

  useEffect(() => {
    // เช็คว่าไม่มี token ใน localStorage หรือ sessionStorage
    if (!localStorage.getItem("token") && !sessionStorage.getItem("token")) {
      setError("กรุณาเข้าสู่ระบบเพื่อเข้าถึงข้อมูล");
      navigate("/login"); // เมื่อไม่มี token จะนำไปที่หน้า login
    }
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

      const response = await axios.get(URL, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const transactions = response.data.data;

      if (!transactions || transactions.length === 0) {
        setError("ไม่มีข้อมูลที่จะแสดง");
      } else {
        // กรองข้อมูลที่เป็น income และ expense เท่านั้น
        const filteredTransactions = transactions.filter(
          (item) =>
            item.attributes.type === "income" ||
            item.attributes.type === "expense"
        );

        // Group ข้อมูลตามวันที่
        const groupedData = filteredTransactions.reduce((acc, item) => {
          const { date, type, amount } = item.attributes;

          if (!acc[date]) acc[date] = { income: 0, expense: 0 };

          if (type === "income") acc[date].income += amount;
          if (type === "expense") acc[date].expense += amount;

          return acc;
        }, {});

        // แปลงข้อมูลเป็น Label และ Dataset สำหรับ Chart
        const labels = Object.keys(groupedData);
        const incomeData = labels.map((label) => groupedData[label].income);
        const expenseData = labels.map((label) => groupedData[label].expense);

        // ในการกำหนดค่า chartData
        setChartData({
          labels: labels.length > 0 ? labels : ["ข้อมูลไม่พร้อม"], // ตรวจสอบว่า labels มีค่าหรือไม่
          datasets: [
            {
              label: "รายรับ",
              data: incomeData.length > 0 ? incomeData : [0], // ถ้าไม่มีข้อมูลให้ใส่เป็น 0
              backgroundColor: "rgba(75, 192, 192, 0.6)",
            },
            {
              label: "รายจ่าย",
              data: expenseData.length > 0 ? expenseData : [0], // ถ้าไม่มีข้อมูลให้ใส่เป็น 0
              backgroundColor: "rgba(255, 99, 132, 0.6)",
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
    fetchTransactionData();
  }, []);

  if (loading) return <p>กำลังโหลดข้อมูล...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div>
      <h2>กราฟรายรับและรายจ่าย</h2>
      <div style={{ position: "relative", width: "80%", height: "450px" }}>
        <Bar
          data={chartData}
          options={{
            responsive: true,
            maintainAspectRatio: false, // ปิดการขยายกราฟไปเรื่อยๆ
            plugins: {
              tooltip: {
                callbacks: {
                  afterLabel: () => "",
                },
              },
              title: {
                display: true,
                text: "กราฟรายรับและรายจ่าย",
              },
            },
            scales: {
              x: {
                display: false,
                type: "category",
                labels: chartData.labels,
                // ticks: {
                //   autoSkip: true,
                //   maxRotation: 45,
                //   minRotation: 45,
                // },
              },
              y: {
                ticks: {
                  beginAtZero: true,
                  stepSize: 300, // ปรับให้เหมาะสม ไม่ละเอียดเกินไป
                  callback: function (value) {
                    return value + " บาท";
                  },
                },
                title: {
                  display: true,
                },
              },
            },
            datasets: {
              barThickness: 5, // ลดความกว้างของแท่งกราฟ
              categoryPercentage: 2, // ปรับความกว้างของกราฟ
              barPercentage: 2, // ลดขนาดแท่งกราฟ
            },
          }}
        />
      </div>
    </div>
  );
}

import "../App.css";
import TransactionList from "../components/TransactionList";
import { useState, useEffect, useRef } from "react";
import dayjs from "dayjs";
import AddItem from "../components/Additem";
import { Spin, Typography, Modal, Card, message } from "antd";
import axios from "axios";
import EditItem from "../components/EditItem";
import { jwtDecode } from "jwt-decode";

import { useNavigate } from "react-router-dom";

const URL_TXACTIONS = "/api/txactions";
const URL_TXACTIONS_user = "/api/txactions";

function FinanceScreen() {
  const [summaryAmount, setSummaryAmount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [transactionData, setTransactionData] = useState([]);
  const [editingItem, setEditingItem] = useState(null);

  const navigate = useNavigate();
  const [setError] = useState(null);

  useEffect(() => {
    // เช็คว่าไม่มี token ใน localStorage หรือ sessionStorage
    if (!localStorage.getItem("token") && !sessionStorage.getItem("token")) {
      setError("กรุณาเข้าสู่ระบบเพื่อเข้าถึงข้อมูล");
      navigate("/login"); // เมื่อไม่มี token จะนำไปที่หน้า login
    }
  }, [navigate]); // การเพิ่ม `navigate` ใน dependencies

  const fetchItems = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get(
        `${URL_TXACTIONS}?filters[creator][id][$eq]=${
          jwtDecode(sessionStorage.getItem("token")).id ||
          jwtDecode(localStorage.getItem("token")).id
        }`
      );
      setTransactionData(
        response.data.data.map((row) => ({
          id: row.id,
          key: row.id,
          ...row.attributes,
        }))
      );
    } catch (err) {
      console.log(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchItems();
  }, []);

  const handleAddItem = async (item) => {
    try {
      setIsLoading(true);
      const savedToken =
        localStorage.getItem("token") || sessionStorage.getItem("token");
      const decodedToken = jwtDecode(savedToken); // ถอดรหัส JWT เพื่อดึง ID ผู้ใช้
      const creator = decodedToken.id; // ใช้ `id` หรือ `username` ที่เหมาะสมจาก token
      const params = { ...item, action_datetime: dayjs(), creator };
      const response = await axios.post(URL_TXACTIONS, { data: params });
      const { id, attributes } = response.data.data;
      setTransactionData([
        ...transactionData,
        { id: id, key: id, ...attributes },
      ]);
    } catch (err) {
      console.log(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleNoteChanged = (id, note) => {
    setTransactionData(
      transactionData.map((transaction) => {
        transaction.note = transaction.id === id ? note : transaction.note;
        return transaction;
      })
    );
  };

  const handleRowDeleted = async (id) => {
    try {
      setIsLoading(true);
      await axios.delete(`${URL_TXACTIONS}/${id}`);
      fetchItems();
    } catch (err) {
      console.log(err);
    } finally {
      setIsLoading(false);
    }
  };

  const updateItem = async (updatedItem) => {
    try {
      const response = await axios.put(`${URL_TXACTIONS}/${updatedItem.id}`, {
        data: updatedItem,
      });

      const { id, attributes } = response.data.data;

      setTransactionData((prevData) => {
        const newData = prevData.map((item) =>
          item.id === id ? { id, key: id, ...attributes } : item
        );
        console.log("Updated Transaction Data:", newData);
        return newData;
      });
    } catch (err) {
      console.error("Error updating item:", err);
    }
  };

  useEffect(() => {
    const token =
      localStorage.getItem("token") || sessionStorage.getItem("token");
    if (!token) {
      //window.location.href = "/login";
      navigate("/login");
    }
  }, []);

  useEffect(() => {
    setSummaryAmount(
      transactionData.reduce(
        (sum, transaction) =>
          transaction.type === "income"
            ? sum + transaction.amount
            : sum - transaction.amount,
        0
      )
    );
  }, [transactionData]);

  // ใช้งาน fetchUserTransactions และตั้งค่า Transaction Data

  return (
    <div
      className="finance-container"
      style={{
        padding: "25px",
        backgroundColor: "#e4e4e4",
        //height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
      }}
    >
      <header>
        <Spin spinning={isLoading}>
          <Typography.Title
            style={{
              backgroundColor: "#333", // สีพื้นหลัง
              color: "#fff", // สีตัวอักษร
              padding: "15px",
              borderRadius: "8px",
              textAlign: "center",
              fontSize: "30px",
            }}
          >
            จำนวนเงินปัจจุบัน {summaryAmount} บาท
          </Typography.Title>

          <AddItem onItemAdded={handleAddItem} />

          {/* เพิ่มขอบบนและล่างให้ติดกับขอบเว็บ */}
          <Card
            style={{
              textAlign: "center",
              backgroundColor: "#fff",
              borderRadius: "8px",
              padding: "15px",
              boxShadow: "0 2px 10px rgba(0, 0, 0, 0.1)", // เพิ่มเงาให้สวยขึ้น
              marginTop: "5px", // ขอบบน
              marginBottom: "10px", // ขอบล่าง
              height: "60px",
              display: "flex", // ใช้ flexbox เพื่อจัดตำแหน่ง
              justifyContent: "center", // จัดตำแหน่งให้อยู่ตรงกลางแนวนอน
              alignItems: "center", // จัดตำแหน่งให้อยู่ตรงกลางแนวตั้ง
            }}
          >
            <span
              style={{ color: "#333", fontWeight: "bold", fontSize: "22px" }}
            >
              บันทึก รายรับ - รายจ่าย
            </span>
          </Card>

          <TransactionList
            data={transactionData}
            onNoteChanged={handleNoteChanged}
            onRowDeleted={handleRowDeleted}
            onRowEdited={updateItem}
          />
          {editingItem && (
            <EditItem
              isOpen={editingItem !== null}
              item={editingItem}
              onItemEdited={updateItem} // ฟังก์ชันที่ใช้แก้ไข
              onClose={() => setEditingItem(null)}
            />
          )}
        </Spin>
      </header>
    </div>
  );
}

export default FinanceScreen;

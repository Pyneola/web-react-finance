import "../App.css";
import TransactionList from "./TransactionList";
import { useState, useEffect, useRef } from "react";
import dayjs from "dayjs";
import { Divider } from "antd";
import AddItem from "./AddItem";
import { Spin, Typography, Modal } from "antd";
import axios from "axios";
import EditItem from "./EditItem"; // เพิ่ม EditItem เข้ามา

const URL_TXACTIONS = "/api/txactions";

function FinanceScreen() {
  const [summaryAmount, setSummaryAmount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [transactionData, setTransactionData] = useState([]);
  const [editingItem, setEditingItem] = useState(null); // เพิ่ม state สำหรับจัดการ item ที่กำลังแก้ไข
  const formRef = useRef(null); // ใช้ ref อ้างอิงไปที่ฟอร์ม
  const [data, setData] = useState([]); // เก็บรายการทั้งหมด

  const fetchItems = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get(URL_TXACTIONS);
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

  const handleAddItem = async (item) => {
    try {
      setIsLoading(true);
      const params = { ...item, action_datetime: dayjs() };
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

  // ฟังก์ชันเปิด Modal สำหรับการแก้ไข
  const handleEdit = (item) => {
    setEditingItem(item); // ตั้งค่าข้อมูลที่จะต้องแก้ไข
  };

  // ฟังก์ชันสำหรับการอัปเดตข้อมูล
  const updateItem = async (updatedItem) => {
    try {
      // ส่งคำขอ PUT ไปที่ API
      await axios.put(`${URL_TXACTIONS}/${updatedItem.id}`, {
        data: updatedItem,
      });
      // อัปเดตข้อมูลใน state หลังจากการแก้ไข
      setData((prevData) =>
        prevData.map((item) =>
          item.id === updatedItem.id ? updatedItem : item
        )
      );
      setEditingItem(null); // ปิด modal หลังจากการแก้ไขสำเร็จ
    } catch (error) {
      console.error("Failed to update item:", error);
    }
  };

  useEffect(() => {
    const token =
      localStorage.getItem("token") || sessionStorage.getItem("token");
    if (!token) {
      window.location.href = "/login";
    }
  }, []);

  useEffect(() => {
    fetchItems();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(URL_TXACTIONS);
        setData(response.data); // ตั้งค่าข้อมูลใน state
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
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

  return (
    <div className="App">
      <header className="App-header">
        <Spin spinning={isLoading}>
          <Typography.Title>
            จำนวนเงินปัจจุบัน {summaryAmount} บาท
          </Typography.Title>

          <AddItem onItemAdded={handleAddItem} />
          <Divider
            style={{
              border: "1px solid #000",
              padding: "10px",
              borderRadius: "5px",
              textAlign: "center",
            }}
          >
            บันทึก รายรับ - รายจ่าย
          </Divider>

          <TransactionList
            data={transactionData}
            onNoteChanged={handleNoteChanged}
            onRowDeleted={handleRowDeleted}
            onRowEdited={handleEdit} // ส่งฟังก์ชันสำหรับแก้ไข
          />

          {/* Modal สำหรับแก้ไขข้อมูล */}
          {editingItem && (
            <EditItem
              isOpen={editingItem !== null} // ถ้ามี editingItem จะแสดง Modal
              item={editingItem} // ส่งข้อมูลที่ต้องการแก้ไข
              onItemEdited={updateItem} // เมื่อการแก้ไขเสร็จสิ้น
              onClose={() => setEditingItem(null)} // ปิด Modal
            />
          )}
        </Spin>
      </header>
    </div>
  );
}

export default FinanceScreen;

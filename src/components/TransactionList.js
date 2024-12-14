// import { Table, Button, Input } from "antd";
// import { DeleteOutlined } from "@ant-design/icons";
// import dayjs from "dayjs";

// export default function TransactionList(props) {
//   const columns = [
//     {
//       title: "Date-Time",
//       dataIndex: "action_datetime",
//       key: "action_datetime",
//       render: (_, record) =>
//         dayjs(record.action_datetime).format("DD/MM/YYYY - HH:MM"),
//     },
//     {
//       title: "Type",
//       dataIndex: "type",
//       key: "type",
//       render: (text, record) => {
//         const displayText =
//           text === "income" ? "รายรับ" : text === "expense" ? "รายจ่าย" : text;
//         // กำหนดกรอบและสีของคอลัมน์ Type
//         const typeStyle = {
//           border: `1px solid ${record.type === "income" ? "green" : "red"}`, // กำหนดกรอบตามประเภท
//           padding: "5px 10px", // เพิ่มช่องว่างในเซลล์
//           borderRadius: "5px", // ทำให้กรอบเซลล์โค้งมน
//           textAlign: "center", // จัดข้อความให้อยู่กลาง
//           color: record.type === "income" ? "green" : "red", // สีข้อความตามประเภท
//           backgroundColor: record.type === "income" ? "#dfffcd" : "#f4cccc",
//         };

//         return <div style={typeStyle}>{displayText}</div>;

//         if (text === "income") {
//           return "รายรับ";
//         } else if (text === "expense") {
//           return "รายจ่าย";
//         }
//         return text;
//       },
//     },
//     {
//       title: "Amount",
//       dataIndex: "amount",
//       key: "amount",
//     },
//     {
//       title: "Note",
//       dataIndex: "note",
//       key: "note",
//       render: (text, record) => (
//         <Input
//           value={text}
//           onChange={(evt) => props.onNoteChanged(record.id, evt.target.value)} // เมื่อมีการแก้ไข note
//         />
//       ),
//     },
//     {
//       title: "Action",
//       key: "action",
//       render: (_, record) => (
//         <Button
//           type="danger"
//           onClick={() => props.onRowDeleted(record.id)} // เมื่อคลิกลบ
//           size="middle"
//           style={{
//             border: "1px solid black", // เพิ่มกรอบสีดำ
//             padding: "5px 15px", // เพิ่มช่องว่างในปุ่ม
//           }}
//         >
//           Delete <DeleteOutlined />
//         </Button>
//       ),
//     },
//   ];

//   return (
//     <Table
//       columns={columns} // กำหนดคอลัมน์จากที่นี้
//       dataSource={props.data} // ใช้ข้อมูลที่ส่งมา
//       rowKey="id" // ใช้ id เป็น key สำหรับแต่ละแถว
//       pagination={false} // ไม่แสดง pagination
//     />
//   );
// }

// TransactionList.js

import { Table, Button, Input } from "antd";
import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import dayjs from "dayjs";
import { useState } from "react"; // เพิ่ม useState
import EditItem from "./EditItem"; // เพิ่มการนำเข้า EditItem
import { handleLogout } from "../logoutFunction"; // นำเข้า handleLogout

export default function TransactionList(props) {
  const [isModalOpen, setIsModalOpen] = useState(false); // เพิ่มสถานะ modal
  const [editingItem, setEditingItem] = useState(null); // เพิ่มสถานะข้อมูลที่จะแก้ไข

  const columns = [
    {
      title: "Date-Time",
      dataIndex: "action_datetime",
      key: "action_datetime",
      render: (_, record) =>
        dayjs(record.action_datetime).format("DD/MM/YYYY - HH:MM"),
    },
    {
      title: "Type",
      dataIndex: "type",
      key: "type",
      render: (text, record) => {
        const displayText =
          text === "income"
            ? "\u0e23\u0e32\u0e22\u0e23\u0e31\u0e1a"
            : text === "expense"
            ? "\u0e23\u0e32\u0e22\u0e08\u0e48\u0e32\u0e22"
            : text;
        const typeStyle = {
          border: `1px solid ${record.type === "income" ? "green" : "red"}`,
          padding: "5px 10px",
          borderRadius: "5px",
          textAlign: "center",
          color: record.type === "income" ? "green" : "red",
          backgroundColor: record.type === "income" ? "#dfffcd" : "#f4cccc",
        };

        return <div style={typeStyle}>{displayText}</div>;
      },
    },
    {
      title: "Amount",
      dataIndex: "amount",
      key: "amount",
    },
    {
      title: "Note",
      dataIndex: "note",
      key: "note",
      render: (text, record) => (
        <Input
          value={text}
          onChange={(evt) => props.onNoteChanged(record.id, evt.target.value)}
        />
      ),
    },
    {
      title: "Action",
      key: "action",
      render: (_, record) => (
        <>
          <Button
            type="primary"
            onClick={() => handleRowEdit(record)} // เปลี่ยนเป็นการเรียก handleRowEdit
            size="middle"
            style={{
              marginLeft: "7px",
              padding: "4px 12px",
            }}
          >
            Edit <EditOutlined />
          </Button>
          <Button
            type="danger"
            onClick={() => props.onRowDeleted(record.id)}
            size="middle"
            style={{
              border: "1px solid black",
              padding: "5px 15px",
            }}
          >
            Delete <DeleteOutlined />
          </Button>
        </>
      ),
    },
  ];

  const handleRowEdit = (record) => {
    setEditingItem(record); // ตั้งค่าข้อมูลที่จะแก้ไข
    setIsModalOpen(true); // เปิด modal
  };

  const handleModalClose = () => {
    setIsModalOpen(false); // ปิด modal
    setEditingItem(null); // เคลียร์ข้อมูล
  };

  const handleItemEdited = (updatedItem) => {
    props.onItemUpdated(updatedItem); // ส่งข้อมูลที่ถูกแก้ไขกลับไปยัง parent
    setIsModalOpen(false);
    setEditingItem(null);
  };

  return (
    <>
      <Table
        columns={columns}
        dataSource={props.data}
        rowKey="id"
        pagination={false}
      />
      {isModalOpen && (
        <EditItem
          isOpen={isModalOpen}
          item={editingItem} // ส่งข้อมูลที่จะแก้ไขไปยัง modal
          onClose={handleModalClose}
          onItemEdited={handleItemEdited} // ส่งฟังก์ชันจัดการการแก้ไขไปยัง modal
        />
      )}

      {/* ปุ่ม Logout */}
      <Button
        onClick={handleLogout}
        type="primary"
        danger
        style={{
          position: "fixed", // ทำให้ปุ่มคงที่
          bottom: "20px", // ระยะห่างจากขอบล่าง
          right: "20px", // ระยะห่างจากขอบขวา
          zIndex: 1000, // ให้ปุ่มอยู่ด้านบนขององค์ประกอบอื่นๆ
        }}
      >
        Logout
      </Button>
    </>
  );
}

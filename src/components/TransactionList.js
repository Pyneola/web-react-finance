import { Table, Button, Input } from "antd";
import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import dayjs from "dayjs";
import { useState } from "react"; // เพิ่ม useState
import EditItem from "./EditItem"; // เพิ่มการนำเข้า EditItem

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
        style={{
          border: "2px solid #ddd", // ขอบของตาราง
          borderRadius: "8px", // มุมโค้งของขอบ
          overflow: "hidden", // ป้องกันการแสดงผลลัพธ์เกินขอบ
          boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
          backgroundColor: "#e4e4e4",
        }}
      />
      {isModalOpen && (
        <EditItem
          isOpen={isModalOpen}
          item={editingItem} // ส่งข้อมูลที่จะแก้ไขไปยัง modal
          onClose={handleModalClose}
          onItemEdited={handleItemEdited} // ส่งฟังก์ชันจัดการการแก้ไขไปยัง modal
        />
      )}
    </>
  );
}

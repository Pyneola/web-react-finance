import { Table, Button, Input } from "antd";
import { DeleteOutlined } from "@ant-design/icons";
import dayjs from "dayjs";

export default function TransactionList(props) {
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
          text === "income" ? "รายรับ" : text === "expense" ? "รายจ่าย" : text;
        // กำหนดกรอบและสีของคอลัมน์ Type
        const typeStyle = {
          border: `1px solid ${record.type === "income" ? "green" : "red"}`, // กำหนดกรอบตามประเภท
          padding: "5px 10px", // เพิ่มช่องว่างในเซลล์
          borderRadius: "5px", // ทำให้กรอบเซลล์โค้งมน
          textAlign: "center", // จัดข้อความให้อยู่กลาง
          color: record.type === "income" ? "green" : "red", // สีข้อความตามประเภท
          backgroundColor: record.type === "income" ? "#dfffcd" : "#f4cccc",
        };

        return <div style={typeStyle}>{displayText}</div>;

        if (text === "income") {
          return "รายรับ";
        } else if (text === "expense") {
          return "รายจ่าย";
        }
        return text;
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
          onChange={(evt) => props.onNoteChanged(record.id, evt.target.value)} // เมื่อมีการแก้ไข note
        />
      ),
    },
    {
      title: "Action",
      key: "action",
      render: (_, record) => (
        <Button
          type="danger"
          onClick={() => props.onRowDeleted(record.id)} // เมื่อคลิกลบ
          size="middle"
          style={{
            border: "1px solid black", // เพิ่มกรอบสีดำ
            padding: "5px 15px", // เพิ่มช่องว่างในปุ่ม
          }}
        >
          Delete <DeleteOutlined />
        </Button>
      ),
    },
  ];

  return (
    <Table
      columns={columns} // กำหนดคอลัมน์จากที่นี้
      dataSource={props.data} // ใช้ข้อมูลที่ส่งมา
      rowKey="id" // ใช้ id เป็น key สำหรับแต่ละแถว
      pagination={false} // ไม่แสดง pagination
    />
  );
}

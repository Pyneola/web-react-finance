import { Table, Button, Input } from "antd";
import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import dayjs from "dayjs";
import { useState } from "react";
import EditItem from "./EditItem";

export default function TransactionList(props) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);

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
            onClick={() => handleRowEdit(record)}
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
    setEditingItem(record);
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setEditingItem(null);
  };

  const handleItemEdited = async (updatedItem) => {
    console.log("Updated Item:", updatedItem);
    if (props.onRowEdited) {
      await props.onRowEdited(updatedItem); // เพิ่ม await เพื่อรอให้ updateItem เสร็จก่อน
    } else {
      console.error("onRowEdited is not a function.");
    }
  };

  return (
    <>
      <Table
        columns={columns}
        dataSource={props.data}
        rowKey="id"
        pagination={false}
        style={{
          border: "2px solid #ddd",
          borderRadius: "8px",
          overflow: "hidden",
          boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
          backgroundColor: "#e4e4e4",
        }}
      />
      {isModalOpen && (
        <EditItem
          isOpen={isModalOpen}
          item={editingItem}
          onItemEdited={handleItemEdited}
          onClose={handleModalClose}
        />
      )}
    </>
  );
}

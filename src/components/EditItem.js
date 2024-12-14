import React, { useEffect } from "react";
import { Modal, Form, Input, Button } from "antd";

const EditItem = ({ isOpen, item, onItemEdited, onClose }) => {
  const [form] = Form.useForm();

  useEffect(() => {
    if (item) {
      form.setFieldsValue(item); // ตั้งค่าให้กับฟอร์มโดยอัตโนมัติ
    }
  }, [item, form]);

  // ฟังก์ชันที่ใช้เมื่อกดปุ่ม "OK" หรือ submit form
  const handleFormSubmit = (formData) => {
    console.log("Form Data submitted:", formData); // เพิ่ม log เพื่อตรวจสอบข้อมูลที่ submit
    onItemEdited(formData); // เรียก onItemEdited
  };

  return (
    <Modal
      title="Edit Item"
      visible={isOpen}
      onCancel={onClose}
      onOk={() => form.submit()} // ใช้ form.submit() แทน
    >
      <Form
        form={form}
        layout="vertical"
        name="edit-item-form"
        onFinish={handleFormSubmit} // เมื่อฟอร์มผ่านการ validate จะเรียก handleFormSubmit
      >
        <Form.Item
          label="Amount"
          name="amount"
          rules={[{ required: true, message: "Please input the amount!" }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          label="Note"
          name="note"
          rules={[{ required: true, message: "Please input the note!" }]}
        >
          <Input />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default EditItem;

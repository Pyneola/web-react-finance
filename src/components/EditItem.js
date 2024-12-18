// import React, { useEffect } from "react";
// import { Modal, Form, Input, Button } from "antd";

// const EditItem = ({ isOpen, item, onItemEdited, onClose }) => {
//   const [form] = Form.useForm();

//   useEffect(() => {
//     if (item) {
//       form.setFieldsValue(item); // ตั้งค่าให้กับฟอร์มโดยอัตโนมัติ
//     }
//   }, [item, form]);

//   // ฟังก์ชันที่ใช้เมื่อกดปุ่ม "OK" หรือ submit form
//   const handleFormSubmit = (formData) => {
//     console.log("Form Data submitted:", formData); // เพิ่ม log เพื่อตรวจสอบข้อมูลที่ submit
//     onItemEdited(formData); // เรียก onItemEdited
//   };

//   return (
//     <Modal
//       title="Edit Item"
//       visible={isOpen}
//       onCancel={onClose}
//       onOk={() => form.submit()} // ใช้ form.submit() แทน
//     >
//       <Form
//         form={form}
//         layout="vertical"
//         name="edit-item-form"
//         onFinish={handleFormSubmit} // เมื่อฟอร์มผ่านการ validate จะเรียก handleFormSubmit
//       >
//         <Form.Item
//           label="Amount"
//           name="amount"
//           rules={[{ required: true, message: "Please input the amount!" }]}
//         >
//           <Input />
//         </Form.Item>
//         <Form.Item
//           label="Note"
//           name="note"
//           rules={[{ required: true, message: "Please input the note!" }]}
//         >
//           <Input />
//         </Form.Item>
//       </Form>
//     </Modal>
//   );
// };

// export default EditItem;

import { Button, Form, Select, Input, InputNumber, Modal } from "antd";
import { useEffect } from "react";

export default function EditItem(props) {
  const [form] = Form.useForm();

  useEffect(() => {
    if (props.isOpen && props.item) {
      form.setFieldsValue(props.item); // กำหนดค่าเริ่มต้นให้กับฟอร์มจาก props.item
    }
  }, [props.isOpen, props.item, form]);

  const handleFormSubmit = async (values) => {
    try {
      // อัปเดตข้อมูลที่แก้ไข
      const updatedItem = {
        ...props.item, // ใช้ props.item แทนการใช้ item
        ...values, // ข้อมูลที่แก้ไขจากฟอร์ม
      };

      // ส่งข้อมูลที่อัปเดตกลับไปที่ onItemEdited ที่รับมาจาก props
      if (props.onItemEdited) {
        props.onItemEdited(updatedItem); // เรียกใช้ onItemEdited ที่มาจาก TransactionList.js
      } else {
        console.error("onItemEdited is not a function.");
      }
      if (props.onClose) {
        props.onClose(); // เรียกใช้ฟังก์ชัน onClose เพื่อปิด Modal
      }
    } catch (err) {
      console.error("Error while submitting form:", err);
    }
    // ปิดฟอร์มหลังจากบันทึกข้อมูล
  };

  useEffect(() => {
    console.log("EditItem Props:", props);
  }, [props]);

  return (
    <Modal
      title="Edit Item"
      visible={props.isOpen}
      onCancel={props.onClose}
      onOk={() => form.submit()} // ใช้ form.submit() เมื่อกด Save
      okText="Save"
      cancelText="Cancel"
    >
      <Form form={form} layout="inline" onFinish={handleFormSubmit}>
        <Form.Item name="type" label="ชนิด" rules={[{ required: true }]}>
          <Select
            allowClear
            style={{ width: "150px", justifyContent: "space-between" }}
            options={[
              {
                value: "income",
                label: "รายรับ",
              },
              {
                value: "expense",
                label: "รายจ่าย",
              },
            ]}
          />
        </Form.Item>
        <Form.Item
          name="amount"
          label="จํานวนเงิน"
          rules={[{ required: true }]}
        >
          <InputNumber placeholder="จํานวนเงิน" min={0} />
        </Form.Item>
        <Form.Item name="note" label="หมายเหตุ" rules={[{ required: true }]}>
          <Input placeholder="Note" />
        </Form.Item>
      </Form>
    </Modal>
  );
}

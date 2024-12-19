import { Button, Form, Select, Input, InputNumber } from "antd";
export default function AddItem(props) {
  return (
    <Form
      layout="inline"
      onFinish={props.onItemAdded}
      style={{ width: "100%" }}
    >
      <Form.Item name="type" label="ชนิด" rules={[{ required: true }]}>
        <Select
          allowClear
          style={{ width: "120px" }}
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
        style={{ width: "36%" }}
      >
        <InputNumber
          placeholder="จํานวนเงิน"
          min={0}
          style={{ width: "80%" }}
        />
      </Form.Item>
      <Form.Item
        name="note"
        label="หมายเหตุ"
        rules={[{ required: true }]}
        style={{ width: "35%" }}
      >
        <Input placeholder="Note" style={{ width: "90%" }} />
      </Form.Item>
      <Form.Item>
        <Button type="primary" htmlType="submit">
          Add
        </Button>
      </Form.Item>
    </Form>
  );
}

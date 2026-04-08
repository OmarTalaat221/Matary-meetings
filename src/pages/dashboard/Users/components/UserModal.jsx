// src/pages/dashboard/Users/components/UserModal.jsx
import { useEffect } from "react";
import { Modal, Form, Input, Select } from "antd";
import { levels, statuses } from "../useUsersData";

const UserModal = ({
  open,
  onCancel,
  onSubmit,
  loading,
  mode = "add",
  initialData,
}) => {
  const [form] = Form.useForm();
  const isEdit = mode === "edit";

  useEffect(() => {
    if (open && isEdit && initialData) {
      form.setFieldsValue(initialData);
    } else if (open) {
      form.resetFields();
    }
  }, [open, isEdit, initialData, form]);

  const handleSubmit = async () => {
    const values = await form.validateFields();
    await onSubmit(values);
  };

  return (
    <Modal
      title={isEdit ? "Edit Student" : "Add New Student"}
      open={open}
      onCancel={onCancel}
      onOk={handleSubmit}
      okText={isEdit ? "Save" : "Add"}
      cancelText="Cancel"
      confirmLoading={loading}
      destroyOnClose
    >
      <Form
        form={form}
        layout="vertical"
        className="mt-4"
        initialValues={{ status: "active" }}
      >
        <Form.Item
          name="name"
          label="Full Name"
          rules={[{ required: true, message: "Name is required" }]}
        >
          <Input placeholder="Enter full name" />
        </Form.Item>

        <Form.Item
          name="email"
          label="Email"
          rules={[
            { required: true, message: "Email is required" },
            { type: "email", message: "Invalid email" },
          ]}
        >
          <Input placeholder="email@student.com" />
        </Form.Item>

        <Form.Item name="phone" label="Phone">
          <Input placeholder="+1 234 567 8900" />
        </Form.Item>

        <Form.Item
          name="level"
          label="Level"
          rules={[{ required: true, message: "Level is required" }]}
        >
          <Select placeholder="Select level" options={levels} />
        </Form.Item>

        <Form.Item name="status" label="Status">
          <Select
            options={statuses.map((s) => ({ value: s.value, label: s.label }))}
          />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default UserModal;

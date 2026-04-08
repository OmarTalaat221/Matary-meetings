import { Modal, Form, Input, Select, message } from "antd";
import { useEffect } from "react";

const { TextArea } = Input;

const DoctorModal = ({ open, onClose, doctor, onSubmit }) => {
  const [form] = Form.useForm();
  const isEdit = !!doctor;

  useEffect(() => {
    if (open) {
      if (doctor) {
        form.setFieldsValue(doctor);
      } else {
        form.resetFields();
      }
    }
  }, [open, doctor, form]);

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      onSubmit(values);
      form.resetFields();
    } catch (error) {
      console.error("Validation failed:", error);
    }
  };

  return (
    <Modal
      open={open}
      title={isEdit ? "Edit Doctor" : "Add New Doctor"}
      onCancel={onClose}
      onOk={handleSubmit}
      width={600}
      okText={isEdit ? "Update" : "Add"}
    >
      <Form form={form} layout="vertical" className="mt-4">
        <Form.Item
          name="name"
          label="Full Name"
          rules={[{ required: true, message: "Please enter doctor name" }]}
        >
          <Input placeholder="Dr. Ahmed Hassan" size="large" />
        </Form.Item>

        <div className="grid grid-cols-2 gap-4">
          <Form.Item
            name="email"
            label="Email"
            rules={[
              { required: true, message: "Please enter email" },
              { type: "email", message: "Please enter a valid email" },
            ]}
          >
            <Input placeholder="ahmed@hospital.com" size="large" />
          </Form.Item>

          <Form.Item
            name="phone"
            label="Phone"
            rules={[{ required: true, message: "Please enter phone number" }]}
          >
            <Input placeholder="+966 50 123 4567" size="large" />
          </Form.Item>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <Form.Item
            name="specialization"
            label="Specialization"
            rules={[
              { required: true, message: "Please select specialization" },
            ]}
          >
            <Select placeholder="Select specialization" size="large">
              <Select.Option value="Cardiology">Cardiology</Select.Option>
              <Select.Option value="Neurology">Neurology</Select.Option>
              <Select.Option value="Orthopedics">Orthopedics</Select.Option>
              <Select.Option value="Pediatrics">Pediatrics</Select.Option>
              <Select.Option value="General Surgery">
                General Surgery
              </Select.Option>
              <Select.Option value="Dermatology">Dermatology</Select.Option>
              <Select.Option value="Psychiatry">Psychiatry</Select.Option>
              <Select.Option value="Radiology">Radiology</Select.Option>
            </Select>
          </Form.Item>

          <Form.Item
            name="department"
            label="Department"
            rules={[{ required: true, message: "Please enter department" }]}
          >
            <Input placeholder="Internal Medicine" size="large" />
          </Form.Item>
        </div>

        <Form.Item
          name="officeHours"
          label="Office Hours"
          rules={[{ required: true, message: "Please enter office hours" }]}
        >
          <Input placeholder="Sun-Thu, 9:00 AM - 5:00 PM" size="large" />
        </Form.Item>

        <Form.Item
          name="status"
          label="Status"
          initialValue="active"
          rules={[{ required: true }]}
        >
          <Select size="large">
            <Select.Option value="active">Active</Select.Option>
            <Select.Option value="inactive">Inactive</Select.Option>
            <Select.Option value="onLeave">On Leave</Select.Option>
          </Select>
        </Form.Item>

        <Form.Item name="bio" label="Bio">
          <TextArea
            rows={4}
            placeholder="Brief description about the doctor's expertise and experience..."
          />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default DoctorModal;

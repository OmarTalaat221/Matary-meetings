import { Modal, Form, Select, Input } from "antd";
import { useEffect } from "react";
import { User, AlertTriangle } from "lucide-react";

const { TextArea } = Input;

const actions = [
  { value: "warning", label: "Send Warning" },
  { value: "reschedule", label: "Allow Reschedule" },
  { value: "penalty", label: "Apply Penalty" },
  { value: "ignore", label: "Ignore (No Action)" },
];

const StudentActionModal = ({ open, onClose, onSubmit, slot }) => {
  const [form] = Form.useForm();

  useEffect(() => {
    if (open) {
      form.resetFields();
    }
  }, [open, form]);

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      onSubmit(values.action, values.notes);
    } catch (error) {
      console.error("Validation failed:", error);
    }
  };

  return (
    <Modal
      open={open}
      title={
        <span className="flex items-center gap-2 text-orange-600">
          <AlertTriangle size={20} />
          Student No-Show Action
        </span>
      }
      onCancel={onClose}
      onOk={handleSubmit}
      okText="Submit Action"
      okButtonProps={{ className: "!bg-orange-600 hover:!bg-orange-700" }}
    >
      {slot && (
        <>
          {/* Student Info */}
          <div className="mb-4 p-3 bg-orange-50 rounded-lg border border-orange-200">
            <div className="flex items-center gap-2">
              <User size={16} className="text-orange-600" />
              <span className="font-medium">{slot.student?.name}</span>
            </div>
            <p className="text-sm text-orange-600 mt-1">
              Missed meeting at {slot.time}
            </p>
          </div>

          <Form form={form} layout="vertical">
            <Form.Item
              name="action"
              label="Action to Take"
              rules={[{ required: true, message: "Please select an action" }]}
            >
              <Select size="large" placeholder="Select action">
                {actions.map((action) => (
                  <Select.Option key={action.value} value={action.value}>
                    {action.label}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>

            <Form.Item name="notes" label="Notes (Optional)">
              <TextArea rows={3} placeholder="Add any additional notes..." />
            </Form.Item>
          </Form>
        </>
      )}
    </Modal>
  );
};

export default StudentActionModal;

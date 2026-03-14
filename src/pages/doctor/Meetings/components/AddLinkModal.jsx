import { Modal, Form, Input } from "antd";
import { useEffect } from "react";
import { Video, User } from "lucide-react";

const AddLinkModal = ({ open, onClose, onSubmit, slot }) => {
  const [form] = Form.useForm();

  useEffect(() => {
    if (open) {
      form.resetFields();
    }
  }, [open, form]);

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      onSubmit(values.link);
    } catch (error) {
      console.error("Validation failed:", error);
    }
  };

  return (
    <Modal
      open={open}
      title="Add Meeting Link"
      onCancel={onClose}
      onOk={handleSubmit}
      okText="Add Link"
      okButtonProps={{ className: "!bg-emerald-600 hover:!bg-emerald-700" }}
    >
      {slot && (
        <div className="mb-4 p-3 bg-gray-50 rounded-lg">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <User size={14} />
            <span className="font-medium">{slot.student?.name}</span>
          </div>
          <div className="text-xs text-gray-500 mt-1">
            {slot.time} • {slot.duration} min
          </div>
        </div>
      )}

      <Form form={form} layout="vertical">
        <Form.Item
          name="link"
          label="Meeting Link"
          rules={[
            { required: true, message: "Please enter meeting link" },
            { type: "url", message: "Please enter a valid URL" },
          ]}
        >
          <Input
            size="large"
            prefix={<Video size={16} className="text-gray-400" />}
            placeholder="https://meet.google.com/... or https://zoom.us/..."
          />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default AddLinkModal;

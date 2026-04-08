// src/pages/dashboard/Meetings/components/MeetingModal.jsx
import { useEffect } from "react";
import {
  Modal,
  Form,
  Input,
  DatePicker,
  TimePicker,
  InputNumber,
  Select,
  ConfigProvider,
} from "antd";
import { Video, User, FileText, Link, Users } from "lucide-react";
import dayjs from "dayjs";
import enUS from "antd/locale/en_US";

const { TextArea } = Input;

const MeetingModal = ({
  open,
  onClose,
  onSubmit,
  initialData,
  loading,
  typeOptions,
  statusOptions,
}) => {
  const [form] = Form.useForm();
  const isEdit = !!initialData;

  useEffect(() => {
    if (open) {
      if (initialData) {
        form.setFieldsValue({
          ...initialData,
          date: initialData.date ? dayjs(initialData.date) : null,
          time: initialData.time ? dayjs(initialData.time, "HH:mm") : null,
        });
      } else {
        form.resetFields();
      }
    }
  }, [open, initialData, form]);

  const handleSubmit = () => {
    form.validateFields().then((values) => {
      const formattedValues = {
        ...values,
        date: values.date?.format("YYYY-MM-DD"),
        time: values.time?.format("HH:mm"),
      };
      onSubmit(formattedValues, initialData?.id);
    });
  };

  return (
    <ConfigProvider locale={enUS} direction="ltr">
      <Modal
        title={
          <div className="flex items-center gap-3 pb-4 border-b">
            <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
              <Video className="w-5 h-5 text-primary" />
            </div>
            <span className="text-lg font-semibold">
              {isEdit ? "Edit Meeting" : "New Meeting"}
            </span>
          </div>
        }
        open={open}
        onCancel={onClose}
        onOk={handleSubmit}
        okText={isEdit ? "Save Changes" : "Create Meeting"}
        cancelText="Cancel"
        confirmLoading={loading}
        width={600}
        destroyOnClose
      >
        <Form
          form={form}
          layout="vertical"
          className="mt-4"
          initialValues={{
            type: "internal",
            status: "upcoming",
            participants: 1,
            duration: 30,
          }}
        >
          <Form.Item
            name="title"
            label="Meeting Title"
            rules={[
              { required: true, message: "Please enter a meeting title" },
            ]}
          >
            <Input
              placeholder="Enter meeting title"
              prefix={<FileText className="w-4 h-4 text-gray-400" />}
              size="large"
            />
          </Form.Item>

          <div className="grid grid-cols-2 gap-4">
            <Form.Item
              name="date"
              label="Date"
              rules={[{ required: true, message: "Please select a date" }]}
            >
              <DatePicker
                placeholder="Select date"
                className="w-full"
                size="large"
                format="YYYY-MM-DD"
              />
            </Form.Item>

            <Form.Item
              name="time"
              label="Time"
              rules={[{ required: true, message: "Please select a time" }]}
            >
              <TimePicker
                placeholder="Select time"
                className="w-full"
                size="large"
                format="HH:mm"
                minuteStep={15}
              />
            </Form.Item>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Form.Item
              name="duration"
              label="Duration (minutes)"
              rules={[{ required: true, message: "Please enter duration" }]}
            >
              <InputNumber
                placeholder="30"
                min={15}
                max={480}
                step={15}
                className="!w-full"
                size="large"
              />
            </Form.Item>

            <Form.Item
              name="participants"
              label="Participants"
              rules={[
                {
                  required: true,
                  message: "Please enter number of participants",
                },
              ]}
            >
              <InputNumber
                placeholder="1"
                min={1}
                max={100}
                className="!w-full"
                size="large"
                prefix={<Users className="w-4 h-4 text-gray-400" />}
              />
            </Form.Item>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Form.Item name="type" label="Meeting Type">
              <Select
                placeholder="Select type"
                options={typeOptions}
                size="large"
              />
            </Form.Item>

            <Form.Item
              name="status"
              label="Status"
              rules={[{ required: true, message: "Please select a status" }]}
            >
              <Select
                placeholder="Select status"
                options={statusOptions}
                size="large"
              />
            </Form.Item>
          </div>

          <Form.Item
            name="organizer"
            label="Organizer"
            rules={[{ required: true, message: "Please enter organizer name" }]}
          >
            <Input
              placeholder="Enter organizer name"
              prefix={<User className="w-4 h-4 text-gray-400" />}
              size="large"
            />
          </Form.Item>

          <Form.Item name="description" label="Description">
            <TextArea
              placeholder="Enter meeting description (optional)"
              rows={3}
            />
          </Form.Item>

          <Form.Item name="link" label="Meeting Link">
            <Input
              placeholder="https://meet.example.com/..."
              prefix={<Link className="w-4 h-4 text-gray-400" />}
              size="large"
            />
          </Form.Item>
        </Form>
      </Modal>
    </ConfigProvider>
  );
};

export default MeetingModal;

import {
  Modal,
  Form,
  Input,
  Select,
  DatePicker,
  TimePicker,
  InputNumber,
} from "antd";
import { useEffect } from "react";
import dayjs from "dayjs";
import { studentsList } from "../useDoctorCalendarData";

const { TextArea } = Input;

const ScheduleModal = ({
  open,
  onClose,
  onSubmit,
  lecture,
  initialDate,
  isEdit,
}) => {
  const [form] = Form.useForm();

  useEffect(() => {
    if (open) {
      if (lecture) {
        form.setFieldsValue({
          ...lecture,
          date: dayjs(lecture.date),
          time: dayjs(lecture.time, "HH:mm"),
        });
      } else {
        form.resetFields();
        if (initialDate) {
          form.setFieldValue("date", initialDate);
        }
      }
    }
  }, [open, lecture, initialDate, form]);

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      const formattedData = {
        ...values,
        date: values.date.format("YYYY-MM-DD"),
        time: values.time.format("HH:mm"),
      };
      onSubmit(formattedData);
    } catch (error) {
      console.error("Validation failed:", error);
    }
  };

  return (
    <Modal
      open={open}
      title={isEdit ? "Edit Lecture" : "Schedule New Lecture"}
      onCancel={onClose}
      onOk={handleSubmit}
      width={600}
      okText={isEdit ? "Update" : "Schedule"}
    >
      <Form
        form={form}
        layout="vertical"
        className="mt-4"
        initialValues={{
          type: "lecture",
          duration: 90,
        }}
      >
        <Form.Item
          name="title"
          label="Lecture Title"
          rules={[{ required: true, message: "Please enter lecture title" }]}
        >
          <Input placeholder="e.g., Cardiovascular Anatomy" size="large" />
        </Form.Item>

        <div className="grid grid-cols-2 gap-4">
          <Form.Item
            name="date"
            label="Date"
            rules={[{ required: true, message: "Please select date" }]}
          >
            <DatePicker className="w-full" size="large" format="YYYY-MM-DD" />
          </Form.Item>

          <Form.Item
            name="time"
            label="Time"
            rules={[{ required: true, message: "Please select time" }]}
          >
            <TimePicker
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
              className="w-full"
              size="large"
              min={15}
              max={300}
              step={15}
            />
          </Form.Item>

          <Form.Item name="type" label="Type" rules={[{ required: true }]}>
            <Select size="large">
              <Select.Option value="lecture">Lecture</Select.Option>
              <Select.Option value="practical">Practical</Select.Option>
              <Select.Option value="seminar">Seminar</Select.Option>
              <Select.Option value="workshop">Workshop</Select.Option>
            </Select>
          </Form.Item>
        </div>

        <Form.Item
          name="location"
          label="Location"
          rules={[{ required: true, message: "Please enter location" }]}
        >
          <Input placeholder="e.g., Hall A - Building 2" size="large" />
        </Form.Item>

        {isEdit && (
          <Form.Item name="status" label="Status" rules={[{ required: true }]}>
            <Select size="large">
              <Select.Option value="upcoming">Upcoming</Select.Option>
              <Select.Option value="ongoing">Ongoing</Select.Option>
              <Select.Option value="completed">Completed</Select.Option>
              <Select.Option value="cancelled">Cancelled</Select.Option>
            </Select>
          </Form.Item>
        )}

        <Form.Item name="description" label="Description">
          <TextArea
            rows={3}
            placeholder="Brief description of the lecture content..."
          />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default ScheduleModal;

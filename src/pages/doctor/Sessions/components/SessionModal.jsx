// src/pages/doctor/Sessions/components/SessionModal.jsx
import { useEffect, useState } from "react";
import {
  Modal,
  Form,
  Input,
  DatePicker,
  TimePicker,
  InputNumber,
  Button,
  Divider,
} from "antd";
import { X, BookOpen, CalendarCheck } from "lucide-react";
import dayjs from "dayjs";

const SessionModal = ({ open, onClose, onSave, session, loading }) => {
  const [form] = Form.useForm();
  const [isFormValid, setIsFormValid] = useState(false);
  const isEditing = !!session;

  // Watch all form values to check validity
  const formValues = Form.useWatch([], form);

  // Check form validity whenever values change
  useEffect(() => {
    if (open) {
      form
        .validateFields({ validateOnly: true })
        .then(() => setIsFormValid(true))
        .catch(() => setIsFormValid(false));
    }
  }, [formValues, form, open]);

  // Reset form when modal opens
  useEffect(() => {
    if (open) {
      if (session) {
        // Edit mode - populate form
        form.setFieldsValue({
          title: session.title,
          topic: session.topic,
          session_date: session.session_date
            ? dayjs(session.session_date)
            : null,
          session_time: session.session_time
            ? dayjs(session.session_time, "HH:mm:ss")
            : null,
          session_schedule_date: session.session_schedule_date
            ? dayjs(session.session_schedule_date)
            : null,
          address: session.address,
          student_limit: session.student_limit,
        });
      } else {
        // Create mode - reset form
        form.resetFields();
        setIsFormValid(false);
      }
    }
  }, [open, session, form]);

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();

      const sessionData = {
        title: values.title,
        topic: values.topic,
        session_date: values.session_date.format("YYYY-MM-DD"),
        session_time: values.session_time.format("HH:mm:ss"),
        session_schedule_date: values.session_schedule_date
          ? values.session_schedule_date.format("YYYY-MM-DD HH:mm:ss")
          : null,
        address: values.address,
        student_limit: values.student_limit,
      };

      const success = await onSave(sessionData, session?.id);
      if (success) {
        form.resetFields();
        onClose();
      }
    } catch (error) {
      console.error("Validation failed:", error);
    }
  };

  // Watch session_date and session_time to validate schedule_date
  const sessionDate = Form.useWatch("session_date", form);
  const sessionTime = Form.useWatch("session_time", form);

  // Combine session date and time for comparison
  const getSessionDateTime = () => {
    if (sessionDate && sessionTime) {
      return sessionDate
        .hour(sessionTime.hour())
        .minute(sessionTime.minute())
        .second(sessionTime.second());
    }
    return sessionDate;
  };

  return (
    <Modal
      open={open}
      onCancel={onClose}
      footer={null}
      centered
      width={520}
      closeIcon={<X className="w-5 h-5" />}
      title={
        <div className="flex items-center gap-2">
          <BookOpen className="w-5 h-5 text-primary" />
          <span>{isEditing ? "Edit Session" : "Create New Session"}</span>
        </div>
      }
      destroyOnHidden
    >
      <Form form={form} layout="vertical" className="mt-4" requiredMark={false}>
        {/* Title */}
        <Form.Item
          name="title"
          label="Session Title"
          rules={[
            { required: true, message: "Please enter session title" },
            { min: 3, message: "Title must be at least 3 characters" },
          ]}
        >
          <Input placeholder="e.g., Final Review Session" size="large" />
        </Form.Item>

        {/* Topic */}
        <Form.Item
          name="topic"
          label="Topic"
          rules={[
            { required: true, message: "Please enter topic" },
            { min: 3, message: "Topic must be at least 3 characters" },
          ]}
        >
          <Input.TextArea
            placeholder="e.g., All Chapters Review"
            rows={2}
            size="large"
          />
        </Form.Item>

        <Divider className="my-4" />

        {/* Session Date & Time */}
        <div className="grid grid-cols-2 gap-4">
          <Form.Item
            name="session_date"
            label="Session Date"
            rules={[{ required: true, message: "Please select date" }]}
          >
            <DatePicker
              className="w-full"
              size="large"
              format="YYYY-MM-DD"
              placeholder="Select date"
              disabledDate={(current) =>
                current && current < dayjs().startOf("day")
              }
            />
          </Form.Item>

          <Form.Item
            name="session_time"
            label="Session Time"
            rules={[{ required: true, message: "Please select time" }]}
          >
            <TimePicker
              className="w-full"
              size="large"
              format="hh:mm A"
              placeholder="Select time"
              use12Hours
              minuteStep={15}
            />
          </Form.Item>
        </div>

        {/* Booking Start Date & Time - معاد بداية الحجز */}
        <Form.Item
          name="session_schedule_date"
          label={
            <div className="flex items-center gap-2">
              <CalendarCheck className="w-4 h-4 text-emerald-600" />
              <span>Booking Start Date & Time</span>
              <span className="text-xs text-gray-400">(معاد بداية الحجز)</span>
            </div>
          }
          tooltip="The date and time when students can start booking this session"
          rules={[
            {
              validator: (_, value) => {
                const sessionDateTime = getSessionDateTime();
                if (
                  value &&
                  sessionDateTime &&
                  value.isAfter(sessionDateTime)
                ) {
                  return Promise.reject(
                    new Error(
                      "Booking date/time must be before session date/time"
                    )
                  );
                }
                return Promise.resolve();
              },
            },
          ]}
        >
          <DatePicker
            className="w-full"
            size="large"
            showTime={{
              format: "hh:mm A",
              use12Hours: true,
              minuteStep: 15,
            }}
            format="YYYY-MM-DD hh:mm A"
            placeholder="Select booking start date & time (optional)"
            disabledDate={(current) => {
              if (current && current < dayjs().startOf("day")) {
                return true;
              }
              if (
                sessionDate &&
                current &&
                current.isAfter(sessionDate, "day")
              ) {
                return true;
              }
              return false;
            }}
            disabledTime={(current) => {
              const sessionDateTime = getSessionDateTime();
              if (!current || !sessionDateTime) return {};

              if (current.isSame(sessionDate, "day")) {
                const sessionHour = sessionTime?.hour() || 23;
                const sessionMinute = sessionTime?.minute() || 59;

                return {
                  disabledHours: () => {
                    const hours = [];
                    for (let i = sessionHour + 1; i < 24; i++) {
                      hours.push(i);
                    }
                    return hours;
                  },
                  disabledMinutes: (selectedHour) => {
                    if (selectedHour === sessionHour) {
                      const minutes = [];
                      for (let i = sessionMinute; i < 60; i++) {
                        minutes.push(i);
                      }
                      return minutes;
                    }
                    return [];
                  },
                };
              }
              return {};
            }}
          />
        </Form.Item>

        <Divider className="my-4" />

        {/* Address */}
        <Form.Item
          name="address"
          label="Location / Address"
          rules={[
            { required: true, message: "Please enter location" },
            { min: 3, message: "Location must be at least 3 characters" },
          ]}
        >
          <Input placeholder="e.g., Cairo Hall 5" size="large" />
        </Form.Item>

        {/* Student Limit */}
        <Form.Item
          name="student_limit"
          label="Student Limit"
          rules={[
            { required: true, message: "Please enter student limit" },
            {
              type: "number",
              min: 1,
              message: "Minimum 1 student",
            },
            {
              type: "number",
              max: 500,
              message: "Maximum 500 students",
            },
          ]}
        >
          <InputNumber
            className="w-full!"
            size="large"
            min={1}
            max={500}
            placeholder="e.g., 30"
          />
        </Form.Item>

        {/* Actions */}
        <div className="flex justify-end gap-3 pt-4 border-t mt-6">
          <Button onClick={onClose} size="large" disabled={loading}>
            Cancel
          </Button>
          <Button
            type="primary"
            onClick={handleSubmit}
            loading={loading}
            disabled={!isFormValid || loading}
            size="large"
          >
            {isEditing ? "Save Changes" : "Create Session"}
          </Button>
        </div>
      </Form>
    </Modal>
  );
};

export default SessionModal;

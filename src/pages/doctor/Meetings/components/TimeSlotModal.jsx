// src/pages/doctor/Meetings/components/TimeSlotModal.jsx
import { Modal, Form, Select, Alert } from "antd";
import { useEffect, useState } from "react";
import { Clock, AlertCircle } from "lucide-react";
import {
  timeOptions,
  calculateDuration,
  formatDuration,
} from "../useMeetingsData";

const TimeSlotModal = ({
  open,
  onClose,
  onSubmit,
  onEdit,
  dayKey,
  slot,
  existingSlots = [],
}) => {
  const [form] = Form.useForm();
  const [duration, setDuration] = useState(null);

  const isEditing = !!slot;

  useEffect(() => {
    if (open) {
      if (slot) {
        // Editing mode
        form.setFieldsValue({
          startTime: slot.startTime,
          endTime: slot.endTime,
        });
        setDuration(calculateDuration(slot.startTime, slot.endTime));
      } else {
        // Adding mode
        form.resetFields();
        setDuration(null);
      }
    }
  }, [open, slot, form]);

  // Calculate duration when times change
  const handleTimeChange = () => {
    const startTime = form.getFieldValue("startTime");
    const endTime = form.getFieldValue("endTime");

    if (startTime && endTime) {
      const mins = calculateDuration(startTime, endTime);
      setDuration(mins > 0 ? mins : null);
    } else {
      setDuration(null);
    }
  };

  // Filter end time options based on start time
  const getEndTimeOptions = () => {
    const startTime = form.getFieldValue("startTime");
    if (!startTime) return timeOptions;

    return timeOptions.filter((time) => time > startTime);
  };

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();

      if (isEditing) {
        onEdit(dayKey, slot.id, values);
      } else {
        onSubmit(dayKey, values);
      }
    } catch (error) {
      console.error("Validation failed:", error);
    }
  };

  return (
    <Modal
      open={open}
      title={
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 bg-emerald-100 rounded-xl flex items-center justify-center">
            <Clock size={20} className="text-emerald-600" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">
              {isEditing ? "Edit Time Slot" : "Add Available Time"}
            </h3>
            <p className="text-sm text-gray-500 font-normal">
              Set your availability period
            </p>
          </div>
        </div>
      }
      onCancel={onClose}
      onOk={handleSubmit}
      okText={isEditing ? "Save Changes" : "Add Slot"}
      okButtonProps={{
        className: "!bg-emerald-600 hover:!bg-emerald-700",
        disabled: !duration || duration <= 0,
      }}
      width={420}
    >
      <Form
        form={form}
        layout="vertical"
        className="mt-6"
        onValuesChange={handleTimeChange}
      >
        <div className="grid grid-cols-2 gap-4">
          <Form.Item
            name="startTime"
            label="Start Time"
            rules={[{ required: true, message: "Select start time" }]}
          >
            <Select
              size="large"
              placeholder="From"
              showSearch
              className="w-full"
            >
              {timeOptions.map((time) => (
                <Select.Option key={time} value={time}>
                  {time}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            name="endTime"
            label="End Time"
            rules={[
              { required: true, message: "Select end time" },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  const startTime = getFieldValue("startTime");
                  if (!value || !startTime) return Promise.resolve();
                  if (value > startTime) return Promise.resolve();
                  return Promise.reject(new Error("Must be after start"));
                },
              }),
            ]}
          >
            <Select size="large" placeholder="To" showSearch className="w-full">
              {getEndTimeOptions().map((time) => (
                <Select.Option key={time} value={time}>
                  {time}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
        </div>

        {/* Duration Display */}
        {duration && duration > 0 && (
          <div className="p-4 bg-emerald-50 rounded-xl border border-emerald-100 mt-2">
            <div className="flex items-center justify-between">
              <span className="text-emerald-700 font-medium">Duration</span>
              <span className="text-emerald-800 font-bold text-lg">
                {formatDuration(duration)}
              </span>
            </div>
          </div>
        )}

        {/* Warning for short slots */}
        {duration && duration < 30 && (
          <Alert
            type="warning"
            message="Short time slot"
            description="This slot is less than 30 minutes. Consider extending it for meaningful meetings."
            className="mt-4"
            showIcon
            icon={<AlertCircle size={16} />}
          />
        )}
      </Form>
    </Modal>
  );
};

export default TimeSlotModal;

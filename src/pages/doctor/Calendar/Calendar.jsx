import {
  Calendar as AntCalendar,
  Card,
  Tag,
  Modal,
  Form,
  Input,
  Badge,
} from "antd";
import {
  CalendarOff,
  Plus,
  Trash2,
  Calendar as CalendarIcon,
} from "lucide-react";
import dayjs from "dayjs";

import Button from "../../../components/common/Button";
import useCalendarData from "./useCalendarData";

const Calendar = () => {
  const {
    stats,
    upcomingOffDays,
    isOffDay,
    getOffDayInfo,
    addOffDay,
    removeOffDay,
    selectedDate,
    modalOpen,
    openModal,
    closeModal,
  } = useCalendarData();

  const [form] = Form.useForm();

  // Handle form submit
  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      addOffDay(selectedDate, values.reason);
      form.resetFields();
    } catch (error) {
      console.error("Validation failed:", error);
    }
  };

  // Custom date cell render
  const fullCellRender = (date) => {
    const isOff = isOffDay(date);
    const offInfo = getOffDayInfo(date);
    const isToday = date.isSame(dayjs(), "day");
    const isPast = date.isBefore(dayjs(), "day");

    return (
      <div
        className={`
          ant-picker-cell-inner ant-picker-calendar-date relative p-1
          ${isOff ? "bg-red-50 border border-red-200" : ""}
          ${isPast ? "opacity-50" : ""}
          rounded-lg min-h-[80px] cursor-pointer
          hover:bg-gray-50 transition-colors
        `}
        onClick={() =>
          !isPast && (isOff ? removeOffDay(date) : openModal(date))
        }
      >
        {/* Day number */}
        <div
          className={`
            ant-picker-calendar-date-value text-center
            ${isToday ? "bg-emerald-600 text-white rounded-full w-7 h-7 flex items-center justify-center mx-auto" : ""}
            ${isOff && !isToday ? "text-red-600 font-bold" : ""}
          `}
        >
          {date.date()}
        </div>

        {/* Off day indicator */}
        {isOff && (
          <div className="mt-2 text-center">
            <Tag color="red" className="text-xs">
              <CalendarOff size={10} className="inline mr-1" />
              Off
            </Tag>
            {offInfo?.reason && (
              <p className="text-xs text-red-600 mt-1 truncate">
                {offInfo.reason}
              </p>
            )}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Calendar</h1>
          <p className="text-gray-600">Manage your off days and availability</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        <Card bodyStyle={{ padding: 16 }} className="text-center">
          <div className="text-2xl font-bold text-red-600">{stats.total}</div>
          <div className="text-sm text-gray-500">Total Off Days</div>
        </Card>
        <Card bodyStyle={{ padding: 16 }} className="text-center">
          <div className="text-2xl font-bold text-orange-600">
            {stats.thisMonth}
          </div>
          <div className="text-sm text-gray-500">This Month</div>
        </Card>
        <Card bodyStyle={{ padding: 16 }} className="text-center">
          <div className="text-2xl font-bold text-blue-600">
            {stats.nextMonth}
          </div>
          <div className="text-sm text-gray-500">Next Month</div>
        </Card>
      </div>

      <div className=" gap-6">
        {/* Calendar */}
        <div className="">
          <Card>
            <AntCalendar
              fullCellRender={fullCellRender}
              defaultValue={dayjs("2026-03-15")}
            />
          </Card>
        </div>
      </div>

      {/* Add Off Day Modal */}
      <Modal
        open={modalOpen}
        title="Mark Day as Off"
        onCancel={closeModal}
        onOk={handleSubmit}
        okText="Mark as Off"
        okButtonProps={{ danger: true }}
      >
        <div className="py-4">
          <div className="mb-4 p-4 bg-red-50 rounded-lg text-center">
            <CalendarIcon size={32} className="mx-auto mb-2 text-red-500" />
            <p className="font-medium text-red-700">
              {selectedDate?.format("dddd, MMMM D, YYYY")}
            </p>
          </div>

          <Form form={form} layout="vertical">
            <Form.Item name="reason" label="Reason (Optional)">
              <Input
                size="large"
                placeholder="e.g., Personal Leave, Conference, Holiday..."
              />
            </Form.Item>
          </Form>
        </div>
      </Modal>
    </div>
  );
};

export default Calendar;

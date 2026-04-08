// src/pages/dashboard/Users/components/UserCalendarModal.jsx
import { Modal, Calendar, Badge, Tag } from "antd";
import dayjs from "dayjs";
import { Calendar as CalendarIcon } from "lucide-react";

const UserCalendarModal = ({ open, onCancel, user }) => {
  if (!user) return null;

  // الحصول على اجتماعات يوم معين
  const getMeetingsForDate = (date) => {
    return user.meetings.filter(
      (meeting) =>
        dayjs(meeting.date).format("YYYY-MM-DD") === date.format("YYYY-MM-DD")
    );
  };

  // تخصيص خلية التاريخ
  const dateCellRender = (date) => {
    const meetings = getMeetingsForDate(date);

    if (meetings.length === 0) return null;

    return (
      <ul className="list-none p-0 m-0">
        {meetings.slice(0, 2).map((meeting) => (
          <li key={meeting.id} className="mb-1">
            <Badge
              status={
                meeting.status === "completed"
                  ? "success"
                  : meeting.status === "ongoing"
                    ? "processing"
                    : meeting.status === "cancelled"
                      ? "error"
                      : "default"
              }
              text={
                <span className="text-xs truncate block max-w-[100px]">
                  {meeting.title}
                </span>
              }
            />
          </li>
        ))}
        {meetings.length > 2 && (
          <li className="text-xs text-primary">
            +{meetings.length - 2} المزيد
          </li>
        )}
      </ul>
    );
  };

  return (
    <Modal
      title={
        <span className="flex items-center gap-2">
          <CalendarIcon size={20} className="text-primary" />
          اجتماعات {user.name}
        </span>
      }
      open={open}
      onCancel={onCancel}
      footer={null}
      width={900}
    >
      <div className="py-4">
        {/* ملخص */}
        <div className="flex gap-4 mb-4 justify-center">
          <Tag color="default">{user.meetings.length} اجتماع</Tag>
          <Tag color="green">
            {user.meetings.filter((m) => m.status === "completed").length} مكتمل
          </Tag>
          <Tag color="blue">
            {user.meetings.filter((m) => m.status === "upcoming").length} قادم
          </Tag>
        </div>

        <Calendar
          cellRender={dateCellRender}
          defaultValue={dayjs("2026-03-14")}
        />
      </div>
    </Modal>
  );
};

export default UserCalendarModal;

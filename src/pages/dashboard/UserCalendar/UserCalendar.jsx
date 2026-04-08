// src/pages/dashboard/UserCalendar/UserCalendar.jsx
import { Calendar, Card, Tag, Avatar, Empty, Modal, Badge } from "antd";
import {
  ArrowLeft,
  Calendar as CalendarIcon,
  Clock,
  MapPin,
  User,
} from "lucide-react";
import dayjs from "dayjs";

import Button from "../../../components/common/Button";
import useUserCalendarData, { statusConfig } from "./useUserCalendarData";

const UserCalendar = () => {
  const {
    user,
    userExists,
    statistics,
    selectedMeeting,
    modalVisible,
    getMeetingsForDate,
    openMeetingDetails,
    closeMeetingDetails,
    goBack,
  } = useUserCalendarData();

  if (!userExists) {
    return (
      <div className="flex flex-col items-center justify-center h-96">
        <Empty description="Student not found" />
        <Button className="mt-4" onClick={goBack}>
          Go Back
        </Button>
      </div>
    );
  }

  // Custom date cell render
  const dateCellRender = (date) => {
    const meetings = getMeetingsForDate(date);
    if (meetings.length === 0) return null;

    return (
      <div className="space-y-1">
        {meetings.map((meeting) => {
          const config = statusConfig[meeting.status];
          return (
            <div
              key={meeting.id}
              className="text-xs p-1.5 rounded cursor-pointer transition-all hover:scale-105 hover:shadow-md"
              style={{
                backgroundColor: config.bg,
                borderLeft: `3px solid ${config.color}`,
              }}
              onClick={(e) => {
                e.stopPropagation();
                openMeetingDetails(meeting);
              }}
            >
              <div
                className="font-medium truncate"
                style={{ color: config.color }}
              >
                {meeting.title}
              </div>
              <div className="text-gray-500 flex items-center gap-1 mt-0.5">
                <Clock size={10} />
                {meeting.time}
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  // Full cell render for highlighting days with meetings
  const fullCellRender = (date) => {
    const meetings = getMeetingsForDate(date);
    const isToday = date.isSame(dayjs(), "day");
    const hasMeetings = meetings.length > 0;

    return (
      <div
        className="ant-picker-cell-inner ant-picker-calendar-date relative"
        style={{
          backgroundColor: hasMeetings ? "#f0f5ff" : undefined,
          borderRadius: "8px",
          minHeight: "80px",
          padding: "4px",
          border: hasMeetings ? "1px solid #d6e4ff" : undefined,
        }}
      >
        {/* Day number */}
        <div
          className={`
            ant-picker-calendar-date-value
            ${hasMeetings ? "font-bold text-primary" : ""}
            ${isToday ? "bg-primary text-white rounded-full w-7 h-7 flex items-center justify-center mx-auto" : ""}
          `}
        >
          {date.date()}
        </div>

        {/* Meetings */}
        <div className="ant-picker-calendar-date-content mt-1">
          {dateCellRender(date)}
        </div>

        {/* Badge for multiple meetings */}
        {hasMeetings && meetings.length > 1 && (
          <Badge
            count={meetings.length}
            size="small"
            style={{
              position: "absolute",
              top: 2,
              right: 2,
              backgroundColor: "#5046c4",
            }}
          />
        )}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" onClick={goBack} className="!p-2">
          <ArrowLeft size={20} />
        </Button>
        <Avatar size={48} style={{ backgroundColor: "#1890ff" }}>
          {user.name.charAt(0)}
        </Avatar>
        <div>
          <h1 className="text-xl font-bold">{user.name}</h1>
          <p className="text-gray-500">{user.level}</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        <Card bodyStyle={{ padding: 16 }} className="text-center">
          <div className="text-2xl font-bold">{statistics?.total}</div>
          <div className="text-gray-500 text-sm">Total Lectures</div>
        </Card>
        <Card bodyStyle={{ padding: 16 }} className="text-center">
          <div className="text-2xl font-bold text-green-600">
            {statistics?.completed}
          </div>
          <div className="text-gray-500 text-sm">Completed</div>
        </Card>
        <Card bodyStyle={{ padding: 16 }} className="text-center">
          <div className="text-2xl font-bold text-blue-600">
            {statistics?.upcoming}
          </div>
          <div className="text-gray-500 text-sm">Upcoming</div>
        </Card>
      </div>

      {/* Legend */}
      <Card size="small">
        <div className="flex gap-6 justify-center">
          {Object.entries(statusConfig).map(([key, config]) => (
            <div key={key} className="flex items-center gap-2">
              <div
                className="w-4 h-4 rounded"
                style={{
                  backgroundColor: config.bg,
                  border: `2px solid ${config.color}`,
                }}
              />
              <span className="text-sm">{config.label}</span>
            </div>
          ))}
        </div>
      </Card>

      {/* Calendar */}
      <Card className="calendar-card">
        <Calendar
          fullCellRender={fullCellRender}
          defaultValue={dayjs("2026-03-14")}
        />
      </Card>

      {/* Meeting Modal */}
      <Modal
        title={
          <span className="flex items-center gap-2 text-primary">
            <CalendarIcon size={20} />
            Lecture Details
          </span>
        }
        open={modalVisible}
        onCancel={closeMeetingDetails}
        footer={<Button onClick={closeMeetingDetails}>Close</Button>}
        width={450}
      >
        {selectedMeeting && (
          <div className="py-4">
            {/* Title & Status */}
            <div className="flex items-start justify-between mb-4">
              <h3 className="text-lg font-bold">{selectedMeeting.title}</h3>
              <Tag
                style={{
                  backgroundColor: statusConfig[selectedMeeting.status].bg,
                  color: statusConfig[selectedMeeting.status].color,
                  border: `1px solid ${statusConfig[selectedMeeting.status].color}`,
                }}
              >
                {statusConfig[selectedMeeting.status].label}
              </Tag>
            </div>

            {/* Details */}
            <div className="space-y-3 bg-gray-50 rounded-lg p-4">
              <div className="flex items-center gap-3 text-gray-600">
                <CalendarIcon size={18} className="text-gray-400" />
                <span>
                  {dayjs(selectedMeeting.date).format("dddd, MMMM DD, YYYY")}
                </span>
              </div>

              <div className="flex items-center gap-3 text-gray-600">
                <Clock size={18} className="text-gray-400" />
                <span>{selectedMeeting.time}</span>
              </div>

              <div className="flex items-center gap-3 text-gray-600">
                <MapPin size={18} className="text-gray-400" />
                <span>{selectedMeeting.location}</span>
              </div>

              <div className="flex items-center gap-3 text-gray-600">
                <User size={18} className="text-gray-400" />
                <span>{selectedMeeting.doctor}</span>
              </div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default UserCalendar;

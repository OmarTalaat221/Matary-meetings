// src/pages/doctor/Sessions/components/SessionCard.jsx
import { useNavigate } from "react-router-dom";
import {
  Calendar,
  Clock,
  MapPin,
  Users,
  BookOpen,
  Edit,
  Trash2,
  MoreVertical,
  GraduationCap,
  CalendarCheck,
} from "lucide-react";
import { Dropdown, Popconfirm, Tag, Tooltip } from "antd";

const SessionCard = ({ session, onEdit, onDelete }) => {
  const navigate = useNavigate();

  // Format date
  const formatDate = (dateStr) => {
    if (!dateStr) return "-";
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  // Format date and time together
  const formatDateTime = (dateStr) => {
    if (!dateStr) return "-";
    const date = new Date(dateStr);
    return date.toLocaleString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  };

  // Format date in Arabic style with time
  const formatDateTimeAr = (dateStr) => {
    if (!dateStr) return "-";
    const date = new Date(dateStr);
    return date.toLocaleString("ar-EG", {
      weekday: "long",
      month: "long",
      day: "numeric",
      year: "numeric",
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  };

  // Format time
  const formatTime = (timeStr) => {
    if (!timeStr) return "";
    const [hours, minutes] = timeStr.split(":");
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? "PM" : "AM";
    const hour12 = hour % 12 || 12;
    return `${hour12}:${minutes} ${ampm}`;
  };

  // Check if session is past
  const isPast = () => {
    const sessionDateTime = new Date(
      `${session.session_date}T${session.session_time}`
    );
    return sessionDateTime < new Date();
  };

  // Check if booking is open
  const isBookingOpen = () => {
    if (!session.session_schedule_date) return true;
    const scheduleDate = new Date(session.session_schedule_date);
    return scheduleDate <= new Date();
  };

  // Get time until booking opens
  const getTimeUntilBooking = () => {
    if (!session.session_schedule_date) return null;
    const scheduleDate = new Date(session.session_schedule_date);
    const now = new Date();

    if (scheduleDate <= now) return null;

    const diff = scheduleDate - now;
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

    if (days > 0) return `${days}d ${hours}h`;
    if (hours > 0) return `${hours}h ${minutes}m`;
    return `${minutes}m`;
  };

  // Status config
  const getStatusConfig = () => {
    if (isPast()) {
      return { color: "default", label: "Completed" };
    }
    switch (session.status) {
      case "active":
        return { color: "green", label: "Active" };
      case "cancelled":
        return { color: "red", label: "Cancelled" };
      case "full":
        return { color: "orange", label: "Full" };
      default:
        return { color: "blue", label: session.status };
    }
  };

  const statusConfig = getStatusConfig();
  const timeUntilBooking = getTimeUntilBooking();

  // Navigate to students page
  const handleViewStudents = () => {
    navigate(`/sessions/${session.id}/students`);
  };

  // Dropdown menu items
  const menuItems = [
    {
      key: "students",
      icon: <GraduationCap className="w-4 h-4" />,
      label: "View Students",
      onClick: handleViewStudents,
    },
    {
      key: "edit",
      icon: <Edit className="w-4 h-4" />,
      label: "Edit Session",
      onClick: () => onEdit(session),
    },
    { type: "divider" },
    {
      key: "delete",
      icon: <Trash2 className="w-4 h-4" />,
      label: (
        <Popconfirm
          title="Delete this session?"
          description="This action cannot be undone."
          onConfirm={() => onDelete(session.id)}
          okText="Yes, Delete"
          cancelText="No"
          okButtonProps={{ danger: true }}
        >
          <span className="text-red-600">Delete Session</span>
        </Popconfirm>
      ),
      danger: true,
    },
  ];

  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden group">
      {/* Header */}
      <div className="p-4 pb-3 border-b border-gray-50">
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-gray-900 truncate text-lg">
              {session.title}
            </h3>
            <div className="flex items-center gap-2 mt-1">
              <BookOpen className="w-4 h-4 text-primary flex-shrink-0" />
              <span className="text-sm text-gray-600 truncate">
                {session.topic}
              </span>
            </div>
          </div>

          {/* Actions Dropdown */}
          <Dropdown
            menu={{ items: menuItems }}
            trigger={["click"]}
            placement="bottomRight"
          >
            <button className="p-2 rounded-lg hover:bg-gray-100 transition-colors opacity-0 group-hover:opacity-100">
              <MoreVertical className="w-5 h-5 text-gray-500" />
            </button>
          </Dropdown>
        </div>

        {/* Status Tags */}
        <div className="mt-3 flex items-center gap-2 flex-wrap">
          <Tag color={statusConfig.color}>{statusConfig.label}</Tag>
          {session.session_schedule_date && (
            <Tooltip
              title={
                isBookingOpen()
                  ? "Booking is open"
                  : `Booking opens on ${formatDateTimeAr(session.session_schedule_date)}`
              }
            >
              <Tag color={isBookingOpen() ? "green" : "orange"}>
                {isBookingOpen()
                  ? "Booking Open"
                  : `Opens in ${timeUntilBooking}`}
              </Tag>
            </Tooltip>
          )}
        </div>
      </div>

      {/* Body */}
      <div className="p-4 space-y-3">
        {/* Session Date */}
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
            <Calendar className="w-5 h-5 text-primary" />
          </div>
          <div>
            <p className="text-xs text-gray-500">Session Date</p>
            <p className="text-sm font-medium text-gray-900">
              {formatDate(session.session_date)}
            </p>
          </div>
        </div>

        {/* Time */}
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-blue-50 flex items-center justify-center flex-shrink-0">
            <Clock className="w-5 h-5 text-blue-600" />
          </div>
          <div>
            <p className="text-xs text-gray-500">Time</p>
            <p className="text-sm font-medium text-gray-900">
              {formatTime(session.session_time)}
            </p>
          </div>
        </div>

        {/* Booking Start Date & Time - معاد بداية الحجز */}
        {session.session_schedule_date && (
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-emerald-50 flex items-center justify-center flex-shrink-0">
              <CalendarCheck className="w-5 h-5 text-emerald-600" />
            </div>
            <div className="flex-1">
              <p className="text-xs text-gray-500">Booking Opens</p>
              <p className="text-sm font-medium text-gray-900">
                {formatDateTime(session.session_schedule_date)}
              </p>
              {!isBookingOpen() && timeUntilBooking && (
                <p className="text-xs text-orange-600 mt-0.5">
                  Opens in {timeUntilBooking}
                </p>
              )}
            </div>
          </div>
        )}

        {/* Location */}
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-orange-50 flex items-center justify-center flex-shrink-0">
            <MapPin className="w-5 h-5 text-orange-600" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs text-gray-500">Location</p>
            <p className="text-sm font-medium text-gray-900 truncate">
              {session.address}
            </p>
          </div>
        </div>

        {/* Student Limit */}
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-purple-50 flex items-center justify-center flex-shrink-0">
            <Users className="w-5 h-5 text-purple-600" />
          </div>
          <div>
            <p className="text-xs text-gray-500">Student Limit</p>
            <p className="text-sm font-medium text-gray-900">
              {session.student_limit} students
            </p>
          </div>
        </div>
      </div>

      {/* Footer - View Students Button */}
      <div className="px-4 pb-4">
        <button
          onClick={handleViewStudents}
          className="w-full flex items-center justify-center gap-2 py-2.5 bg-gradient-to-r from-primary/10 to-blue-50 text-primary rounded-lg hover:from-primary/20 hover:to-blue-100 transition-all duration-300 font-medium"
        >
          <GraduationCap className="w-5 h-5" />
          <span>View Students</span>
        </button>
      </div>
    </div>
  );
};

export default SessionCard;

import {
  Calendar,
  Card,
  Tag,
  Avatar,
  Empty,
  Modal,
  Badge,
  Dropdown,
} from "antd";
import {
  ArrowLeft,
  Calendar as CalendarIcon,
  Clock,
  MapPin,
  Users,
  Plus,
  Edit,
  Trash2,
  MoreVertical,
  CheckCircle,
  XCircle,
  BookOpen,
} from "lucide-react";
import dayjs from "dayjs";

import Button from "../../../components/common/Button";
import useDoctorCalendarData, {
  statusConfig,
  typeConfig,
} from "./useDoctorCalendarData";
import ScheduleModal from "./components/ScheduleModal";
import DeleteLectureModal from "./components/DeleteLectureModal";

const DoctorCalendar = () => {
  const {
    doctor,
    doctorExists,
    statistics,
    getLecturesForDate,

    // Modal states
    selectedLecture,
    viewModalVisible,
    scheduleModalVisible,
    deleteModalVisible,
    isEditMode,
    selectedDate,

    // Modal actions
    openViewModal,
    closeViewModal,
    openScheduleModal,
    openEditModal,
    closeScheduleModal,
    openDeleteModal,
    closeDeleteModal,

    // CRUD actions
    addLecture,
    updateLecture,
    deleteLecture,
    markAsCompleted,
    cancelLecture,

    goBack,
  } = useDoctorCalendarData();

  if (!doctorExists) {
    return (
      <div className="flex flex-col items-center justify-center h-96">
        <Empty description="Doctor not found" />
        <Button className="mt-4" onClick={goBack}>
          Go Back
        </Button>
      </div>
    );
  }

  // Action menu for lecture card
  const getLectureMenu = (lecture) => ({
    items: [
      {
        key: "view",
        label: "View Details",
        icon: <CalendarIcon size={14} />,
        onClick: () => openViewModal(lecture),
      },
      {
        key: "edit",
        label: "Edit",
        icon: <Edit size={14} />,
        onClick: () => openEditModal(lecture),
      },
      {
        type: "divider",
      },
      {
        key: "complete",
        label: "Mark as Completed",
        icon: <CheckCircle size={14} />,
        onClick: () => markAsCompleted(lecture),
        disabled: lecture.status === "completed",
      },
      {
        key: "cancel",
        label: "Cancel Lecture",
        icon: <XCircle size={14} />,
        onClick: () => cancelLecture(lecture),
        disabled: lecture.status === "cancelled",
      },
      {
        type: "divider",
      },
      {
        key: "delete",
        label: "Delete",
        icon: <Trash2 size={14} />,
        danger: true,
        onClick: () => openDeleteModal(lecture),
      },
    ],
  });

  // Custom date cell render
  const dateCellRender = (date) => {
    const lectures = getLecturesForDate(date);
    if (lectures.length === 0) return null;

    return (
      <div className="space-y-1">
        {lectures.map((lecture) => {
          const config = statusConfig[lecture.status];
          const tConfig = typeConfig[lecture.type];
          return (
            <div
              key={lecture.id}
              className="text-xs p-1.5 rounded cursor-pointer transition-all hover:scale-105 hover:shadow-md group relative"
              style={{
                backgroundColor: config.bg,
                borderLeft: `3px solid ${config.color}`,
              }}
              onClick={(e) => {
                e.stopPropagation();
                openViewModal(lecture);
              }}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1 min-w-0">
                  <div
                    className="font-medium truncate"
                    style={{ color: config.color }}
                  >
                    {lecture.title}
                  </div>
                  <div className="text-gray-500 flex items-center gap-1 mt-0.5">
                    <Clock size={10} />
                    {lecture.time}
                  </div>
                </div>
                {/* Quick actions on hover */}
                <Dropdown
                  menu={getLectureMenu(lecture)}
                  trigger={["click"]}
                  placement="bottomRight"
                >
                  <div
                    className="opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-white/50 rounded"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <MoreVertical size={12} />
                  </div>
                </Dropdown>
              </div>
              {/* Type badge */}
              <div
                className="text-[10px] mt-1 inline-block px-1.5 py-0.5 rounded"
                style={{
                  backgroundColor: tConfig.bg,
                  color: tConfig.color,
                }}
              >
                {tConfig.label}
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  // Full cell render for highlighting days with lectures
  const fullCellRender = (date) => {
    const lectures = getLecturesForDate(date);
    const isToday = date.isSame(dayjs(), "day");
    const hasLectures = lectures.length > 0;

    return (
      <div
        className="ant-picker-cell-inner ant-picker-calendar-date relative"
        style={{
          backgroundColor: hasLectures ? "#f0f5ff" : undefined,
          borderRadius: "8px",
          minHeight: "100px",
          padding: "4px",
          border: hasLectures ? "1px solid #d6e4ff" : undefined,
        }}
      >
        {/* Day number */}
        <div
          className={`
            ant-picker-calendar-date-value
            ${hasLectures ? "font-bold text-primary" : ""}
            ${isToday ? "bg-primary text-white! rounded-full w-7 h-7 flex items-center justify-center mx-auto" : ""}
          `}
        >
          {date.date()}
        </div>

        {/* Lectures */}
        <div className="ant-picker-calendar-date-content mt-1">
          {dateCellRender(date)}
        </div>

        {/* Badge for multiple lectures */}
        {hasLectures && lectures.length > 1 && (
          <Badge
            count={lectures.length}
            size="small"
            style={{
              position: "absolute",
              top: 2,
              right: 2,
              backgroundColor: "#5046c4",
            }}
          />
        )}

        {/* Add button on hover for empty days */}
        {!hasLectures && (
          <div
            className="absolute inset-0 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity cursor-pointer"
            onClick={(e) => {
              e.stopPropagation();
              openScheduleModal(date);
            }}
          >
            <div className="bg-primary/10 hover:bg-primary/20 rounded-lg p-2 transition-colors">
              <Plus size={16} className="text-primary" />
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" onClick={goBack} className="!p-2">
            <ArrowLeft size={20} />
          </Button>
          <Avatar size={48} style={{ backgroundColor: "#5046c4" }}>
            {doctor.name
              .split(" ")
              .map((n) => n[0])
              .join("")
              .slice(0, 2)}
          </Avatar>
          <div>
            <h1 className="text-xl font-bold">{doctor.name}</h1>
            <p className="text-gray-500">
              {doctor.specialization} • {doctor.department}
            </p>
          </div>
        </div>
        <Button
          variant="primary"
          onClick={() => openScheduleModal(dayjs())}
          className="flex items-center gap-2"
        >
          <Plus size={18} />
          Schedule Lecture
        </Button>
      </div>

      {/* Legend */}
      <Card size="small">
        <div className="flex gap-6 justify-center flex-wrap">
          <div className="flex items-center gap-4">
            <span className="text-sm font-medium text-gray-600">Status:</span>
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
          <div className="border-l pl-4 flex items-center gap-4">
            <span className="text-sm font-medium text-gray-600">Type:</span>
            {Object.entries(typeConfig).map(([key, config]) => (
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
        </div>
      </Card>

      {/* Calendar */}
      <Card className="calendar-card">
        <Calendar
          fullCellRender={fullCellRender}
          defaultValue={dayjs("2026-03-15")}
        />
      </Card>

      {/* View Lecture Modal */}
      <Modal
        title={
          <span className="flex items-center gap-2 text-primary">
            <CalendarIcon size={20} />
            Lecture Details
          </span>
        }
        open={viewModalVisible}
        onCancel={closeViewModal}
        footer={
          <div className="flex justify-between">
            <Button
              variant="ghost"
              danger
              onClick={() => openDeleteModal(selectedLecture)}
            >
              <Trash2 size={16} />
              Delete
            </Button>
            <div className="flex gap-2">
              <Button variant="ghost" onClick={closeViewModal}>
                Close
              </Button>
              <Button
                variant="primary"
                onClick={() => openEditModal(selectedLecture)}
              >
                <Edit size={16} />
                Edit
              </Button>
            </div>
          </div>
        }
        width={500}
      >
        {selectedLecture && (
          <div className="py-4">
            {/* Title & Status */}
            <div className="flex items-start justify-between mb-4">
              <h3 className="text-lg font-bold">{selectedLecture.title}</h3>
              <div className="flex gap-2">
                <Tag
                  style={{
                    backgroundColor: statusConfig[selectedLecture.status].bg,
                    color: statusConfig[selectedLecture.status].color,
                    border: `1px solid ${statusConfig[selectedLecture.status].color}`,
                  }}
                >
                  {statusConfig[selectedLecture.status].label}
                </Tag>
                <Tag
                  style={{
                    backgroundColor: typeConfig[selectedLecture.type].bg,
                    color: typeConfig[selectedLecture.type].color,
                    border: `1px solid ${typeConfig[selectedLecture.type].color}`,
                  }}
                >
                  {typeConfig[selectedLecture.type].label}
                </Tag>
              </div>
            </div>

            {/* Details */}
            <div className="space-y-3 bg-gray-50 rounded-lg p-4">
              <div className="flex items-center gap-3 text-gray-600">
                <CalendarIcon size={18} className="text-gray-400" />
                <span>
                  {dayjs(selectedLecture.date).format("dddd, MMMM DD, YYYY")}
                </span>
              </div>

              <div className="flex items-center gap-3 text-gray-600">
                <Clock size={18} className="text-gray-400" />
                <span>
                  {selectedLecture.time} • {selectedLecture.duration} minutes
                </span>
              </div>

              <div className="flex items-center gap-3 text-gray-600">
                <MapPin size={18} className="text-gray-400" />
                <span>{selectedLecture.location}</span>
              </div>

              <div className="flex items-center gap-3 text-gray-600">
                <Users size={18} className="text-gray-400" />
                <span>{selectedLecture.students?.length || 0} students</span>
              </div>
            </div>

            {/* Students */}
            {selectedLecture.students?.length > 0 && (
              <div className="mt-4">
                <h4 className="text-sm font-semibold text-gray-700 mb-2">
                  Enrolled Students
                </h4>
                <div className="flex flex-wrap gap-2">
                  {selectedLecture.students.map((student, index) => (
                    <Tag key={index} className="rounded-full">
                      {student}
                    </Tag>
                  ))}
                </div>
              </div>
            )}

            {/* Description */}
            {selectedLecture.description && (
              <div className="mt-4">
                <h4 className="text-sm font-semibold text-gray-700 mb-2">
                  Description
                </h4>
                <p className="text-gray-600 text-sm">
                  {selectedLecture.description}
                </p>
              </div>
            )}

            {/* Quick Actions */}
            {selectedLecture.status === "upcoming" && (
              <div className="mt-4 pt-4 border-t flex gap-2">
                <Button
                  variant="ghost"
                  className="flex-1"
                  onClick={() => {
                    markAsCompleted(selectedLecture);
                    closeViewModal();
                  }}
                >
                  <CheckCircle size={16} className="text-green-500" />
                  Mark Completed
                </Button>
                <Button
                  variant="ghost"
                  className="flex-1"
                  onClick={() => {
                    cancelLecture(selectedLecture);
                    closeViewModal();
                  }}
                >
                  <XCircle size={16} className="text-red-500" />
                  Cancel
                </Button>
              </div>
            )}
          </div>
        )}
      </Modal>

      {/* Schedule/Edit Modal */}
      <ScheduleModal
        open={scheduleModalVisible}
        onClose={closeScheduleModal}
        onSubmit={isEditMode ? updateLecture : addLecture}
        lecture={isEditMode ? selectedLecture : null}
        initialDate={selectedDate}
        isEdit={isEditMode}
      />

      {/* Delete Modal */}
      <DeleteLectureModal
        open={deleteModalVisible}
        onClose={closeDeleteModal}
        lecture={selectedLecture}
        onConfirm={deleteLecture}
      />
    </div>
  );
};

export default DoctorCalendar;

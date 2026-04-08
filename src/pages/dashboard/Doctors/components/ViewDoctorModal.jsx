import { Modal, Button, Tag, Divider } from "antd";
import {
  Mail,
  Phone,
  Calendar,
  Clock,
  Building,
  Stethoscope,
  BookOpen,
  Edit,
  Trash2,
  CalendarDays,
} from "lucide-react";

const ViewDoctorModal = ({
  open,
  onClose,
  doctor,
  onEdit,
  onDelete,
  onViewCalendar,
}) => {
  if (!doctor) return null;

  const statusConfig = {
    active: { color: "#52c41a", bg: "#f6ffed", label: "Active" },
    inactive: { color: "#ff4d4f", bg: "#fff2f0", label: "Inactive" },
    onLeave: { color: "#faad14", bg: "#fffbe6", label: "On Leave" },
  };

  const config = statusConfig[doctor.status] || statusConfig.active;

  const upcomingLectures =
    doctor.lectures?.filter((l) => l.status === "upcoming").length || 0;
  const completedLectures =
    doctor.lectures?.filter((l) => l.status === "completed").length || 0;

  return (
    <Modal
      open={open}
      onCancel={onClose}
      footer={null}
      width={600}
      className="doctor-view-modal"
    >
      {/* Header */}
      <div className="flex items-start gap-4 mb-6">
        <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center">
          <span className="text-primary text-2xl font-bold">
            {doctor.name
              .split(" ")
              .map((n) => n[0])
              .join("")
              .slice(0, 2)}
          </span>
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-3">
            <h2 className="text-xl font-bold text-gray-900">{doctor.name}</h2>
            <Tag color={config.color}>{config.label}</Tag>
          </div>
          <p className="text-gray-600 mt-1">{doctor.specialization}</p>
          <p className="text-sm text-gray-500">{doctor.department}</p>
        </div>
      </div>

      {/* Contact Info */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
          <Mail className="w-5 h-5 text-gray-400" />
          <div>
            <p className="text-xs text-gray-500">Email</p>
            <p className="text-sm font-medium">{doctor.email}</p>
          </div>
        </div>
        <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
          <Phone className="w-5 h-5 text-gray-400" />
          <div>
            <p className="text-xs text-gray-500">Phone</p>
            <p className="text-sm font-medium">{doctor.phone}</p>
          </div>
        </div>
        <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
          <Clock className="w-5 h-5 text-gray-400" />
          <div>
            <p className="text-xs text-gray-500">Office Hours</p>
            <p className="text-sm font-medium">{doctor.officeHours}</p>
          </div>
        </div>
        <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
          <Calendar className="w-5 h-5 text-gray-400" />
          <div>
            <p className="text-xs text-gray-500">Join Date</p>
            <p className="text-sm font-medium">
              {new Date(doctor.joinDate).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </p>
          </div>
        </div>
      </div>

      {/* Bio */}
      {doctor.bio && (
        <div className="mb-6">
          <h3 className="text-sm font-semibold text-gray-700 mb-2">About</h3>
          <p className="text-gray-600 text-sm">{doctor.bio}</p>
        </div>
      )}

      <Divider />

      {/* Lectures Stats */}
      <div className="mb-6">
        <h3 className="text-sm font-semibold text-gray-700 mb-3">
          Lectures Overview
        </h3>
        <div className="grid grid-cols-3 gap-3">
          <div className="text-center p-3 bg-blue-50 rounded-lg">
            <BookOpen className="w-5 h-5 text-blue-500 mx-auto mb-1" />
            <p className="text-lg font-bold text-blue-600">
              {doctor.lectures?.length || 0}
            </p>
            <p className="text-xs text-gray-500">Total</p>
          </div>
          <div className="text-center p-3 bg-green-50 rounded-lg">
            <CalendarDays className="w-5 h-5 text-green-500 mx-auto mb-1" />
            <p className="text-lg font-bold text-green-600">
              {upcomingLectures}
            </p>
            <p className="text-xs text-gray-500">Upcoming</p>
          </div>
          <div className="text-center p-3 bg-purple-50 rounded-lg">
            <Stethoscope className="w-5 h-5 text-purple-500 mx-auto mb-1" />
            <p className="text-lg font-bold text-purple-600">
              {completedLectures}
            </p>
            <p className="text-xs text-gray-500">Completed</p>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center justify-between pt-4 border-t">
        <Button
          type="primary"
          icon={<CalendarDays className="w-4 h-4" />}
          onClick={() => onViewCalendar(doctor)}
        >
          View Calendar
        </Button>
        <div className="flex gap-2">
          <Button
            icon={<Edit className="w-4 h-4" />}
            onClick={() => onEdit(doctor)}
          >
            Edit
          </Button>
          <Button
            danger
            icon={<Trash2 className="w-4 h-4" />}
            onClick={() => onDelete(doctor)}
          >
            Delete
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default ViewDoctorModal;

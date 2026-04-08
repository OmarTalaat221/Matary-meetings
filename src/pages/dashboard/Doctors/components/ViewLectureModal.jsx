import { Modal, Button, Tag, Divider } from "antd";
import {
  Calendar,
  Clock,
  MapPin,
  Users,
  Edit,
  Trash2,
  BookOpen,
  User,
} from "lucide-react";
import dayjs from "dayjs";

const ViewLectureModal = ({
  open,
  onClose,
  lecture,
  doctor,
  onEdit,
  onDelete,
  lectureStatusConfig,
  lectureTypeConfig,
}) => {
  if (!lecture) return null;

  const statusConf = lectureStatusConfig[lecture.status];
  const typeConf = lectureTypeConfig[lecture.type];

  return (
    <Modal open={open} onCancel={onClose} footer={null} width={500}>
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-2">
          <Tag
            style={{
              backgroundColor: statusConf.bg,
              color: statusConf.color,
              border: "none",
            }}
          >
            {statusConf.label}
          </Tag>
          <Tag
            style={{
              backgroundColor: typeConf.bg,
              color: typeConf.color,
              border: "none",
            }}
          >
            {typeConf.label}
          </Tag>
        </div>
        <h2 className="text-xl font-bold text-gray-900">{lecture.title}</h2>
      </div>

      {/* Details */}
      <div className="space-y-4 mb-6">
        <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
          <User className="w-5 h-5 text-gray-400" />
          <div>
            <p className="text-xs text-gray-500">Doctor</p>
            <p className="text-sm font-medium">{doctor?.name}</p>
          </div>
        </div>

        <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
          <Calendar className="w-5 h-5 text-gray-400" />
          <div>
            <p className="text-xs text-gray-500">Date</p>
            <p className="text-sm font-medium">
              {dayjs(lecture.date).format("dddd, MMMM D, YYYY")}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
          <Clock className="w-5 h-5 text-gray-400" />
          <div>
            <p className="text-xs text-gray-500">Time & Duration</p>
            <p className="text-sm font-medium">
              {lecture.time} • {lecture.duration} minutes
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
          <MapPin className="w-5 h-5 text-gray-400" />
          <div>
            <p className="text-xs text-gray-500">Location</p>
            <p className="text-sm font-medium">{lecture.location}</p>
          </div>
        </div>
      </div>

      {/* Students */}
      {lecture.students && lecture.students.length > 0 && (
        <div className="mb-6">
          <h3 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
            <Users className="w-4 h-4" />
            Students ({lecture.students.length})
          </h3>
          <div className="flex flex-wrap gap-2">
            {lecture.students.map((student, index) => (
              <Tag key={index} className="rounded-full">
                {student}
              </Tag>
            ))}
          </div>
        </div>
      )}

      {/* Description */}
      {lecture.description && (
        <div className="mb-6">
          <h3 className="text-sm font-semibold text-gray-700 mb-2">
            Description
          </h3>
          <p className="text-gray-600 text-sm">{lecture.description}</p>
        </div>
      )}

      <Divider />

      {/* Actions */}
      <div className="flex items-center justify-end gap-2">
        <Button
          icon={<Edit className="w-4 h-4" />}
          onClick={() => onEdit(lecture)}
        >
          Edit
        </Button>
        <Button
          danger
          icon={<Trash2 className="w-4 h-4" />}
          onClick={() => onDelete(lecture)}
        >
          Delete
        </Button>
      </div>
    </Modal>
  );
};

export default ViewLectureModal;

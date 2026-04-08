// src/pages/dashboard/Meetings/components/ViewMeetingModal.jsx
import { Modal, Tag, Descriptions, Space } from "antd";
import {
  Video,
  Calendar,
  Clock,
  Users,
  User,
  FileText,
  Link as LinkIcon,
  ExternalLink,
  Edit,
} from "lucide-react";
import Button from "../../../../components/common/Button";

const ViewMeetingModal = ({ open, onClose, meeting, statusConfig, onEdit }) => {
  if (!meeting) return null;

  const typeLabels = {
    standup: "Standup",
    review: "Review",
    planning: "Planning",
    client: "Client",
    internal: "Internal",
    training: "Training",
  };

  return (
    <Modal
      title={
        <div className="flex items-center gap-3 pb-4 border-b">
          <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
            <Video className="w-5 h-5 text-primary" />
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-semibold">{meeting.title}</h3>
            <Tag color={statusConfig[meeting.status]?.color}>
              {statusConfig[meeting.status]?.label}
            </Tag>
          </div>
        </div>
      }
      open={open}
      onCancel={onClose}
      footer={
        <Space>
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
          {meeting.link && (
            <Button
              variant="secondary"
              onClick={() => window.open(meeting.link, "_blank")}
            >
              <ExternalLink className="w-4 h-4" />
              Join Meeting
            </Button>
          )}
        </Space>
      }
      width={600}
    >
      <Descriptions
        column={1}
        className="mt-4"
        bordered
        size="small"
        labelStyle={{ width: "140px", fontWeight: 500 }}
      >
        <Descriptions.Item
          label={
            <span className="flex items-center gap-2">
              <Calendar className="w-4 h-4" /> Date
            </span>
          }
        >
          {meeting.date}
        </Descriptions.Item>

        <Descriptions.Item
          label={
            <span className="flex items-center gap-2">
              <Clock className="w-4 h-4" /> Time
            </span>
          }
        >
          {meeting.time}
        </Descriptions.Item>

        <Descriptions.Item
          label={
            <span className="flex items-center gap-2">
              <Clock className="w-4 h-4" /> Duration
            </span>
          }
        >
          {meeting.duration} minutes
        </Descriptions.Item>

        <Descriptions.Item
          label={
            <span className="flex items-center gap-2">
              <User className="w-4 h-4" /> Organizer
            </span>
          }
        >
          {meeting.organizer}
        </Descriptions.Item>

        <Descriptions.Item
          label={
            <span className="flex items-center gap-2">
              <Users className="w-4 h-4" /> Participants
            </span>
          }
        >
          {meeting.participants} participants
        </Descriptions.Item>

        {meeting.type && (
          <Descriptions.Item
            label={
              <span className="flex items-center gap-2">
                <FileText className="w-4 h-4" /> Type
              </span>
            }
          >
            <Tag>{typeLabels[meeting.type] || meeting.type}</Tag>
          </Descriptions.Item>
        )}

        {meeting.description && (
          <Descriptions.Item
            label={
              <span className="flex items-center gap-2">
                <FileText className="w-4 h-4" /> Description
              </span>
            }
          >
            {meeting.description}
          </Descriptions.Item>
        )}

        {meeting.link && (
          <Descriptions.Item
            label={
              <span className="flex items-center gap-2">
                <LinkIcon className="w-4 h-4" /> Link
              </span>
            }
          >
            <a
              href={meeting.link}
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline flex items-center gap-1"
            >
              {meeting.link}
              <ExternalLink className="w-3 h-3" />
            </a>
          </Descriptions.Item>
        )}
      </Descriptions>
    </Modal>
  );
};

export default ViewMeetingModal;

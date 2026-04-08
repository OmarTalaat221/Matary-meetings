// src/pages/dashboard/Users/components/ViewUserModal.jsx
import { Modal, Descriptions, Tag, Avatar, Space } from "antd";
import { Edit, Calendar } from "lucide-react";
import dayjs from "dayjs";
import Button from "../../../../components/common/Button";
import { statuses } from "../useUsersData";

const ViewUserModal = ({ open, onCancel, user, onEdit, onViewCalendar }) => {
  if (!user) return null;

  const statusInfo = statuses.find((s) => s.value === user.status);

  return (
    <Modal
      title="Student Details"
      open={open}
      onCancel={onCancel}
      footer={
        <Space>
          <Button variant="outline" onClick={onCancel}>
            Close
          </Button>
          <Button variant="secondary" onClick={onViewCalendar}>
            <Calendar size={16} /> Schedule
          </Button>
          <Button onClick={onEdit}>
            <Edit size={16} /> Edit
          </Button>
        </Space>
      }
      width={500}
    >
      <div className="flex items-center gap-4 mb-6 mt-4">
        <Avatar size={64} style={{ backgroundColor: "#1890ff" }}>
          {user.name.charAt(0)}
        </Avatar>
        <div>
          <h2 className="text-lg font-bold">{user.name}</h2>
          <Tag color={statusInfo?.color}>{statusInfo?.label}</Tag>
        </div>
      </div>

      <Descriptions column={1} bordered size="small">
        <Descriptions.Item label="Email">{user.email}</Descriptions.Item>
        <Descriptions.Item label="Phone">{user.phone || "-"}</Descriptions.Item>
        <Descriptions.Item label="Level">{user.level}</Descriptions.Item>
        <Descriptions.Item label="Join Date">
          {dayjs(user.joinDate).format("MM/DD/YYYY")}
        </Descriptions.Item>
        <Descriptions.Item label="Lectures">
          {user.meetings.length} lectures
        </Descriptions.Item>
      </Descriptions>
    </Modal>
  );
};

export default ViewUserModal;

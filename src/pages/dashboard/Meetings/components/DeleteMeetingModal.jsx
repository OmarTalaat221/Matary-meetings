// src/pages/dashboard/Meetings/components/DeleteMeetingModal.jsx
import { Modal } from "antd";
import { AlertTriangle } from "lucide-react";

const DeleteMeetingModal = ({
  open,
  onClose,
  onConfirm,
  loading,
  meetingTitle,
  isBulk = false,
  bulkCount = 0,
}) => {
  return (
    <Modal
      open={open}
      onCancel={onClose}
      onOk={onConfirm}
      okText="Delete"
      cancelText="Cancel"
      okButtonProps={{ danger: true, loading }}
      width={400}
      centered
    >
      <div className="text-center py-4">
        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <AlertTriangle className="w-8 h-8 text-red-500" />
        </div>
        <h3 className="text-lg font-semibold text-gray-800 mb-2">
          {isBulk ? "Delete Meetings" : "Delete Meeting"}
        </h3>
        <p className="text-gray-600">
          {isBulk
            ? `Are you sure you want to delete ${bulkCount} meetings?`
            : "Are you sure you want to delete this meeting?"}
          {meetingTitle && (
            <span className="block mt-2 font-medium text-gray-800">
              "{meetingTitle}"
            </span>
          )}
        </p>
        <p className="text-sm text-gray-500 mt-3">
          This action cannot be undone.
        </p>
      </div>
    </Modal>
  );
};

export default DeleteMeetingModal;

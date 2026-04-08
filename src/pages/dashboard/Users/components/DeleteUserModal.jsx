// src/pages/dashboard/Users/components/DeleteUserModal.jsx
import { Modal } from "antd";
import { AlertTriangle } from "lucide-react";

const DeleteUserModal = ({
  open,
  onCancel,
  onConfirm,
  loading,
  user,
  count = 0,
}) => {
  return (
    <Modal
      title={
        <span className="flex items-center gap-2 text-red-600">
          <AlertTriangle size={20} />
          Confirm Delete
        </span>
      }
      open={open}
      onCancel={onCancel}
      onOk={onConfirm}
      okText="Delete"
      cancelText="Cancel"
      okButtonProps={{ danger: true, loading }}
    >
      <p className="py-4">
        {count > 0
          ? `Are you sure you want to delete ${count} students?`
          : `Are you sure you want to delete "${user?.name}"?`}
      </p>
    </Modal>
  );
};

export default DeleteUserModal;

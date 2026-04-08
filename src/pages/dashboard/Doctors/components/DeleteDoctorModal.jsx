import { Modal } from "antd";
import { AlertTriangle } from "lucide-react";

const DeleteDoctorModal = ({ open, onClose, doctor, onConfirm }) => {
  if (!doctor) return null;

  return (
    <Modal
      open={open}
      onCancel={onClose}
      onOk={onConfirm}
      okText="Delete"
      okButtonProps={{ danger: true }}
      cancelText="Cancel"
      width={400}
      title={null}
      closable={false}
    >
      <div className="text-center py-4">
        <div className="w-16 h-16 mx-auto mb-4 bg-red-100 rounded-full flex items-center justify-center">
          <AlertTriangle className="w-8 h-8 text-red-500" />
        </div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          Delete Doctor
        </h3>
        <p className="text-gray-600 mb-2">Are you sure you want to delete</p>
        <p className="font-semibold text-gray-900 mb-4">"{doctor.name}"?</p>
        {doctor.lectures?.length > 0 && (
          <div className="bg-yellow-50 text-yellow-700 p-3 rounded-lg text-sm">
            Warning: This doctor has {doctor.lectures.length} scheduled
            lecture(s). All lectures will be deleted.
          </div>
        )}
      </div>
    </Modal>
  );
};

export default DeleteDoctorModal;

import { Modal } from "antd";
import { AlertTriangle } from "lucide-react";
import dayjs from "dayjs";

const DeleteLectureModal = ({ open, onClose, lecture, onConfirm }) => {
  if (!lecture) return null;

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
          Delete Lecture
        </h3>
        <p className="text-gray-600 mb-2">Are you sure you want to delete</p>
        <p className="font-semibold text-gray-900 mb-1">"{lecture.title}"</p>
        <p className="text-sm text-gray-500">
          {dayjs(lecture.date).format("MMMM D, YYYY")} at {lecture.time}
        </p>
        {lecture.students?.length > 0 && (
          <div className="mt-4 bg-yellow-50 text-yellow-700 p-3 rounded-lg text-sm">
            Warning: This lecture has {lecture.students.length} enrolled
            student(s).
          </div>
        )}
      </div>
    </Modal>
  );
};

export default DeleteLectureModal;

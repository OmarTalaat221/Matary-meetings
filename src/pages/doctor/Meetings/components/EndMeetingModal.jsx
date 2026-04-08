import { Modal } from "antd";
import { User, CheckCircle, XCircle } from "lucide-react";
import Button from "../../../../components/common/Button";

const EndMeetingModal = ({ open, onClose, onSubmit, slot }) => {
  return (
    <Modal
      open={open}
      title="End Meeting"
      onCancel={onClose}
      footer={null}
      width={400}
    >
      {slot && (
        <div className="py-4">
          {/* Student Info */}
          <div className="mb-6 p-4 bg-gray-50 rounded-lg text-center">
            <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-2">
              <User size={24} className="text-emerald-600" />
            </div>
            <p className="font-medium">{slot.student?.name}</p>
            <p className="text-sm text-gray-500">{slot.student?.email}</p>
          </div>

          <p className="text-center text-gray-600 mb-6">
            Did the student attend the meeting?
          </p>

          {/* Action Buttons */}
          <div className="grid grid-cols-2 gap-4">
            <Button
              variant="ghost"
              onClick={() => onSubmit(false)}
              className="!border-red-200 !text-red-600 hover:!bg-red-50 flex-col !py-6"
            >
              <XCircle size={32} className="mb-2" />
              <span>No Show</span>
            </Button>

            <Button
              variant="primary"
              onClick={() => onSubmit(true)}
              className="!bg-green-600 hover:!bg-green-700 flex-col !py-6"
            >
              <CheckCircle size={32} className="mb-2" />
              <span>Attended</span>
            </Button>
          </div>
        </div>
      )}
    </Modal>
  );
};

export default EndMeetingModal;

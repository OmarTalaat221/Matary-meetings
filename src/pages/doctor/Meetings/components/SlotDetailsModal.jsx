// src/pages/doctor/Meetings/components/SlotDetailsModal.jsx
import { Modal, Tag, Divider, Popconfirm } from "antd";
import { Clock, Trash2, Edit3, Calendar, CheckCircle } from "lucide-react";
import {
  slotStatusConfig,
  calculateDuration,
  formatDuration,
} from "../useMeetingsData";
import Button from "../../../../components/common/Button";

const SlotDetailsModal = ({
  open,
  onClose,
  slot,
  dayKey,
  dayLabel,
  onRemoveSlot,
  onEditSlot,
}) => {
  if (!slot) return null;

  const config = slotStatusConfig[slot.status];
  const duration = calculateDuration(slot.startTime, slot.endTime);

  return (
    <Modal open={open} onCancel={onClose} footer={null} width={400} centered>
      {/* Header */}
      <div className="text-center pb-4">
        <div
          className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4"
          style={{ backgroundColor: config.bg }}
        >
          <Clock size={32} style={{ color: config.color }} />
        </div>

        <Tag color={config.color} className="mb-3">
          {config.label}
        </Tag>

        <h2 className="text-2xl font-bold text-gray-900">
          {slot.startTime} - {slot.endTime}
        </h2>

        <p className="text-gray-500 mt-1">{dayLabel}</p>
      </div>

      <Divider className="my-4" />

      {/* Details */}
      <div className="space-y-3">
        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
          <div className="flex items-center gap-3 text-gray-600">
            <Clock size={18} />
            <span>Duration</span>
          </div>
          <span className="font-semibold text-gray-900">
            {formatDuration(duration)}
          </span>
        </div>

        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
          <div className="flex items-center gap-3 text-gray-600">
            <Calendar size={18} />
            <span>Status</span>
          </div>
          <span className="font-semibold" style={{ color: config.color }}>
            {config.description}
          </span>
        </div>
      </div>

      <Divider className="my-4" />

      {/* Actions */}
      {slot.status === "available" && (
        <div className="space-y-3">
          <Button
            variant="ghost"
            className="w-full !border-gray-200 hover:!bg-gray-50"
            onClick={() => {
              onEditSlot(dayKey, slot);
              onClose();
            }}
          >
            <Edit3 size={18} className="mr-2" />
            Edit Time Slot
          </Button>

          <Popconfirm
            title="Remove this time slot?"
            description="This action cannot be undone."
            onConfirm={() => {
              onRemoveSlot(dayKey, slot.id);
              onClose();
            }}
            okText="Yes, Remove"
            cancelText="Cancel"
            okButtonProps={{ danger: true }}
          >
            <Button
              variant="ghost"
              className="w-full !border-red-200 !text-red-600 hover:!bg-red-50"
            >
              <Trash2 size={18} className="mr-2" />
              Remove Slot
            </Button>
          </Popconfirm>
        </div>
      )}

      {/* Info for non-available slots */}
      {slot.status !== "available" && (
        <div className="p-4 bg-blue-50 rounded-xl text-center">
          <CheckCircle size={20} className="mx-auto mb-2 text-blue-500" />
          <p className="text-sm text-blue-700">
            This slot is {config.label.toLowerCase()} and cannot be modified.
          </p>
        </div>
      )}
    </Modal>
  );
};

export default SlotDetailsModal;

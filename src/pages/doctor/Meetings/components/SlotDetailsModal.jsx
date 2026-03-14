// src/pages/doctor/Meetings/components/SlotDetailsModal.jsx
import { Modal, Tag, Divider, Popconfirm } from "antd";
import { Clock, Trash2, Edit3 } from "lucide-react";
import { slotStatusConfig, formatTimeTo12Hour } from "../useMeetingsData";
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

  return (
    <Modal open={open} onCancel={onClose} footer={null} width={380} centered>
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
          {formatTimeTo12Hour(slot.startTime)} -{" "}
          {formatTimeTo12Hour(slot.endTime)}
        </h2>

        <p className="text-gray-500 mt-1">Every {dayLabel}</p>
      </div>

      <Divider className="my-4" />

      {/* Actions */}
      <div className="space-y-3">
        <Button
          variant="ghost"
          className="w-full !border-gray-200 hover:!bg-gray-50"
          onClick={onEditSlot}
        >
          <Edit3 size={18} className="mr-2" />
          Edit Day Schedule
        </Button>

        <Popconfirm
          title="Remove this time slot?"
          description="This will remove it from your weekly schedule."
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
    </Modal>
  );
};

export default SlotDetailsModal;

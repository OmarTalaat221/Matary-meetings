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
      <div className="text-center pb-4 landscape:pb-2">
        <div
          className="w-16 h-16 landscape:w-12 landscape:h-12 rounded-2xl flex items-center justify-center mx-auto mb-4 landscape:mb-2"
          style={{ backgroundColor: config.bg }}
        >
          <Clock
            size={32}
            className="landscape:w-6 landscape:h-6"
            style={{ color: config.color }}
          />
        </div>

        <Tag
          color={config.color}
          className="mb-3 landscape:mb-2 landscape:text-xs"
        >
          {config.label}
        </Tag>

        <h2 className="text-2xl landscape:text-lg font-bold text-gray-900">
          {formatTimeTo12Hour(slot.startTime)} -{" "}
          {formatTimeTo12Hour(slot.endTime)}
        </h2>

        <p className="text-gray-500 mt-1 landscape:text-xs">{dayLabel}</p>
      </div>

      <Divider className="my-4 landscape:my-2" />

      <div className="space-y-3 landscape:space-y-2">
        <Button
          variant="ghost"
          className="w-full !border-gray-200 hover:!bg-gray-50 landscape:text-xs landscape:h-8"
          onClick={onEditSlot}
        >
          <Edit3 size={18} className="mr-2 landscape:w-4 landscape:h-4" />
          Edit Day Schedule
        </Button>

        <Popconfirm
          title="Remove this time slot?"
          description="This will permanently delete it."
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
            className="w-full !border-red-200 !text-red-600 hover:!bg-red-50 landscape:text-xs landscape:h-8"
          >
            <Trash2 size={18} className="mr-2 landscape:w-4 landscape:h-4" />
            Remove Slot
          </Button>
        </Popconfirm>
      </div>
    </Modal>
  );
};

export default SlotDetailsModal;

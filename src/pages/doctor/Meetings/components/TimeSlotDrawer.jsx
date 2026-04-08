import { Drawer, Checkbox, Button, Divider } from "antd";
import { Clock, Check, X } from "lucide-react";
import { useState, useEffect } from "react";

const formatTime = (hour) => {
  if (hour === 0 || hour === 24) return "12:00 AM";
  if (hour === 12) return "12:00 PM";
  if (hour > 12) return `${hour - 12}:00 PM`;
  return `${hour}:00 AM`;
};

const generateTimeSlots = () => {
  const slots = [];
  for (let hour = 9; hour <= 23; hour++) {
    const startTime = `${hour.toString().padStart(2, "0")}:00`;
    const endHour = hour + 1;
    const endTime =
      endHour === 24 ? "00:00" : `${endHour.toString().padStart(2, "0")}:00`;
    slots.push({
      id: `slot-${hour}`,
      startTime,
      endTime,
      label: `${formatTime(hour)} - ${formatTime(endHour)}`,
    });
  }
  return slots;
};

const ALL_SLOTS = generateTimeSlots();

const SLOT_GROUPS = [
  {
    label: "Morning",
    icon: "🌅",
    slots: ALL_SLOTS.filter(
      (s) => parseInt(s.startTime) >= 9 && parseInt(s.startTime) < 12
    ),
  },
  {
    label: "Afternoon",
    icon: "☀️",
    slots: ALL_SLOTS.filter(
      (s) => parseInt(s.startTime) >= 12 && parseInt(s.startTime) < 17
    ),
  },
  {
    label: "Evening",
    icon: "🌆",
    slots: ALL_SLOTS.filter(
      (s) => parseInt(s.startTime) >= 17 && parseInt(s.startTime) < 21
    ),
  },
  {
    label: "Night",
    icon: "🌙",
    slots: ALL_SLOTS.filter(
      (s) => parseInt(s.startTime) >= 21 && parseInt(s.startTime) <= 23
    ),
  },
];

const TimeSlotDrawer = ({
  open,
  onClose,
  dayLabel,
  selectedSlots = [],
  onSave,
}) => {
  const [selected, setSelected] = useState([]);

  useEffect(() => {
    if (open) {
      const existingIds = selectedSlots.map(
        (slot) => `slot-${parseInt(slot.startTime)}`
      );
      setSelected(existingIds);
    }
  }, [open, selectedSlots]);

  const toggleSlot = (slotId) => {
    setSelected((prev) =>
      prev.includes(slotId)
        ? prev.filter((id) => id !== slotId)
        : [...prev, slotId]
    );
  };

  const selectGroup = (group) => {
    const groupIds = group.slots.map((s) => s.id);
    const allSelected = groupIds.every((id) => selected.includes(id));
    if (allSelected) {
      setSelected((prev) => prev.filter((id) => !groupIds.includes(id)));
    } else {
      setSelected((prev) => [...new Set([...prev, ...groupIds])]);
    }
  };

  const clearAll = () => setSelected([]);

  // ✅ FIXED: Only send the slots array
  const handleSave = () => {
    const slotsToSave = selected
      .map((id) => {
        const slot = ALL_SLOTS.find((s) => s.id === id);
        if (!slot) return null; // ✅ Guard against undefined
        return {
          startTime: slot.startTime,
          endTime: slot.endTime,
        };
      })
      .filter(Boolean) // ✅ Remove any null values
      .sort((a, b) => a.startTime.localeCompare(b.startTime));

    // ✅ Only send the slots array - parent handles the date
    onSave(slotsToSave);
    onClose();
  };

  return (
    <Drawer
      open={open}
      onClose={onClose}
      title={
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-emerald-100 rounded-xl flex items-center justify-center">
            <Clock size={20} className="text-emerald-600" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900 landscape:text-sm">
              Select Available Times
            </h3>
            <p className="text-sm landscape:text-xs text-gray-500 font-normal">
              {dayLabel}
            </p>
          </div>
        </div>
      }
      placement="right"
      width={420}
      footer={
        <div className="flex gap-3 landscape:p-2">
          <Button
            onClick={clearAll}
            className="flex-1 landscape:text-xs"
            icon={<X size={16} />}
          >
            Clear All
          </Button>
          <Button
            type="primary"
            onClick={handleSave}
            className="flex-1 !bg-emerald-600 hover:!bg-emerald-700 landscape:text-xs"
            icon={<Check size={16} />}
          >
            Save ({selected.length} slots)
          </Button>
        </div>
      }
    >
      <div className="space-y-6 landscape:space-y-3">
        <div className="p-4 landscape:p-3 bg-emerald-50 rounded-xl border border-emerald-100">
          <div className="flex items-center justify-between">
            <span className="text-emerald-700 font-medium landscape:text-sm">
              Selected Hours
            </span>
            <span className="text-emerald-800 font-bold text-xl landscape:text-lg">
              {selected.length}h
            </span>
          </div>
        </div>

        {SLOT_GROUPS.map((group) => {
          const groupIds = group.slots.map((s) => s.id);
          const selectedInGroup = groupIds.filter((id) =>
            selected.includes(id)
          ).length;
          const allSelected = selectedInGroup === groupIds.length;

          return (
            <div key={group.label}>
              <div
                className="flex items-center justify-between mb-3 cursor-pointer group"
                onClick={() => selectGroup(group)}
              >
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-gray-700 landscape:text-sm">
                    {group.label}
                  </span>
                  <span className="text-xs text-gray-400">
                    ({selectedInGroup}/{groupIds.length})
                  </span>
                </div>
                <Checkbox
                  checked={allSelected}
                  indeterminate={selectedInGroup > 0 && !allSelected}
                  onChange={() => selectGroup(group)}
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                {group.slots.map((slot) => {
                  const isSelected = selected.includes(slot.id);
                  return (
                    <div
                      key={slot.id}
                      onClick={() => toggleSlot(slot.id)}
                      className={`p-3 landscape:p-2 rounded-xl border-2 cursor-pointer transition-all duration-200
                        ${isSelected ? "bg-emerald-50 border-emerald-500 shadow-sm" : "bg-gray-50 border-gray-200 hover:border-emerald-300 hover:bg-emerald-50/50"}
                      `}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Clock
                            size={14}
                            className={
                              isSelected ? "text-emerald-600" : "text-gray-400"
                            }
                          />
                          <span
                            className={`text-sm landscape:text-xs font-medium ${isSelected ? "text-emerald-700" : "text-gray-600"}`}
                          >
                            {slot.label}
                          </span>
                        </div>
                        {isSelected && (
                          <div className="w-5 h-5 landscape:w-4 landscape:h-4 bg-emerald-500 rounded-full flex items-center justify-center">
                            <Check
                              size={12}
                              className="text-white landscape:w-3 landscape:h-3"
                            />
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
              <Divider className="my-4 landscape:my-2" />
            </div>
          );
        })}
      </div>
    </Drawer>
  );
};

export default TimeSlotDrawer;

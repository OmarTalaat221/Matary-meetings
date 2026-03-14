// src/pages/doctor/Meetings/components/TimeSlotDrawer.jsx
import { Drawer, Checkbox, Button, Divider } from "antd";
import { Clock, Check, X } from "lucide-react";
import { useState, useEffect } from "react";

// Generate 1-hour slots from 9 AM to 12 AM (midnight)
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

// Format time to 12-hour format
const formatTime = (hour) => {
  if (hour === 0 || hour === 24) return "12:00 AM";
  if (hour === 12) return "12:00 PM";
  if (hour > 12) return `${hour - 12}:00 PM`;
  return `${hour}:00 AM`;
};

const ALL_SLOTS = generateTimeSlots();

// Group slots by period
const SLOT_GROUPS = [
  {
    label: "Morning",
    icon: "🌅",
    slots: ALL_SLOTS.filter((s) => {
      const hour = parseInt(s.startTime);
      return hour >= 9 && hour < 12;
    }),
  },
  {
    label: "Afternoon",
    icon: "☀️",
    slots: ALL_SLOTS.filter((s) => {
      const hour = parseInt(s.startTime);
      return hour >= 12 && hour < 17;
    }),
  },
  {
    label: "Evening",
    icon: "🌆",
    slots: ALL_SLOTS.filter((s) => {
      const hour = parseInt(s.startTime);
      return hour >= 17 && hour < 21;
    }),
  },
  {
    label: "Night",
    icon: "🌙",
    slots: ALL_SLOTS.filter((s) => {
      const hour = parseInt(s.startTime);
      return hour >= 21 && hour <= 23;
    }),
  },
];

const TimeSlotDrawer = ({
  open,
  onClose,
  dayKey,
  dayLabel,
  selectedSlots = [],
  onSave,
}) => {
  const [selected, setSelected] = useState([]);

  // Initialize selected slots when drawer opens
  useEffect(() => {
    if (open) {
      // Convert existing slots to slot IDs
      const existingIds = selectedSlots.map((slot) => {
        const hour = parseInt(slot.startTime);
        return `slot-${hour}`;
      });
      setSelected(existingIds);
    }
  }, [open, selectedSlots]);

  // Toggle slot selection
  const toggleSlot = (slotId) => {
    setSelected((prev) => {
      if (prev.includes(slotId)) {
        return prev.filter((id) => id !== slotId);
      } else {
        return [...prev, slotId];
      }
    });
  };

  // Select all slots in a group
  const selectGroup = (group) => {
    const groupIds = group.slots.map((s) => s.id);
    const allSelected = groupIds.every((id) => selected.includes(id));

    if (allSelected) {
      // Deselect all in group
      setSelected((prev) => prev.filter((id) => !groupIds.includes(id)));
    } else {
      // Select all in group
      setSelected((prev) => [...new Set([...prev, ...groupIds])]);
    }
  };

  // Clear all
  const clearAll = () => setSelected([]);

  // Handle save
  const handleSave = () => {
    // Convert selected IDs back to slot objects
    const slotsToSave = selected
      .map((id) => {
        const slot = ALL_SLOTS.find((s) => s.id === id);
        return {
          startTime: slot.startTime,
          endTime: slot.endTime,
        };
      })
      .sort((a, b) => a.startTime.localeCompare(b.startTime));

    onSave(dayKey, slotsToSave);
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
            <h3 className="font-semibold text-gray-900">
              Select Available Times
            </h3>
            <p className="text-sm text-gray-500 font-normal">{dayLabel}</p>
          </div>
        </div>
      }
      placement="right"
      width={420}
      footer={
        <div className="flex gap-3">
          <Button onClick={clearAll} className="flex-1" icon={<X size={16} />}>
            Clear All
          </Button>
          <Button
            type="primary"
            onClick={handleSave}
            className="flex-1 !bg-emerald-600 hover:!bg-emerald-700"
            icon={<Check size={16} />}
          >
            Save ({selected.length} slots)
          </Button>
        </div>
      }
    >
      <div className="space-y-6">
        {/* Quick Stats */}
        <div className="p-4 bg-emerald-50 rounded-xl border border-emerald-100">
          <div className="flex items-center justify-between">
            <span className="text-emerald-700 font-medium">Selected Hours</span>
            <span className="text-emerald-800 font-bold text-xl">
              {selected.length}h
            </span>
          </div>
        </div>

        {/* Slot Groups */}
        {SLOT_GROUPS.map((group) => {
          const groupIds = group.slots.map((s) => s.id);
          const selectedInGroup = groupIds.filter((id) =>
            selected.includes(id)
          ).length;
          const allSelected = selectedInGroup === groupIds.length;

          return (
            <div key={group.label}>
              {/* Group Header */}
              <div
                className="flex items-center justify-between mb-3 cursor-pointer group"
                onClick={() => selectGroup(group)}
              >
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-gray-700">
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

              {/* Slots Grid */}
              <div className="grid grid-cols-2 gap-2">
                {group.slots.map((slot) => {
                  const isSelected = selected.includes(slot.id);

                  return (
                    <div
                      key={slot.id}
                      onClick={() => toggleSlot(slot.id)}
                      className={`
                        p-3 rounded-xl border-2 cursor-pointer transition-all duration-200
                        ${
                          isSelected
                            ? "bg-emerald-50 border-emerald-500 shadow-sm"
                            : "bg-gray-50 border-gray-200 hover:border-emerald-300 hover:bg-emerald-50/50"
                        }
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
                            className={`text-sm font-medium ${
                              isSelected ? "text-emerald-700" : "text-gray-600"
                            }`}
                          >
                            {slot.label}
                          </span>
                        </div>
                        {isSelected && (
                          <div className="w-5 h-5 bg-emerald-500 rounded-full flex items-center justify-center">
                            <Check size={12} className="text-white" />
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              <Divider className="my-4" />
            </div>
          );
        })}
      </div>
    </Drawer>
  );
};

export default TimeSlotDrawer;

// src/pages/doctor/Meetings/Meetings.jsx
import { Card, Tooltip } from "antd";
import { Plus, Clock, CalendarDays, Timer, Settings } from "lucide-react";

import useMeetingsData, {
  slotStatusConfig,
  calculateDuration,
  formatDuration,
  formatTimeTo12Hour,
} from "./useMeetingsData";
import TimeSlotDrawer from "./components/TimeSlotDrawer";
import SlotDetailsModal from "./components/SlotDetailsModal";

const Meetings = () => {
  const {
    weekDates,
    weekInfo,
    stats,
    getSlotsForDay,
    saveDaySlots,
    removeTimeSlot,

    // Drawer
    drawerOpen,
    selectedDay,
    selectedDayLabel,
    openDrawer,
    closeDrawer,

    // Slot details modal
    slotDetailsModalOpen,
    selectedSlot,
    openSlotDetailsModal,
    closeModals,

    // Helpers
    resetToDefault,
    clearAllSlots,
  } = useMeetingsData();

  // Compact slot card
  const renderCompactSlot = (slot, dayKey, dayLabel) => {
    const config = slotStatusConfig[slot.status];

    return (
      <Tooltip
        key={slot.id}
        title={`${formatTimeTo12Hour(slot.startTime)} - ${formatTimeTo12Hour(slot.endTime)}`}
        placement="top"
      >
        <div
          onClick={() => openSlotDetailsModal(dayKey, slot, dayLabel)}
          className="relative p-2.5 rounded-lg border-2 cursor-pointer transition-all duration-200 hover:scale-[1.02] hover:shadow-md"
          style={{
            backgroundColor: config.bg,
            borderColor: config.color,
          }}
        >
          {/* Time Range */}
          <div className="flex items-center gap-1.5">
            <Clock size={12} style={{ color: config.color }} />
            <span className="text-xs font-bold text-gray-800">
              {formatTimeTo12Hour(slot.startTime)}
            </span>
            <span className="text-gray-400 text-xs">→</span>
            <span className="text-xs font-bold text-gray-800">
              {formatTimeTo12Hour(slot.endTime)}
            </span>
          </div>
        </div>
      </Tooltip>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Weekly Schedule</h1>
          <p className="text-gray-600">
            Set your recurring weekly availability
          </p>
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <Settings size={16} />
          <span>This schedule repeats every week</span>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="!bg-gradient-to-br from-emerald-50 to-green-100 border-0">
          <div className="text-center">
            <div className="text-3xl font-bold text-emerald-700">
              {stats.totalSlots}
            </div>
            <div className="text-sm text-emerald-600/80 mt-1">Time Slots</div>
          </div>
        </Card>
        <Card className="!bg-gradient-to-br from-blue-50 to-blue-100 border-0">
          <div className="text-center">
            <div className="text-3xl font-bold text-blue-700">
              {stats.totalHours}h
            </div>
            <div className="text-sm text-blue-600/80 mt-1">Weekly Hours</div>
          </div>
        </Card>
        <Card className="!bg-gradient-to-br from-purple-50 to-purple-100 border-0">
          <div className="text-center">
            <div className="text-3xl font-bold text-purple-700">
              {stats.daysWithSlots}
            </div>
            <div className="text-sm text-purple-600/80 mt-1">Working Days</div>
          </div>
        </Card>
        <Card className="!bg-gradient-to-br from-gray-50 to-slate-100 border-0">
          <div className="text-center">
            <div className="text-3xl font-bold text-gray-600">
              {stats.emptyDays}
            </div>
            <div className="text-sm text-gray-500 mt-1">Days Off</div>
          </div>
        </Card>
      </div>

      {/* Weekly Calendar */}
      <div className="grid grid-cols-7 gap-3">
        {weekDates.map((day) => {
          const slots = getSlotsForDay(day.key);
          const totalMinutes = slots.reduce(
            (acc, slot) =>
              acc + calculateDuration(slot.startTime, slot.endTime),
            0
          );

          return (
            <Card
              key={day.key}
              className="relative overflow-hidden transition-all hover:shadow-md"
              styles={{ body: { padding: 12 } }}
            >
              {/* Day Header */}
              <div className="text-center mb-3 pb-3 border-b border-gray-100">
                <p className="text-sm font-semibold text-gray-700">
                  {day.label}
                </p>
                {slots.length > 0 && (
                  <div className="mt-1 flex items-center justify-center gap-1 text-xs text-emerald-600">
                    <Timer size={10} />
                    <span>{formatDuration(totalMinutes)}</span>
                  </div>
                )}
              </div>

              {/* Slots */}
              <div className="space-y-2 min-h-[120px]">
                {slots.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-[120px] text-gray-300">
                    <CalendarDays size={24} className="mb-2" />
                    <p className="text-xs">Day Off</p>
                  </div>
                ) : (
                  slots.map((slot) =>
                    renderCompactSlot(slot, day.key, day.fullLabel)
                  )
                )}
              </div>

              {/* Edit Button */}
              <button
                onClick={() => openDrawer(day.key, day.label)}
                className="w-full mt-3 p-2 rounded-lg border-2 border-dashed border-gray-200 text-gray-400 text-xs font-medium hover:border-emerald-400 hover:text-emerald-500 hover:bg-emerald-50 transition-all duration-200 flex items-center justify-center gap-1"
              >
                <Plus size={14} />
                {slots.length > 0 ? "Edit" : "Add Times"}
              </button>
            </Card>
          );
        })}
      </div>

      {/* Drawer */}
      <TimeSlotDrawer
        open={drawerOpen}
        onClose={closeDrawer}
        dayKey={selectedDay}
        dayLabel={selectedDayLabel}
        selectedSlots={selectedDay ? getSlotsForDay(selectedDay) : []}
        onSave={saveDaySlots}
      />

      {/* Slot Details Modal */}
      <SlotDetailsModal
        open={slotDetailsModalOpen}
        onClose={closeModals}
        slot={selectedSlot}
        dayKey={selectedDay}
        dayLabel={selectedDayLabel}
        onRemoveSlot={removeTimeSlot}
        onEditSlot={() => {
          closeModals();
          if (selectedDay) {
            openDrawer(selectedDay, selectedDayLabel);
          }
        }}
      />
    </div>
  );
};

export default Meetings;

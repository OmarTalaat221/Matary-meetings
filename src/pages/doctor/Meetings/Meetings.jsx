// src/pages/doctor/Meetings/Meetings.jsx
import { Card, Tooltip } from "antd";
import {
  Plus,
  Clock,
  Calendar,
  CalendarDays,
  Timer,
  RefreshCw,
} from "lucide-react";
import dayjs from "dayjs";

import useMeetingsData, {
  slotStatusConfig,
  calculateDuration,
  formatDuration,
} from "./useMeetingsData";
import TimeSlotModal from "./components/TimeSlotModal";
import SlotDetailsModal from "./components/SlotDetailsModal";

const Meetings = () => {
  const {
    weekDates,
    weekInfo,
    stats,
    getSlotsForDay,
    addTimeSlot,
    removeTimeSlot,
    editTimeSlot,

    // Modal states
    selectedSlot,
    selectedDay,
    selectedDayLabel,
    slotDetailsModalOpen,
    timeSlotModalOpen,

    // Modal actions
    openSlotDetailsModal,
    openTimeSlotModal,
    openEditSlotModal,
    closeModals,

    // 🧪 Test helpers
    testWeekReset,
    simulateNewWeek,
  } = useMeetingsData();

  // Compact slot card
  const renderCompactSlot = (slot, dayKey, dayLabel) => {
    const config = slotStatusConfig[slot.status];
    const duration = calculateDuration(slot.startTime, slot.endTime);

    return (
      <Tooltip
        key={slot.id}
        title={`${slot.startTime} - ${slot.endTime} (${formatDuration(duration)})`}
        placement="top"
      >
        <div
          onClick={() => openSlotDetailsModal(dayKey, slot, dayLabel)}
          className="relative p-3 rounded-xl border-2 cursor-pointer transition-all duration-200 hover:scale-[1.02] hover:shadow-md"
          style={{
            backgroundColor: config.bg,
            borderColor: config.color,
          }}
        >
          {/* Time Range */}
          <div className="flex items-center gap-2">
            <Clock size={14} style={{ color: config.color }} />
            <span className="text-sm font-bold text-gray-800">
              {slot.startTime}
            </span>
            <span className="text-gray-400">→</span>
            <span className="text-sm font-bold text-gray-800">
              {slot.endTime}
            </span>
          </div>

          {/* Duration */}
          <div className="mt-1.5 flex items-center gap-1.5">
            <Timer size={11} className="text-gray-400" />
            <span className="text-xs text-gray-500">
              {formatDuration(duration)}
            </span>
          </div>

          {/* Status indicator dot */}
          <div
            className="absolute top-2 right-2 w-2 h-2 rounded-full"
            style={{ backgroundColor: config.color }}
          />
        </div>
      </Tooltip>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">My Availability</h1>
          <p className="text-gray-600">
            Set your available time slots for this week
          </p>
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
            <div className="text-sm text-blue-600/80 mt-1">Total Hours</div>
          </div>
        </Card>
        <Card className="!bg-gradient-to-br from-purple-50 to-purple-100 border-0">
          <div className="text-center">
            <div className="text-3xl font-bold text-purple-700">
              {stats.daysWithSlots}
            </div>
            <div className="text-sm text-purple-600/80 mt-1">Active Days</div>
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

      {/* Current Week Display */}
      <Card
        className="bg-white! border-0"
        styles={{ body: { padding: 20 }, root: { borderRadius: 0 } }}
      >
        <div className="flex items-center justify-between">
          <div className="text-black">
            <p className="text-primary-light text-sm font-medium">
              Current Week
            </p>
            <h2 className="text-2xl font-bold mt-1">
              {weekInfo?.start} - {weekInfo?.end}
            </h2>
          </div>
          <div className="flex items-center gap-2 bg-white/20 rounded-xl px-4 py-2">
            <RefreshCw size={18} className="text-white" />
            <span className="text-white text-sm font-medium">
              Resets every Saturday
            </span>
          </div>
        </div>
      </Card>

      {/* Weekly Calendar */}
      <div className="grid grid-cols-7 gap-3">
        {weekDates.map((day) => {
          const slots = getSlotsForDay(day.key);
          const isToday = day.date.isSame(dayjs(), "day");
          const isPast = day.date.isBefore(dayjs(), "day");
          const totalMinutes = slots.reduce(
            (acc, slot) =>
              acc + calculateDuration(slot.startTime, slot.endTime),
            0
          );

          return (
            <Card
              key={day.key}
              className={`relative overflow-hidden transition-all ${
                isToday
                  ? "ring-2 ring-primary shadow-lg"
                  : isPast
                    ? "opacity-60"
                    : "hover:shadow-md"
              }`}
              styles={{ body: { padding: 12 }, root: { borderRadius: 0 } }}
            >
              {/* Day Header */}
              <div className="text-center mb-3 pb-3 border-b border-gray-100">
                <p className="text-xs font-medium text-gray-400 uppercase tracking-wide">
                  {day.short}
                </p>
                <p
                  className={`text-xl font-bold mt-0.5 ${
                    isToday
                      ? "text-primary"
                      : isPast
                        ? "text-gray-400"
                        : "text-gray-900"
                  }`}
                >
                  {day.date.format("D")}
                </p>
                {isToday && (
                  <span className="inline-block mt-1 text-[10px] bg-emerald-500 text-white px-2 py-0.5 rounded-full font-medium">
                    TODAY
                  </span>
                )}
                {isPast && !isToday && (
                  <span className="inline-block mt-1 text-[10px] bg-gray-200 text-gray-500 px-2 py-0.5 rounded-full font-medium">
                    PAST
                  </span>
                )}
                {!isToday && !isPast && slots.length > 0 && (
                  <div className="mt-1 text-[10px] text-gray-400">
                    {formatDuration(totalMinutes)}
                  </div>
                )}
              </div>

              {/* Slots */}
              <div className="space-y-2 min-h-[140px]">
                {slots.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-[140px] text-gray-300">
                    <CalendarDays size={24} className="mb-2" />
                    <p className="text-xs">No availability</p>
                  </div>
                ) : (
                  slots.map((slot) =>
                    renderCompactSlot(slot, day.key, day.fullLabel)
                  )
                )}
              </div>

              {/* Add Slot Button - Disabled for past days */}
              <button
                onClick={() => !isPast && openTimeSlotModal(day.key)}
                disabled={isPast}
                className={`w-full mt-3 p-2 rounded-xl border-2 border-dashed text-xs font-medium transition-all duration-200 flex items-center justify-center gap-1 ${
                  isPast
                    ? "border-gray-100 text-gray-300 cursor-not-allowed"
                    : "border-gray-200 text-gray-400 hover:border-emerald-400 hover:text-emerald-500 hover:bg-emerald-50"
                }`}
              >
                <Plus size={14} />
                Add Time
              </button>
            </Card>
          );
        })}
      </div>

      {/* Info Card */}
      <Card className="!bg-gradient-to-r from-amber-50 to-orange-50 border-amber-100">
        <div className="flex items-start gap-4">
          <div className="w-10 h-10 bg-amber-100 rounded-xl flex items-center justify-center flex-shrink-0">
            <RefreshCw size={20} className="text-amber-600" />
          </div>
          <div>
            <h3 className="font-semibold text-amber-900">Weekly Reset</h3>
            <p className="text-sm text-amber-700 mt-1">
              Your availability resets automatically every Saturday. Make sure
              to set your available times for each new week. Past days cannot be
              modified.
            </p>
          </div>
        </div>
      </Card>

      {/* Modals */}
      <SlotDetailsModal
        open={slotDetailsModalOpen}
        onClose={closeModals}
        slot={selectedSlot}
        dayKey={selectedDay}
        dayLabel={selectedDayLabel}
        onRemoveSlot={removeTimeSlot}
        onEditSlot={openEditSlotModal}
      />

      <TimeSlotModal
        open={timeSlotModalOpen}
        onClose={closeModals}
        onSubmit={addTimeSlot}
        onEdit={editTimeSlot}
        dayKey={selectedDay}
        slot={selectedSlot}
      />
    </div>
  );
};

export default Meetings;

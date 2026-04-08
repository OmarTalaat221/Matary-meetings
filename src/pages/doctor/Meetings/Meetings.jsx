import { Card, Tooltip, Spin } from "antd";
import {
  Plus,
  Clock,
  CalendarDays,
  Timer,
  ChevronLeft,
  ChevronRight,
  Calendar,
} from "lucide-react";
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
    loading,
    getSlotsForDate,
    saveDaySlots,
    removeTimeSlot,
    nextWeek,
    prevWeek,
    currentWeek,
    isPrevDisabled,
    isNextDisabled, // 🛡️ استقبال حالة تعطيل الأزرار
    drawerOpen,
    selectedDate,
    selectedDayLabel,
    openDrawer,
    closeDrawer,
    slotDetailsModalOpen,
    selectedSlot,
    openSlotDetailsModal,
    closeModals,
  } = useMeetingsData();

  const renderCompactSlot = (slot, dayLabel, fullDate) => {
    const config = slotStatusConfig[slot.status];
    return (
      <Tooltip
        key={slot.id}
        title={`${formatTimeTo12Hour(slot.startTime)} - ${formatTimeTo12Hour(slot.endTime)}`}
        placement="top"
      >
        <div
          onClick={() => openSlotDetailsModal(slot, dayLabel, fullDate)}
          className="relative p-2.5 landscape:p-1.5 rounded-lg border-2 cursor-pointer transition-all duration-200 hover:scale-[1.02] hover:shadow-md"
          style={{ backgroundColor: config.bg, borderColor: config.color }}
        >
          <div className="flex items-center justify-center gap-1.5 landscape:gap-1">
            <Clock
              size={12}
              className="landscape:w-3 landscape:h-3"
              style={{ color: config.color }}
            />
            <span className="text-xs landscape:text-[10px] font-bold text-gray-800">
              {formatTimeTo12Hour(slot.startTime)}
            </span>
            <span className="text-gray-400 text-xs landscape:text-[10px]">
              →
            </span>
            <span className="text-xs landscape:text-[10px] font-bold text-gray-800">
              {formatTimeTo12Hour(slot.endTime)}
            </span>
          </div>
        </div>
      </Tooltip>
    );
  };

  return (
    <div className="space-y-6 landscape:space-y-4">
      {/* Header with Navigation */}
      <div className="flex flex-col sm:flex-row landscape:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl landscape:text-xl font-bold text-gray-900">
            Weekly Schedule
          </h1>
          <p className="text-gray-600 text-sm landscape:text-xs">
            Manage your appointments week by week
          </p>
        </div>

        {/* Navigation Controls */}
        <div className="flex items-center gap-2 bg-white p-1.5 rounded-xl border border-gray-200 shadow-sm">
          <button
            onClick={prevWeek}
            className={`p-2 rounded-lg transition-colors hover:bg-gray-100 text-gray-700`}
          >
            <ChevronLeft size={18} />
          </button>

          <button
            onClick={currentWeek}
            className="flex items-center gap-2 px-3 py-1.5 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <Calendar size={16} className="text-primary" />
            <span className="text-sm font-semibold text-gray-700 min-w-[130px] text-center">
              {weekInfo.start} - {weekInfo.end}
            </span>
          </button>

          <button
            onClick={nextWeek}
            // disabled={isNextDisabled}
            className={`p-2 rounded-lg transition-colors hover:bg-gray-100 text-gray-700`}
          >
            <ChevronRight size={18} />
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 landscape:gap-2">
        <Card className="!bg-gradient-to-br from-emerald-50 to-green-100 border-0">
          <div className="text-center">
            <div className="text-3xl landscape:text-xl font-bold text-emerald-700">
              {stats.totalSlots}
            </div>
            <div className="text-sm landscape:text-xs text-emerald-600/80 mt-1">
              Time Slots
            </div>
          </div>
        </Card>
        <Card className="!bg-gradient-to-br from-blue-50 to-blue-100 border-0">
          <div className="text-center">
            <div className="text-3xl landscape:text-xl font-bold text-blue-700">
              {stats.totalHours}h
            </div>
            <div className="text-sm landscape:text-xs text-blue-600/80 mt-1">
              Weekly Hours
            </div>
          </div>
        </Card>
        <Card className="!bg-gradient-to-br from-purple-50 to-purple-100 border-0">
          <div className="text-center">
            <div className="text-3xl landscape:text-xl font-bold text-purple-700">
              {stats.daysWithSlots}
            </div>
            <div className="text-sm landscape:text-xs text-purple-600/80 mt-1">
              Working Days
            </div>
          </div>
        </Card>
        <Card className="!bg-gradient-to-br from-gray-50 to-slate-100 border-0">
          <div className="text-center">
            <div className="text-3xl landscape:text-xl font-bold text-gray-600">
              {stats.emptyDays}
            </div>
            <div className="text-sm landscape:text-xs text-gray-500 mt-1">
              Days Off
            </div>
          </div>
        </Card>
      </div>

      {/* Loading Wrapper */}
      <Spin spinning={loading} tip="Loading schedule...">
        <div className="overflow-x-auto pb-4 custom-scrollbar">
          <div className="grid grid-cols-7 gap-3 min-w-[800px]">
            {weekDates.map((day) => {
              // 💡 سحب الداتا بناءً على التاريخ الفعلي مش اسم اليوم
              const slots = getSlotsForDate(day.fullDate);
              const totalMinutes = slots.reduce(
                (acc, slot) =>
                  acc + calculateDuration(slot.startTime, slot.endTime),
                0
              );

              return (
                <Card
                  key={day.fullDate}
                  className="relative overflow-hidden transition-all hover:shadow-md h-full"
                  styles={{ body: { padding: 12 } }}
                >
                  <div className="text-center mb-3 pb-3 border-b border-gray-100">
                    <p className="text-sm font-semibold text-gray-700">
                      {day.label}
                    </p>
                    <p className="text-xs text-gray-400 mt-0.5">
                      {day.dateFormatted}
                    </p>
                    {slots.length > 0 && (
                      <div className="mt-2 flex items-center justify-center gap-1 text-xs text-emerald-600">
                        <Timer size={10} />
                        <span>{formatDuration(totalMinutes)}</span>
                      </div>
                    )}
                  </div>

                  <div className="space-y-2 min-h-[120px] landscape:min-h-[80px]">
                    {slots.length === 0 ? (
                      <div className="flex flex-col items-center justify-center h-[120px] landscape:h-[80px] text-gray-300">
                        <CalendarDays
                          size={24}
                          className="mb-2 landscape:w-5 landscape:h-5"
                        />
                        <p className="text-xs">Day Off</p>
                      </div>
                    ) : (
                      slots.map((slot) =>
                        renderCompactSlot(slot, day.fullLabel, day.fullDate)
                      )
                    )}
                  </div>

                  <button
                    onClick={() => openDrawer(day.fullDate, day.fullLabel)}
                    className="w-full mt-3 p-2 rounded-lg border-2 border-dashed border-gray-200 text-gray-400 text-xs font-medium hover:border-emerald-400 hover:text-emerald-500 hover:bg-emerald-50 transition-all duration-200 flex items-center justify-center gap-1"
                  >
                    <Plus size={14} />
                    {slots.length > 0 ? "Edit" : "Add"}
                  </button>
                </Card>
              );
            })}
          </div>
        </div>
      </Spin>

      {/* Models & Drawers */}
      <TimeSlotDrawer
        open={drawerOpen}
        onClose={closeDrawer}
        selectedDate={selectedDate}
        dayLabel={selectedDayLabel}
        selectedSlots={selectedDate ? getSlotsForDate(selectedDate) : []}
        onSave={(newSlots) => saveDaySlots(selectedDate, newSlots)}
      />

      <SlotDetailsModal
        open={slotDetailsModalOpen}
        onClose={closeModals}
        slot={selectedSlot}
        dayLabel={selectedDayLabel}
        onRemoveSlot={() => {
          removeTimeSlot(selectedSlot.id);
          closeModals();
        }}
        onEditSlot={() => {
          closeModals();
          if (selectedDate) openDrawer(selectedDate, selectedDayLabel);
        }}
      />
    </div>
  );
};

export default Meetings;

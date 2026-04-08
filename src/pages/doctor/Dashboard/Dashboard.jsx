// src/pages/doctor/Dashboard/Dashboard.jsx
import { Card, Tag, Empty, Spin } from "antd";
import {
  ChevronLeft,
  ChevronRight,
  Clock,
  CalendarDays,
  Timer,
  Calendar,
  TrendingUp,
  CalendarOff,
  Video,
  FileText,
  Hash,
  AlertCircle,
} from "lucide-react";
import dayjs from "dayjs";

import Button from "../../../components/common/Button";
import useDashboardData, {
  formatTimeTo12Hour,
  formatDuration,
  slotStatusConfig,
} from "./useDashboardData";
import { useAuth } from "../../../hooks/useAuth";

const Dashboard = () => {
  const {
    loading,
    weekSlots,
    weekInfo,
    stats,
    upcomingOffDays,
    todaySlots,
    goToPreviousWeek,
    goToNextWeek,
    goToCurrentWeek,
  } = useDashboardData();

  const { user, getDoctorType } = useAuth();

  const doctorType = getDoctorType();

  // Render slot with status
  const renderSlot = (slot) => {
    const statusConfig =
      slotStatusConfig[slot.status] || slotStatusConfig.available;

    return (
      <div
        key={slot.id}
        className={`p-2 border rounded-lg ${
          slot.status === "booked"
            ? "bg-blue-50 border-blue-200"
            : "bg-emerald-50 border-emerald-200"
        }`}
      >
        <div className="flex items-center gap-1.5">
          <Clock
            size={12}
            className={
              slot.status === "booked" ? "text-blue-600" : "text-emerald-600"
            }
          />
          <span
            className={`text-xs font-semibold ${
              slot.status === "booked" ? "text-blue-700" : "text-emerald-700"
            }`}
          >
            {formatTimeTo12Hour(slot.startTime)} -{" "}
            {formatTimeTo12Hour(slot.endTime)}
          </span>
        </div>
        {slot.status === "booked" && (
          <span className="text-[10px] text-blue-500 mt-1 block">Booked</span>
        )}
      </div>
    );
  };

  return (
    <Spin spinning={loading}>
      <div className="flex flex-col gap-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600">
            Overview of your schedule and availability
          </p>
        </div>

        {/* Today's Overview */}
        <Card className="!bg-gradient-to-r from-primary to-primary-light border-0 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white/80 text-sm">Today</p>
              <h2 className="text-2xl font-bold mt-1 text-white">
                {todaySlots.todayFormatted ||
                  dayjs().format("dddd, MMMM D, YYYY")}
              </h2>
              {todaySlots.isOffDay ? (
                <div className="flex items-center gap-2 mt-3 text-accent">
                  <CalendarOff size={18} />
                  <span>Day Off - {todaySlots.reason}</span>
                </div>
              ) : (
                <div className="flex items-center gap-4 mt-3">
                  <div className="flex items-center gap-2 text-white">
                    <Clock size={18} />
                    <span>{todaySlots.availableSlots} slots available</span>
                  </div>
                  {todaySlots.meetingsCount > 0 && (
                    <div className="flex items-center gap-2 text-white/80">
                      <CalendarDays size={18} />
                      <span>{todaySlots.meetingsCount} booked</span>
                    </div>
                  )}
                </div>
              )}
            </div>
            <div className="text-right">
              <div className="text-5xl font-bold text-white">
                {todaySlots.meetingsCount}
              </div>
              <p className="text-white/80 text-sm mt-1">Meetings Today</p>
            </div>
          </div>
        </Card>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card className="!bg-gradient-to-br from-emerald-50 to-green-100 border-0">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-emerald-500 rounded-xl flex items-center justify-center">
                <Clock size={24} className="text-white" />
              </div>
              <div>
                <div className="text-2xl font-bold text-emerald-700">
                  {stats.weekly.totalSlots}
                </div>
                <div className="text-sm text-emerald-600/80">Weekly Slots</div>
              </div>
            </div>
          </Card>

          <Card className="!bg-gradient-to-br from-blue-50 to-blue-100 border-0">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-blue-500 rounded-xl flex items-center justify-center">
                <Timer size={24} className="text-white" />
              </div>
              <div>
                <div className="text-2xl font-bold text-blue-700">
                  {stats.weekly.totalHours}h
                </div>
                <div className="text-sm text-blue-600/80">Weekly Hours</div>
              </div>
            </div>
          </Card>

          <Card className="!bg-gradient-to-br from-purple-50 to-purple-100 border-0">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-purple-500 rounded-xl flex items-center justify-center">
                <CalendarDays size={24} className="text-white" />
              </div>
              <div>
                <div className="text-2xl font-bold text-purple-700">
                  {stats.weekly.workingDays}
                </div>
                <div className="text-sm text-purple-600/80">Working Days</div>
              </div>
            </div>
          </Card>

          <Card className="!bg-gradient-to-br from-orange-50 to-amber-100 border-0">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-orange-500 rounded-xl flex items-center justify-center">
                <CalendarOff size={24} className="text-white" />
              </div>
              <div>
                <div className="text-2xl font-bold text-orange-700">
                  {stats.weekly.offDaysCount}
                </div>
                <div className="text-sm text-orange-600/80">Days Off</div>
              </div>
            </div>
          </Card>
        </div>

        {/* Week Navigation */}
        <Card className="!shadow-sm">
          <div className="flex items-center justify-between">
            <Button variant="ghost" onClick={goToPreviousWeek}>
              <ChevronLeft size={20} />
              <span className="hidden sm:inline ml-1">Previous</span>
            </Button>

            <div className="text-center">
              <h2 className="text-lg font-bold text-gray-900">
                {weekInfo.start} - {weekInfo.end}
              </h2>
              {!weekInfo.isCurrentWeek && (
                <button
                  onClick={goToCurrentWeek}
                  className="text-sm text-primary hover:underline transition-colors"
                >
                  Go to current week
                </button>
              )}
              {weekInfo.isCurrentWeek && (
                <span className="text-sm text-emerald-600 font-medium">
                  Current Week
                </span>
              )}
            </div>

            <Button variant="ghost" onClick={goToNextWeek}>
              <span className="hidden sm:inline mr-1">Next</span>
              <ChevronRight size={20} />
            </Button>
          </div>
        </Card>

        {/* Weekly Calendar */}
        <div className="grid grid-cols-7 gap-3">
          {weekSlots.map((day) => (
            <Card
              key={day.key}
              className={`relative overflow-hidden transition-all ${
                day.isToday
                  ? "ring-2 ring-primary shadow-lg"
                  : day.isPast
                    ? "opacity-60"
                    : ""
              }`}
              styles={{ body: { padding: 12 } }}
            >
              {/* Day Header */}
              <div className="text-center mb-3 pb-3 border-b border-gray-100">
                <p className="text-xs font-medium text-gray-400 uppercase tracking-wide">
                  {day.short}
                </p>
                <p
                  className={`text-xl font-bold mt-0.5 ${
                    day.isToday
                      ? "text-primary"
                      : day.isPast
                        ? "text-gray-400"
                        : "text-gray-900"
                  }`}
                >
                  {day.date.format("D")}
                </p>
                {day.isToday && (
                  <span className="inline-block mt-1 text-[10px] bg-primary text-white px-2 py-0.5 rounded-full font-medium">
                    TODAY
                  </span>
                )}
                {!day.isToday && !day.isOffDay && day.slots.length > 0 && (
                  <div className="mt-1 text-[10px] text-emerald-600">
                    {formatDuration(day.totalMinutes)}
                  </div>
                )}
              </div>

              {/* Content */}
              <div className="space-y-2 min-h-[100px]">
                {day.isOffDay ? (
                  <div className="flex flex-col items-center justify-center h-[100px] text-orange-400">
                    <CalendarOff size={24} className="mb-2" />
                    <p className="text-xs font-medium">Day Off</p>
                    <p className="text-[10px] text-orange-300 mt-1 text-center px-2">
                      {day.offDayReason}
                    </p>
                  </div>
                ) : day.slots.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-[100px] text-gray-300">
                    <CalendarDays size={24} className="mb-2" />
                    <p className="text-xs">No slots</p>
                  </div>
                ) : (
                  day.slots.map((slot) => renderSlot(slot))
                )}
              </div>

              {/* Slot count badge */}
              {!day.isOffDay && day.slots.length > 0 && (
                <div className="absolute top-2 right-2">
                  <span className="bg-emerald-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                    {day.slots.length}
                  </span>
                </div>
              )}
            </Card>
          ))}
        </div>

        {/* Bottom Section */}
        <div className="grid grid-cols-1 gap-6">
          {/* Upcoming Off Days */}

          {/* Settings Overview */}
          {doctorType === "private" && (
            <Card className="!shadow-sm">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
                  <TrendingUp size={20} className="text-blue-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Configuration</h3>
                  <p className="text-sm text-gray-500">
                    Your settings overview
                  </p>
                </div>
              </div>

              <div className="space-y-3">
                {/* Max Meetings */}
                {/* <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <Hash size={16} className="text-gray-500" />
                  <span className="text-gray-700">Max Daily Meetings</span>
                </div>
                <span className="font-bold text-gray-900">
                  {stats.settings.maxMeetingsPerDay}
                </span>
              </div> */}

                {/* Meeting Link */}
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <Video size={16} className="text-gray-500" />
                    <span className="text-gray-700">Meeting Link</span>
                  </div>
                  {stats.settings.hasMeetingLink ? (
                    <Tag color="green">Configured</Tag>
                  ) : (
                    <Tag color="red">Not Set</Tag>
                  )}
                </div>

                {/* Instructions */}
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <FileText size={16} className="text-gray-500" />
                    <span className="text-gray-700">Instructions</span>
                  </div>
                  {stats.settings.hasInstructions ? (
                    <Tag color="green">Added</Tag>
                  ) : (
                    <Tag color="orange">Not Set</Tag>
                  )}
                </div>

                {/* Monthly Stats */}
                <div className="mt-4 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl">
                  <p className="text-sm text-blue-700 font-medium mb-2">
                    Monthly Overview (Estimated)
                  </p>
                  <div className="flex justify-between">
                    <div>
                      <p className="text-2xl font-bold text-blue-800">
                        {stats.monthly.totalSlots}
                      </p>
                      <p className="text-xs text-blue-600">Total Slots</p>
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-blue-800">
                        {stats.monthly.totalHours}h
                      </p>
                      <p className="text-xs text-blue-600">Total Hours</p>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          )}
        </div>

        {/* Info Alert */}
        {(!stats.settings.hasMeetingLink ||
          !stats.settings.hasInstructions) && (
          <Card className="!bg-amber-50 border-amber-200">
            <div className="flex items-start gap-3">
              <AlertCircle size={20} className="text-amber-600 mt-0.5" />
              <div>
                <h4 className="font-semibold text-amber-900">
                  Complete Your Setup
                </h4>
                <p className="text-sm text-amber-700 mt-1">
                  {!stats.settings.hasMeetingLink &&
                  !stats.settings.hasInstructions
                    ? "You haven't set up your meeting link and instructions yet. "
                    : !stats.settings.hasMeetingLink
                      ? "You haven't set up your meeting link yet. "
                      : "You haven't added meeting instructions yet. "}
                  Go to Settings to complete your profile.
                </p>
              </div>
            </div>
          </Card>
        )}
      </div>
    </Spin>
  );
};

export default Dashboard;

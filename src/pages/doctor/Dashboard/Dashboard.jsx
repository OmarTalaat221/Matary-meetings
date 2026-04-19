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
        className={`p-1.5 sm:p-2 border rounded-lg ${
          slot.status === "booked"
            ? "bg-blue-50 border-blue-200"
            : "bg-emerald-50 border-emerald-200"
        }`}
      >
        <div className="flex items-center gap-1 sm:gap-1.5">
          <Clock
            size={12}
            className={`shrink-0 ${
              slot.status === "booked" ? "text-blue-600" : "text-emerald-600"
            }`}
          />
          <span
            className={`text-[10px] sm:text-xs font-semibold whitespace-nowrap ${
              slot.status === "booked" ? "text-blue-700" : "text-emerald-700"
            }`}
          >
            {formatTimeTo12Hour(slot.startTime)} -{" "}
            {formatTimeTo12Hour(slot.endTime)}
          </span>
        </div>
        {slot.status === "booked" && (
          <span className="text-[10px] text-blue-500 mt-0.5 sm:mt-1 block">
            Booked
          </span>
        )}
      </div>
    );
  };

  return (
    <Spin spinning={loading}>
      <div className="flex flex-col gap-4 sm:gap-5 lg:gap-6">
        {/* ──────────────── Header ──────────────── */}
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900">
            Dashboard
          </h1>
          <p className="text-sm sm:text-base text-gray-600">
            Overview of your schedule and availability
          </p>
        </div>

        {/* ──────────────── Today's Overview ──────────────── */}
        <Card
          className="!bg-gradient-to-r from-primary to-primary-light border-0 text-white overflow-hidden"
          style={{ backgroundColor: "var(--primary)" }}
        >
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="min-w-0 flex-1">
              <p className="text-white/80 text-sm">Today</p>
              <h2 className="text-lg sm:text-2xl font-bold mt-1 text-white break-words">
                {todaySlots.todayFormatted ||
                  dayjs().format("dddd, MMMM D, YYYY")}
              </h2>

              {todaySlots.isOffDay ? (
                <div className="flex items-center gap-2 mt-3 text-accent">
                  <CalendarOff size={18} className="shrink-0" />
                  <span className="text-sm sm:text-base">
                    Day Off - {todaySlots.reason}
                  </span>
                </div>
              ) : (
                <div className="flex flex-wrap items-center gap-3 sm:gap-4 mt-3">
                  <div className="flex items-center gap-2 text-white">
                    <Clock size={18} className="shrink-0" />
                    <span className="text-sm sm:text-base">
                      {todaySlots.availableSlots} slots available
                    </span>
                  </div>
                  {todaySlots.meetingsCount > 0 && (
                    <div className="flex items-center gap-2 text-white/80">
                      <CalendarDays size={18} className="shrink-0" />
                      <span className="text-sm sm:text-base">
                        {todaySlots.meetingsCount} booked
                      </span>
                    </div>
                  )}
                </div>
              )}
            </div>

            <div className="flex sm:flex-col items-center sm:items-end gap-2 sm:gap-0 shrink-0">
              <div className="text-3xl sm:text-5xl font-bold text-white">
                {todaySlots.meetingsCount}
              </div>
              <p className="text-white/80 text-xs sm:text-sm sm:mt-1">
                Meetings Today
              </p>
            </div>
          </div>
        </Card>

        {/* ──────────────── Stats Grid ──────────────── */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          <Card
            className="!bg-gradient-to-br from-emerald-50 to-green-100 border-0"
            style={{ backgroundColor: "#ecfdf5" }}
          >
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-emerald-500 rounded-xl flex items-center justify-center shrink-0">
                <Clock size={20} className="text-white sm:hidden" />
                <Clock size={24} className="text-white hidden sm:block" />
              </div>
              <div className="min-w-0">
                <div className="text-xl sm:text-2xl font-bold text-emerald-700">
                  {stats.weekly.totalSlots}
                </div>
                <div className="text-xs sm:text-sm text-emerald-600/80 truncate">
                  Weekly Slots
                </div>
              </div>
            </div>
          </Card>

          <Card
            className="!bg-gradient-to-br from-blue-50 to-blue-100 border-0"
            style={{ backgroundColor: "#eff6ff" }}
          >
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-blue-500 rounded-xl flex items-center justify-center shrink-0">
                <Timer size={20} className="text-white sm:hidden" />
                <Timer size={24} className="text-white hidden sm:block" />
              </div>
              <div className="min-w-0">
                <div className="text-xl sm:text-2xl font-bold text-blue-700">
                  {stats.weekly.totalHours}h
                </div>
                <div className="text-xs sm:text-sm text-blue-600/80 truncate">
                  Weekly Hours
                </div>
              </div>
            </div>
          </Card>

          <Card
            className="!bg-gradient-to-br from-purple-50 to-purple-100 border-0"
            style={{ backgroundColor: "#faf5ff" }}
          >
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-purple-500 rounded-xl flex items-center justify-center shrink-0">
                <CalendarDays size={20} className="text-white sm:hidden" />
                <CalendarDays
                  size={24}
                  className="text-white hidden sm:block"
                />
              </div>
              <div className="min-w-0">
                <div className="text-xl sm:text-2xl font-bold text-purple-700">
                  {stats.weekly.workingDays}
                </div>
                <div className="text-xs sm:text-sm text-purple-600/80 truncate">
                  Working Days
                </div>
              </div>
            </div>
          </Card>

          <Card
            className="!bg-gradient-to-br from-orange-50 to-amber-100 border-0"
            style={{ backgroundColor: "#fff7ed" }}
          >
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-orange-500 rounded-xl flex items-center justify-center shrink-0">
                <CalendarOff size={20} className="text-white sm:hidden" />
                <CalendarOff size={24} className="text-white hidden sm:block" />
              </div>
              <div className="min-w-0">
                <div className="text-xl sm:text-2xl font-bold text-orange-700">
                  {stats.weekly.offDaysCount}
                </div>
                <div className="text-xs sm:text-sm text-orange-600/80 truncate">
                  Days Off
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* ──────────────── Week Navigation ──────────────── */}
        <Card className="!shadow-sm">
          <div className="flex items-center justify-between gap-2">
            <Button
              variant="ghost"
              onClick={goToPreviousWeek}
              className="shrink-0"
            >
              <ChevronLeft size={20} />
              <span className="hidden sm:inline ml-1">Previous</span>
            </Button>

            <div className="text-center min-w-0 flex-1">
              <h2 className="text-sm sm:text-lg font-bold text-gray-900 truncate">
                {weekInfo.start} - {weekInfo.end}
              </h2>
              {!weekInfo.isCurrentWeek && (
                <button
                  onClick={goToCurrentWeek}
                  className="text-xs sm:text-sm text-primary hover:underline transition-colors"
                >
                  Go to current week
                </button>
              )}
              {weekInfo.isCurrentWeek && (
                <span className="text-xs sm:text-sm text-emerald-600 font-medium">
                  Current Week
                </span>
              )}
            </div>

            <Button variant="ghost" onClick={goToNextWeek} className="shrink-0">
              <span className="hidden sm:inline mr-1">Next</span>
              <ChevronRight size={20} />
            </Button>
          </div>
        </Card>

        {/* ──────────────── Weekly Calendar ──────────────── */}
        {/* 
          هنا الحل الأساسي:
          - على الموبايل: scroll أفقي مع min-width
          - على md فأكبر: grid عادي من غير scroll
        */}
        {/* Weekly Calendar */}
        <div className="overflow-x-auto xl:overflow-visible pb-2">
          <div
            className=" mt-4
      grid grid-flow-col gap-3 min-w-full
      auto-cols-[calc((100%-0.75rem)/2)]
      xs:auto-cols-[calc((100%-0.75rem)/3)]
      sm:auto-cols-[calc((100%-2.25rem)/4)]
      lg:auto-cols-[calc((100%-3rem)/5)]
      xl:auto-cols-[calc((100%-4.5rem)/7)]
    "
          >
            {weekSlots.map((day) => (
              <Card
                key={day.key}
                className={`snap-start relative overflow-hidden transition-all ${
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
                    className={`text-lg md:text-xl font-bold mt-0.5 ${
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
        </div>

        {/* ──────────────── Bottom Section ──────────────── */}
        <div className="grid grid-cols-1 gap-4 sm:gap-6">
          {/* Settings Overview */}
          {doctorType === "private" && (
            <Card className="!shadow-sm">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center shrink-0">
                  <TrendingUp size={20} className="text-blue-600" />
                </div>
                <div className="min-w-0">
                  <h3 className="font-semibold text-gray-900 text-sm sm:text-base">
                    Configuration
                  </h3>
                  <p className="text-xs sm:text-sm text-gray-500">
                    Your settings overview
                  </p>
                </div>
              </div>

              <div className="space-y-3">
                {/* Meeting Link */}
                <div className="flex items-center justify-between p-2.5 sm:p-3 bg-gray-50 rounded-lg gap-3">
                  <div className="flex items-center gap-2 sm:gap-3 min-w-0">
                    <Video size={16} className="text-gray-500 shrink-0" />
                    <span className="text-sm text-gray-700 truncate">
                      Meeting Link
                    </span>
                  </div>
                  {stats.settings.hasMeetingLink ? (
                    <Tag color="green" className="shrink-0">
                      Configured
                    </Tag>
                  ) : (
                    <Tag color="red" className="shrink-0">
                      Not Set
                    </Tag>
                  )}
                </div>

                {/* Instructions */}
                <div className="flex items-center justify-between p-2.5 sm:p-3 bg-gray-50 rounded-lg gap-3">
                  <div className="flex items-center gap-2 sm:gap-3 min-w-0">
                    <FileText size={16} className="text-gray-500 shrink-0" />
                    <span className="text-sm text-gray-700 truncate">
                      Instructions
                    </span>
                  </div>
                  {stats.settings.hasInstructions ? (
                    <Tag color="green" className="shrink-0">
                      Added
                    </Tag>
                  ) : (
                    <Tag color="orange" className="shrink-0">
                      Not Set
                    </Tag>
                  )}
                </div>

                {/* Monthly Stats */}
                <div className="mt-4 p-3 sm:p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl">
                  <p className="text-xs sm:text-sm text-blue-700 font-medium mb-2">
                    Monthly Overview (Estimated)
                  </p>
                  <div className="flex justify-between gap-4">
                    <div>
                      <p className="text-xl sm:text-2xl font-bold text-blue-800">
                        {stats.monthly.totalSlots}
                      </p>
                      <p className="text-[10px] sm:text-xs text-blue-600">
                        Total Slots
                      </p>
                    </div>
                    <div>
                      <p className="text-xl sm:text-2xl font-bold text-blue-800">
                        {stats.monthly.totalHours}h
                      </p>
                      <p className="text-[10px] sm:text-xs text-blue-600">
                        Total Hours
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          )}
        </div>

        {/* ──────────────── Info Alert ──────────────── */}
        {(!stats.settings.hasMeetingLink ||
          !stats.settings.hasInstructions) && (
          <Card className="!bg-amber-50 border-amber-200">
            <div className="flex items-start gap-2.5 sm:gap-3">
              <AlertCircle
                size={20}
                className="text-amber-600 mt-0.5 shrink-0"
              />
              <div className="min-w-0">
                <h4 className="font-semibold text-amber-900 text-sm sm:text-base">
                  Complete Your Setup
                </h4>
                <p className="text-xs sm:text-sm text-amber-700 mt-1">
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

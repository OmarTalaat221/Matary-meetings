// src/pages/doctor/Dashboard/useDashboardData.jsx
import { useState, useMemo, useCallback, useEffect } from "react";
import { message } from "antd";
import dayjs from "dayjs";
import api from "../../../api/axios";

// Days of the week
export const weekDays = [
  { key: "saturday", label: "Saturday", short: "Sat" },
  { key: "sunday", label: "Sunday", short: "Sun" },
  { key: "monday", label: "Monday", short: "Mon" },
  { key: "tuesday", label: "Tuesday", short: "Tue" },
  { key: "wednesday", label: "Wednesday", short: "Wed" },
  { key: "thursday", label: "Thursday", short: "Thu" },
  { key: "friday", label: "Friday", short: "Fri" },
];

// Slot status config
export const slotStatusConfig = {
  available: { color: "#52c41a", bg: "#f6ffed", label: "Available" },
  booked: { color: "#1890ff", bg: "#e6f7ff", label: "Booked" },
};

// Format time to 12-hour format
export const formatTimeTo12Hour = (time24) => {
  const [hours] = time24.split(":").map(Number);
  if (hours === 0) return "12 AM";
  if (hours === 12) return "12 PM";
  if (hours > 12) return `${hours - 12} PM`;
  return `${hours} AM`;
};

// Calculate duration
export const calculateDuration = (startTime, endTime) => {
  const [startH, startM] = startTime.split(":").map(Number);
  let [endH, endM] = endTime.split(":").map(Number);
  if (endH === 0) endH = 24;
  return endH * 60 + endM - (startH * 60 + startM);
};

// Format duration
export const formatDuration = (minutes) => {
  if (minutes < 60) return `${minutes}m`;
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`;
};

// Get Saturday of a given week
const getWeekSaturday = (date = dayjs()) => {
  const dayOfWeek = date.day();
  if (dayOfWeek === 6) {
    return date.startOf("day");
  } else {
    const daysToSubtract = dayOfWeek + 1;
    return date.subtract(daysToSubtract, "day").startOf("day");
  }
};

// =====================================================
// 🎣 Main Hook
// =====================================================
export const useDashboardData = () => {
  const [loading, setLoading] = useState(false);
  const [apiData, setApiData] = useState(null);

  // Current viewing week
  const [currentWeekSaturday, setCurrentWeekSaturday] = useState(() =>
    getWeekSaturday()
  );

  // =====================================================
  // 📡 Fetch Dashboard Data from API
  // =====================================================
  const fetchDashboardData = useCallback(async () => {
    setLoading(true);
    try {
      const startDate = currentWeekSaturday.format("YYYY-MM-DD");
      const endDate = currentWeekSaturday.add(6, "day").format("YYYY-MM-DD");

      const response = await api.get(`/stats/list`, {
        params: {
          start_date: startDate,
          end_date: endDate,
        },
      });

      if (response.data.status === "success") {
        setApiData(response.data.data);
      }
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
      message.error("Failed to load dashboard data");
    } finally {
      setLoading(false);
    }
  }, [currentWeekSaturday]);

  // Fetch on mount and when week changes
  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  // =====================================================
  // 📅 Week Dates Calculation
  // =====================================================
  const weekDates = useMemo(() => {
    return weekDays.map((day, index) => {
      const date = currentWeekSaturday.add(index, "day");
      return {
        ...day,
        date,
        dateStr: date.format("YYYY-MM-DD"),
        dateFormatted: date.format("MMM D"),
        fullLabel: `${day.label}, ${date.format("MMM D, YYYY")}`,
        isToday: date.isSame(dayjs(), "day"),
        isPast: date.isBefore(dayjs(), "day"),
        isFuture: date.isAfter(dayjs(), "day"),
      };
    });
  }, [currentWeekSaturday]);

  // =====================================================
  // 📊 Week Info
  // =====================================================
  const weekInfo = useMemo(() => {
    const startDate = currentWeekSaturday;
    const endDate = currentWeekSaturday.add(6, "day");
    const today = dayjs();
    const currentWeekStart = getWeekSaturday(today);

    return {
      start: startDate.format("MMM D"),
      end: endDate.format("MMM D, YYYY"),
      isCurrentWeek:
        apiData?.range_summary?.is_current_week ??
        startDate.isSame(currentWeekStart, "day"),
      isPastWeek: endDate.isBefore(today, "day"),
      isFutureWeek: startDate.isAfter(today, "day"),
      label:
        apiData?.range_summary?.label ||
        `${startDate.format("MMM D")} - ${endDate.format("MMM D")}`,
    };
  }, [currentWeekSaturday, apiData]);

  // =====================================================
  // 🔀 Navigation Functions
  // =====================================================
  const goToPreviousWeek = useCallback(() => {
    setCurrentWeekSaturday((prev) => prev.subtract(7, "day"));
  }, []);

  const goToNextWeek = useCallback(() => {
    setCurrentWeekSaturday((prev) => prev.add(7, "day"));
  }, []);

  const goToCurrentWeek = useCallback(() => {
    setCurrentWeekSaturday(getWeekSaturday());
  }, []);

  // =====================================================
  // 🎯 Get Slots for Specific Date
  // =====================================================
  const getSlotsForDate = useCallback(
    (dateStr) => {
      if (!apiData?.calendar?.[dateStr]) return [];

      return apiData.calendar[dateStr].slots
        .map((slot) => ({
          id: `${slot.slot_date}-${slot.start_time}`,
          startTime: slot.start_time.substring(0, 5),
          endTime: slot.end_time.substring(0, 5),
          status: slot.status,
          date: slot.slot_date,
        }))
        .sort((a, b) => a.startTime.localeCompare(b.startTime));
    },
    [apiData]
  );

  // =====================================================
  // 📅 Week Slots with Calendar Data
  // =====================================================
  const weekSlots = useMemo(() => {
    return weekDates.map((day) => {
      const calendarData = apiData?.calendar?.[day.dateStr];
      const slots = getSlotsForDate(day.dateStr);

      // Calculate total minutes from slots
      const totalMinutes = slots.reduce(
        (acc, slot) => acc + calculateDuration(slot.startTime, slot.endTime),
        0
      );

      return {
        ...day,
        slots,
        isOffDay: false, // Can be extended if API provides off day info
        offDayReason: "",
        totalMinutes,
        totalHours:
          calendarData?.total_hours ||
          Math.round((totalMinutes / 60) * 10) / 10,
        totalSlots: calendarData?.total_slots || slots.length,
      };
    });
  }, [weekDates, apiData, getSlotsForDate]);

  // =====================================================
  // 📈 Statistics from API
  // =====================================================
  const stats = useMemo(() => {
    const rangeSummary = apiData?.range_summary || {};
    const config = apiData?.config || {};

    // Calculate from weekSlots if API doesn't provide
    let calculatedTotalSlots = 0;
    let calculatedTotalHours = 0;
    let calculatedWorkingDays = 0;

    weekSlots.forEach((day) => {
      if (day.slots.length > 0) {
        calculatedWorkingDays++;
        calculatedTotalSlots += day.slots.length;
        calculatedTotalHours += day.totalMinutes / 60;
      }
    });

    return {
      weekly: {
        totalSlots: rangeSummary.total_slots ?? calculatedTotalSlots,
        totalHours:
          rangeSummary.total_hours ??
          Math.round(calculatedTotalHours * 10) / 10,
        workingDays: rangeSummary.working_days ?? calculatedWorkingDays,
        offDaysCount: rangeSummary.days_off ?? 7 - calculatedWorkingDays,
      },
      monthly: {
        // Estimate monthly based on weekly (4 weeks)
        totalSlots: (rangeSummary.total_slots ?? calculatedTotalSlots) * 4,
        totalHours:
          Math.round(
            (rangeSummary.total_hours ?? calculatedTotalHours) * 4 * 10
          ) / 10,
      },
      allOffDays: {
        total: rangeSummary.days_off ?? 0,
        upcoming: rangeSummary.days_off ?? 0,
      },
      settings: {
        maxMeetingsPerDay: config.max_daily || 8,
        hasMeetingLink: config.has_link || false,
        hasInstructions: config.has_instructions || false,
      },
    };
  }, [apiData, weekSlots]);

  // =====================================================
  // 📆 Today's Slots
  // =====================================================
  const todaySlots = useMemo(() => {
    const header = apiData?.header || {};
    const todayStr = dayjs().format("YYYY-MM-DD");
    const slots = getSlotsForDate(todayStr);

    return {
      isOffDay: false,
      reason: "",
      slots,
      meetingsCount:
        header.meetings_count ??
        slots.filter((s) => s.status === "booked").length,
      availableSlots:
        header.available_slots ??
        slots.filter((s) => s.status === "available").length,
      todayFormatted:
        header.today_formatted || dayjs().format("dddd, MMMM D, YYYY"),
    };
  }, [apiData, getSlotsForDate]);

  // =====================================================
  // 🏖️ Upcoming Off Days (Placeholder - extend when API supports)
  // =====================================================
  const upcomingOffDays = useMemo(() => {
    // Can be populated when API provides off days endpoint
    return [];
  }, []);

  // =====================================================
  // 🔄 Return Hook Data
  // =====================================================
  return {
    // Loading state
    loading,

    // API Data (raw)
    apiData,

    // Processed Data
    weekSlots,
    weekDates,
    weekInfo,
    stats,
    upcomingOffDays,
    todaySlots,

    // Helper Functions
    getSlotsForDate,

    // Navigation
    currentWeekSaturday,
    goToPreviousWeek,
    goToNextWeek,
    goToCurrentWeek,

    // Refresh
    refreshData: fetchDashboardData,
  };
};

export default useDashboardData;

// src/pages/doctor/Meetings/useMeetingsData.jsx
import { useState, useMemo, useCallback, useEffect } from "react";
import { message } from "antd";
import dayjs from "dayjs";

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
  available: {
    color: "#52c41a",
    bg: "#f6ffed",
    label: "Available",
    description: "Open for booking",
  },
};

// Helper functions
export const calculateDuration = (startTime, endTime) => {
  const [startH, startM] = startTime.split(":").map(Number);
  let [endH, endM] = endTime.split(":").map(Number);
  if (endH === 0) endH = 24; // Handle midnight
  return endH * 60 + endM - (startH * 60 + startM);
};

export const formatDuration = (minutes) => {
  if (minutes < 60) return `${minutes} min`;
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`;
};

// Format time to 12-hour format
export const formatTimeTo12Hour = (time24) => {
  const [hours] = time24.split(":").map(Number);
  if (hours === 0) return "12 AM";
  if (hours === 12) return "12 PM";
  if (hours > 12) return `${hours - 12} PM`;
  return `${hours} AM`;
};

// Storage key - This is PERSISTENT (doesn't reset weekly)
const STORAGE_KEY = "doctor_weekly_schedule";

// =====================================================
// 📊 Default Schedule (الجدول الأسبوعي الثابت)
// =====================================================
const getDefaultSchedule = () => ({
  saturday: [
    { id: 1, startTime: "09:00", endTime: "10:00", status: "available" },
    { id: 2, startTime: "10:00", endTime: "11:00", status: "available" },
    { id: 3, startTime: "14:00", endTime: "15:00", status: "available" },
  ],
  sunday: [
    { id: 4, startTime: "10:00", endTime: "11:00", status: "available" },
    { id: 5, startTime: "11:00", endTime: "12:00", status: "available" },
  ],
  monday: [
    { id: 6, startTime: "09:00", endTime: "10:00", status: "available" },
    { id: 7, startTime: "15:00", endTime: "16:00", status: "available" },
  ],
  tuesday: [
    { id: 8, startTime: "13:00", endTime: "14:00", status: "available" },
    { id: 9, startTime: "14:00", endTime: "15:00", status: "available" },
  ],
  wednesday: [
    { id: 10, startTime: "10:00", endTime: "11:00", status: "available" },
    { id: 11, startTime: "11:00", endTime: "12:00", status: "available" },
    { id: 12, startTime: "16:00", endTime: "17:00", status: "available" },
  ],
  thursday: [
    { id: 13, startTime: "09:00", endTime: "10:00", status: "available" },
  ],
  friday: [], // Day off
});

// Get empty schedule
const getEmptySchedule = () => ({
  saturday: [],
  sunday: [],
  monday: [],
  tuesday: [],
  wednesday: [],
  thursday: [],
  friday: [],
});

// Load schedule from localStorage
const loadSchedule = () => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      return JSON.parse(saved);
    }
    return getDefaultSchedule();
  } catch (error) {
    console.error("Error loading schedule:", error);
    return getDefaultSchedule();
  }
};

// Get current week's Saturday
const getCurrentWeekSaturday = () => {
  const today = dayjs();
  const dayOfWeek = today.day();
  if (dayOfWeek === 6) {
    return today.startOf("day");
  } else {
    const daysToSubtract = dayOfWeek + 1;
    return today.subtract(daysToSubtract, "day").startOf("day");
  }
};

// =====================================================
// 🎣 Main Hook
// =====================================================
export const useMeetingsData = () => {
  // Weekly schedule (persistent - الجدول الثابت)
  const [schedule, setSchedule] = useState(() => loadSchedule());

  // Current week Saturday (for display)
  const [currentWeekSaturday] = useState(() => getCurrentWeekSaturday());

  // Drawer states
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selectedDay, setSelectedDay] = useState(null);
  const [selectedDayLabel, setSelectedDayLabel] = useState("");

  // Slot details modal
  const [slotDetailsModalOpen, setSlotDetailsModalOpen] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState(null);

  // Save to localStorage whenever schedule changes
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(schedule));
    console.log("💾 Schedule saved");
  }, [schedule]);

  // Week dates (for display only)
  const weekDates = useMemo(() => {
    return weekDays.map((day, index) => ({
      ...day,
      date: currentWeekSaturday.add(index, "day"),
      dateFormatted: currentWeekSaturday.add(index, "day").format("MMM D"),
      fullLabel: `${day.label}`,
    }));
  }, [currentWeekSaturday]);

  // Week info
  const weekInfo = useMemo(() => {
    const endOfWeek = currentWeekSaturday.add(6, "day");
    return {
      start: currentWeekSaturday.format("MMM D"),
      end: endOfWeek.format("MMM D, YYYY"),
    };
  }, [currentWeekSaturday]);

  // Get slots for day
  const getSlotsForDay = useCallback(
    (dayKey) => {
      return (schedule[dayKey] || []).sort((a, b) =>
        a.startTime.localeCompare(b.startTime)
      );
    },
    [schedule]
  );

  // Save slots for a day (from drawer)
  const saveDaySlots = useCallback((dayKey, slots) => {
    const newSlots = slots.map((slot, index) => ({
      id: Date.now() + index,
      startTime: slot.startTime,
      endTime: slot.endTime,
      status: "available",
    }));

    setSchedule((prev) => ({
      ...prev,
      [dayKey]: newSlots,
    }));

    message.success(
      `${dayKey.charAt(0).toUpperCase() + dayKey.slice(1)} schedule updated!`
    );
  }, []);

  // Remove single slot
  const removeTimeSlot = useCallback((dayKey, slotId) => {
    setSchedule((prev) => ({
      ...prev,
      [dayKey]: prev[dayKey].filter((slot) => slot.id !== slotId),
    }));
    message.success("Time slot removed");
  }, []);

  // Open drawer for a day
  const openDrawer = useCallback((dayKey, dayLabel) => {
    setSelectedDay(dayKey);
    setSelectedDayLabel(dayLabel);
    setDrawerOpen(true);
  }, []);

  // Close drawer
  const closeDrawer = useCallback(() => {
    setDrawerOpen(false);
    setSelectedDay(null);
    setSelectedDayLabel("");
  }, []);

  // Open slot details
  const openSlotDetailsModal = useCallback((dayKey, slot, dayLabel) => {
    setSelectedDay(dayKey);
    setSelectedSlot(slot);
    setSelectedDayLabel(dayLabel);
    setSlotDetailsModalOpen(true);
  }, []);

  // Close modals
  const closeModals = useCallback(() => {
    setSlotDetailsModalOpen(false);
    setSelectedSlot(null);
    setSelectedDay(null);
    setSelectedDayLabel("");
  }, []);

  // Statistics
  const stats = useMemo(() => {
    let totalSlots = 0;
    let totalHours = 0;

    Object.values(schedule).forEach((slots) => {
      slots.forEach((slot) => {
        totalSlots++;
        totalHours += calculateDuration(slot.startTime, slot.endTime) / 60;
      });
    });

    const daysWithSlots = Object.values(schedule).filter(
      (slots) => slots.length > 0
    ).length;

    return {
      totalSlots,
      totalHours: Math.round(totalHours * 10) / 10,
      daysWithSlots,
      emptyDays: 7 - daysWithSlots,
    };
  }, [schedule]);

  // Reset to default
  const resetToDefault = useCallback(() => {
    setSchedule(getDefaultSchedule());
    message.success("Reset to default schedule!");
  }, []);

  // Clear all
  const clearAllSlots = useCallback(() => {
    setSchedule(getEmptySchedule());
    message.success("All slots cleared!");
  }, []);

  return {
    schedule,
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
  };
};

export const meetingStatusConfig = slotStatusConfig;
export default useMeetingsData;

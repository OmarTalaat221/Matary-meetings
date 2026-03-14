// src/pages/doctor/Meetings/useMeetingsData.jsx
import { useState, useMemo, useCallback, useEffect } from "react";
import { message } from "antd";
import dayjs from "dayjs";

// Days of the week
export const weekDays = [
  { key: "saturday", label: "Saturday", short: "Sat", dayIndex: 6 },
  { key: "sunday", label: "Sunday", short: "Sun", dayIndex: 0 },
  { key: "monday", label: "Monday", short: "Mon", dayIndex: 1 },
  { key: "tuesday", label: "Tuesday", short: "Tue", dayIndex: 2 },
  { key: "wednesday", label: "Wednesday", short: "Wed", dayIndex: 3 },
  { key: "thursday", label: "Thursday", short: "Thu", dayIndex: 4 },
  { key: "friday", label: "Friday", short: "Fri", dayIndex: 5 },
];

// Time options
export const timeOptions = [
  "08:00",
  "08:30",
  "09:00",
  "09:30",
  "10:00",
  "10:30",
  "11:00",
  "11:30",
  "12:00",
  "12:30",
  "13:00",
  "13:30",
  "14:00",
  "14:30",
  "15:00",
  "15:30",
  "16:00",
  "16:30",
  "17:00",
  "17:30",
  "18:00",
  "18:30",
  "19:00",
  "19:30",
  "20:00",
  "20:30",
  "21:00",
  "21:30",
  "22:00",
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
  const [endH, endM] = endTime.split(":").map(Number);
  return endH * 60 + endM - (startH * 60 + startM);
};

export const formatDuration = (minutes) => {
  if (minutes < 60) return `${minutes} min`;
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`;
};

// Get Saturday of current week
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

// Storage keys
const STORAGE_KEY = "doctor_availability";
const WEEK_KEY = "doctor_availability_week";

// =====================================================
// 📊 Default Data
// =====================================================
const getDefaultAvailability = () => ({
  saturday: [
    { id: 1, startTime: "09:00", endTime: "10:00", status: "available" },
    { id: 2, startTime: "10:30", endTime: "11:30", status: "available" },
    { id: 3, startTime: "14:00", endTime: "15:30", status: "available" },
  ],
  sunday: [
    { id: 4, startTime: "10:00", endTime: "11:00", status: "available" },
    { id: 5, startTime: "13:00", endTime: "14:30", status: "available" },
    { id: 6, startTime: "16:00", endTime: "17:00", status: "available" },
  ],
  monday: [
    { id: 7, startTime: "09:00", endTime: "10:30", status: "available" },
    { id: 8, startTime: "11:00", endTime: "12:00", status: "available" },
  ],
  tuesday: [
    { id: 9, startTime: "14:00", endTime: "15:00", status: "available" },
    { id: 10, startTime: "15:30", endTime: "17:00", status: "available" },
  ],
  wednesday: [
    { id: 11, startTime: "09:00", endTime: "10:00", status: "available" },
    { id: 12, startTime: "10:30", endTime: "11:30", status: "available" },
    { id: 13, startTime: "14:00", endTime: "16:00", status: "available" },
  ],
  thursday: [
    { id: 14, startTime: "11:00", endTime: "12:30", status: "available" },
    { id: 15, startTime: "15:00", endTime: "16:30", status: "available" },
  ],
  friday: [],
});

// Get empty availability
const getEmptyAvailability = () => ({
  saturday: [],
  sunday: [],
  monday: [],
  tuesday: [],
  wednesday: [],
  thursday: [],
  friday: [],
});

// =====================================================
// 🔑 Load availability - FIXED
// =====================================================
const loadAvailability = (saturdayDate) => {
  try {
    const savedWeek = localStorage.getItem(WEEK_KEY);
    const savedData = localStorage.getItem(STORAGE_KEY);
    const currentWeekId = saturdayDate.format("YYYY-MM-DD");

    console.log("📅 Current week:", currentWeekId);
    console.log("💾 Saved week:", savedWeek);

    // Check if new week
    if (savedWeek !== currentWeekId) {
      console.log("🔄 New week detected! Loading default data...");
      return getDefaultAvailability();
    }

    // Same week - try to load saved data
    if (savedData) {
      const parsed = JSON.parse(savedData);

      // Check if saved data has any slots
      const hasSlots = Object.values(parsed).some(
        (slots) => slots && slots.length > 0
      );

      if (hasSlots) {
        console.log("📂 Loaded saved availability");
        return parsed;
      }
    }

    // No saved data or empty - return default
    console.log("📊 No saved data, loading defaults...");
    return getDefaultAvailability();
  } catch (error) {
    console.error("❌ Error loading:", error);
    return getDefaultAvailability();
  }
};

// =====================================================
// 🎣 Main Hook
// =====================================================
export const useMeetingsData = () => {
  const [currentWeekSaturday] = useState(() => getCurrentWeekSaturday());

  const [availability, setAvailability] = useState(() => {
    // Clear old data and force reload defaults for testing
    // Remove these 2 lines after testing:
    // localStorage.removeItem(STORAGE_KEY);
    // localStorage.removeItem(WEEK_KEY);

    return loadAvailability(currentWeekSaturday);
  });

  // Modal states
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [selectedDay, setSelectedDay] = useState(null);
  const [selectedDayLabel, setSelectedDayLabel] = useState("");
  const [slotDetailsModalOpen, setSlotDetailsModalOpen] = useState(false);
  const [timeSlotModalOpen, setTimeSlotModalOpen] = useState(false);

  // Save to localStorage whenever availability changes
  useEffect(() => {
    const weekId = currentWeekSaturday.format("YYYY-MM-DD");
    localStorage.setItem(WEEK_KEY, weekId);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(availability));
    console.log("💾 Saved availability for week:", weekId);
  }, [availability, currentWeekSaturday]);

  // Week dates
  const weekDates = useMemo(() => {
    return weekDays.map((day, index) => ({
      ...day,
      date: currentWeekSaturday.add(index, "day"),
      dateFormatted: currentWeekSaturday.add(index, "day").format("MMM D"),
      fullLabel: `${day.label}, ${currentWeekSaturday.add(index, "day").format("MMM D, YYYY")}`,
    }));
  }, [currentWeekSaturday]);

  // Week info
  const weekInfo = useMemo(() => {
    const endOfWeek = currentWeekSaturday.add(6, "day");
    return {
      start: currentWeekSaturday.format("MMM D"),
      end: endOfWeek.format("MMM D, YYYY"),
      saturday: currentWeekSaturday.format("YYYY-MM-DD"),
    };
  }, [currentWeekSaturday]);

  // Get slots for day
  const getSlotsForDay = useCallback(
    (dayKey) => {
      return (availability[dayKey] || []).sort((a, b) =>
        a.startTime.localeCompare(b.startTime)
      );
    },
    [availability]
  );

  // Check time conflict
  const hasTimeConflict = useCallback(
    (dayKey, startTime, endTime, excludeSlotId = null) => {
      const slots = availability[dayKey] || [];
      return slots.some((slot) => {
        if (excludeSlotId && slot.id === excludeSlotId) return false;
        return startTime < slot.endTime && endTime > slot.startTime;
      });
    },
    [availability]
  );

  // Add slot
  const addTimeSlot = useCallback(
    (dayKey, slotData) => {
      const { startTime, endTime } = slotData;

      if (endTime <= startTime) {
        message.error("End time must be after start time");
        return false;
      }

      if (hasTimeConflict(dayKey, startTime, endTime)) {
        message.error("This time slot conflicts with an existing slot");
        return false;
      }

      const newSlot = {
        id: Date.now(),
        startTime,
        endTime,
        status: "available",
      };

      setAvailability((prev) => ({
        ...prev,
        [dayKey]: [...(prev[dayKey] || []), newSlot].sort((a, b) =>
          a.startTime.localeCompare(b.startTime)
        ),
      }));

      message.success("Time slot added successfully");
      setTimeSlotModalOpen(false);
      return true;
    },
    [hasTimeConflict]
  );

  // Remove slot
  const removeTimeSlot = useCallback((dayKey, slotId) => {
    setAvailability((prev) => ({
      ...prev,
      [dayKey]: prev[dayKey].filter((slot) => slot.id !== slotId),
    }));
    message.success("Time slot removed");
  }, []);

  // Edit slot
  const editTimeSlot = useCallback(
    (dayKey, slotId, newData) => {
      const { startTime, endTime } = newData;

      if (endTime <= startTime) {
        message.error("End time must be after start time");
        return false;
      }

      if (hasTimeConflict(dayKey, startTime, endTime, slotId)) {
        message.error("This time slot conflicts with an existing slot");
        return false;
      }

      setAvailability((prev) => ({
        ...prev,
        [dayKey]: prev[dayKey]
          .map((slot) =>
            slot.id === slotId ? { ...slot, startTime, endTime } : slot
          )
          .sort((a, b) => a.startTime.localeCompare(b.startTime)),
      }));

      message.success("Time slot updated successfully");
      setTimeSlotModalOpen(false);
      return true;
    },
    [hasTimeConflict]
  );

  // Modal actions
  const openSlotDetailsModal = useCallback((dayKey, slot, dayLabel) => {
    setSelectedDay(dayKey);
    setSelectedSlot(slot);
    setSelectedDayLabel(dayLabel);
    setSlotDetailsModalOpen(true);
  }, []);

  const openTimeSlotModal = useCallback((dayKey) => {
    setSelectedDay(dayKey);
    setSelectedSlot(null);
    setTimeSlotModalOpen(true);
  }, []);

  const openEditSlotModal = useCallback((dayKey, slot) => {
    setSelectedDay(dayKey);
    setSelectedSlot(slot);
    setTimeSlotModalOpen(true);
  }, []);

  const closeModals = useCallback(() => {
    setSlotDetailsModalOpen(false);
    setTimeSlotModalOpen(false);
    setSelectedSlot(null);
    setSelectedDay(null);
    setSelectedDayLabel("");
  }, []);

  // Statistics
  const stats = useMemo(() => {
    let totalSlots = 0;
    let totalHours = 0;

    Object.values(availability).forEach((slots) => {
      slots.forEach((slot) => {
        totalSlots++;
        totalHours += calculateDuration(slot.startTime, slot.endTime) / 60;
      });
    });

    const daysWithSlots = Object.values(availability).filter(
      (slots) => slots.length > 0
    ).length;

    return {
      totalSlots,
      totalHours: Math.round(totalHours * 10) / 10,
      daysWithSlots,
      emptyDays: 7 - daysWithSlots,
    };
  }, [availability]);

  // =====================================================
  // 🧪 Test Helpers
  // =====================================================
  const resetToDefault = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem(WEEK_KEY);
    setAvailability(getDefaultAvailability());
    message.success("Reset to default data!");
  }, []);

  const clearAllSlots = useCallback(() => {
    setAvailability(getEmptyAvailability());
    message.success("All slots cleared!");
  }, []);

  const testWeekReset = useCallback(() => {
    console.log(
      "🧪 Current Saturday:",
      currentWeekSaturday.format("YYYY-MM-DD")
    );
    console.log("🧪 Stored week:", localStorage.getItem(WEEK_KEY));
    console.log("🧪 Availability:", availability);
    console.log("🧪 Stats:", stats);
  }, [currentWeekSaturday, availability, stats]);

  const simulateNewWeek = useCallback(() => {
    const nextSat = currentWeekSaturday.add(7, "day").format("YYYY-MM-DD");
    localStorage.setItem(WEEK_KEY, nextSat);
    message.info("Refresh page to see new week reset!");
  }, [currentWeekSaturday]);

  return {
    availability,
    weekDates,
    weekInfo,
    currentWeekSaturday,
    stats,
    getSlotsForDay,
    addTimeSlot,
    removeTimeSlot,
    editTimeSlot,
    hasTimeConflict,
    selectedSlot,
    selectedDay,
    selectedDayLabel,
    slotDetailsModalOpen,
    timeSlotModalOpen,
    openSlotDetailsModal,
    openTimeSlotModal,
    openEditSlotModal,
    closeModals,
    // Test helpers
    resetToDefault,
    clearAllSlots,
    testWeekReset,
    simulateNewWeek,
  };
};

export const meetingStatusConfig = slotStatusConfig;
export default useMeetingsData;

// src/pages/doctor/Calendar/useCalendarData.jsx
import { useState, useMemo, useCallback, useEffect } from "react";
import { message } from "antd";
import dayjs from "dayjs";

// Storage key
const STORAGE_KEY = "doctor_off_days";

// Default off days
const defaultOffDays = [
  { id: 1, date: "2026-03-17", reason: "Personal Leave" },
  { id: 2, date: "2026-03-21", reason: "Conference" },
  { id: 3, date: "2026-04-01", reason: "Holiday" },
];

// Load from localStorage
const loadOffDays = () => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      // Check if it's a valid array with items
      if (Array.isArray(parsed) && parsed.length > 0) {
        console.log("📂 Loaded off days from storage:", parsed);
        return parsed;
      }
    }
    // Return defaults and save them
    console.log("📊 Loading default off days");
    localStorage.setItem(STORAGE_KEY, JSON.stringify(defaultOffDays));
    return defaultOffDays;
  } catch (error) {
    console.error("Error loading off days:", error);
    return defaultOffDays;
  }
};

export const useCalendarData = () => {
  const [offDays, setOffDays] = useState(() => loadOffDays());
  const [selectedDate, setSelectedDate] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

  // Save to localStorage whenever offDays changes
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(offDays));
    console.log("💾 Saved off days:", offDays);
  }, [offDays]);

  // Get off days as a Set for quick lookup
  const offDaysSet = useMemo(() => {
    return new Set(offDays.map((d) => d.date));
  }, [offDays]);

  // Check if date is off
  const isOffDay = useCallback(
    (date) => {
      const dateStr =
        typeof date === "string" ? date : date.format("YYYY-MM-DD");
      return offDaysSet.has(dateStr);
    },
    [offDaysSet]
  );

  // Get off day info
  const getOffDayInfo = useCallback(
    (date) => {
      const dateStr =
        typeof date === "string" ? date : date.format("YYYY-MM-DD");
      return offDays.find((d) => d.date === dateStr);
    },
    [offDays]
  );

  // Add off day
  const addOffDay = useCallback((date, reason) => {
    const dateStr = typeof date === "string" ? date : date.format("YYYY-MM-DD");

    setOffDays((prev) => {
      // Check if already exists
      if (prev.some((d) => d.date === dateStr)) {
        message.warning("This day is already marked as off");
        return prev;
      }

      const newOffDay = {
        id: Date.now(),
        date: dateStr,
        reason: reason || "Day Off",
      };

      message.success("Day marked as off");
      return [...prev, newOffDay].sort((a, b) => a.date.localeCompare(b.date));
    });

    setModalOpen(false);
  }, []);

  // Remove off day
  const removeOffDay = useCallback((date) => {
    const dateStr = typeof date === "string" ? date : date.format("YYYY-MM-DD");

    setOffDays((prev) => {
      const filtered = prev.filter((d) => d.date !== dateStr);
      message.success("Day unmarked");
      return filtered;
    });
  }, []);

  // Toggle off day
  const toggleOffDay = useCallback(
    (date) => {
      if (isOffDay(date)) {
        removeOffDay(date);
      } else {
        setSelectedDate(date);
        setModalOpen(true);
      }
    },
    [isOffDay, removeOffDay]
  );

  // Open modal for specific date
  const openModal = useCallback((date) => {
    setSelectedDate(date);
    setModalOpen(true);
  }, []);

  // Close modal
  const closeModal = useCallback(() => {
    setModalOpen(false);
    setSelectedDate(null);
  }, []);

  // Statistics
  const stats = useMemo(() => {
    const thisMonth = dayjs().format("YYYY-MM");
    const nextMonth = dayjs().add(1, "month").format("YYYY-MM");

    return {
      total: offDays.length,
      thisMonth: offDays.filter((d) => d.date.startsWith(thisMonth)).length,
      nextMonth: offDays.filter((d) => d.date.startsWith(nextMonth)).length,
    };
  }, [offDays]);

  // Upcoming off days
  const upcomingOffDays = useMemo(() => {
    const today = dayjs().format("YYYY-MM-DD");
    return offDays
      .filter((d) => d.date >= today)
      .sort((a, b) => a.date.localeCompare(b.date))
      .slice(0, 5)
      .map((d) => ({
        ...d,
        dayjs: dayjs(d.date),
        formatted: dayjs(d.date).format("ddd, MMM D"),
        daysFromNow: dayjs(d.date).diff(dayjs(), "day"),
      }));
  }, [offDays]);

  // Reset to defaults (for testing)
  const resetToDefaults = useCallback(() => {
    setOffDays(defaultOffDays);
    message.success("Reset to default off days");
  }, []);

  // Clear all
  const clearAll = useCallback(() => {
    setOffDays([]);
    message.success("All off days cleared");
  }, []);

  return {
    offDays,
    offDaysSet,
    stats,
    upcomingOffDays,

    // Helpers
    isOffDay,
    getOffDayInfo,

    // Actions
    addOffDay,
    removeOffDay,
    toggleOffDay,
    resetToDefaults,
    clearAll,

    // Modal
    selectedDate,
    modalOpen,
    openModal,
    closeModal,
  };
};

export default useCalendarData;

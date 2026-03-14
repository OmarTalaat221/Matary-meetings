import { useState, useMemo, useCallback } from "react";
import { message } from "antd";
import dayjs from "dayjs";

// Initial off days
const initialOffDays = [
  { id: 1, date: "2026-03-20", reason: "Personal Leave" },
  { id: 2, date: "2026-03-21", reason: "Conference" },
  { id: 3, date: "2026-04-01", reason: "Holiday" },
];

export const useCalendarData = () => {
  const [offDays, setOffDays] = useState(initialOffDays);
  const [selectedDate, setSelectedDate] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

  // Get off days as a Set for quick lookup
  const offDaysSet = useMemo(() => {
    return new Set(offDays.map((d) => d.date));
  }, [offDays]);

  // Check if date is off
  const isOffDay = useCallback(
    (date) => {
      return offDaysSet.has(date.format("YYYY-MM-DD"));
    },
    [offDaysSet]
  );

  // Get off day info
  const getOffDayInfo = useCallback(
    (date) => {
      return offDays.find((d) => d.date === date.format("YYYY-MM-DD"));
    },
    [offDays]
  );

  // Add off day
  const addOffDay = (date, reason) => {
    const dateStr = date.format("YYYY-MM-DD");

    if (offDaysSet.has(dateStr)) {
      message.warning("This day is already marked as off");
      return;
    }

    const newOffDay = {
      id: Date.now(),
      date: dateStr,
      reason: reason || "Day Off",
    };

    setOffDays((prev) => [...prev, newOffDay]);
    message.success("Day marked as off");
    setModalOpen(false);
  };

  // Remove off day
  const removeOffDay = (date) => {
    const dateStr = date.format("YYYY-MM-DD");
    setOffDays((prev) => prev.filter((d) => d.date !== dateStr));
    message.success("Day unmarked");
  };

  // Toggle off day
  const toggleOffDay = (date) => {
    if (isOffDay(date)) {
      removeOffDay(date);
    } else {
      setSelectedDate(date);
      setModalOpen(true);
    }
  };

  // Open modal for specific date
  const openModal = (date) => {
    setSelectedDate(date);
    setModalOpen(true);
  };

  // Close modal
  const closeModal = () => {
    setModalOpen(false);
    setSelectedDate(null);
  };

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
      .slice(0, 5);
  }, [offDays]);

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

    // Modal
    selectedDate,
    modalOpen,
    openModal,
    closeModal,
  };
};

export default useCalendarData;

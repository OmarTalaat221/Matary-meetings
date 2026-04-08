import { useState, useMemo, useCallback, useEffect } from "react";
import { message } from "antd";
import dayjs from "dayjs";
import api from "../../../api/axios";

export const weekDays = [
  { key: "saturday", label: "Saturday", short: "Sat" },
  { key: "sunday", label: "Sunday", short: "Sun" },
  { key: "monday", label: "Monday", short: "Mon" },
  { key: "tuesday", label: "Tuesday", short: "Tue" },
  { key: "wednesday", label: "Wednesday", short: "Wed" },
  { key: "thursday", label: "Thursday", short: "Thu" },
  { key: "friday", label: "Friday", short: "Fri" },
];

export const slotStatusConfig = {
  available: { color: "#52c41a", bg: "#f6ffed", label: "Available" },
};

export const calculateDuration = (startTime, endTime) => {
  const [startH, startM] = startTime.split(":").map(Number);
  let [endH, endM] = endTime.split(":").map(Number);
  if (endH === 0) endH = 24;
  return endH * 60 + endM - (startH * 60 + startM);
};

export const formatDuration = (minutes) => {
  if (minutes < 60) return `${minutes} min`;
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`;
};

export const formatTimeTo12Hour = (time24) => {
  const [hours] = time24.split(":").map(Number);
  if (hours === 0) return "12 AM";
  if (hours === 12) return "12 PM";
  if (hours > 12) return `${hours - 12} PM`;
  return `${hours} AM`;
};

export const useMeetingsData = () => {
  // 💡 المواعيد أصبحت تُحفظ بالتاريخ وليس باليوم {"2026-03-18": [...slots]}
  const [schedule, setSchedule] = useState({});
  const [loading, setLoading] = useState(false);

  // نظام التنقل بالأسابيع
  const [currentWeekSaturday, setCurrentWeekSaturday] = useState(() => {
    const today = dayjs();
    const dayOfWeek = today.day();
    return dayOfWeek === 6
      ? today.startOf("day")
      : today.subtract(dayOfWeek + 1, "day").startOf("day");
  });

  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null); // الاعتماد الكلي على التاريخ
  const [selectedDayLabel, setSelectedDayLabel] = useState("");

  const [slotDetailsModalOpen, setSlotDetailsModalOpen] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState(null);

  const currentMonthStart = dayjs().startOf("month");
  const currentMonthEnd = dayjs().endOf("month");

  // 1️⃣ Fetch API Data
  const fetchWeeklySlots = async () => {
    setLoading(true);
    try {
      const response = await api.get("/slots/list");
      const apiData = response.data.data;

      const formattedSchedule = {};

      if (apiData && Array.isArray(apiData)) {
        apiData.forEach((dayData) => {
          const dateKey = dayData.date; // 💡 نستخدم التاريخ كمفتاح
          formattedSchedule[dateKey] = dayData.slots.map((s) => {
            const [start, end] = s.time.split("-");
            return {
              id: s.id,
              startTime: start.substring(0, 5),
              endTime: end.substring(0, 5),
              status: "available",
              date: dateKey,
            };
          });
        });
      }
      setSchedule(formattedSchedule);
    } catch (error) {
      console.error("Error fetching slots:", error);
      message.error("Failed to load schedule");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWeeklySlots();
  }, [currentWeekSaturday]);

  // Week Navigation
  const nextWeek = () => {
    setCurrentWeekSaturday((prev) => prev.add(7, "day"));
  };
  const prevWeek = () => {
    setCurrentWeekSaturday((prev) => prev.subtract(7, "day"));
  };
  const currentWeek = () => {
    const today = dayjs();
    const dayOfWeek = today.day();
    setCurrentWeekSaturday(
      dayOfWeek === 6
        ? today.startOf("day")
        : today.subtract(dayOfWeek + 1, "day").startOf("day")
    );
  };

  const weekDates = useMemo(() => {
    return weekDays.map((day, index) => {
      const dateObj = currentWeekSaturday.add(index, "day");
      return {
        ...day,
        dateObj,
        fullDate: dateObj.format("YYYY-MM-DD"),
        dateFormatted: dateObj.format("MMM D"),
        fullLabel: `${day.label}, ${dateObj.format("MMM D")}`,
      };
    });
  }, [currentWeekSaturday]);

  const weekInfo = useMemo(() => {
    const endOfWeek = currentWeekSaturday.add(6, "day");
    return {
      start: currentWeekSaturday.format("MMM D"),
      end: endOfWeek.format("MMM D, YYYY"),
    };
  }, [currentWeekSaturday]);

  // 💡 جلب المواعيد بناءً على التاريخ
  const getSlotsForDate = useCallback(
    (dateStr) => {
      return (schedule[dateStr] || []).sort((a, b) =>
        a.startTime.localeCompare(b.startTime)
      );
    },
    [schedule]
  );

  // 2️⃣ Create & Delete Slots via API
  const saveDaySlots = async (dateStr, newSelectedSlots) => {
    setLoading(true);
    try {
      const existingSlots = schedule[dateStr] || [];
      const existingStarts = existingSlots?.map((s) => s.startTime);
      const newStarts = newSelectedSlots?.map((s) => s.startTime);

      const slotsToCreate = newSelectedSlots?.filter(
        (s) => !existingStarts.includes(s.startTime)
      );
      const slotsToDelete = existingSlots?.filter(
        (s) => !newStarts.includes(s.startTime)
      );

      const createPromises = slotsToCreate.map((slot) =>
        api.post("/slots/create", {
          start_time: `${slot.startTime}:00`,
          end_time: `${slot.endTime}:00`,
          slot_date: dateStr,
        })
      );

      const deletePromises = slotsToDelete.map((slot) =>
        api.delete("/slots/delete", { data: { slot_id: slot.id } })
      );

      await Promise.all([...createPromises, ...deletePromises]);

      if (slotsToCreate.length > 0 || slotsToDelete.length > 0) {
        message.success(`Schedule updated for ${dateStr}!`);
        fetchWeeklySlots();
      } else {
        message.info("No changes were made.");
      }
    } catch (error) {
      console.error("Error saving slots:", error);
      message.error("Failed to update schedule");
    } finally {
      setLoading(false);
    }
  };

  // 3️⃣ Delete Single Slot via API
  const removeTimeSlot = async (slotId) => {
    try {
      await api.delete(`/slots/delete`, { data: { slot_id: slotId } });
      message.success("Time slot removed");
      fetchWeeklySlots();
    } catch (error) {
      console.error("Error deleting slot:", error);
      message.error("Failed to delete slot");
    }
  };

  const openDrawer = useCallback((fullDateStr, dayLabel) => {
    setSelectedDate(fullDateStr);
    setSelectedDayLabel(dayLabel);
    setDrawerOpen(true);
  }, []);

  const closeDrawer = useCallback(() => {
    setDrawerOpen(false);
    setSelectedDate(null);
    setSelectedDayLabel("");
  }, []);

  const openSlotDetailsModal = useCallback((slot, dayLabel, fullDateStr) => {
    setSelectedSlot(slot);
    setSelectedDayLabel(dayLabel);
    setSelectedDate(fullDateStr);
    setSlotDetailsModalOpen(true);
  }, []);

  const closeModals = useCallback(() => {
    setSlotDetailsModalOpen(false);
    setSelectedSlot(null);
    setSelectedDate(null);
    setSelectedDayLabel("");
  }, []);

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

  return {
    schedule,
    loading,
    weekDates,
    weekInfo,
    stats,
    getSlotsForDate,
    saveDaySlots,
    removeTimeSlot,
    nextWeek,
    prevWeek,
    currentWeek,

    drawerOpen,
    selectedDate,
    selectedDayLabel,
    openDrawer,
    closeDrawer,
    slotDetailsModalOpen,
    selectedSlot,
    openSlotDetailsModal,
    closeModals,
  };
};

export default useMeetingsData;

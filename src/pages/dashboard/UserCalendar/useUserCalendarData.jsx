// src/pages/dashboard/UserCalendar/useUserCalendarData.jsx
import { useState, useMemo, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import dayjs from "dayjs";

const usersData = [
  {
    id: 1,
    name: "Mohamed Khaled",
    level: "Level 3",
    meetings: [
      {
        id: 1,
        title: "Algebra Lecture",
        date: "2026-03-15",
        time: "10:00",
        status: "completed",
        location: "Room 101",
        doctor: "Dr. Ahmed Mohamed",
      },
      {
        id: 2,
        title: "Mechanics Lecture",
        date: "2026-03-18",
        time: "13:00",
        status: "upcoming",
        location: "Room 201",
        doctor: "Dr. Sara Ahmed",
      },
      {
        id: 3,
        title: "Calculus Lecture",
        date: "2026-03-25",
        time: "10:00",
        status: "upcoming",
        location: "Room 101",
        doctor: "Dr. Ahmed Mohamed",
      },
    ],
  },
  {
    id: 2,
    name: "Fatima Abdullah",
    level: "Level 2",
    meetings: [
      {
        id: 4,
        title: "Physics Lab",
        date: "2026-03-18",
        time: "13:00",
        status: "upcoming",
        location: "Lab 1",
        doctor: "Dr. Sara Ahmed",
      },
      {
        id: 5,
        title: "Electricity Lecture",
        date: "2026-03-21",
        time: "09:00",
        status: "upcoming",
        location: "Room 201",
        doctor: "Dr. Sara Ahmed",
      },
    ],
  },
  {
    id: 3,
    name: "Omar Hassan",
    level: "Level 1",
    meetings: [],
  },
  {
    id: 4,
    name: "Sara Mahmoud",
    level: "Level 4",
    meetings: [
      {
        id: 6,
        title: "Graduation Project",
        date: "2026-03-14",
        time: "11:00",
        status: "completed",
        location: "Room 301",
        doctor: "Dr. Noura Saeed",
      },
      {
        id: 7,
        title: "Networks Lecture",
        date: "2026-03-17",
        time: "09:00",
        status: "completed",
        location: "Room 102",
        doctor: "Dr. Khaled Ali",
      },
      {
        id: 8,
        title: "Programming Lab",
        date: "2026-03-20",
        time: "14:00",
        status: "upcoming",
        location: "Lab 3",
        doctor: "Dr. Ahmed Mohamed",
      },
      {
        id: 9,
        title: "Project Discussion",
        date: "2026-03-24",
        time: "10:00",
        status: "upcoming",
        location: "Room 301",
        doctor: "Dr. Noura Saeed",
      },
    ],
  },
  {
    id: 5,
    name: "Ahmed Ali",
    level: "Level 3",
    meetings: [
      {
        id: 10,
        title: "Algebra Lecture",
        date: "2026-03-15",
        time: "10:00",
        status: "completed",
        location: "Room 101",
        doctor: "Dr. Ahmed Mohamed",
      },
      {
        id: 11,
        title: "Database Lecture",
        date: "2026-03-19",
        time: "11:00",
        status: "upcoming",
        location: "Room 103",
        doctor: "Dr. Khaled Ali",
      },
    ],
  },
  {
    id: 6,
    name: "Noura Saad",
    level: "Level 2",
    meetings: [
      {
        id: 12,
        title: "Physics Lecture",
        date: "2026-03-16",
        time: "10:00",
        status: "completed",
        location: "Room 201",
        doctor: "Dr. Sara Ahmed",
      },
      {
        id: 13,
        title: "Chemistry Lab",
        date: "2026-03-22",
        time: "13:00",
        status: "upcoming",
        location: "Lab 2",
        doctor: "Dr. Noura Saeed",
      },
      {
        id: 14,
        title: "Math Lecture",
        date: "2026-03-23",
        time: "09:00",
        status: "upcoming",
        location: "Room 101",
        doctor: "Dr. Ahmed Mohamed",
      },
    ],
  },
];

export const statusConfig = {
  completed: { color: "#52c41a", bg: "#f6ffed", label: "Completed" },
  upcoming: { color: "#1890ff", bg: "#e6f7ff", label: "Upcoming" },
  cancelled: { color: "#ff4d4f", bg: "#fff2f0", label: "Cancelled" },
};

export const useUserCalendarData = () => {
  const { userId } = useParams();
  const navigate = useNavigate();

  const [selectedMeeting, setSelectedMeeting] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);

  const user = useMemo(() => {
    return usersData.find((u) => u.id === parseInt(userId));
  }, [userId]);

  const statistics = useMemo(() => {
    if (!user) return null;
    return {
      total: user.meetings.length,
      completed: user.meetings.filter((m) => m.status === "completed").length,
      upcoming: user.meetings.filter((m) => m.status === "upcoming").length,
    };
  }, [user]);

  const datesWithMeetings = useMemo(() => {
    if (!user) return {};

    const dates = {};
    user.meetings.forEach((meeting) => {
      const dateKey = dayjs(meeting.date).format("YYYY-MM-DD");
      if (!dates[dateKey]) {
        dates[dateKey] = [];
      }
      dates[dateKey].push(meeting);
    });
    return dates;
  }, [user]);

  const getMeetingsForDate = useCallback(
    (date) => {
      const dateKey = date.format("YYYY-MM-DD");
      return datesWithMeetings[dateKey] || [];
    },
    [datesWithMeetings]
  );

  const openMeetingDetails = (meeting) => {
    setSelectedMeeting(meeting);
    setModalVisible(true);
  };

  const closeMeetingDetails = () => {
    setModalVisible(false);
    setSelectedMeeting(null);
  };

  const goBack = () => navigate("/users");

  return {
    user,
    userExists: !!user,
    statistics,
    selectedMeeting,
    modalVisible,
    datesWithMeetings,
    getMeetingsForDate,
    openMeetingDetails,
    closeMeetingDetails,
    goBack,
  };
};

export default useUserCalendarData;

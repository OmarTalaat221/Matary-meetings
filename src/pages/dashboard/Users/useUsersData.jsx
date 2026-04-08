// src/pages/dashboard/Users/useUsersData.jsx
import { useState, useMemo } from "react";
import { message } from "antd";
import dayjs from "dayjs";

const initialUsers = [
  {
    id: 1,
    name: "Mohamed Khaled",
    email: "mohamed.k@student.com",
    phone: "+966 54 345 6789",
    level: "Level 3",
    status: "active",
    joinDate: "2024-09-01",
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
    email: "fatima.a@student.com",
    phone: "+966 56 456 7890",
    level: "Level 2",
    status: "active",
    joinDate: "2024-09-01",
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
    email: "omar.h@student.com",
    phone: "+966 59 567 8901",
    level: "Level 1",
    status: "inactive",
    joinDate: "2024-09-01",
    meetings: [],
  },
  {
    id: 4,
    name: "Sara Mahmoud",
    email: "sara.m@student.com",
    phone: "+966 55 123 4567",
    level: "Level 4",
    status: "active",
    joinDate: "2023-09-01",
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
    email: "ahmed.ali@student.com",
    phone: "+966 50 234 5678",
    level: "Level 3",
    status: "active",
    joinDate: "2024-09-01",
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
    email: "noura.s@student.com",
    phone: "+966 58 345 6789",
    level: "Level 2",
    status: "active",
    joinDate: "2024-09-01",
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

export const levels = [
  { value: "Level 1", label: "Level 1" },
  { value: "Level 2", label: "Level 2" },
  { value: "Level 3", label: "Level 3" },
  { value: "Level 4", label: "Level 4" },
];

export const statuses = [
  { value: "active", label: "Active", color: "green" },
  { value: "inactive", label: "Inactive", color: "default" },
];

export const useUsersData = () => {
  const [users, setUsers] = useState(initialUsers);
  const [selectedRows, setSelectedRows] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(false);

  const [modalState, setModalState] = useState({
    add: false,
    edit: false,
    view: false,
    delete: false,
  });

  const statistics = useMemo(
    () => ({
      total: users.length,
      active: users.filter((u) => u.status === "active").length,
      inactive: users.filter((u) => u.status === "inactive").length,
      totalMeetings: users.reduce((acc, u) => acc + u.meetings.length, 0),
    }),
    [users]
  );

  const openModal = (type, user = null) => {
    setCurrentUser(user);
    setModalState((prev) => ({ ...prev, [type]: true }));
  };

  const closeModal = (type) => {
    setModalState((prev) => ({ ...prev, [type]: false }));
    setCurrentUser(null);
  };

  const addUser = async (values) => {
    setLoading(true);
    await new Promise((r) => setTimeout(r, 500));

    const newUser = {
      id: Date.now(),
      ...values,
      joinDate: dayjs().format("YYYY-MM-DD"),
      meetings: [],
    };

    setUsers((prev) => [...prev, newUser]);
    message.success("Student added successfully");
    closeModal("add");
    setLoading(false);
  };

  const editUser = async (values) => {
    setLoading(true);
    await new Promise((r) => setTimeout(r, 500));

    setUsers((prev) =>
      prev.map((u) => (u.id === currentUser.id ? { ...u, ...values } : u))
    );

    message.success("Student updated successfully");
    closeModal("edit");
    setLoading(false);
  };

  const deleteUser = async () => {
    setLoading(true);
    await new Promise((r) => setTimeout(r, 500));

    if (selectedRows.length > 0) {
      setUsers((prev) => prev.filter((u) => !selectedRows.includes(u.id)));
      message.success(`${selectedRows.length} students deleted`);
      setSelectedRows([]);
    } else {
      setUsers((prev) => prev.filter((u) => u.id !== currentUser.id));
      message.success("Student deleted");
    }

    closeModal("delete");
    setLoading(false);
  };

  const rowSelection = {
    selectedRowKeys: selectedRows,
    onChange: setSelectedRows,
  };

  return {
    users,
    currentUser,
    selectedRows,
    statistics,
    modalState,
    loading,
    levels,
    statuses,
    openModal,
    closeModal,
    addUser,
    editUser,
    deleteUser,
    rowSelection,
    setSelectedRows,
  };
};

export default useUsersData;

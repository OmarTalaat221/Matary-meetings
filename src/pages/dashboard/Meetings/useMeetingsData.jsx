// src/pages/dashboard/Meetings/useMeetingsData.jsx
import { useState } from "react";
import { message } from "antd";

const useMeetingsData = () => {
  // ============ Data State ============
  const [meetings, setMeetings] = useState([
    {
      id: 1,
      title: "Daily Team Standup",
      date: "2026-03-15",
      time: "10:00",
      duration: 30,
      status: "completed",
      participants: 5,
      organizer: "Ahmed Mohamed",
      type: "standup",
      description: "Daily progress discussion",
      link: "https://meet.google.com/abc-defg-hij",
    },
    {
      id: 2,
      title: "Project Review",
      date: "2026-03-18",
      time: "14:00",
      duration: 60,
      status: "upcoming",
      participants: 8,
      organizer: "Sara Ahmed",
      type: "review",
      description: "Review Q1 project milestones",
    },
    {
      id: 3,
      title: "Client Call",
      date: "2026-03-18",
      time: "16:30",
      duration: 45,
      status: "upcoming",
      participants: 3,
      organizer: "Mohamed Ali",
      type: "client",
      description: "Discuss new requirements with client",
      link: "https://zoom.us/j/123456789",
    },
    {
      id: 4,
      title: "Sprint Planning",
      date: "2026-03-20",
      time: "11:00",
      duration: 90,
      status: "upcoming",
      participants: 6,
      organizer: "Ahmed Mohamed",
      type: "planning",
      description: "Plan tasks for the upcoming sprint",
    },
    {
      id: 5,
      title: "Budget Discussion",
      date: "2026-03-14",
      time: "09:00",
      duration: 60,
      status: "cancelled",
      participants: 4,
      organizer: "Khaled Saeed",
      type: "internal",
      description: "Review budget allocations",
    },
    {
      id: 6,
      title: "Training Session",
      date: "2026-03-22",
      time: "13:00",
      duration: 120,
      status: "upcoming",
      participants: 12,
      organizer: "Noura Saeed",
      type: "training",
      description: "New employee onboarding training",
      link: "https://meet.google.com/xyz-abcd-efg",
    },
    {
      id: 7,
      title: "Design Review",
      date: "2026-03-16",
      time: "15:00",
      duration: 45,
      status: "completed",
      participants: 4,
      organizer: "Fatima Abdullah",
      type: "review",
      description: "Review UI/UX designs for new features",
    },
    {
      id: 8,
      title: "Weekly Team Sync",
      date: "2026-03-19",
      time: "10:00",
      duration: 60,
      status: "ongoing",
      participants: 10,
      organizer: "Ahmed Mohamed",
      type: "internal",
      description: "Weekly team synchronization meeting",
      link: "https://teams.microsoft.com/l/meetup",
    },
  ]);

  const [selectedRows, setSelectedRows] = useState([]);
  const [loading, setLoading] = useState(false);

  // ============ Modal State ============
  const [modalState, setModalState] = useState({
    add: false,
    edit: false,
    view: false,
    delete: false,
    bulkDelete: false,
  });
  const [currentMeeting, setCurrentMeeting] = useState(null);

  // ============ Modal Handlers ============
  const openModal = (type, meeting = null) => {
    setCurrentMeeting(meeting);
    setModalState((prev) => ({ ...prev, [type]: true }));
  };

  const closeModal = (type) => {
    setModalState((prev) => ({ ...prev, [type]: false }));
    if (type !== "bulkDelete") {
      setCurrentMeeting(null);
    }
  };

  // ============ CRUD Operations ============

  const addMeeting = (values) => {
    setLoading(true);
    const newMeeting = {
      ...values,
      id: Date.now(),
    };
    setMeetings((prev) => [newMeeting, ...prev]);
    message.success("Meeting added successfully");
    closeModal("add");
    setLoading(false);
  };

  const editMeeting = (values, id) => {
    setLoading(true);
    setMeetings((prev) =>
      prev.map((meeting) =>
        meeting.id === id ? { ...meeting, ...values } : meeting
      )
    );
    message.success("Meeting updated successfully");
    closeModal("edit");
    setLoading(false);
  };

  const deleteMeeting = () => {
    setLoading(true);
    setMeetings((prev) => prev.filter((m) => m.id !== currentMeeting.id));
    message.success("Meeting deleted successfully");
    closeModal("delete");
    setLoading(false);
  };

  const bulkDeleteMeetings = () => {
    setLoading(true);
    setMeetings((prev) => prev.filter((m) => !selectedRows.includes(m.id)));
    message.success(`${selectedRows.length} meetings deleted successfully`);
    setSelectedRows([]);
    closeModal("bulkDelete");
    setLoading(false);
  };

  const copyMeetingLink = (meeting) => {
    if (meeting.link) {
      navigator.clipboard.writeText(meeting.link);
      message.success("Link copied to clipboard");
    } else {
      message.warning("No link available for this meeting");
    }
  };

  const duplicateMeeting = (meeting) => {
    const duplicated = {
      ...meeting,
      id: Date.now(),
      title: `${meeting.title} (Copy)`,
      status: "upcoming",
    };
    setMeetings((prev) => [duplicated, ...prev]);
    message.success("Meeting duplicated successfully");
  };

  const changeStatus = (meeting, newStatus) => {
    setMeetings((prev) =>
      prev.map((m) => (m.id === meeting.id ? { ...m, status: newStatus } : m))
    );
    const statusLabels = {
      completed: "Completed",
      upcoming: "Upcoming",
      ongoing: "Ongoing",
      cancelled: "Cancelled",
    };
    message.success(`Meeting marked as ${statusLabels[newStatus]}`);
  };

  // ============ Config ============
  const statusConfig = {
    completed: { color: "green", label: "Completed" },
    upcoming: { color: "blue", label: "Upcoming" },
    cancelled: { color: "red", label: "Cancelled" },
    ongoing: { color: "orange", label: "Ongoing" },
  };

  const statusFilters = Object.entries(statusConfig).map(([key, value]) => ({
    text: value.label,
    value: key,
  }));

  const statusOptions = [
    { value: "upcoming", label: "Upcoming" },
    { value: "ongoing", label: "Ongoing" },
    { value: "completed", label: "Completed" },
    { value: "cancelled", label: "Cancelled" },
  ];

  const typeOptions = [
    { value: "standup", label: "Standup" },
    { value: "review", label: "Review" },
    { value: "planning", label: "Planning" },
    { value: "client", label: "Client" },
    { value: "internal", label: "Internal" },
    { value: "training", label: "Training" },
  ];

  return {
    // Data
    meetings,
    selectedRows,
    setSelectedRows,
    loading,

    // Modal
    modalState,
    currentMeeting,
    openModal,
    closeModal,

    // Actions
    addMeeting,
    editMeeting,
    deleteMeeting,
    bulkDeleteMeetings,
    copyMeetingLink,
    duplicateMeeting,
    changeStatus,

    // Config
    statusConfig,
    statusFilters,
    statusOptions,
    typeOptions,
  };
};

export default useMeetingsData;

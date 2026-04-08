import { useState, useMemo, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { message } from "antd";
import dayjs from "dayjs";

// Mock doctors data
const doctorsData = [
  {
    id: 1,
    name: "Dr. Ahmed Hassan",
    email: "ahmed.hassan@hospital.com",
    phone: "+966 50 123 4567",
    specialization: "Cardiology",
    department: "Internal Medicine",
    status: "active",
    lectures: [
      {
        id: 101,
        title: "Cardiovascular Anatomy",
        date: "2026-03-15",
        time: "10:00",
        duration: 90,
        location: "Hall A - Building 2",
        students: ["Mohamed Khaled", "Sara Ahmed", "Ali Hassan"],
        status: "completed",
        type: "lecture",
        description: "Introduction to cardiovascular system",
      },
      {
        id: 102,
        title: "Heart Diseases",
        date: "2026-03-20",
        time: "14:00",
        duration: 120,
        location: "Hall B - Building 2",
        students: ["Mohamed Khaled", "Sara Ahmed"],
        status: "upcoming",
        type: "lecture",
        description: "Common heart diseases and treatments",
      },
      {
        id: 103,
        title: "Clinical Practice",
        date: "2026-03-25",
        time: "09:00",
        duration: 180,
        location: "Hospital - Ward 3",
        students: ["Ali Hassan", "Fatima Omar"],
        status: "upcoming",
        type: "practical",
        description: "Hands-on clinical training",
      },
      {
        id: 104,
        title: "ECG Reading",
        date: "2026-03-15",
        time: "14:00",
        duration: 60,
        location: "Lab 1",
        students: ["Omar Khalid"],
        status: "completed",
        type: "practical",
        description: "How to read ECG results",
      },
    ],
  },
  {
    id: 2,
    name: "Dr. Fatima Al-Sayed",
    email: "fatima.sayed@hospital.com",
    phone: "+966 55 987 6543",
    specialization: "Neurology",
    department: "Neuroscience",
    status: "active",
    lectures: [
      {
        id: 201,
        title: "Brain Anatomy",
        date: "2026-03-16",
        time: "11:00",
        duration: 90,
        location: "Hall C - Building 1",
        students: ["Omar Khalid", "Layla Ahmed"],
        status: "completed",
        type: "lecture",
        description: "Detailed study of brain structure",
      },
      {
        id: 202,
        title: "Neurological Disorders",
        date: "2026-03-22",
        time: "13:00",
        duration: 120,
        location: "Hall C - Building 1",
        students: ["Omar Khalid", "Layla Ahmed", "Youssef Ibrahim"],
        status: "upcoming",
        type: "lecture",
        description: "Common neurological conditions",
      },
    ],
  },
  {
    id: 3,
    name: "Dr. Khaled Ibrahim",
    email: "khaled.ibrahim@hospital.com",
    phone: "+966 54 456 7890",
    specialization: "Orthopedics",
    department: "Surgery",
    status: "active",
    lectures: [
      {
        id: 301,
        title: "Bone Structure",
        date: "2026-03-18",
        time: "09:30",
        duration: 90,
        location: "Hall D - Building 3",
        students: ["Ahmed Samir", "Nour Hassan"],
        status: "upcoming",
        type: "lecture",
        description: "Skeletal system overview",
      },
    ],
  },
  {
    id: 4,
    name: "Dr. Layla Mahmoud",
    email: "layla.mahmoud@hospital.com",
    phone: "+966 53 234 5678",
    specialization: "Pediatrics",
    department: "Children's Health",
    status: "inactive",
    lectures: [],
  },
  {
    id: 5,
    name: "Dr. Omar Rashid",
    email: "omar.rashid@hospital.com",
    phone: "+966 56 789 0123",
    specialization: "General Surgery",
    department: "Surgery",
    status: "active",
    lectures: [
      {
        id: 501,
        title: "Surgical Basics",
        date: "2026-03-17",
        time: "08:00",
        duration: 120,
        location: "Surgery Room 1",
        students: ["Hamza Nabil", "Reem Khalid"],
        status: "upcoming",
        type: "practical",
        description: "Basic surgical skills training",
      },
      {
        id: 502,
        title: "Emergency Procedures",
        date: "2026-03-24",
        time: "08:00",
        duration: 180,
        location: "Emergency Room",
        students: ["Hamza Nabil", "Reem Khalid", "Tariq Youssef"],
        status: "upcoming",
        type: "practical",
        description: "Emergency surgery protocols",
      },
    ],
  },
];

// Status configuration
export const statusConfig = {
  completed: { color: "#52c41a", bg: "#f6ffed", label: "Completed" },
  upcoming: { color: "#1890ff", bg: "#e6f7ff", label: "Upcoming" },
  ongoing: { color: "#722ed1", bg: "#f9f0ff", label: "Ongoing" },
  cancelled: { color: "#ff4d4f", bg: "#fff2f0", label: "Cancelled" },
};

// Type configuration
export const typeConfig = {
  lecture: { color: "#1890ff", bg: "#e6f7ff", label: "Lecture" },
  practical: { color: "#52c41a", bg: "#f6ffed", label: "Practical" },
  seminar: { color: "#722ed1", bg: "#f9f0ff", label: "Seminar" },
  workshop: { color: "#faad14", bg: "#fffbe6", label: "Workshop" },
};

// Students list for selection
export const studentsList = [
  "Mohamed Khaled",
  "Sara Ahmed",
  "Ali Hassan",
  "Fatima Omar",
  "Omar Khalid",
  "Layla Ahmed",
  "Youssef Ibrahim",
  "Ahmed Samir",
  "Nour Hassan",
  "Aisha Kamal",
  "Zainab Ali",
  "Hamza Nabil",
  "Reem Khalid",
  "Tariq Youssef",
];

export const useDoctorCalendarData = () => {
  const { doctorId } = useParams();
  const navigate = useNavigate();

  // Local state for doctors (to allow mutations)
  const [doctors, setDoctors] = useState(doctorsData);

  // Modal states
  const [selectedLecture, setSelectedLecture] = useState(null);
  const [viewModalVisible, setViewModalVisible] = useState(false);
  const [scheduleModalVisible, setScheduleModalVisible] = useState(false);
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);

  // Get current doctor
  const doctor = useMemo(() => {
    return doctors.find((d) => d.id === parseInt(doctorId));
  }, [doctors, doctorId]);

  // Statistics
  const statistics = useMemo(() => {
    if (!doctor) return null;
    return {
      total: doctor.lectures.length,
      completed: doctor.lectures.filter((l) => l.status === "completed").length,
      upcoming: doctor.lectures.filter((l) => l.status === "upcoming").length,
      cancelled: doctor.lectures.filter((l) => l.status === "cancelled").length,
    };
  }, [doctor]);

  // Group lectures by date
  const lecturesByDate = useMemo(() => {
    if (!doctor) return {};

    const dates = {};
    doctor.lectures.forEach((lecture) => {
      const dateKey = dayjs(lecture.date).format("YYYY-MM-DD");
      if (!dates[dateKey]) {
        dates[dateKey] = [];
      }
      dates[dateKey].push(lecture);
    });
    return dates;
  }, [doctor]);

  // Get lectures for specific date
  const getLecturesForDate = useCallback(
    (date) => {
      const dateKey = date.format("YYYY-MM-DD");
      return lecturesByDate[dateKey] || [];
    },
    [lecturesByDate]
  );

  // Open view modal
  const openViewModal = (lecture) => {
    setSelectedLecture(lecture);
    setViewModalVisible(true);
  };

  // Close view modal
  const closeViewModal = () => {
    setViewModalVisible(false);
    setSelectedLecture(null);
  };

  // Open schedule modal (add new)
  const openScheduleModal = (date = null) => {
    setSelectedDate(date);
    setIsEditMode(false);
    setSelectedLecture(null);
    setScheduleModalVisible(true);
  };

  // Open edit modal
  const openEditModal = (lecture) => {
    setSelectedLecture(lecture);
    setIsEditMode(true);
    setScheduleModalVisible(true);
    setViewModalVisible(false);
  };

  // Close schedule modal
  const closeScheduleModal = () => {
    setScheduleModalVisible(false);
    setSelectedLecture(null);
    setSelectedDate(null);
    setIsEditMode(false);
  };

  // Open delete modal
  const openDeleteModal = (lecture) => {
    setSelectedLecture(lecture);
    setDeleteModalVisible(true);
    setViewModalVisible(false);
  };

  // Close delete modal
  const closeDeleteModal = () => {
    setDeleteModalVisible(false);
    setSelectedLecture(null);
  };

  // Add lecture
  const addLecture = (lectureData) => {
    setDoctors((prev) =>
      prev.map((d) => {
        if (d.id === parseInt(doctorId)) {
          const newLecture = {
            id: Math.max(...d.lectures.map((l) => l.id), 0) + 1,
            ...lectureData,
            status: "upcoming",
          };
          return {
            ...d,
            lectures: [...d.lectures, newLecture],
          };
        }
        return d;
      })
    );
    message.success("Lecture scheduled successfully");
    closeScheduleModal();
  };

  // Update lecture
  const updateLecture = (lectureData) => {
    setDoctors((prev) =>
      prev.map((d) => {
        if (d.id === parseInt(doctorId)) {
          return {
            ...d,
            lectures: d.lectures.map((l) =>
              l.id === selectedLecture.id ? { ...l, ...lectureData } : l
            ),
          };
        }
        return d;
      })
    );
    message.success("Lecture updated successfully");
    closeScheduleModal();
  };

  // Delete lecture
  const deleteLecture = () => {
    setDoctors((prev) =>
      prev.map((d) => {
        if (d.id === parseInt(doctorId)) {
          return {
            ...d,
            lectures: d.lectures.filter((l) => l.id !== selectedLecture.id),
          };
        }
        return d;
      })
    );
    message.success("Lecture deleted successfully");
    closeDeleteModal();
  };

  // Mark as completed
  const markAsCompleted = (lecture) => {
    setDoctors((prev) =>
      prev.map((d) => {
        if (d.id === parseInt(doctorId)) {
          return {
            ...d,
            lectures: d.lectures.map((l) =>
              l.id === lecture.id ? { ...l, status: "completed" } : l
            ),
          };
        }
        return d;
      })
    );
    message.success("Lecture marked as completed");
  };

  // Cancel lecture
  const cancelLecture = (lecture) => {
    setDoctors((prev) =>
      prev.map((d) => {
        if (d.id === parseInt(doctorId)) {
          return {
            ...d,
            lectures: d.lectures.map((l) =>
              l.id === lecture.id ? { ...l, status: "cancelled" } : l
            ),
          };
        }
        return d;
      })
    );
    message.success("Lecture cancelled");
  };

  // Go back
  const goBack = () => navigate("/doctors");

  return {
    doctor,
    doctorExists: !!doctor,
    statistics,
    lecturesByDate,
    getLecturesForDate,

    // Modal states
    selectedLecture,
    viewModalVisible,
    scheduleModalVisible,
    deleteModalVisible,
    isEditMode,
    selectedDate,

    // Modal actions
    openViewModal,
    closeViewModal,
    openScheduleModal,
    openEditModal,
    closeScheduleModal,
    openDeleteModal,
    closeDeleteModal,

    // CRUD actions
    addLecture,
    updateLecture,
    deleteLecture,
    markAsCompleted,
    cancelLecture,

    goBack,
  };
};

export default useDoctorCalendarData;

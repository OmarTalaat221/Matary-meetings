import { useState, useMemo } from "react";
import { message } from "antd";

// Mock doctors data
const initialDoctors = [
  {
    id: 1,
    name: "Dr. Ahmed Hassan",
    email: "ahmed.hassan@hospital.com",
    phone: "+966 50 123 4567",
    specialization: "Cardiology",
    department: "Internal Medicine",
    status: "active",
    joinDate: "2023-01-15",
    officeHours: "Sun-Thu, 9:00 AM - 5:00 PM",
    bio: "Specialized in cardiovascular diseases with 15 years of experience",
    avatar: null,
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
    joinDate: "2023-03-20",
    officeHours: "Sun-Thu, 10:00 AM - 4:00 PM",
    bio: "Expert in neurological disorders and brain imaging",
    avatar: null,
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
    joinDate: "2022-09-10",
    officeHours: "Mon-Wed, 8:00 AM - 3:00 PM",
    bio: "Specializing in sports injuries and joint replacement",
    avatar: null,
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
      {
        id: 302,
        title: "Surgical Techniques",
        date: "2026-03-28",
        time: "10:00",
        duration: 150,
        location: "Surgery Room 2",
        students: ["Ahmed Samir"],
        status: "upcoming",
        type: "practical",
        description: "Advanced surgical procedures",
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
    joinDate: "2023-06-01",
    officeHours: "Sun-Tue, 9:00 AM - 2:00 PM",
    bio: "Dedicated to child healthcare and development",
    avatar: null,
    lectures: [
      {
        id: 401,
        title: "Child Development",
        date: "2026-03-14",
        time: "10:30",
        duration: 90,
        location: "Hall E - Building 1",
        students: ["Aisha Kamal", "Zainab Ali"],
        status: "cancelled",
        type: "lecture",
        description: "Stages of child growth",
      },
    ],
  },
  {
    id: 5,
    name: "Dr. Omar Rashid",
    email: "omar.rashid@hospital.com",
    phone: "+966 56 789 0123",
    specialization: "General Surgery",
    department: "Surgery",
    status: "active",
    joinDate: "2021-11-15",
    officeHours: "Sun-Thu, 7:00 AM - 3:00 PM",
    bio: "Experienced in emergency and elective surgeries",
    avatar: null,
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
const statusConfig = {
  active: {
    color: "#52c41a",
    bg: "#f6ffed",
    label: "Active",
  },
  inactive: {
    color: "#ff4d4f",
    bg: "#fff2f0",
    label: "Inactive",
  },
  onLeave: {
    color: "#faad14",
    bg: "#fffbe6",
    label: "On Leave",
  },
};

// Lecture status configuration
const lectureStatusConfig = {
  completed: {
    color: "#52c41a",
    bg: "#f6ffed",
    label: "Completed",
  },
  upcoming: {
    color: "#1890ff",
    bg: "#e6f7ff",
    label: "Upcoming",
  },
  cancelled: {
    color: "#ff4d4f",
    bg: "#fff2f0",
    label: "Cancelled",
  },
  ongoing: {
    color: "#722ed1",
    bg: "#f9f0ff",
    label: "Ongoing",
  },
};

// Lecture type configuration
const lectureTypeConfig = {
  lecture: {
    color: "#1890ff",
    bg: "#e6f7ff",
    label: "Lecture",
  },
  practical: {
    color: "#52c41a",
    bg: "#f6ffed",
    label: "Practical",
  },
  seminar: {
    color: "#722ed1",
    bg: "#f9f0ff",
    label: "Seminar",
  },
  workshop: {
    color: "#faad14",
    bg: "#fffbe6",
    label: "Workshop",
  },
};

export const useDoctorsData = () => {
  const [doctors, setDoctors] = useState(initialDoctors);
  const [selectedDoctorId, setSelectedDoctorId] = useState(null);

  // Get doctor by ID
  const getDoctor = (id) => {
    return doctors.find((doctor) => doctor.id === id);
  };

  // Add new doctor
  const addDoctor = (doctorData) => {
    const newDoctor = {
      id: Math.max(...doctors.map((d) => d.id), 0) + 1,
      ...doctorData,
      lectures: [],
      joinDate: new Date().toISOString().split("T")[0],
    };

    setDoctors((prev) => [...prev, newDoctor]);
    message.success("Doctor added successfully");
    return newDoctor;
  };

  // Update doctor
  const updateDoctor = (id, updates) => {
    setDoctors((prev) =>
      prev.map((doctor) =>
        doctor.id === id ? { ...doctor, ...updates } : doctor
      )
    );
    message.success("Doctor updated successfully");
  };

  // Delete doctor
  const deleteDoctor = (id) => {
    setDoctors((prev) => prev.filter((doctor) => doctor.id !== id));
    message.success("Doctor deleted successfully");
  };

  // Add lecture to doctor
  const addLecture = (doctorId, lectureData) => {
    setDoctors((prev) =>
      prev.map((doctor) => {
        if (doctor.id === doctorId) {
          const newLecture = {
            id: Math.max(...doctor.lectures.map((l) => l.id), 0) + 1,
            ...lectureData,
          };
          return {
            ...doctor,
            lectures: [...doctor.lectures, newLecture],
          };
        }
        return doctor;
      })
    );
    message.success("Lecture scheduled successfully");
  };

  // Update lecture
  const updateLecture = (doctorId, lectureId, updates) => {
    setDoctors((prev) =>
      prev.map((doctor) => {
        if (doctor.id === doctorId) {
          return {
            ...doctor,
            lectures: doctor.lectures.map((lecture) =>
              lecture.id === lectureId ? { ...lecture, ...updates } : lecture
            ),
          };
        }
        return doctor;
      })
    );
    message.success("Lecture updated successfully");
  };

  // Delete lecture
  const deleteLecture = (doctorId, lectureId) => {
    setDoctors((prev) =>
      prev.map((doctor) => {
        if (doctor.id === doctorId) {
          return {
            ...doctor,
            lectures: doctor.lectures.filter(
              (lecture) => lecture.id !== lectureId
            ),
          };
        }
        return doctor;
      })
    );
    message.success("Lecture deleted successfully");
  };

  // Calculate statistics
  const stats = useMemo(() => {
    const totalDoctors = doctors.length;
    const activeDoctors = doctors.filter((d) => d.status === "active").length;
    const inactiveDoctors = doctors.filter(
      (d) => d.status === "inactive"
    ).length;
    const totalLectures = doctors.reduce(
      (sum, d) => sum + d.lectures.length,
      0
    );
    const upcomingLectures = doctors.reduce(
      (sum, d) =>
        sum + d.lectures.filter((l) => l.status === "upcoming").length,
      0
    );

    return {
      totalDoctors,
      activeDoctors,
      inactiveDoctors,
      totalLectures,
      upcomingLectures,
    };
  }, [doctors]);

  return {
    doctors,
    selectedDoctorId,
    setSelectedDoctorId,
    getDoctor,
    addDoctor,
    updateDoctor,
    deleteDoctor,
    addLecture,
    updateLecture,
    deleteLecture,
    stats,
    statusConfig,
    lectureStatusConfig,
    lectureTypeConfig,
  };
};

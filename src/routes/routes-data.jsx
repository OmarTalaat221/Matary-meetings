// src/routes/routes-data.jsx
import {
  LayoutDashboard,
  Video,
  Calendar,
  Users,
  Stethoscope,
  Settings,
  Clock,
  CalendarOff,
  Settings2,
  BookOpen,
} from "lucide-react";

import { lazy } from "react";

// ============ AUTH PAGES (NO LAZY - Important!) ============
import Login from "../pages/auth/Login";
import Signup from "../pages/auth/Signup";
import ReservedMeetings from "../pages/doctor/ReservedMeetings/ReservedMeetings";
// ============ ADMIN PAGES ============
const Home = lazy(() => import("../pages/dashboard/Home/Home"));
const Meetings = lazy(() => import("../pages/dashboard/Meetings"));
const UsersPage = lazy(() => import("../pages/dashboard/Users"));
const UserCalendar = lazy(() => import("../pages/dashboard/UserCalendar"));
const Doctors = lazy(() => import("../pages/dashboard/Doctors/Doctors"));
const DoctorCalendar = lazy(
  () => import("../pages/dashboard/Doctors/DoctorCalendar")
);

// ============ DOCTOR PAGES ============
const DoctorMeetings = lazy(() => import("../pages/doctor/Meetings/Meetings"));
const DoctorCalendarPage = lazy(
  () => import("../pages/doctor/Calendar/Calendar")
);
const GeneralSettings = lazy(() => import("../pages/doctor/Settings/Settings"));
const DoctorDashboard = lazy(
  () => import("../pages/doctor/Dashboard/Dashboard")
);

// ============ SESSIONS DOCTOR PAGES (Placeholder - هننشئهم بعدين) ============
const SessionsList = lazy(
  () => import("../pages/doctor/Sessions/SessionsList")
);
const SessionStudentsList = lazy(
  () => import("../pages/doctor/Sessions/components/SessionStudentsList")
);

// ============ AUTH ROUTES ============
export const authRoutes = [
  { path: "/login", element: <Login /> },
  { path: "/signup", element: <Signup /> },
];

// ============ ADMIN ROUTES ============
export const adminRoutes = [
  {
    path: "/dashboard",
    label: "Dashboard",
    icon: LayoutDashboard,
    element: <Home />,
  },
  {
    path: "/meetings",
    label: "Meetings",
    icon: Video,
    element: <Meetings />,
  },
  {
    path: "/doctors",
    label: "Doctors",
    icon: Stethoscope,
    element: <Doctors />,
  },
  {
    path: "/doctors/:doctorId/calendar",
    element: <DoctorCalendar />,
    hidden: true,
  },
  {
    path: "/users",
    label: "Students",
    icon: Users,
    element: <UsersPage />,
  },
  {
    path: "/users/:userId/calendar",
    element: <UserCalendar />,
    hidden: true,
  },
];

// ============ DOCTOR ROUTES (Private Doctor - Meetings) ============
export const privateDoctorRoutes = [
  {
    path: "/dashboard",
    label: "Dashboard",
    icon: LayoutDashboard,
    element: <DoctorDashboard />,
  },
  {
    path: "/reserved-meetings",
    label: "Reserved Meetings",
    icon: Video,
    element: <ReservedMeetings />,
  },
  {
    key: "settings",
    label: "Settings",
    icon: Settings,
    isGroup: true,
    children: [
      {
        path: "/settings/availability",
        label: "Daily Available Time",
        icon: Clock,
        element: <DoctorMeetings />,
      },
      {
        path: "/settings/general-setting",
        label: "General Settings",
        icon: Settings2,
        element: <GeneralSettings />,
      },
    ],
  },
];

// ============ SESSIONS DOCTOR ROUTES (Group Sessions) ============
export const sessionsDoctorRoutes = [
  {
    path: "/dashboard",
    label: "Dashboard",
    icon: LayoutDashboard,
    element: <DoctorDashboard />,
  },
  {
    path: "/sessions",
    label: "Sessions",
    icon: BookOpen,
    element: <SessionsList />,
  },
  {
    path: "/sessions/:sessionId/students",
    label: "Students",
    icon: BookOpen,
    hidden: true,
    element: <SessionStudentsList />,
  },
];

// ============ HELPER FUNCTIONS ============
export const getRoutesByRole = (role, doctorType = null) => {
  let routes = [];

  if (role === "admin") {
    routes = adminRoutes;
  } else if (role === "doctor") {
    // اختيار Routes حسب نوع الدكتور
    switch (doctorType) {
      case "sessions":
      case "group":
        routes = sessionsDoctorRoutes;
        break;
      case "private":
      default:
        routes = privateDoctorRoutes;
        break;
    }
  }

  // Flatten routes for React Router
  const flattenedRoutes = [];
  routes.forEach((route) => {
    if (route.children) {
      route.children.forEach((child) => {
        flattenedRoutes.push(child);
      });
    } else if (route.path) {
      flattenedRoutes.push(route);
    }
  });

  return flattenedRoutes;
};

export const getSidebarItems = (role, doctorType = null) => {
  let routes = [];

  if (role === "admin") {
    routes = adminRoutes;
  } else if (role === "doctor") {
    switch (doctorType) {
      case "sessions":
      case "group":
        routes = sessionsDoctorRoutes;
        break;
      case "private":
      default:
        routes = privateDoctorRoutes;
        break;
    }
  }

  return routes.filter((route) => !route.hidden);
};

export const getHomePath = (role) => {
  return "/dashboard";
};

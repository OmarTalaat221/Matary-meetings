import {
  LayoutDashboard,
  Video,
  Calendar,
  Users,
  Stethoscope,
} from "lucide-react";

import { lazy } from "react";

// ============ AUTH PAGES ============
const Login = lazy(() => import("../pages/auth/Login"));
const Signup = lazy(() => import("../pages/auth/Signup"));

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

// ============ DOCTOR ROUTES ============
export const doctorRoutes = [
  {
    path: "/dashboard",
    label: "Meetings",
    icon: Video,
    element: <DoctorMeetings />,
  },
  {
    path: "/calendar",
    label: "Calendar",
    icon: Calendar,
    element: <DoctorCalendarPage />,
  },
];

// ============ HELPER FUNCTIONS ============

// Get routes by role
export const getRoutesByRole = (role) => {
  switch (role) {
    case "admin":
      return adminRoutes;
    case "doctor":
      return doctorRoutes;
    default:
      return [];
  }
};

// Get sidebar items by role
export const getSidebarItems = (role) => {
  const routes = getRoutesByRole(role);
  return routes.filter((route) => !route.hidden);
};

// Get home path by role
export const getHomePath = (role) => {
  return "/dashboard";
};

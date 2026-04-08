// ============ AUTH ============
export const AUTH_ENDPOINTS = {
  LOGIN: "/auth/login",
};

// ============ DOCTOR ============
export const DOCTOR_ENDPOINTS = {
  // Profile
  PROFILE: "/doctor/profile",
  UPDATE_PROFILE: "/doctor/profile",

  // Schedule / Availability
  SCHEDULE: "/doctor/schedule",
  UPDATE_SCHEDULE: "/doctor/schedule",

  // Days Off
  DAYS_OFF: "/doctor/days-off",
  ADD_DAY_OFF: "/doctor/days-off",
  REMOVE_DAY_OFF: (id) => `/doctor/days-off/${id}`,

  // Settings
  SETTINGS: "/doctor/settings",
  UPDATE_SETTINGS: "/doctor/settings",

  // Meetings (Old - if needed)
  MEETINGS: "/doctor/meetings",
  MEETING_DETAILS: (id) => `/doctor/meetings/${id}`,
};

// ============ MEETINGS (Reserved) ============
export const MEETINGS_ENDPOINTS = {
  LIST: "/meetings/list",
  ACTION: "/meetings/action",
  CANCEL: "/meetings/cancel",
};

export const SESSIONS_ENDPOINTS = {
  LIST: "/sessions/list",
  CREATE: "/sessions/create",
  UPDATE: "/sessions/update",
  DELETE: "/sessions/delete",
  STUDENTS: "/sessions/students/list",
};

// ============ ADMIN ============
export const ADMIN_ENDPOINTS = {
  // Doctors
  DOCTORS: "/admin/doctors",
  DOCTOR_DETAILS: (id) => `/admin/doctors/${id}`,

  // Users/Students
  USERS: "/admin/users",
  USER_DETAILS: (id) => `/admin/users/${id}`,

  // Meetings
  MEETINGS: "/admin/meetings",
};

import { createContext, useState, useEffect } from "react";

export const AuthContext = createContext(null);

// Mock users data
const mockUsers = {
  admin: {
    id: 1,
    name: "Admin User",
    email: "admin@matary.com",
    role: "admin",
    avatar: null,
  },
  doctor: {
    id: 2,
    name: "Dr. Ahmed Hassan",
    email: "dr.ahmed@hospital.com",
    role: "doctor",
    specialization: "Cardiology",
    department: "Internal Medicine",
    phone: "+966 50 123 4567",
    avatar: null,
  },
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for saved session
    const savedUser = localStorage.getItem("user");
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setLoading(false);
  }, []);

  const login = (credentials) => {
    // Mock login - replace with API call
    // For demo: admin@matary.com = admin, any other email = doctor
    if (credentials.email && credentials.password) {
      let userData;

      if (credentials.email.includes("admin")) {
        userData = { ...mockUsers.admin, email: credentials.email };
      } else {
        userData = { ...mockUsers.doctor, email: credentials.email };
      }

      setUser(userData);
      localStorage.setItem("user", JSON.stringify(userData));
      localStorage.setItem("token", "mock-token");

      return { success: true, role: userData.role };
    }
    return { success: false, error: "Invalid credentials" };
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
    localStorage.removeItem("token");
  };

  const isAuthenticated = !!user;
  const isAdmin = user?.role === "admin";
  const isDoctor = user?.role === "doctor";

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        isAuthenticated,
        isAdmin,
        isDoctor,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// src/context/AuthContext.jsx
import { createContext, useState, useEffect, useCallback } from "react";
import { authService } from "../api/services/auth.service";
import { getUser, getToken, clearAuth } from "../utils/token";

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isInitialized, setIsInitialized] = useState(false); // ✅ جديد

  // Initialize auth state from localStorage
  useEffect(() => {
    const initAuth = async () => {
      try {
        const token = getToken();
        const storedUser = getUser();

        if (token && storedUser) {
          setUser(storedUser);
        }
      } catch (error) {
        console.error("Error initializing auth:", error);
        clearAuth();
      } finally {
        setLoading(false);
        setIsInitialized(true); // ✅ تم التهيئة
      }
    };

    initAuth();
  }, []);

  // ============ LOGIN ============
  const login = async (email, password) => {
    const result = await authService.login(email, password);

    if (result.success) {
      setUser(result.user);
      return {
        success: true,
        user: result.user,
        role: "doctor",
      };
    }

    return {
      success: false,
      error: result.message,
    };
  };

  // ============ LOGOUT ============
  const logout = useCallback(() => {
    authService.logout();
    setUser(null);
  }, []);

  // ============ COMPUTED VALUES ============
  const isAuthenticated = !!user;
  const isAdmin = false;
  const isDoctor = !!user;

  // ============ DOCTOR TYPE HELPERS ============
  const getDoctorType = useCallback(() => {
    return user?.doctor_type || null;
  }, [user]);

  const isPrivateDoctor = user?.doctor_type === "private";
  const isGroupDoctor = user?.doctor_type === "group";
  const isSessionsDoctor = user?.doctor_type === "sessions";

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        isInitialized, // ✅ إضافة
        isAuthenticated,
        isAdmin,
        isDoctor,
        login,
        logout,
        // Doctor type helpers
        getDoctorType,
        isPrivateDoctor,
        isGroupDoctor,
        isSessionsDoctor,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

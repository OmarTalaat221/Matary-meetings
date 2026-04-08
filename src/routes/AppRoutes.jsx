// src/routes/AppRoutes.jsx
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import { Suspense, useMemo } from "react";
import { useAuth } from "../hooks/useAuth";
import { authRoutes, getRoutesByRole, getHomePath } from "./routes-data";
import DashboardLayout from "../components/layout/DashboardLayout";
import Loading from "../components/common/Loading";

// ============ PROTECTED ROUTE WRAPPER ============
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading, isInitialized } = useAuth();
  const location = useLocation();

  // ✅ انتظر حتى يتم تهيئة الـ Auth بالكامل
  if (!isInitialized || loading) {
    return <Loading />;
  }

  if (!isAuthenticated) {
    // ✅ احفظ المسار الحالي للرجوع إليه بعد تسجيل الدخول
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
};

// ============ PUBLIC ROUTE WRAPPER ============
const PublicRoute = ({ children }) => {
  const { isAuthenticated, loading, isInitialized } = useAuth();
  const location = useLocation();

  // ✅ انتظر حتى يتم تهيئة الـ Auth
  if (!isInitialized || loading) {
    return <Loading />;
  }

  if (isAuthenticated) {
    // ✅ ارجع للصفحة اللي كان فيها لو موجودة
    const from = location.state?.from?.pathname || getHomePath("doctor");
    return <Navigate to={from} replace />;
  }

  return children;
};

// ============ MAIN ROUTES ============
const AppRoutes = () => {
  const { user, getDoctorType, loading, isInitialized } = useAuth();

  // ✅ استخدم useMemo لتجنب إعادة حساب الـ routes
  const protectedRoutes = useMemo(() => {
    if (!user) return [];
    const doctorType = getDoctorType();
    return getRoutesByRole("doctor", doctorType);
  }, [user, getDoctorType]);

  // ✅ انتظر التهيئة الكاملة قبل render
  if (!isInitialized || loading) {
    return <Loading />;
  }

  return (
    <Routes>
      {/* Auth Routes (Public) */}
      {authRoutes.map((route) => (
        <Route
          key={route.path}
          path={route.path}
          element={<PublicRoute>{route.element}</PublicRoute>}
        />
      ))}

      {/* Protected Routes - Nested under DashboardLayout */}
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        {/* Dashboard Home */}
        <Route index element={<Navigate to="/dashboard" replace />} />

        {/* Dynamic Protected Routes */}
        {protectedRoutes.map((route) => (
          <Route
            key={route.path}
            path={route.path}
            element={
              <Suspense fallback={<Loading />}>{route.element}</Suspense>
            }
          />
        ))}

        {/* ✅ Fallback للـ routes الغير موجودة داخل الـ dashboard */}
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Route>

      {/* 404 - Catch all */}
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
};

export default AppRoutes;

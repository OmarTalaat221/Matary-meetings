import { Routes, Route, Navigate } from "react-router-dom";
import { Suspense } from "react";
import { useAuth } from "../hooks/useAuth";
import { authRoutes, getRoutesByRole, getHomePath } from "./routes-data";
import DashboardLayout from "../components/layout/DashboardLayout";
import Loading from "../components/common/Loading";

const AppRoutes = () => {
  const { isAuthenticated, user, loading } = useAuth();

  if (loading) {
    return <Loading />;
  }

  const protectedRoutes = isAuthenticated ? getRoutesByRole(user?.role) : [];
  const homePath = getHomePath(user?.role);

  return (
    <Suspense fallback={<Loading />}>
      <Routes>
        {/* Auth Routes */}
        {authRoutes.map((route) => (
          <Route
            key={route.path}
            path={route.path}
            element={
              isAuthenticated ? (
                <Navigate to={homePath} replace />
              ) : (
                route.element
              )
            }
          />
        ))}

        {/* Protected Routes - Nested under DashboardLayout */}
        {isAuthenticated && (
          <Route element={<DashboardLayout />}>
            {protectedRoutes.map((route) => (
              <Route
                key={route.path}
                path={route.path}
                element={route.element}
              />
            ))}
          </Route>
        )}

        {/* Default Redirect */}
        <Route
          path="/"
          element={
            <Navigate to={isAuthenticated ? homePath : "/login"} replace />
          }
        />

        {/* 404 */}
        <Route
          path="*"
          element={
            <Navigate to={isAuthenticated ? homePath : "/login"} replace />
          }
        />
      </Routes>
    </Suspense>
  );
};

export default AppRoutes;

// src/routes/ProtectedRoute.jsx
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import Loading from "../components/common/Loading";

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return <Loading />;
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
};

export default ProtectedRoute;

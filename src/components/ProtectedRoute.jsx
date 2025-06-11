import { Navigate, useLocation } from "react-router-dom";

export default function ProtectedRoute({ children, allowedRoles = [] }) {
  const location = useLocation();
  const userData = localStorage.getItem("user");
  const token = localStorage.getItem("token");

  // Jika tidak ada token atau user data, redirect ke login
  if (!token || !userData) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Jika ada allowedRoles, periksa apakah user memiliki role yang diizinkan
  if (allowedRoles.length > 0) {
    const user = JSON.parse(userData);
    if (!allowedRoles.includes(user.role)) {
      // Redirect ke halaman yang sesuai dengan role user
      if (user.role === "ADMIN") {
        return <Navigate to="/dashboard-admin" replace />;
      } else if (user.role === "PETANI") {
        return <Navigate to="/dashboard-petani" replace />;
      } else if (user.role === "PEMBELI") {
        return <Navigate to="/dashboard-pembeli" replace />;
      } else {
        return <Navigate to="/" replace />;
      }
    }
  }

  return children;
}

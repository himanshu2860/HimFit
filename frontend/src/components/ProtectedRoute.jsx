import { Navigate } from "react-router-dom";

export default function ProtectedRoute({ children }) {
  const token =
    localStorage.getItem("token") ||
    sessionStorage.getItem("token");

 
  if (!token) {
    return <Navigate to="/login" replace />;
  }

 
  const user = localStorage.getItem("user");

  if (!user) {
    localStorage.removeItem("token");
    return <Navigate to="/login" replace />;
  }

  return children;
}
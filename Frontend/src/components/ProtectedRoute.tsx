// ProtectedRoute.tsx
import { useUserStore } from "@/Stores/UserStore";
import React from "react";
import { Navigate, useLocation } from "react-router-dom";

interface ProtectedRouteProps {
  element: JSX.Element;
  allowedRoles: string[]; // Accept multiple allowed roles
}


const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  element,
  allowedRoles,
}) => {
  const user = useUserStore((state) => state.user);
  const location = useLocation();

  if (!user || !allowedRoles.includes(user.employeePosition)) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return element;
};

export default ProtectedRoute;

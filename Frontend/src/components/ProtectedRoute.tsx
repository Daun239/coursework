// ProtectedRoute.tsx
import { useUserStore } from "@/Stores/UserStore";
import React from "react";
import { Navigate, useLocation } from "react-router-dom";

interface ProtectedRouteProps {
  element: JSX.Element;
  requiredRole: string; // The role needed to access this route
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  element,
  requiredRole,
}) => {
  const user = useUserStore((state) => state.user); // Access the current user
  const location = useLocation(); // To remember where to redirect if not authorized

  if (!user || user.role !== requiredRole) {
    // Redirect them to login if they are not authorized or not logged in
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return element; // If the user has the required role, show the element (protected page)
};

export default ProtectedRoute;

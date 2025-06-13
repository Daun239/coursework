// ProtectedRoute.tsx
import { useUserStore } from "@/Stores/UserStore";
import React from "react";
import { Navigate, useLocation } from "react-router-dom";

interface ProtectedRouteProps {
  element: JSX.Element;
  allowedRoles: string[];
}

const roleRedirectMap: Record<string, string> = {
  Cashier: "/movies",
  Manager: "/clientsPage",
  WarehouseWorker: "/deliveryOrders",
  Admin: "/auditPage",
};

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  element,
  allowedRoles,
}) => {
  // const user = useUserStore((state) => state.user);


  const { user } = useUserStore();

  console.log('USER', user);


  const location = useLocation();

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (!allowedRoles.includes(user.employeePosition)) {
    const redirectPath = roleRedirectMap[user.employeePosition] || "/";
    return <Navigate to={redirectPath} replace />;
  }

  return element;
};

export default ProtectedRoute;

// src/components/auth/ProtectedRoute.tsx
import React from "react";
import { Navigate } from "react-router-dom";
import {useLoginInfo} from "../../hook/auth/useLoginInfo";

interface ProtectedRouteProps {
  requiredRoles?: string[];
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ requiredRoles, children }) => {
  const { data: user, isLoading } = useLoginInfo();

  if (isLoading) return <div>Đang tải...</div>;
  if (!user) return <Navigate to="/login" replace />;

  if (requiredRoles && !requiredRoles.includes(user.user.role)) {
    return <div>Bạn không có quyền truy cập trang này.</div>;
  }

  return <>{children}</>;
};

export default ProtectedRoute;

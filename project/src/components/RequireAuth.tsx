import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

interface Props {
  children: JSX.Element;
  role?: string; // nếu có, thì bắt buộc phải đúng role
}

const RequireAuth: React.FC<Props> = ({ children, role }) => {
  const { user } = useAuth();
  const location = useLocation();

  if (!user) {
    // ❌ Chưa đăng nhập
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (role && user.role !== role) {
    // ❌ Có role yêu cầu nhưng không đúng
    return <Navigate to="/" replace />;
  }

  return children;
};

export default RequireAuth;

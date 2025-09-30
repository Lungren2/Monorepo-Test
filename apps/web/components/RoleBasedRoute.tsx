import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/components/auth';

interface RoleBasedRouteProps {
  children: React.ReactNode;
  requiredRole?: string;
  requiredRoles?: string[];
  fallbackRoute?: string;
}

const RoleBasedRoute: React.FC<RoleBasedRouteProps> = ({
  children,
  requiredRole,
  requiredRoles,
  fallbackRoute = '/unauthorized',
}) => {
  const { user, hasRole } = useAuth();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Check single role
  if (requiredRole && !hasRole(requiredRole)) {
    return <Navigate to={fallbackRoute} replace />;
  }

  // Check multiple roles (user needs at least one)
  if (requiredRoles && !requiredRoles.some((role) => hasRole(role))) {
    return <Navigate to={fallbackRoute} replace />;
  }

  return <>{children}</>;
};

export default RoleBasedRoute;

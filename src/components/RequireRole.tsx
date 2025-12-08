import { ReactNode } from 'react';
import { User, UserRole, hasRole } from '../utils/auth';
import { AccessDenied } from './AccessDenied';

interface RequireRoleProps {
  user: User | null;
  roles: UserRole[];
  children: ReactNode;
  fallback?: ReactNode;
}

export function RequireRole({ user, roles, children, fallback }: RequireRoleProps) {
  if (!hasRole(user, roles)) {
    if (fallback !== undefined) {
      return <>{fallback}</>;
    }
    return <AccessDenied userRole={user?.role} />;
  }

  return <>{children}</>;
}

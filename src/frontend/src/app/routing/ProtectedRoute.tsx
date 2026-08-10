import type { ReactNode } from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import type { Role } from '../../shared/types/auth';
import { useAuth } from '../auth/useAuth';

type ProtectedRouteProps = {
	roles?: readonly Role[];
	children?: ReactNode;
};

export function ProtectedRoute({ roles, children }: ProtectedRouteProps) {
	const { isAuthenticated, user } = useAuth();
	const location = useLocation();

	if (!isAuthenticated) {
		return <Navigate to="/auth/login" replace state={{ from: location.pathname }} />;
	}

	if (roles?.length && !roles.some((role) => user?.roles.includes(role))) {
		return <Navigate to="/forbidden" replace />;
	}

	return children ?? <Outlet />;
}

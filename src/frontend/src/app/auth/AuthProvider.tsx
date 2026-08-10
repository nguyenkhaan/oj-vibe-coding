import { useMemo, useState, type ReactNode } from 'react';
import type { UserSession } from '../../shared/types/auth';
import { AuthContext } from './authContext';

type AuthProviderProps = {
	children: ReactNode;
	initialUser?: UserSession | null;
};

export function AuthProvider({ children, initialUser = null }: AuthProviderProps) {
	const [user, setUser] = useState<UserSession | null>(initialUser);
	const value = useMemo<AuthContextValue>(
		() => ({
			user,
			isAuthenticated: user !== null,
			hasRole: (role) => user?.roles.includes(role) ?? false,
			signIn: setUser,
			signOut: () => setUser(null)
		}),
		[user]
	);

	return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

import { createContext } from 'react';
import type { Role, UserSession } from '../../shared/types/auth';

export type AuthContextValue = {
	user: UserSession | null;
	isAuthenticated: boolean;
	hasRole: (role: Role) => boolean;
	signIn: (user: UserSession) => void;
	signOut: () => void;
};

export const AuthContext = createContext<AuthContextValue | null>(null);

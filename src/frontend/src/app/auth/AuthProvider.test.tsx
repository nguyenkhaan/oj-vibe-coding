import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import { AuthProvider } from './AuthProvider';
import { useAuth } from './useAuth';

function SessionProbe() {
	const { user } = useAuth();
	return <span>{user ? `${user.fullName}:${user.roles.join(',')}` : 'guest'}</span>;
}

describe('AuthProvider', () => {
	it('starts with a guest session by default', () => {
		render(
			<AuthProvider>
				<SessionProbe />
			</AuthProvider>
		);

		expect(screen.getByText('guest')).toBeInTheDocument();
	});

	it('supports a deterministic initial mock session', () => {
		render(
			<AuthProvider
				initialUser={{
					id: '1001',
					fullName: 'Minh Anh',
					email: 'student@example.com',
					roles: ['STUDENT']
				}}
			>
				<SessionProbe />
			</AuthProvider>
		);

		expect(screen.getByText('Minh Anh:STUDENT')).toBeInTheDocument();
	});
});

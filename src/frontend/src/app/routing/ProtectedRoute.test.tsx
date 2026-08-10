import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { AuthProvider } from '../auth/AuthProvider';
import { ProtectedRoute } from './ProtectedRoute';

function renderRoute(
	initialUser: Parameters<typeof AuthProvider>[0]['initialUser'],
	roles?: ('STUDENT' | 'TEACHER' | 'ADMIN')[]
) {
	return render(
		<AuthProvider initialUser={initialUser}>
			<MemoryRouter initialEntries={['/private']}>
				<Routes>
					<Route element={<ProtectedRoute roles={roles} />}>
						<Route path="/private" element={<p>Private content</p>} />
					</Route>
					<Route path="/auth/login" element={<p>Login screen</p>} />
					<Route path="/forbidden" element={<p>Forbidden screen</p>} />
				</Routes>
			</MemoryRouter>
		</AuthProvider>
	);
}

describe('ProtectedRoute', () => {
	it('redirects guests to login', () => {
		renderRoute(null);
		expect(screen.getByText('Login screen')).toBeInTheDocument();
	});

	it('redirects authenticated users without the required role', () => {
		renderRoute(
			{ id: '1001', fullName: 'Minh Anh', email: 'student@example.com', roles: ['STUDENT'] },
			['TEACHER']
		);
		expect(screen.getByText('Forbidden screen')).toBeInTheDocument();
	});

	it('renders protected content when the role is allowed', () => {
		renderRoute(
			{ id: '1101', fullName: 'Gia Bao', email: 'teacher@example.com', roles: ['TEACHER'] },
			['TEACHER']
		);
		expect(screen.getByText('Private content')).toBeInTheDocument();
	});
});

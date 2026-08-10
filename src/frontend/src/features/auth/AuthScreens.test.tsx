import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { AuthProvider } from '../../app/auth/AuthProvider';
import { LoginPage } from './LoginPage';

describe('auth screens', () => {
	it('shows field errors before creating a session', async () => {
		const user = userEvent.setup();
		render(
			<MemoryRouter>
				<AuthProvider>
					<LoginPage />
				</AuthProvider>
			</MemoryRouter>
		);

		await user.click(screen.getByRole('button', { name: 'Sign in' }));

		expect(screen.getByRole('alert')).toHaveTextContent('Enter a valid email and password.');
	});

	it('creates a session for the selected demo role', async () => {
		const user = userEvent.setup();
		render(
			<MemoryRouter>
				<AuthProvider>
					<LoginPage />
				</AuthProvider>
			</MemoryRouter>
		);

		await user.type(screen.getByLabelText('Email'), 'teacher@example.com');
		await user.type(screen.getByLabelText('Password'), 'Password1');
		await user.selectOptions(screen.getByLabelText('Demo role'), 'TEACHER');
		await user.click(screen.getByRole('button', { name: 'Sign in' }));

		expect(screen.queryByRole('alert')).not.toBeInTheDocument();
	});
});

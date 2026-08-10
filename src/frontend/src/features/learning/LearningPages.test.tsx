import { describe, expect, it } from 'vitest';
import type { ReactNode } from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import {
	EnrolledCoursesPage,
	FavoritesPage,
	StudentDashboardPage,
	StudentProfilePage
} from './LearningPages';

function renderPage(ui: ReactNode) {
	return render(<MemoryRouter>{ui}</MemoryRouter>);
}

describe('student learning pages', () => {
	it('switches enrolled course filters', async () => {
		const user = userEvent.setup();
		renderPage(<EnrolledCoursesPage />);

		await user.click(screen.getByRole('tab', { name: /Completed/ }));

		expect(screen.getByText('Data Structures & Algorithms Interview')).toBeInTheDocument();
		expect(screen.queryByText('Production React & TypeScript')).not.toBeInTheDocument();
	});

	it('renders a continue action with course progress', () => {
		renderPage(<StudentDashboardPage />);

		expect(
			screen.getByRole('heading', { name: 'Your learning dashboard' })
		).toBeInTheDocument();
		expect(screen.getByRole('link', { name: 'Continue learning' })).toHaveAttribute(
			'href',
			'/learn/python-foundations/hash-tables'
		);
	});

	it('removes a saved favorite from the list', async () => {
		const user = userEvent.setup();
		renderPage(<FavoritesPage />);

		await user.click(
			screen.getByRole('button', { name: 'Remove Python API Engineering from favorites' })
		);

		expect(screen.queryByText('Python API Engineering')).not.toBeInTheDocument();
	});

	it('shows the student profile details', () => {
		renderPage(<StudentProfilePage />);

		expect(screen.getByRole('heading', { name: 'My Profile' })).toBeInTheDocument();
		expect(screen.getByText('studentdemo@example.com')).toBeInTheDocument();
	});
});

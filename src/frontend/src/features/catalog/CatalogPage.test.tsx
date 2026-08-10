import { describe, expect, it } from 'vitest';
import type { ReactNode } from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { CatalogPage } from './CatalogPage';
import { CourseDetailPage } from './CourseDetailPage';
import { CourseEmptyPage } from './CourseEmptyPage';

function renderWithRouter(ui: ReactNode) {
	return render(<MemoryRouter>{ui}</MemoryRouter>);
}

describe('catalog and course detail', () => {
	it('filters course cards by search term', async () => {
		const user = userEvent.setup();
		renderWithRouter(<CatalogPage />);

		await user.type(screen.getByRole('searchbox', { name: 'Search courses' }), 'algorithms');

		expect(
			screen.getByRole('link', { name: /Data Structures & Algorithms/i })
		).toBeInTheDocument();
		expect(
			screen.queryByRole('link', { name: /Python API Engineering/i })
		).not.toBeInTheDocument();
	});

	it('shows Continue learning for an enrolled course', () => {
		renderWithRouter(<CourseDetailPage slug="data-structures-algorithms" enrolled />);

		expect(screen.getByRole('button', { name: 'Continue learning' })).toBeInTheDocument();
		expect(screen.queryByRole('button', { name: 'Enroll now' })).not.toBeInTheDocument();
	});

	it('switches the course detail tab to curriculum', async () => {
		const user = userEvent.setup();
		renderWithRouter(<CourseDetailPage slug="data-structures-algorithms" />);

		await user.click(screen.getByRole('tab', { name: 'Curriculum' }));

		expect(screen.getByText('Module 1: Foundations')).toBeInTheDocument();
		expect(screen.getByText(/Complexity analysis/)).toBeInTheDocument();
	});

	it('renders a clear empty state for an unavailable course', () => {
		renderWithRouter(<CourseEmptyPage />);

		expect(screen.getByRole('heading', { name: 'Cannot find the course' })).toBeInTheDocument();
		expect(screen.getByRole('link', { name: 'Back to courses' })).toHaveAttribute(
			'href',
			'/courses'
		);
	});
});

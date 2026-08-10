import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { InstructorGridPage } from './InstructorPages';

describe('instructor discovery', () => {
	it('filters instructors and toggles follow on a profile card', async () => {
		const user = userEvent.setup();
		render(
			<MemoryRouter>
				<InstructorGridPage />
			</MemoryRouter>
		);

		await user.type(screen.getByRole('searchbox', { name: 'Search instructors' }), 'React');

		expect(screen.getByText('Jenny Wilson')).toBeInTheDocument();
		expect(screen.queryByText('Edythe Andrew')).not.toBeInTheDocument();
		await user.click(screen.getByRole('button', { name: 'Follow Jenny Wilson' }));
		expect(screen.getByRole('button', { name: 'Following Jenny Wilson' })).toBeInTheDocument();
	});
});

import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { TeacherApplicationPage } from './TeacherApplicationPage';

function renderPage(entry = '/student/teacher-application') {
	return render(
		<MemoryRouter initialEntries={[entry]}>
			<TeacherApplicationPage />
		</MemoryRouter>
	);
}

describe('teacher application', () => {
	it('requires the identity and motivation fields before submit', async () => {
		const user = userEvent.setup();
		renderPage();

		await user.click(screen.getByRole('button', { name: 'Submit application' }));

		expect(screen.getByRole('alert')).toHaveTextContent(
			'Complete the required fields before submitting.'
		);
	});

	it('shows pending status after a valid application is submitted', async () => {
		const user = userEvent.setup();
		renderPage();

		await user.type(screen.getByLabelText('Bio'), 'Backend engineer and coding mentor.');
		await user.type(screen.getByLabelText('School or company'), 'Skill school');
		await user.type(
			screen.getByLabelText('Motivation'),
			'I want to share practical systems knowledge.'
		);
		await user.type(screen.getByLabelText('CCCD number'), '012345678901');
		await user.upload(
			screen.getByLabelText('CCCD front'),
			new File(['front'], 'front.png', { type: 'image/png' })
		);
		await user.upload(
			screen.getByLabelText('CCCD back'),
			new File(['back'], 'back.png', { type: 'image/png' })
		);
		await user.click(screen.getByRole('button', { name: 'Submit application' }));

		expect(screen.getByRole('heading', { name: 'Application pending' })).toBeInTheDocument();
	});

	it('renders an admin rejection note from the review state', () => {
		renderPage('/student/teacher-application?status=rejected');

		expect(screen.getByRole('heading', { name: 'Changes requested' })).toBeInTheDocument();
		expect(screen.getByText('Please add a clearer teaching portfolio.')).toBeInTheDocument();
	});
});

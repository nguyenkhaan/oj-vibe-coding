import { describe, expect, it } from 'vitest';
import type { ReactNode } from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { CourseApprovalPage } from './CourseApprovalPage';
import { CurriculumReorderPage } from './CurriculumReorderPage';
import { EnrollmentRequestsPage } from './EnrollmentRequestsPage';
import { LessonBuilderPage } from './LessonBuilderPage';
import { PhaseFourProvider } from './PhaseFourProvider';

function renderStudio(page: ReactNode) {
	return render(
		<MemoryRouter>
			<PhaseFourProvider>{page}</PhaseFourProvider>
		</MemoryRouter>
	);
}

describe('teacher studio flows', () => {
	it('shows assessment controls for Quiz and Problem content', async () => {
		const user = userEvent.setup();
		renderStudio(<LessonBuilderPage />);
		expect(screen.queryByLabelText('Passing score (%)')).not.toBeInTheDocument();
		await user.selectOptions(screen.getByLabelText('Content type'), 'Quiz');
		expect(screen.getByLabelText('Passing score (%)')).toHaveValue(70);
		expect(screen.getByLabelText('Maximum attempts')).toHaveValue(2);
	});

	it('reorders curriculum with keyboard-accessible controls', async () => {
		const user = userEvent.setup();
		renderStudio(<CurriculumReorderPage />);
		await user.click(screen.getByRole('button', { name: 'Move Complexity up' }));
		expect(screen.getByText('1. Complexity')).toBeInTheDocument();
		expect(screen.getByRole('button', { name: 'Save order' })).toBeEnabled();
	});

	it('records an enrollment approval', async () => {
		const user = userEvent.setup();
		renderStudio(<EnrollmentRequestsPage />);
		await user.click(screen.getAllByRole('button', { name: 'Approve' })[0]);
		expect(screen.getAllByText('APPROVED').length).toBeGreaterThan(0);
	});

	it('withdraws and resubmits a pending course review', async () => {
		const user = userEvent.setup();
		renderStudio(<CourseApprovalPage />);
		await user.click(screen.getByRole('button', { name: 'Withdraw submission' }));
		expect(screen.getAllByText('DRAFT').length).toBeGreaterThan(0);
		await user.click(screen.getByRole('button', { name: 'Submit for review' }));
		expect(screen.getAllByText('PENDING REVIEW').length).toBeGreaterThan(0);
	});
});

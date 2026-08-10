import { describe, expect, it } from 'vitest';
import type { ReactNode } from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { PhaseFourProvider } from '../teacher-studio/PhaseFourProvider';
import { AuditLogsPage } from './AuditLogsPage';
import { CourseReviewPage } from './CourseReviewPage';
import { TeacherReviewPage } from './TeacherReviewPage';

function renderAdmin(page: ReactNode) {
	return render(
		<MemoryRouter>
			<PhaseFourProvider>{page}</PhaseFourProvider>
		</MemoryRouter>
	);
}

describe('admin moderation flows', () => {
	it('requires a note before rejecting a course and records an audit event', async () => {
		const user = userEvent.setup();
		renderAdmin(
			<>
				<CourseReviewPage />
				<AuditLogsPage />
			</>
		);
		const reject = screen.getByRole('button', { name: 'Reject' });
		expect(reject).toBeDisabled();
		await user.type(screen.getByLabelText('Decision note'), 'Add learning outcomes.');
		await user.click(reject);
		expect(screen.getAllByText('REJECTED').length).toBeGreaterThan(0);
		expect(screen.getByText('COURSE_REJECTED')).toBeInTheDocument();
	});

	it('blocks Teacher approval until the verification checklist is complete', async () => {
		const user = userEvent.setup();
		renderAdmin(<TeacherReviewPage />);
		const approve = screen.getByRole('button', { name: 'Approve request' });
		expect(approve).toBeDisabled();
		for (const label of ['ID document reviewed', 'Background check', 'Profile complete']) {
			await user.click(screen.getByLabelText(label));
		}
		expect(approve).toBeEnabled();
		await user.click(approve);
		expect(screen.getAllByText('APPROVED').length).toBeGreaterThan(0);
	});

	it('requires a decision note for requesting Teacher changes', async () => {
		const user = userEvent.setup();
		renderAdmin(<TeacherReviewPage />);
		await user.click(screen.getByRole('button', { name: 'Request changes' }));
		expect(screen.queryByText('CHANGES REQUESTED')).not.toBeInTheDocument();
		await user.type(screen.getByLabelText('Decision note'), 'Upload a clearer ID image.');
		await user.click(screen.getByRole('button', { name: 'Request changes' }));
		expect(screen.getAllByText('CHANGES REQUESTED').length).toBeGreaterThan(0);
	});
});

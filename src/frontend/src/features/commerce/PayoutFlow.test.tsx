import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { describe, expect, it } from 'vitest';
import { PayoutReviewPage } from '../admin-console/PayoutReviewPage';
import { TeacherWalletPage } from '../teacher-studio/TeacherWalletPage';
import { CommerceProvider } from './CommerceProvider';

describe('Phase 5 payout flow', () => {
	it('validates the minimum, blocks duplicate requests and completes Admin settlement', async () => {
		const user = userEvent.setup();
		render(
			<MemoryRouter>
				<CommerceProvider>
					<TeacherWalletPage />
					<PayoutReviewPage />
				</CommerceProvider>
			</MemoryRouter>
		);
		const amount = screen.getByLabelText('Amount (VND)');
		await user.clear(amount);
		await user.type(amount, '999');
		expect(screen.getByRole('button', { name: 'Request payout' })).toBeDisabled();
		await user.clear(amount);
		await user.type(amount, '2000');
		await user.click(screen.getByRole('button', { name: 'Request payout' }));
		expect(screen.getByRole('button', { name: 'Request payout' })).toBeDisabled();
		await user.click(screen.getByRole('button', { name: 'Approve & reserve' }));
		expect(screen.getByRole('button', { name: 'Complete settlement' })).toBeEnabled();
		await user.click(screen.getByRole('button', { name: 'Complete settlement' }));
		expect(screen.getAllByText('COMPLETED').length).toBeGreaterThan(0);
		expect(screen.getByText('PAY-0001 · completed')).toBeInTheDocument();
	});

	it('requires a note before Admin rejection', async () => {
		const user = userEvent.setup();
		render(
			<MemoryRouter>
				<CommerceProvider>
					<TeacherWalletPage />
					<PayoutReviewPage />
				</CommerceProvider>
			</MemoryRouter>
		);
		await user.click(screen.getByRole('button', { name: 'Request payout' }));
		const reject = screen.getByRole('button', { name: 'Reject' });
		expect(reject).toBeDisabled();
		await user.type(screen.getByLabelText('Decision note'), 'Bank account mismatch');
		await user.click(reject);
		expect(screen.getAllByText('REJECTED').length).toBeGreaterThan(0);
		expect(screen.getByText('Admin note: Bank account mismatch')).toBeInTheDocument();
	});
});

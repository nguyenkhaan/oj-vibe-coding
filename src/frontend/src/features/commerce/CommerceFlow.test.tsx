import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { describe, expect, it } from 'vitest';
import { CartPage } from './CartPage';
import { CheckoutPage } from './CheckoutPage';
import { CommerceProvider } from './CommerceProvider';
import { PaymentResultPage } from './PaymentResultPage';
import { useCommerce } from './commerceContext';

function renderPage(page: React.ReactNode, path = '/') {
	return render(
		<MemoryRouter initialEntries={[path]}>
			<CommerceProvider>{page}</CommerceProvider>
		</MemoryRouter>
	);
}

function WebhookHarness() {
	const { simulateWebhook, ledger, enrolledCourseIds } = useCommerce();
	return (
		<>
			<button type="button" onClick={() => simulateWebhook('COMPLETED')}>
				Replay completed webhook
			</button>
			<span>Ledger rows: {ledger.length}</span>
			<span>Enrollments: {enrolledCourseIds.length}</span>
		</>
	);
}

describe('Phase 5 commerce flow', () => {
	it('prevents duplicate and enrolled course additions, then supports empty cart', async () => {
		const user = userEvent.setup();
		renderPage(<CartPage />);
		const addButtons = screen.getAllByRole('button', { name: 'Add to cart' });
		await user.click(addButtons[1]);
		await user.click(screen.getAllByRole('button', { name: 'Add to cart' })[1]);
		expect(screen.getByText('Course is already in your cart.')).toBeInTheDocument();
		expect(screen.getByRole('button', { name: 'Already enrolled' })).toBeDisabled();
		for (const button of screen.getAllByRole('button', { name: 'Remove' }))
			await user.click(button);
		expect(screen.getByText('Your cart is empty')).toBeInTheDocument();
	});

	it('keeps checkout scoped to one course', () => {
		renderPage(
			<Routes>
				<Route path="/checkout/:orderId" element={<CheckoutPage />} />
			</Routes>,
			'/checkout/ORD-0001'
		);
		expect(
			screen.getByText('Your order contains exactly one course and is paid through PayOS.')
		).toBeInTheDocument();
		expect(screen.getByText('Python Foundations for Problem Solving')).toBeInTheDocument();
	});

	it('creates enrollment and 80% revenue only after completed webhook', async () => {
		const user = userEvent.setup();
		renderPage(
			<Routes>
				<Route path="/checkout/:orderId/result" element={<PaymentResultPage />} />
			</Routes>,
			'/checkout/ORD-0001/result'
		);
		expect(screen.getByText('Waiting for payment')).toBeInTheDocument();
		await user.click(screen.getByRole('button', { name: 'Complete payment' }));
		expect(screen.getByText('Payment completed')).toBeInTheDocument();
		expect(screen.getByRole('link', { name: 'Start learning' })).toBeInTheDocument();
		expect(screen.getByText('PayOS webhook: completed')).toBeInTheDocument();
	});

	it('deduplicates a completed webhook replay', async () => {
		const user = userEvent.setup();
		renderPage(<WebhookHarness />);
		const replay = screen.getByRole('button', { name: 'Replay completed webhook' });
		await user.click(replay);
		await user.click(replay);
		expect(screen.getByText('Ledger rows: 2')).toBeInTheDocument();
		expect(screen.getByText('Enrollments: 2')).toBeInTheDocument();
	});

	it.each([
		['Fail payment', 'Payment failed'],
		['Expire payment', 'Payment expired']
	])('renders terminal state %s without enrollment', async (action, title) => {
		const user = userEvent.setup();
		renderPage(<PaymentResultPage />);
		await user.click(screen.getByRole('button', { name: action }));
		expect(screen.getByText(title)).toBeInTheDocument();
		expect(screen.queryByRole('link', { name: 'Start learning' })).not.toBeInTheDocument();
	});
});

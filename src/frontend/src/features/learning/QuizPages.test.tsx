import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { QuizAttemptPage, QuizPreviewPage } from './QuizPages';
import { LearningProgressProvider } from './LearningProgressProvider';

describe('quiz learning flow', () => {
	it('shows preview rules and starts the attempt', () => {
		render(
			<MemoryRouter>
				<QuizPreviewPage />
			</MemoryRouter>
		);

		expect(screen.getByText('10 questions · 20 minutes')).toBeInTheDocument();
		expect(screen.getByRole('link', { name: 'Start quiz' })).toHaveAttribute(
			'href',
			'/quiz/control-flow/attempt'
		);
	});

	it('submits a passing answer and shows the result', async () => {
		const user = userEvent.setup();
		render(
			<MemoryRouter>
				<LearningProgressProvider>
					<QuizAttemptPage />
				</LearningProgressProvider>
			</MemoryRouter>
		);

		await user.click(screen.getByLabelText('0 1 2'));
		await user.click(screen.getByRole('button', { name: 'Submit quiz' }));

		expect(screen.getByRole('heading', { name: 'Quiz passed' })).toBeInTheDocument();
		expect(screen.getByText('1 of 1 correct · 100%')).toBeInTheDocument();
	});

	it('limits failed attempts and exposes retry state', async () => {
		const user = userEvent.setup();
		render(
			<MemoryRouter>
				<LearningProgressProvider>
					<QuizAttemptPage />
				</LearningProgressProvider>
			</MemoryRouter>
		);

		await user.click(screen.getByLabelText('1 2 3'));
		await user.click(screen.getByRole('button', { name: 'Submit quiz' }));
		expect(screen.getByRole('button', { name: 'Retry quiz' })).toBeInTheDocument();
		await user.click(screen.getByRole('button', { name: 'Retry quiz' }));
		await user.click(screen.getByLabelText('1 2 3'));
		await user.click(screen.getByRole('button', { name: 'Submit quiz' }));

		expect(screen.queryByRole('button', { name: 'Retry quiz' })).not.toBeInTheDocument();
		expect(screen.getByText('Attempts used: 2/2 · 0 remaining')).toBeInTheDocument();
	});
});

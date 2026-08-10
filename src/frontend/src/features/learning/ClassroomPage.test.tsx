import { describe, expect, it } from 'vitest';
import { fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { ClassroomPage } from './ClassroomPage';
import { LearningProgressProvider } from './LearningProgressProvider';

function renderClassroom() {
	return render(
		<MemoryRouter>
			<LearningProgressProvider>
				<ClassroomPage />
			</LearningProgressProvider>
		</MemoryRouter>
	);
}

describe('classroom workspace', () => {
	it('marks the current lesson complete and updates course progress', async () => {
		const user = userEvent.setup();
		renderClassroom();

		await user.click(screen.getByRole('button', { name: 'Mark video watched' }));

		expect(screen.getByRole('button', { name: 'Video completed' })).toBeInTheDocument();
		expect(screen.getAllByText(/60%/).length).toBeGreaterThan(0);
	});

	it('keeps the next lesson locked until its prerequisite is complete', async () => {
		const user = userEvent.setup();
		renderClassroom();

		expect(
			screen.getByRole('button', { name: /Sliding window lab \(locked\)/ })
		).toBeDisabled();
		await user.click(screen.getByRole('button', { name: 'Mark video watched' }));
		expect(screen.getByRole('button', { name: 'Sliding window lab' })).toBeEnabled();
	});

	it('marks video completion when the resume position reaches 100%', () => {
		renderClassroom();

		fireEvent.change(screen.getByRole('slider', { name: 'Video progress' }), {
			target: { value: '100' }
		});

		expect(screen.getByText('Watched 100%')).toBeInTheDocument();
		expect(screen.getByRole('button', { name: 'Video completed' })).toBeInTheDocument();
	});

	it('switches lesson notes and sends a chat message', async () => {
		const user = userEvent.setup();
		renderClassroom();

		await user.click(screen.getByRole('tab', { name: 'Resources' }));
		expect(
			screen.getByText('Downloadable examples and lesson references.')
		).toBeInTheDocument();
		await user.type(screen.getByRole('textbox', { name: 'Chat message' }), 'Ready for the lab');
		await user.click(screen.getByRole('button', { name: 'Send' }));
		expect(screen.getByText('You: Ready for the lab')).toBeInTheDocument();
	});

	it('unlocks the shared next action after completing the prerequisite', async () => {
		const user = userEvent.setup();
		renderClassroom();

		expect(screen.getByRole('button', { name: 'Next lesson locked' })).toBeDisabled();
		await user.click(screen.getByRole('button', { name: 'Mark video watched' }));

		expect(screen.getByRole('button', { name: 'Next →' })).toBeEnabled();
	});
});

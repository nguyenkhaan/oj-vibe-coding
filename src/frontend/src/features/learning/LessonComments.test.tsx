import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { LessonComments } from './LessonComments';

describe('lesson comments', () => {
	it('opens a reply field and adds a reply', async () => {
		const user = userEvent.setup();
		render(<LessonComments />);

		await user.click(screen.getByRole('button', { name: 'Reply' }));
		await user.type(
			screen.getByRole('textbox', { name: 'Reply to comment' }),
			'Yes, here is the tradeoff.'
		);
		await user.click(screen.getAllByRole('button', { name: 'Reply' })[1]);

		expect(screen.getByText('You: Yes, here is the tradeoff.')).toBeInTheDocument();
	});
});

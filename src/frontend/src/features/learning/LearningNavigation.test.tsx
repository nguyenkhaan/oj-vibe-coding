import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { ClassroomRoutePage } from './ClassroomPage';
import { LearningProgressProvider } from './LearningProgressProvider';
import { ReadingViewer } from './ReadingViewer';

describe('learning content navigation', () => {
	it('keeps progress navigation visible when moving from reading to video content', async () => {
		const user = userEvent.setup();
		render(
			<MemoryRouter initialEntries={['/reading/collision-strategies']}>
				<LearningProgressProvider>
					<Routes>
						<Route path="/reading/:lessonId" element={<ReadingViewer />} />
						<Route
							path="/learn/:courseSlug/:lessonContentId"
							element={<ClassroomRoutePage />}
						/>
					</Routes>
				</LearningProgressProvider>
			</MemoryRouter>
		);

		expect(
			screen.getByRole('complementary', { name: 'Learning progress navigation' })
		).toBeInTheDocument();
		expect(screen.getByRole('banner')).toBeInTheDocument();
		expect(screen.getByRole('navigation', { name: 'Lesson navigation' })).toBeInTheDocument();
		await user.click(screen.getByRole('button', { name: 'Two-pointer patterns' }));

		expect(
			screen.getByRole('complementary', { name: 'Learning progress navigation' })
		).toBeInTheDocument();
		expect(
			screen.getAllByRole('heading', { name: 'Two-pointer patterns' })[0]
		).toBeInTheDocument();
	});

	it('opens and closes the responsive course content drawer', async () => {
		const user = userEvent.setup();
		render(
			<MemoryRouter initialEntries={['/reading/collision-strategies']}>
				<LearningProgressProvider>
					<ReadingViewer />
				</LearningProgressProvider>
			</MemoryRouter>
		);

		await user.click(screen.getByRole('button', { name: 'Show course content' }));
		expect(screen.getByRole('button', { name: 'Hide course content' })).toHaveAttribute(
			'aria-expanded',
			'true'
		);
		expect(
			screen.getByRole('complementary', { name: 'Learning progress navigation' })
		).toHaveClass('is-open');

		await user.click(screen.getByRole('button', { name: 'Close' }));
		expect(screen.getByRole('button', { name: 'Show course content' })).toHaveAttribute(
			'aria-expanded',
			'false'
		);
	});
});

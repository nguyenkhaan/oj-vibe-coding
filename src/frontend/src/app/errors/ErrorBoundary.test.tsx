import { describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { ErrorBoundary } from './ErrorBoundary';

function BrokenPage() {
	throw new Error('render failed');
}

describe('ErrorBoundary', () => {
	it('renders a recoverable fallback when a page crashes', () => {
		const consoleError = vi.spyOn(console, 'error').mockImplementation(() => undefined);

		render(
			<ErrorBoundary>
				<BrokenPage />
			</ErrorBoundary>
		);

		expect(screen.getByRole('heading', { name: 'Something went wrong' })).toBeInTheDocument();
		expect(screen.getByRole('button', { name: 'Try again' })).toBeInTheDocument();
		consoleError.mockRestore();
	});
});

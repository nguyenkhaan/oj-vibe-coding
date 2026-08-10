import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { AppShell } from './AppShell';

describe('AppShell', () => {
	it('renders the role navigation and page content', () => {
		render(
			<MemoryRouter>
				<AppShell variant="student" pageTitle="Learning dashboard">
					<p>Course content</p>
				</AppShell>
			</MemoryRouter>
		);

		expect(screen.getByText('SkillBoost')).toBeInTheDocument();
		expect(screen.getByRole('link', { name: 'My courses' })).toBeInTheDocument();
		expect(screen.getByText('Course content')).toBeInTheDocument();
	});

	it('exposes an accessible mobile menu control', () => {
		render(
			<MemoryRouter>
				<AppShell variant="public" pageTitle="Catalog">
					<p>Catalog content</p>
				</AppShell>
			</MemoryRouter>
		);

		expect(screen.getByRole('button', { name: 'Open navigation' })).toBeInTheDocument();
	});
});

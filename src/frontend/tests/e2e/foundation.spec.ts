import { expect, test } from '@playwright/test';

test('renders the public catalog foundation', async ({ page }) => {
	await page.goto('/courses');

	await expect(page.getByText('Find your next course.')).toBeVisible();
	await expect(page.getByText('Python Backend Foundations')).toBeVisible();
});

test('redirects a guest away from protected learning', async ({ page }) => {
	await page.goto('/student/dashboard');

	await expect(page).toHaveURL(/\/auth\/login$/);
	await expect(page.getByText('Make your next session count.')).toBeVisible();
});

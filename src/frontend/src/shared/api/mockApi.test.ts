import { describe, expect, it } from 'vitest';
import { createMockApi } from './mockApi';

describe('mock API adapter', () => {
	it('returns a paginated course envelope', async () => {
		const response = await createMockApi().get('/courses');

		expect(response.data[0]?.slug).toBe('python-backend-foundations');
		expect(response.meta.page).toBe(1);
		expect(response.meta.page_size).toBe(20);
	});

	it('keeps order creation deterministic and idempotent by key', async () => {
		const api = createMockApi();
		const first = await api.post(
			'/orders',
			{ course_id: '2001' },
			{ idempotencyKey: 'order-1' }
		);
		const replay = await api.post(
			'/orders',
			{ course_id: '2001' },
			{ idempotencyKey: 'order-1' }
		);

		expect(first.data.id).toBe('7001');
		expect(replay.data.id).toBe(first.data.id);
	});
});

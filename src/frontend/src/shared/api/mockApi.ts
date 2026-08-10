export type ApiMeta = {
	request_id: string;
	page: number;
	page_size: number;
	total_items: number;
	total_pages: number;
};

export type ApiResponse<T> = {
	data: T;
	meta: ApiMeta;
};

type CourseCard = {
	id: string;
	slug: string;
	title: string;
	price_vnd: number;
};

type Order = {
	id: string;
	status: 'PENDING';
	item: { course_id: string };
	total_amount_vnd: number;
};

type RequestOptions = {
	idempotencyKey?: string;
};

const defaultMeta = (requestId: string, totalItems: number): ApiMeta => ({
	request_id: requestId,
	page: 1,
	page_size: 20,
	total_items: totalItems,
	total_pages: Math.max(1, Math.ceil(totalItems / 20))
});

export function createMockApi() {
	const idempotentOrders = new Map<string, ApiResponse<Order>>();

	return {
		async get(path: '/courses'): Promise<ApiResponse<CourseCard[]>> {
			if (path !== '/courses') {
				throw new Error(`No mock fixture for GET ${path}`);
			}
			const courses: CourseCard[] = [
				{
					id: '2001',
					slug: 'python-backend-foundations',
					title: 'Python Backend Foundations',
					price_vnd: 499000
				}
			];
			return { data: courses, meta: defaultMeta('req_mock_catalog_01', courses.length) };
		},
		async post(
			path: '/orders',
			body: { course_id: string },
			options: RequestOptions = {}
		): Promise<ApiResponse<Order>> {
			if (path !== '/orders') {
				throw new Error(`No mock fixture for POST ${path}`);
			}
			const key = options.idempotencyKey;
			if (key && idempotentOrders.has(key)) {
				return idempotentOrders.get(key)!;
			}
			const response: ApiResponse<Order> = {
				data: { id: '7001', status: 'PENDING', item: body, total_amount_vnd: 499000 },
				meta: defaultMeta('req_mock_order_01', 1)
			};
			if (key) {
				idempotentOrders.set(key, response);
			}
			return response;
		}
	};
}

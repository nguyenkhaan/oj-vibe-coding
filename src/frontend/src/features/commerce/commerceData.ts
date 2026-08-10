import type { CartCourse, LedgerEntry, Order } from './commerceContext';

export const commerceCourses: CartCourse[] = [
	{
		id: 'python',
		title: 'Python Foundations for Problem Solving',
		instructor: 'Edythe Andrew',
		priceVnd: 79000,
		tone: 'indigo'
	},
	{
		id: 'react',
		title: 'Production React & TypeScript',
		instructor: 'Jenny Wilson',
		priceVnd: 89000,
		tone: 'coral'
	},
	{
		id: 'algorithms',
		title: 'Algorithms Interview Prep',
		instructor: 'Ronald Richard',
		priceVnd: 99000,
		tone: 'green'
	}
];

export const initialOrder: Order = {
	id: 'ORD-0001',
	course: commerceCourses[0],
	status: 'PENDING',
	transactionId: 'PAYOS-0001',
	createdAt: '10 Aug 2026, 09:00'
};

export const initialLedger: LedgerEntry[] = [
	{
		id: 'LED-001',
		date: '16 Jan',
		type: 'COURSE_REVENUE',
		detail: 'ORD-0000 · gross 99,000 VND · Teacher 80%',
		amountVnd: 79200,
		status: 'COMPLETED'
	}
];

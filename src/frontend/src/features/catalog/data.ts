import type { Course } from './types';

export const catalogCourses: Course[] = [
	{
		id: '2001',
		slug: 'python-api-engineering',
		title: 'Python API Engineering',
		shortTitle: 'Python API Engineering',
		description:
			'Build production-ready APIs with clear boundaries, tests and useful observability.',
		instructor: 'Edythe Andrew',
		instructorRole: 'Senior Backend Instructor',
		code: 'PY',
		category: 'Backend',
		level: 'Intermediate',
		priceVnd: 499000,
		rating: 4.9,
		reviews: 186,
		lessons: 18,
		duration: '6h 40m',
		accent: 'indigo',
		modules: [
			{
				title: 'API foundations',
				lessons: [
					{ title: 'Request and response design', duration: '18:20', free: true },
					{ title: 'Testing the boundary', duration: '24:10' }
				]
			}
		]
	},
	{
		id: '2002',
		slug: 'data-structures-algorithms',
		title: 'Data Structures & Algorithms',
		shortTitle: 'Data Structures & Algorithms',
		description:
			'Learn the patterns behind efficient solutions and prepare for technical interviews.',
		instructor: 'Ronald Richard',
		instructorRole: 'Algorithms Expert',
		code: 'DS',
		category: 'Algorithms',
		level: 'Beginner',
		priceVnd: 790000,
		rating: 4.8,
		reviews: 120,
		lessons: 24,
		duration: '9h 15m',
		accent: 'coral',
		modules: [
			{
				title: 'Module 1: Foundations',
				lessons: [
					{ title: 'Introduction', duration: '12:30', free: true },
					{ title: 'Complexity analysis', duration: '18:40' }
				]
			},
			{
				title: 'Module 2: Patterns',
				lessons: [
					{ title: 'Two-pointer patterns', duration: '22:10' },
					{ title: 'Sliding window', duration: '25:00' }
				]
			}
		]
	},
	{
		id: '2003',
		slug: 'react-interface-systems',
		title: 'React Interface Systems',
		shortTitle: 'React Interface Systems',
		description: 'Turn product requirements into resilient, accessible React interfaces.',
		instructor: 'Jenny Wilson',
		instructorRole: 'React Instructor',
		code: 'UI',
		category: 'Frontend',
		level: 'Intermediate',
		priceVnd: 649000,
		rating: 4.7,
		reviews: 98,
		lessons: 16,
		duration: '5h 30m',
		accent: 'teal',
		modules: [
			{
				title: 'Interface foundations',
				lessons: [
					{ title: 'Component boundaries', duration: '16:10', free: true },
					{ title: 'Accessible states', duration: '20:30' }
				]
			}
		]
	}
];

export function formatPrice(priceVnd: number) {
	return new Intl.NumberFormat('vi-VN').format(priceVnd) + ' VND';
}

export type ModerationStatus = 'PENDING' | 'APPROVED' | 'REJECTED' | 'CHANGES_REQUESTED';
export type CourseReviewStatus = 'DRAFT' | 'PENDING_REVIEW' | 'REJECTED' | 'PUBLISHED';

export const teacherProfile = {
	name: 'Edythe Andrew',
	username: 'edythe',
	email: 'teacher@example.com',
	phone: '+1 123 456 7890',
	gender: 'Female',
	birthDate: '16 Jan 1990',
	bio: 'Experienced coding instructor and mentor focused on practical problem solving.'
};

export const teacherCourses = [
	{
		id: 'dsa',
		title: 'Data Structures & Algorithms',
		students: 64,
		lessons: 24,
		price: 79000,
		status: 'PENDING_REVIEW'
	},
	{
		id: 'python',
		title: 'Python Foundations',
		students: 38,
		lessons: 18,
		price: 59000,
		status: 'PUBLISHED'
	},
	{
		id: 'react',
		title: 'Production React & TypeScript',
		students: 18,
		lessons: 12,
		price: 89000,
		status: 'DRAFT'
	}
] as const;

export const teacherStudents = [
	{
		id: 'ronald',
		name: 'Ronald Richard',
		email: 'ronald@example.com',
		course: 'Data Structures & Algorithms',
		progress: 64,
		score: '92%',
		active: 'Today'
	},
	{
		id: 'jenny',
		name: 'Jenny Wilson',
		email: 'jenny@example.com',
		course: 'Production React & TypeScript',
		progress: 42,
		score: '68%',
		active: '2 days ago'
	},
	{
		id: 'patricia',
		name: 'Patricia Lebsack',
		email: 'patricia@example.com',
		course: 'Data Structures & Algorithms',
		progress: 28,
		score: '--',
		active: '5 days ago'
	}
];

export const earningRows = [
	{
		date: '16 Jan',
		course: 'Python Foundations',
		student: 'Ronald',
		amount: 48000,
		status: 'Paid'
	},
	{
		date: '18 Jan',
		course: 'React & TypeScript',
		student: 'Jenny',
		amount: 64000,
		status: 'Pending'
	},
	{ date: '22 Jan', course: 'Algorithms', student: 'Patricia', amount: 52000, status: 'Paid' }
];

export const submissionRows = [
	{
		id: 'SUB-01',
		student: 'Ronald Richard',
		problem: 'Two-pointer patterns',
		date: '16 Jan',
		score: '92%',
		status: 'Passed'
	},
	{
		id: 'SUB-02',
		student: 'Jenny Wilson',
		problem: 'Hash table',
		date: '18 Jan',
		score: '68%',
		status: 'Review'
	},
	{
		id: 'SUB-03',
		student: 'Patricia Lebsack',
		problem: 'Sliding window',
		date: '22 Jan',
		score: '--',
		status: 'Pending'
	}
];

export const initialEnrollments = [
	{
		id: 'ENR-01',
		student: 'Ronald Richard',
		course: 'Python Foundations',
		date: '16 Jan',
		status: 'PENDING' as ModerationStatus
	},
	{
		id: 'ENR-02',
		student: 'Jenny Wilson',
		course: 'React & TypeScript',
		date: '18 Jan',
		status: 'APPROVED' as ModerationStatus
	},
	{
		id: 'ENR-03',
		student: 'Patricia Lebsack',
		course: 'Algorithms',
		date: '22 Jan',
		status: 'PENDING' as ModerationStatus
	}
];

export const initialProblems = [
	{
		id: 'OJ-001',
		title: 'Two Sum',
		difficulty: 'Easy',
		tests: 12,
		status: 'Active',
		language: 'Python'
	},
	{
		id: 'OJ-002',
		title: 'Longest Substring',
		difficulty: 'Medium',
		tests: 18,
		status: 'Draft',
		language: 'TypeScript'
	},
	{
		id: 'OJ-003',
		title: 'Sliding Window Maximum',
		difficulty: 'Hard',
		tests: 24,
		status: 'Active',
		language: 'Python'
	}
];

export const teacherRequests = [
	{
		id: 'TR-0001',
		name: 'Edythe Andrew',
		email: 'edythe@example.com',
		expertise: 'Programming, Algorithms'
	},
	{
		id: 'TR-0002',
		name: 'Ronald Richard',
		email: 'ronald@example.com',
		expertise: 'Backend Engineering'
	}
];

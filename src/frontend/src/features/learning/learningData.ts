export type LearningCourse = {
	slug: string;
	title: string;
	code: string;
	accent: 'indigo' | 'coral' | 'teal';
	progress: number;
	lastAccessed: string;
	nextLesson: string;
	status: 'active' | 'completed';
};

export const enrolledCourses: LearningCourse[] = [
	{
		slug: 'python-foundations',
		title: 'Python Foundations for Problem Solving',
		code: 'PY',
		accent: 'indigo',
		progress: 64,
		lastAccessed: 'Today',
		nextLesson: 'Hash tables',
		status: 'active'
	},
	{
		slug: 'production-react-typescript',
		title: 'Production React & TypeScript',
		code: 'UI',
		accent: 'teal',
		progress: 12,
		lastAccessed: '2 days ago',
		nextLesson: 'React hooks',
		status: 'active'
	},
	{
		slug: 'data-structures-interview',
		title: 'Data Structures & Algorithms Interview',
		code: 'DS',
		accent: 'coral',
		progress: 100,
		lastAccessed: '5 days ago',
		nextLesson: 'Review results',
		status: 'completed'
	},
	{
		slug: 'algorithms-patterns',
		title: 'Algorithms Interview Patterns',
		code: 'AL',
		accent: 'coral',
		progress: 100,
		lastAccessed: '1 week ago',
		nextLesson: 'Review results',
		status: 'completed'
	}
];

export const favoriteCourses = [
	{
		title: 'Python API Engineering',
		instructor: 'Edythe Andrew',
		category: 'Backend',
		rating: 4.9,
		code: 'PY',
		accent: 'indigo' as const,
		slug: 'python-api-engineering'
	},
	{
		title: 'Data Structures & Algorithms',
		instructor: 'Ronald Richard',
		category: 'Algorithms',
		rating: 4.8,
		code: 'DS',
		accent: 'coral' as const,
		slug: 'data-structures-algorithms'
	}
];

export const studentProfile = {
	firstName: 'Ronald',
	lastName: 'Richard',
	username: 'studentdemo',
	email: 'studentdemo@example.com',
	phone: '90154-91036',
	gender: 'Male',
	dateOfBirth: '16 Jan 2000',
	age: '24',
	registrationDate: '16 Jan 2024, 11:15 AM',
	bio: 'Ronald Richard is a student focused on practical coding skills and interview preparation.'
};

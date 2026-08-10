export type NavItem = {
	label: string;
	href: string;
	hint?: string;
};

export const sidebarGroups: Array<{ label: string; items: NavItem[] }> = [
	{
		label: 'Public',
		items: [
			{ label: 'Home', href: '/' },
			{ label: 'Courses', href: '/courses' },
			{ label: 'Instructors', href: '/instructors' },
		],
	},
	{
		label: 'Workspace',
		items: [
			{ label: 'Student Dashboard', href: '/student/dashboard' },
			{ label: 'Teacher Dashboard', href: '/teacher/dashboard' },
			{ label: 'AI Interview', href: '/interview' },
			{ label: 'Online Judge', href: '/student/problem/demo' },
		],
	},
];

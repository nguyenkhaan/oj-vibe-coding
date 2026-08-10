export const routePaths = {
	home: '/',
	authOverview: '/auth',
	login: '/auth/login',
	register: '/auth/register',
	forgotPassword: '/auth/forgot-password',
	setPassword: '/auth/set-password',
	otp: '/auth/otp',
	lock: '/auth/lock',
	teacherRegistration: '/auth/teacher-registration',
} as const;

export type RoutePath = (typeof routePaths)[keyof typeof routePaths];

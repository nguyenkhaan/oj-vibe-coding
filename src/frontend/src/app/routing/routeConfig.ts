export type RouteDefinition = {
	path: string;
	requiresAuth: boolean;
	roles?: readonly ('STUDENT' | 'TEACHER' | 'ADMIN')[];
};

export const appRoutes = {
	login: { path: '/auth/login', requiresAuth: false },
	home: { path: '/', requiresAuth: false },
	catalog: { path: '/courses', requiresAuth: false },
	courseDetail: { path: '/courses/:slug', requiresAuth: false },
	studentDashboard: { path: '/student/dashboard', requiresAuth: true, roles: ['STUDENT'] },
	studentCourses: { path: '/student/courses', requiresAuth: true, roles: ['STUDENT'] },
	favorites: { path: '/student/favorites', requiresAuth: true, roles: ['STUDENT'] },
	learning: { path: '/learn/:courseSlug/:lessonContentId', requiresAuth: true },
	checkout: { path: '/checkout/:orderId', requiresAuth: true },
	checkoutResult: { path: '/checkout/:orderId/result', requiresAuth: true },
	interviewSetup: { path: '/interview/setup', requiresAuth: true },
	interviewSession: { path: '/interview/sessions/:sessionId', requiresAuth: true },
	interviewReport: { path: '/interview/sessions/:sessionId/report', requiresAuth: true },
	teacherDashboard: { path: '/teacher/dashboard', requiresAuth: true, roles: ['TEACHER'] },
	teacherCourses: { path: '/teacher/courses', requiresAuth: true, roles: ['TEACHER'] },
	codingProblems: { path: '/online-judge/problems', requiresAuth: true },
	adminDashboard: { path: '/admin', requiresAuth: true, roles: ['ADMIN'] }
} satisfies Record<string, RouteDefinition>;

export type AppRouteKey = keyof typeof appRoutes;

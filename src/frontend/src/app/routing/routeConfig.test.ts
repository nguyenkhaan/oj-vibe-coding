import { describe, expect, it } from 'vitest';
import { appRoutes } from './routeConfig';

describe('app route contract', () => {
	it('keeps public and authenticated routes aligned with Phase 0 baseline', () => {
		expect(appRoutes.catalog.path).toBe('/courses');
		expect(appRoutes.learning.path).toBe('/learn/:courseSlug/:lessonContentId');
		expect(appRoutes.checkoutResult.path).toBe('/checkout/:orderId/result');
		expect(appRoutes.interviewReport.path).toBe('/interview/sessions/:sessionId/report');
	});

	it('requires authentication for protected feature routes', () => {
		expect(appRoutes.catalog.requiresAuth).toBe(false);
		expect(appRoutes.learning.requiresAuth).toBe(true);
		expect(appRoutes.teacherDashboard.requiresAuth).toBe(true);
	});

	it('keeps Phase 4 teacher and admin route contracts stable', () => {
		expect(appRoutes.teacherCourseBuilder.path).toBe('/teacher/course-builder');
		expect(appRoutes.teacherReviewStatus.path).toBe('/teacher/courses/:courseId/review-status');
		expect(appRoutes.adminTeacherReview.path).toBe('/admin/teacher-registration/:requestId');
		expect(appRoutes.adminCourseReview.roles).toContain('ADMIN');
	});
});

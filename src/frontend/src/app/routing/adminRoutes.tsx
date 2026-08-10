import type { ReactNode } from 'react';
import { Route } from 'react-router-dom';
import { AdminShell } from '../../components/layout/Shells';
import { AdminOverviewPage } from '../../features/admin-console/AdminOverviewPage';
import { AuditLogsPage } from '../../features/admin-console/AuditLogsPage';
import { CourseReviewPage } from '../../features/admin-console/CourseReviewPage';
import { TeacherReviewPage } from '../../features/admin-console/TeacherReviewPage';
import { PayoutReviewPage } from '../../features/admin-console/PayoutReviewPage';
import { ProtectedRoute } from './ProtectedRoute';

function adminRoute(key: string, path: string, title: string, page: ReactNode) {
	return (
		<Route key={key} path={path} element={<AdminShell pageTitle={title}>{page}</AdminShell>} />
	);
}

export const adminRouteElements = [
	<Route key="admin" element={<ProtectedRoute roles={['ADMIN']} />}>
		{adminRoute('admin-overview', '/admin', 'Operations overview', <AdminOverviewPage />)}
		{adminRoute(
			'teacher-queue',
			'/admin/teacher-applications',
			'Teacher reviews',
			<TeacherReviewPage />
		)}
		{adminRoute(
			'teacher-review',
			'/admin/teacher-registration/:requestId',
			'Teacher review',
			<TeacherReviewPage />
		)}
		{adminRoute(
			'course-queue',
			'/admin/course-reviews',
			'Course reviews',
			<CourseReviewPage />
		)}
		{adminRoute(
			'course-review',
			'/admin/course-review/:courseId',
			'Course review',
			<CourseReviewPage />
		)}
		{adminRoute('audit-logs', '/admin/audit-logs', 'Audit logs', <AuditLogsPage />)}
		{adminRoute(
			'payout-requests',
			'/admin/payout-requests',
			'Payout requests',
			<PayoutReviewPage />
		)}
	</Route>
];

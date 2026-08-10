import type { ReactNode } from 'react';
import { Route } from 'react-router-dom';
import { TeacherShell } from '../../components/layout/Shells';
import { CodingProblemsPage } from '../../features/teacher-studio/CodingProblemsPage';
import { CourseApprovalPage } from '../../features/teacher-studio/CourseApprovalPage';
import { CourseBuilderPage } from '../../features/teacher-studio/CourseBuilderPage';
import { CurriculumReorderPage } from '../../features/teacher-studio/CurriculumReorderPage';
import { EnrollmentRequestsPage } from '../../features/teacher-studio/EnrollmentRequestsPage';
import { LessonBuilderPage } from '../../features/teacher-studio/LessonBuilderPage';
import { LessonPreviewPage } from '../../features/teacher-studio/LessonPreviewPage';
import { TeacherDashboardPage } from '../../features/teacher-studio/TeacherDashboardPage';
import { TeacherEarningsPage } from '../../features/teacher-studio/TeacherEarningsPage';
import { TeacherProfilePage } from '../../features/teacher-studio/TeacherProfilePage';
import {
	CourseStudentsPage,
	StudentProgressPage,
	SubmissionReviewPage
} from '../../features/teacher-studio/TeacherRecordsPages';
import { TeacherStudentsPage } from '../../features/teacher-studio/TeacherStudentsPage';
import { TeacherCoursesPage } from '../../features/teacher-studio/TeacherCoursesPage';
import { TeacherWalletPage } from '../../features/teacher-studio/TeacherWalletPage';
import { ProtectedRoute } from './ProtectedRoute';

function teacherRoute(key: string, path: string, title: string, page: ReactNode) {
	return (
		<Route
			key={key}
			path={path}
			element={<TeacherShell pageTitle={title}>{page}</TeacherShell>}
		/>
	);
}

export const teacherRouteElements = [
	<Route key="teacher" element={<ProtectedRoute roles={['TEACHER']} />}>
		{teacherRoute(
			'teacher-dashboard',
			'/teacher/dashboard',
			'Teaching studio',
			<TeacherDashboardPage />
		)}
		{teacherRoute('teacher-profile', '/teacher/profile', 'My profile', <TeacherProfilePage />)}
		{teacherRoute('teacher-courses', '/teacher/courses', 'My courses', <TeacherCoursesPage />)}
		{teacherRoute(
			'course-builder',
			'/teacher/course-builder',
			'Course builder',
			<CourseBuilderPage />
		)}
		{teacherRoute(
			'curriculum-reorder',
			'/teacher/curriculum/reorder',
			'Curriculum',
			<CurriculumReorderPage />
		)}
		{teacherRoute(
			'lesson-builder',
			'/teacher/lesson-builder',
			'Lesson builder',
			<LessonBuilderPage />
		)}
		{teacherRoute(
			'lesson-preview',
			'/teacher/lesson-preview',
			'Lesson preview',
			<LessonPreviewPage />
		)}
		{teacherRoute(
			'course-review-status',
			'/teacher/courses/:courseId/review-status',
			'Course review status',
			<CourseApprovalPage />
		)}
		{teacherRoute(
			'enrollment',
			'/teacher/course-enrollment',
			'Enrollment requests',
			<EnrollmentRequestsPage />
		)}
		{teacherRoute('students', '/teacher/students', 'Students', <TeacherStudentsPage />)}
		{teacherRoute(
			'course-students',
			'/teacher/course-students',
			'Course students',
			<CourseStudentsPage />
		)}
		{teacherRoute(
			'student-progress',
			'/teacher/student-progress',
			'Student progress',
			<StudentProgressPage />
		)}
		{teacherRoute(
			'submissions',
			'/teacher/submissions',
			'Submissions',
			<SubmissionReviewPage />
		)}
		{teacherRoute('earnings', '/teacher/earnings', 'Earnings', <TeacherEarningsPage />)}
		{teacherRoute(
			'coding-problems',
			'/teacher/coding-problems',
			'Coding problems',
			<CodingProblemsPage />
		)}
		{teacherRoute('wallet', '/teacher/wallet', 'Wallet & payout', <TeacherWalletPage />)}
	</Route>
];

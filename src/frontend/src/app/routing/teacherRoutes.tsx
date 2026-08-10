import { Route } from 'react-router-dom';
import { TeacherShell } from '../../components/layout/Shells';
import { DashboardPage, PlaceholderPage } from '../../pages/FoundationalPages';
import { ProtectedRoute } from './ProtectedRoute';

export const teacherRouteElements = [
	<Route key="teacher" element={<ProtectedRoute roles={['TEACHER']} />}>
		<Route
			path="/teacher/dashboard"
			element={
				<TeacherShell pageTitle="Teaching studio">
					<DashboardPage role="teacher" />
				</TeacherShell>
			}
		/>
		<Route
			path="/teacher/courses"
			element={
				<TeacherShell pageTitle="My courses">
					<PlaceholderPage
						title="Course studio"
						description="Course builder follows TC11 in Phase 4."
					/>
				</TeacherShell>
			}
		/>
	</Route>
];

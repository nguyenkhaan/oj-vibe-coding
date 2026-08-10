import { Route } from 'react-router-dom';
import { StudentShell } from '../../components/layout/Shells';
import { TeacherApplicationPage } from '../../features/teacher-application/TeacherApplicationPage';
import { DashboardPage, PlaceholderPage } from '../../pages/FoundationalPages';
import { ProtectedRoute } from './ProtectedRoute';

export const studentRouteElements = [
	<Route key="student" element={<ProtectedRoute roles={['STUDENT']} />}>
		<Route
			path="/student/dashboard"
			element={
				<StudentShell pageTitle="Learning dashboard">
					<DashboardPage role="student" />
				</StudentShell>
			}
		/>
		<Route
			path="/student/teacher-application"
			element={
				<StudentShell pageTitle="Teacher application">
					<TeacherApplicationPage />
				</StudentShell>
			}
		/>
		<Route
			path="/student/courses"
			element={
				<StudentShell pageTitle="My courses">
					<PlaceholderPage
						title="Your courses"
						description="Enrolled course cards follow STD02 in Phase 3."
					/>
				</StudentShell>
			}
		/>
		<Route
			path="/student/favorites"
			element={
				<StudentShell pageTitle="Favorites">
					<PlaceholderPage
						title="Saved courses"
						description="Favorite course state follows STD03 in Phase 3."
					/>
				</StudentShell>
			}
		/>
	</Route>
];

import { Route } from 'react-router-dom';
import { StudentShell } from '../../components/layout/Shells';
import {
	EnrolledCoursesPage,
	FavoritesPage,
	StudentDashboardPage,
	StudentProfilePage
} from '../../features/learning/LearningPages';
import { ClassroomPage } from '../../features/learning/ClassroomPage';
import { TeacherApplicationPage } from '../../features/teacher-application/TeacherApplicationPage';
import { ProtectedRoute } from './ProtectedRoute';

export const studentRouteElements = [
	<Route key="student" element={<ProtectedRoute roles={['STUDENT']} />}>
		<Route
			path="/student/dashboard"
			element={
				<StudentShell pageTitle="Learning dashboard">
					<StudentDashboardPage />
				</StudentShell>
			}
		/>
		<Route
			path="/classroom/workspace"
			element={
				<StudentShell pageTitle="Course workspace">
					<ClassroomPage />
				</StudentShell>
			}
		/>
		<Route
			path="/student/profile"
			element={
				<StudentShell pageTitle="My profile">
					<StudentProfilePage />
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
			path={['/student/courses', '/student/enrolled-courses']}
			element={
				<StudentShell pageTitle="My courses">
					<EnrolledCoursesPage />
				</StudentShell>
			}
		/>
		<Route
			path="/student/favorites"
			element={
				<StudentShell pageTitle="Favorites">
					<FavoritesPage />
				</StudentShell>
			}
		/>
	</Route>
];

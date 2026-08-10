import { Route } from 'react-router-dom';
import { CodingShell, StudentShell } from '../../components/layout/Shells';
import { ClassroomRoutePage } from '../../features/learning/ClassroomPage';
import { ProgrammingLessonPage } from '../../features/learning/ProgrammingLessonPage';
import { QuizAttemptPage, QuizPreviewPage } from '../../features/learning/QuizPages';
import { ReadingViewer } from '../../features/learning/ReadingViewer';
import { PlaceholderPage } from '../../pages/FoundationalPages';
import { ProtectedRoute } from './ProtectedRoute';

export const protectedFeatureRouteElements = [
	<Route key="protected-features" element={<ProtectedRoute />}>
		<Route
			path="/reading/:lessonId"
			element={
				<StudentShell pageTitle="Reading lesson">
					<ReadingViewer />
				</StudentShell>
			}
		/>
		<Route
			path="/programming/:problemId/:view"
			element={
				<StudentShell pageTitle="Programming lesson">
					<ProgrammingLessonPage />
				</StudentShell>
			}
		/>
		<Route
			path="/quiz/:quizId/preview"
			element={
				<StudentShell pageTitle="Quiz preview">
					<QuizPreviewPage />
				</StudentShell>
			}
		/>
		<Route
			path="/quiz/:quizId/attempt"
			element={
				<StudentShell pageTitle="Quiz attempt">
					<QuizAttemptPage />
				</StudentShell>
			}
		/>
		<Route
			path="/online-judge/problems"
			element={
				<CodingShell pageTitle="Problem library">
					<PlaceholderPage
						title="Coding workspace foundation"
						description="OJ editor and sandbox states follow OJ01-OJ03 in Phase 6."
					/>
				</CodingShell>
			}
		/>
		<Route
			path="/learn/:courseSlug/:lessonContentId"
			element={
				<StudentShell pageTitle="Course workspace">
					<ClassroomRoutePage />
				</StudentShell>
			}
		/>
		<Route
			path="/interview/setup"
			element={
				<StudentShell pageTitle="AI interview">
					<PlaceholderPage
						title="Interview setup foundation"
						description="AI session setup follows INTERVIEW03 in Phase 6."
					/>
				</StudentShell>
			}
		/>
	</Route>
];

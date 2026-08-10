import { Route } from 'react-router-dom';
import { CodingShell, StudentShell } from '../../components/layout/Shells';
import { PlaceholderPage } from '../../pages/FoundationalPages';
import { ProtectedRoute } from './ProtectedRoute';

export const protectedFeatureRouteElements = [
	<Route key="protected-features" element={<ProtectedRoute />}>
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
					<PlaceholderPage
						title="Learning workspace foundation"
						description="Content navigation follows CLASS01 and STD01 in Phase 3."
					/>
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

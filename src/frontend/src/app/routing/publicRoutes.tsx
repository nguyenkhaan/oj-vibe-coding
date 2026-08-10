import { Route } from 'react-router-dom';
import { AuthShell, PublicShell } from '../../components/layout/Shells';
import { CatalogPage } from '../../features/catalog/CatalogPage';
import { CourseDetailRoutePage } from '../../features/catalog/CourseDetailPage';
import { ComponentPreviewPage } from '../../pages/ComponentPreviewPage';
import { HomePage, PlaceholderPage } from '../../pages/FoundationalPages';
import { authRouteElements } from './authRoutes';
import { instructorRouteElements } from './instructorRoutes';

export const publicRouteElements = [
	<Route
		key="home"
		path="/"
		element={
			<PublicShell pageTitle="Welcome">
				<HomePage />
			</PublicShell>
		}
	/>,
	<Route
		key="catalog"
		path="/courses"
		element={
			<PublicShell pageTitle="Course catalog">
				<CatalogPage />
			</PublicShell>
		}
	/>,
	<Route
		key="course-detail"
		path="/courses/:slug"
		element={
			<PublicShell pageTitle="Course detail">
				<CourseDetailRoutePage />
			</PublicShell>
		}
	/>,
	<Route
		key="preview"
		path="/preview/components"
		element={
			<PublicShell pageTitle="Component preview">
				<ComponentPreviewPage />
			</PublicShell>
		}
	/>,
	...instructorRouteElements,
	...authRouteElements,
	<Route
		key="forbidden"
		path="/forbidden"
		element={
			<AuthShell pageTitle="Access restricted">
				<PlaceholderPage
					title="You do not have access"
					description="The route guard blocked this resource for the current role."
				/>
			</AuthShell>
		}
	/>,
	<Route
		key="not-found"
		path="*"
		element={
			<AuthShell pageTitle="Page not found">
				<PlaceholderPage
					title="This page is not here"
					description="Check the route or return to the SkillBoost home page."
				/>
			</AuthShell>
		}
	/>
];

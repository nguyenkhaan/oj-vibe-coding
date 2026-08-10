import { Route } from 'react-router-dom';
import { AuthShell, PublicShell } from '../../components/layout/Shells';
import { CatalogPage, HomePage, LoginPage, PlaceholderPage } from '../../pages/FoundationalPages';
import { ComponentPreviewPage } from '../../pages/ComponentPreviewPage';

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
		key="preview"
		path="/preview/components"
		element={
			<PublicShell pageTitle="Component preview">
				<ComponentPreviewPage />
			</PublicShell>
		}
	/>,
	<Route
		key="login"
		path="/auth/login"
		element={
			<AuthShell pageTitle="Sign in">
				<LoginPage />
			</AuthShell>
		}
	/>,
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

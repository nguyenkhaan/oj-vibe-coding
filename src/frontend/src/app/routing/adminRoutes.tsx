import { Route } from 'react-router-dom';
import { AdminShell } from '../../components/layout/Shells';
import { DashboardPage } from '../../pages/FoundationalPages';
import { ProtectedRoute } from './ProtectedRoute';

export const adminRouteElements = [
	<Route key="admin" element={<ProtectedRoute roles={['ADMIN']} />}>
		<Route
			path="/admin"
			element={
				<AdminShell pageTitle="Operations overview">
					<DashboardPage role="admin" />
				</AdminShell>
			}
		/>
	</Route>
];

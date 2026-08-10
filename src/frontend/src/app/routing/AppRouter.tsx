import { BrowserRouter, Routes } from 'react-router-dom';
import { AuthProvider } from '../auth/AuthProvider';
import { adminRouteElements } from './adminRoutes';
import { protectedFeatureRouteElements } from './protectedFeatureRoutes';
import { publicRouteElements } from './publicRoutes';
import { studentRouteElements } from './studentRoutes';
import { teacherRouteElements } from './teacherRoutes';

export function AppRouter() {
	return (
		<BrowserRouter>
			<AuthProvider>
				<Routes>
					{publicRouteElements}
					{studentRouteElements}
					{teacherRouteElements}
					{adminRouteElements}
					{protectedFeatureRouteElements}
				</Routes>
			</AuthProvider>
		</BrowserRouter>
	);
}

import { BrowserRouter, Routes } from 'react-router-dom';
import { AuthProvider } from '../auth/AuthProvider';
import { LearningProgressProvider } from '../../features/learning/LearningProgressProvider';
import { PhaseFourProvider } from '../../features/teacher-studio/PhaseFourProvider';
import { CommerceProvider } from '../../features/commerce/CommerceProvider';
import { adminRouteElements } from './adminRoutes';
import { protectedFeatureRouteElements } from './protectedFeatureRoutes';
import { publicRouteElements } from './publicRoutes';
import { studentRouteElements } from './studentRoutes';
import { teacherRouteElements } from './teacherRoutes';

export function AppRouter() {
	return (
		<BrowserRouter>
			<AuthProvider>
				<CommerceProvider>
					<PhaseFourProvider>
						<LearningProgressProvider>
							<Routes>
								{publicRouteElements}
								{studentRouteElements}
								{teacherRouteElements}
								{adminRouteElements}
								{protectedFeatureRouteElements}
							</Routes>
						</LearningProgressProvider>
					</PhaseFourProvider>
				</CommerceProvider>
			</AuthProvider>
		</BrowserRouter>
	);
}

import { Route } from 'react-router-dom';
import { PublicShell } from '../../components/layout/Shells';
import {
	InstructorDetailPage,
	InstructorGridPage
} from '../../features/instructors/InstructorPages';

export const instructorRouteElements = [
	<Route
		key="instructors"
		path="/instructors"
		element={
			<PublicShell pageTitle="Instructors">
				<InstructorGridPage />
			</PublicShell>
		}
	/>,
	<Route
		key="instructor-detail"
		path="/instructors/:instructorId"
		element={
			<PublicShell pageTitle="Instructor profile">
				<InstructorDetailPage />
			</PublicShell>
		}
	/>
];

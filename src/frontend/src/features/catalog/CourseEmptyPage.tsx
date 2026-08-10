import { Link } from 'react-router-dom';

export function CourseEmptyPage() {
	return (
		<section className="course-empty-state">
			<div className="course-empty-icon" aria-hidden="true">
				□
			</div>
			<h1>Cannot find the course</h1>
			<p>The course may have been removed or is not available.</p>
			<Link className="ui-button ui-button-primary" to="/courses">
				Back to courses
			</Link>
		</section>
	);
}

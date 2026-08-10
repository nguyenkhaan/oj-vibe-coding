import { Link } from 'react-router-dom';
import { Card } from '../../shared/ui';
import { enrolledCourses } from './learningData';

export function StudentDashboardPage() {
	const current = enrolledCourses[0];
	return (
		<section className="learning-dashboard-page">
			<div className="catalog-heading">
				<div>
					<span className="eyebrow">Student workspace</span>
					<h1 className="page-title">Your learning dashboard</h1>
					<p className="page-subtitle">
						Pick up a course and keep your next session focused.
					</p>
				</div>
				<Link className="text-link" to="/student/enrolled-courses">
					View enrolled courses →
				</Link>
			</div>
			<div className="learning-metric-grid">
				<Card>
					<strong>64%</strong>
					<span>Current course progress</span>
				</Card>
				<Card>
					<strong>12</strong>
					<span>Lessons completed</span>
				</Card>
				<Card>
					<strong>4</strong>
					<span>Practice streak</span>
				</Card>
			</div>
			<Card className="continue-learning-card">
				<div>
					<span className="eyebrow">Continue where you left off</span>
					<h2>{current.title}</h2>
					<p>Next lesson: {current.nextLesson}</p>
				</div>
				<div className="continue-learning-progress">
					<strong>{current.progress}%</strong>
					<div className="progress-track">
						<span style={{ width: `${current.progress}%` }} />
					</div>
					<Link
						className="ui-button ui-button-primary"
						to={`/learn/${current.slug}/hash-tables`}
					>
						Continue learning
					</Link>
				</div>
			</Card>
		</section>
	);
}

export { EnrolledCoursesPage, FavoritesPage } from './StudentCoursePages';
export { StudentProfilePage } from './StudentProfilePage';

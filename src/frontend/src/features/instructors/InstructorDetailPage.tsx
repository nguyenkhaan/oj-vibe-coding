import { Link, useParams } from 'react-router-dom';
import { Button, Card } from '../../shared/ui';
import { instructors } from './data';

export function InstructorDetailPage() {
	const { instructorId } = useParams();
	const instructor = instructors.find((item) => item.id === instructorId) ?? instructors[0];
	return (
		<section className="instructor-detail-page">
			<Link className="back-link" to="/instructors">
				← All instructors
			</Link>
			<Card className="instructor-profile-hero">
				<div
					className={`instructor-avatar instructor-avatar-large course-art-${instructor.accent}`}
				>
					{instructor.code}
				</div>
				<div>
					<span className="eyebrow">Instructor profile</span>
					<h1 className="page-title">{instructor.name}</h1>
					<p className="page-subtitle">
						{instructor.role} · ★ {instructor.rating}
					</p>
				</div>
				<Button variant="secondary" type="button">
					Follow
				</Button>
			</Card>
			<div className="instructor-profile-grid">
				<Card>
					<span className="eyebrow">About</span>
					<h2>Practical instruction for confident builders.</h2>
					<p className="page-subtitle">
						Focused lessons, clear examples and projects that make technical ideas
						easier to apply.
					</p>
				</Card>
				<Card>
					<span className="eyebrow">Teaching at a glance</span>
					<div className="profile-metrics">
						<strong>
							{instructor.courses}
							<small>Courses</small>
						</strong>
						<strong>
							12k<small>Students</small>
						</strong>
						<strong>
							{instructor.rating}
							<small>Rating</small>
						</strong>
					</div>
				</Card>
			</div>
		</section>
	);
}

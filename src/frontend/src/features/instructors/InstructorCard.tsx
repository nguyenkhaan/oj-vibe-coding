import { Link } from 'react-router-dom';
import { Button, Card } from '../../shared/ui';
import type { Instructor } from './data';

export function InstructorCard({
	instructor,
	followed,
	onToggle
}: {
	instructor: Instructor;
	followed: boolean;
	onToggle: () => void;
}) {
	return (
		<Card className="instructor-card">
			<div className={`instructor-avatar course-art-${instructor.accent}`}>
				{instructor.code}
			</div>
			<div className="instructor-info">
				<h2>{instructor.name}</h2>
				<p>{instructor.role}</p>
				<div className="course-card-meta">
					<span>★ {instructor.rating}</span>
					<span>{instructor.courses} courses</span>
				</div>
			</div>
			<div className="instructor-actions">
				<Button
					variant="secondary"
					type="button"
					onClick={onToggle}
					aria-label={`${followed ? 'Following' : 'Follow'} ${instructor.name}`}
				>
					{followed ? 'Following' : 'Follow'}
				</Button>
				<Link className="text-link" to={`/instructors/${instructor.id}`}>
					View profile
				</Link>
			</div>
		</Card>
	);
}

import { Link } from 'react-router-dom';
import { Button, Card, StatusBadge } from '../../shared/ui';
import { formatPrice } from './data';
import type { Course } from './types';

type CourseCardProps = { course: Course; enrolled?: boolean };

export function CourseCard({ course, enrolled = false }: CourseCardProps) {
	return (
		<Card className="catalog-course-card">
			<div className={`course-art course-art-${course.accent}`} aria-hidden="true">
				<strong>{course.code}</strong>
				<span>{course.category}</span>
			</div>
			<div className="course-card-body">
				<div className="card-row">
					<StatusBadge tone="indigo">{course.level}</StatusBadge>
					<button
						className="favorite-button"
						type="button"
						aria-label={`Save ${course.title}`}
					>
						♡
					</button>
				</div>
				<h2>
					<Link to={`/courses/${course.slug}`}>{course.title}</Link>
				</h2>
				<p>{course.description}</p>
				<div className="course-card-meta">
					<span>
						★ {course.rating} ({course.reviews})
					</span>
					<span>{course.lessons} lessons</span>
				</div>
				<div className="course-card-footer">
					<strong>{enrolled ? 'Enrolled' : formatPrice(course.priceVnd)}</strong>
					<Button variant="ghost" type="button">
						{enrolled ? 'Continue' : 'View course'}
					</Button>
				</div>
			</div>
		</Card>
	);
}

import { Link } from 'react-router-dom';
import { Button, Card, StatusBadge } from '../../shared/ui';
import type { LearningCourse } from './learningData';

export function LearningCourseCard({ course }: { course: LearningCourse }) {
	return (
		<Card className="learning-course-card">
			<div className={`learning-course-art course-art-${course.accent}`} aria-hidden="true">
				<strong>{course.code}</strong>
				<span>Course</span>
			</div>
			<div className="learning-course-body">
				<StatusBadge tone={course.status === 'completed' ? 'success' : 'indigo'}>
					{course.status === 'completed' ? 'Completed' : 'In progress'}
				</StatusBadge>
				<h2>{course.title}</h2>
				<div className="learning-progress-label">
					<span>{course.progress}% complete</span>
					<span>{course.lastAccessed}</span>
				</div>
				<div className="progress-track">
					<span style={{ width: `${course.progress}%` }} />
				</div>
				<p>Next: {course.nextLesson}</p>
				{course.status === 'completed' ? (
					<Button variant="secondary" type="button">
						Review course
					</Button>
				) : (
					<Link
						className="ui-button ui-button-primary"
						to={`/learn/${course.slug}/${course.nextLesson.toLowerCase().replaceAll(' ', '-')}`}
					>
						Continue
					</Link>
				)}
			</div>
		</Card>
	);
}

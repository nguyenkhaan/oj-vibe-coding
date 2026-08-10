import { Link } from 'react-router-dom';
import { Card, StatusBadge } from '../../shared/ui';
import { StudioPageHeader } from './StudioShared';
import { teacherCourses } from './phase4Data';

function tone(status: string) {
	return status === 'PUBLISHED' ? 'success' : status === 'DRAFT' ? 'neutral' : 'warning';
}

export function TeacherCoursesPage() {
	return (
		<section className="studio-page">
			<StudioPageHeader
				eyebrow="Course studio"
				title="My courses"
				subtitle="Create, organize and submit courses for moderation."
				action={
					<Link className="ui-button ui-button-primary" to="/teacher/course-builder">
						Create course
					</Link>
				}
			/>
			<div className="studio-course-grid">
				{teacherCourses.map((course) => (
					<Card className="studio-course-card" key={course.id}>
						<div className="studio-course-art">
							{course.title.slice(0, 2).toUpperCase()}
						</div>
						<div>
							<StatusBadge tone={tone(course.status)}>
								{course.status.replaceAll('_', ' ')}
							</StatusBadge>
							<h2>{course.title}</h2>
							<p>
								{course.lessons} lessons · {course.students} students
							</p>
							<strong>{course.price.toLocaleString()} VND</strong>
							<div className="studio-row-actions">
								<Link className="text-link" to="/teacher/course-builder">
									Open builder
								</Link>
								<Link
									className="text-link"
									to={`/teacher/courses/${course.id}/review-status`}
								>
									Review status
								</Link>
							</div>
						</div>
					</Card>
				))}
			</div>
		</section>
	);
}

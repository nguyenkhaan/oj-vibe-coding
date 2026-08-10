import { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Button, Card, StatusBadge } from '../../shared/ui';
import { catalogCourses, formatPrice } from './data';
import { CourseEmptyPage } from './CourseEmptyPage';
import type { Course } from './types';

type CourseDetailProps = { slug: string; enrolled?: boolean };
type DetailTab = 'Overview' | 'Curriculum' | 'Instructor' | 'Reviews';

export function CourseDetailRoutePage() {
	const { slug = '' } = useParams();
	const course = catalogCourses.find((item) => item.slug === slug);
	return course ? <CourseDetailPage slug={course.slug} /> : <CourseEmptyPage />;
}

export function CourseDetailPage({ slug, enrolled = false }: CourseDetailProps) {
	const course = catalogCourses.find((item) => item.slug === slug) as Course;
	const [tab, setTab] = useState<DetailTab>('Overview');
	return (
		<section className="course-detail-page">
			<Link className="back-link" to="/courses">
				← All courses
			</Link>
			<div className="course-detail-hero">
				<div className={`course-detail-art course-art-${course.accent}`} aria-hidden="true">
					<strong>{course.code}</strong>
					<span>{course.category}</span>
				</div>
				<div className="course-detail-intro">
					<StatusBadge tone="indigo">{course.level}</StatusBadge>
					<h1 className="page-title">{course.title}</h1>
					<p>{course.description}</p>
					<div className="course-rating">
						★ {course.rating} <span>{course.reviews} reviews</span> ·{' '}
						{course.instructor}
					</div>
				</div>
			</div>
			<div className="course-detail-layout">
				<div className="course-detail-main">
					<div className="course-tabs" role="tablist" aria-label="Course details">
						{(['Overview', 'Curriculum', 'Instructor', 'Reviews'] as DetailTab[]).map(
							(item) => (
								<button
									key={item}
									type="button"
									role="tab"
									aria-selected={tab === item}
									className={tab === item ? 'is-active' : ''}
									onClick={() => setTab(item)}
								>
									{item}
								</button>
							)
						)}
					</div>
					<CourseTabContent course={course} tab={tab} />
				</div>
				<Card className="course-purchase-card">
					<div
						className={`course-preview-art course-art-${course.accent}`}
						aria-hidden="true"
					>
						<span>▶</span>
					</div>
					<strong className="course-price">{formatPrice(course.priceVnd)}</strong>
					<Button type="button">{enrolled ? 'Continue learning' : 'Enroll now'}</Button>
					<ul>
						<li>{course.lessons} lessons</li>
						<li>{course.duration} of video and practice</li>
						<li>Lifetime access</li>
					</ul>
				</Card>
			</div>
		</section>
	);
}

function CourseTabContent({ course, tab }: { course: Course; tab: DetailTab }) {
	if (tab === 'Curriculum')
		return (
			<div className="curriculum-list">
				{course.modules.map((module) => (
					<Card className="curriculum-module" key={module.title}>
						<h2>{module.title}</h2>
						{module.lessons.map((lesson) => (
							<div className="lesson-row" key={lesson.title}>
								<span>▶ {lesson.title}</span>
								<span>
									{lesson.duration}{' '}
									{lesson.free ? (
										<StatusBadge tone="success">Free</StatusBadge>
									) : null}
								</span>
							</div>
						))}
					</Card>
				))}
			</div>
		);
	if (tab === 'Instructor')
		return (
			<Card className="detail-copy">
				<span className="eyebrow">Instructor</span>
				<h2>{course.instructor}</h2>
				<p>
					{course.instructorRole} focused on practical projects and clear technical
					foundations.
				</p>
				<Link className="text-link" to="/instructors">
					View instructor profile →
				</Link>
			</Card>
		);
	if (tab === 'Reviews')
		return (
			<Card className="detail-copy">
				<span className="eyebrow">Student reviews</span>
				<h2>{course.rating} out of 5</h2>
				<p>{course.reviews} learners have reviewed this course.</p>
			</Card>
		);
	return (
		<div className="detail-overview">
			<Card className="detail-copy">
				<span className="eyebrow">What you will build</span>
				<h2>Skills that transfer to your next project.</h2>
				<p>{course.description}</p>
			</Card>
			<div className="detail-points">
				<strong>Inside this course</strong>
				<ul>
					<li>Structured lessons with working examples</li>
					<li>Practice tasks with immediate feedback</li>
					<li>Progress you can pick up any time</li>
				</ul>
			</div>
		</div>
	);
}

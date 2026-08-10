import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Card, StatusBadge } from '../../shared/ui';
import { LearningCourseCard } from './LearningCourseCard';
import { enrolledCourses, favoriteCourses } from './learningData';

export function EnrolledCoursesPage() {
	const [filter, setFilter] = useState<'enrolled' | 'active' | 'completed'>('enrolled');
	const courses =
		filter === 'enrolled'
			? enrolledCourses
			: enrolledCourses.filter((course) =>
					filter === 'completed'
						? course.status === 'completed'
						: course.status === 'active'
				);
	return (
		<section className="learning-list-page">
			<div className="catalog-heading">
				<div>
					<span className="eyebrow">My learning</span>
					<h1 className="page-title">Enrolled courses</h1>
					<p className="page-subtitle">
						Your progress, next lesson and recently opened courses.
					</p>
				</div>
			</div>
			<div className="learning-tabs" role="tablist" aria-label="Course status">
				{(['enrolled', 'active', 'completed'] as const).map((item) => (
					<button
						role="tab"
						aria-selected={filter === item}
						type="button"
						key={item}
						onClick={() => setFilter(item)}
					>
						{item[0].toUpperCase() + item.slice(1)} (
						{item === 'enrolled'
							? enrolledCourses.length
							: enrolledCourses.filter(
									(course) =>
										course.status ===
										(item === 'completed' ? 'completed' : 'active')
								).length}
						)
					</button>
				))}
			</div>
			<div className="learning-course-grid">
				{courses.map((course) => (
					<LearningCourseCard course={course} key={course.slug} />
				))}
			</div>
		</section>
	);
}

export function FavoritesPage() {
	const [favorites, setFavorites] = useState(favoriteCourses);
	return (
		<section className="learning-list-page">
			<div className="catalog-heading">
				<div>
					<span className="eyebrow">Saved courses</span>
					<h1 className="page-title">Favorites</h1>
					<p className="page-subtitle">Keep the courses you want to revisit close.</p>
				</div>
			</div>
			{favorites.length ? (
				<div className="learning-favorite-grid">
					{favorites.map((course) => (
						<Card className="favorite-learning-card" key={course.slug}>
							<div
								className={`learning-course-art course-art-${course.accent}`}
								aria-hidden="true"
							>
								<strong>{course.code}</strong>
							</div>
							<div>
								<div className="favorite-card-header">
									<StatusBadge tone="indigo">{course.category}</StatusBadge>
									<button
										type="button"
										aria-label={`Remove ${course.title} from favorites`}
										onClick={() =>
											setFavorites((current) =>
												current.filter((item) => item.slug !== course.slug)
											)
										}
									>
										♥
									</button>
								</div>
								<h2>{course.title}</h2>
								<p>
									{course.instructor} · ★ {course.rating}
								</p>
								<Link className="text-link" to={`/courses/${course.slug}`}>
									View course →
								</Link>
							</div>
						</Card>
					))}
				</div>
			) : (
				<div className="catalog-no-results">
					<h2>Your favorites are empty.</h2>
					<p>Save a course from the catalog to find it here.</p>
				</div>
			)}
		</section>
	);
}

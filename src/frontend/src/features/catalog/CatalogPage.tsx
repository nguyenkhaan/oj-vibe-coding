import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../../shared/ui';
import { catalogCourses } from './data';
import { CourseCard } from './CourseCard';

export function CatalogPage() {
	const [query, setQuery] = useState('');
	const [category, setCategory] = useState('All categories');
	const [level, setLevel] = useState('All levels');
	const courses = useMemo(
		() =>
			catalogCourses.filter((course) => {
				const matchesQuery = `${course.title} ${course.description}`
					.toLowerCase()
					.includes(query.toLowerCase());
				const matchesCategory =
					category === 'All categories' || course.category === category;
				const matchesLevel = level === 'All levels' || course.level === level;
				return matchesQuery && matchesCategory && matchesLevel;
			}),
		[category, level, query]
	);

	return (
		<section className="catalog-page">
			<div className="catalog-heading">
				<div>
					<span className="eyebrow">Course catalog</span>
					<h1 className="page-title">Choose your next build.</h1>
					<p className="page-subtitle">
						Practical courses for coding, systems and interviews.
					</p>
				</div>
				<Link className="text-link" to="/instructors">
					Meet the instructors →
				</Link>
			</div>
			<div className="catalog-toolbar">
				<label className="field-label" htmlFor="course-search">
					Search courses
					<input
						type="search"
						id="course-search"
						aria-label="Search courses"
						value={query}
						onChange={(event) => setQuery(event.target.value)}
						placeholder="Search by topic or skill"
					/>
				</label>
				<label className="field-label" htmlFor="course-category">
					Category
					<select
						id="course-category"
						value={category}
						onChange={(event) => setCategory(event.target.value)}
					>
						<option>All categories</option>
						<option>Backend</option>
						<option>Algorithms</option>
						<option>Frontend</option>
					</select>
				</label>
				<label className="field-label" htmlFor="course-level">
					Level
					<select
						id="course-level"
						value={level}
						onChange={(event) => setLevel(event.target.value)}
					>
						<option>All levels</option>
						<option>Beginner</option>
						<option>Intermediate</option>
						<option>Advanced</option>
					</select>
				</label>
				<Button
					variant="secondary"
					type="button"
					onClick={() => {
						setQuery('');
						setCategory('All categories');
						setLevel('All levels');
					}}
				>
					Clear filters
				</Button>
			</div>
			<p className="result-count">{courses.length} courses</p>
			{courses.length > 0 ? (
				<div className="catalog-grid">
					{courses.map((course) => (
						<CourseCard course={course} key={course.id} />
					))}
				</div>
			) : (
				<div className="catalog-no-results">
					<h2>No courses match these filters.</h2>
					<p>Clear a filter to see the full catalog.</p>
				</div>
			)}
		</section>
	);
}

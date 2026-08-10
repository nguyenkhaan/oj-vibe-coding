import { useState, type ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, StatusBadge } from '../../shared/ui';
import { classroomLessons, type ClassroomLesson } from './classroomData';
import { ClassroomLessonRail } from './ClassroomLessonRail';
import { useLearningProgress } from './LearningProgressProvider';

function lessonPath(lesson: ClassroomLesson) {
	if (lesson.type === 'Reading') return `/reading/${lesson.id}`;
	if (lesson.type === 'Quiz') return '/quiz/control-flow/preview';
	if (lesson.type === 'Problem') return '/programming/two-pointers/reading';
	return `/learn/python-foundations/${lesson.id}`;
}

export function LearningContentLayout({
	currentLessonId,
	action,
	children
}: {
	currentLessonId: string;
	action?: ReactNode;
	children: ReactNode;
}) {
	const [sidebarOpen, setSidebarOpen] = useState(false);
	const navigate = useNavigate();
	const { isComplete, progressPercent } = useLearningProgress();
	const currentIndex = Math.max(
		0,
		classroomLessons.findIndex((lesson) => lesson.id === currentLessonId)
	);
	const current = classroomLessons[currentIndex] ?? classroomLessons[0];
	const previous = classroomLessons[currentIndex - 1];
	const next = classroomLessons[currentIndex + 1];
	const nextLocked = Boolean(next?.prerequisiteId && !isComplete(next.prerequisiteId));
	const progress = progressPercent(classroomLessons.length);
	function openLesson(lesson?: ClassroomLesson) {
		if (!lesson || (lesson.prerequisiteId && !isComplete(lesson.prerequisiteId))) return;
		setSidebarOpen(false);
		navigate(lessonPath(lesson));
	}

	return (
		<section className="learning-content-shell">
			<header className="learning-content-heading">
				<div className="learning-content-identity">
					<span className="eyebrow">Data Structures &amp; Algorithms</span>
					<p>
						Module 2 · Lesson {currentIndex + 1} of {classroomLessons.length}
					</p>
					<div className="learning-content-title-row">
						<h1 className="page-title">{current.title}</h1>
						<StatusBadge tone={isComplete(current.id) ? 'success' : 'indigo'}>
							{isComplete(current.id) ? `${current.type} · Completed` : current.type}
						</StatusBadge>
					</div>
				</div>
				<div className="learning-content-header-actions">
					<span className="learning-content-progress">{progress}% complete</span>
					{action}
				</div>
			</header>
			<button
				className="learning-content-mobile-toggle"
				type="button"
				aria-label={sidebarOpen ? 'Hide course content' : 'Show course content'}
				aria-expanded={sidebarOpen}
				onClick={() => setSidebarOpen((open) => !open)}
			>
				<span>Course content</span>
				<strong>{progress}%</strong>
			</button>
			<div className="learning-content-layout">
				<div className="learning-content-main">
					{children}
					<nav className="learning-content-pager" aria-label="Lesson navigation">
						<Button
							variant="secondary"
							type="button"
							disabled={!previous}
							onClick={() => openLesson(previous)}
						>
							← Previous
						</Button>
						<span>
							Lesson {currentIndex + 1} of {classroomLessons.length}
						</span>
						<Button
							variant="secondary"
							type="button"
							disabled={!next || nextLocked}
							onClick={() => openLesson(next)}
						>
							{nextLocked ? 'Next lesson locked' : 'Next →'}
						</Button>
					</nav>
				</div>
				{sidebarOpen ? (
					<button
						className="learning-content-backdrop"
						type="button"
						aria-label="Close course content"
						onClick={() => setSidebarOpen(false)}
					/>
				) : null}
				<aside
					className={
						sidebarOpen
							? 'learning-content-sidebar is-open'
							: 'learning-content-sidebar'
					}
					aria-label="Learning progress navigation"
				>
					<button
						className="learning-content-sidebar-close"
						type="button"
						onClick={() => setSidebarOpen(false)}
					>
						Close
					</button>
					<ClassroomLessonRail
						lessons={classroomLessons}
						currentId={current.id}
						progress={progress}
						isComplete={isComplete}
						onSelect={(id) =>
							openLesson(classroomLessons.find((lesson) => lesson.id === id))
						}
					/>
				</aside>
			</div>
		</section>
	);
}

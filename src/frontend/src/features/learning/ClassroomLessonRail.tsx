import { Card } from '../../shared/ui';
import type { ClassroomLesson } from './classroomData';

export function ClassroomLessonRail({
	lessons,
	currentId,
	progress,
	isComplete,
	onSelect
}: {
	lessons: ClassroomLesson[];
	currentId: string;
	progress: number;
	isComplete: (id: string) => boolean;
	onSelect: (id: string) => void;
}) {
	return (
		<Card className="classroom-rail">
			<div className="classroom-rail-heading">
				<strong>Course content</strong>
				<span>{progress}%</span>
			</div>
			<div className="progress-track">
				<span style={{ width: `${progress}%` }} />
			</div>
			<div className="classroom-lesson-list">
				{lessons.map((lesson) =>
					(() => {
						const locked = Boolean(
							lesson.prerequisiteId && !isComplete(lesson.prerequisiteId)
						);
						return (
							<button
								aria-label={`${lesson.title}${locked ? ' (locked)' : ''}`}
								className={[
									lesson.id === currentId ? 'is-current' : '',
									locked ? 'is-locked' : ''
								]
									.filter(Boolean)
									.join(' ')}
								type="button"
								key={lesson.id}
								disabled={locked}
								onClick={() => onSelect(lesson.id)}
							>
								<span className="lesson-state">
									{locked
										? '🔒'
										: isComplete(lesson.id)
											? '✓'
											: lesson.id === currentId
												? '>'
												: '○'}
								</span>
								<span>{lesson.title}</span>
								<small>{lesson.duration}</small>
							</button>
						);
					})()
				)}
			</div>
		</Card>
	);
}

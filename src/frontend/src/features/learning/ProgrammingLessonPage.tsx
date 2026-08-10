import { Link, useParams } from 'react-router-dom';
import { Button, Card } from '../../shared/ui';
import { LearningContentLayout } from './LearningContentLayout';
import { useLearningProgress } from './LearningProgressProvider';

const content = {
	reading: 'Problem reading',
	preview: 'Problem preview',
	video: 'Problem walkthrough'
} as const;

export function ProgrammingLessonPage() {
	const { view = 'reading', problemId = 'two-pointers' } = useParams();
	const title = content[view as keyof typeof content] ?? content.reading;
	const { markComplete, isComplete } = useLearningProgress();
	const progressLessonId = 'judge-problem-set-b';
	const completed = isComplete(progressLessonId);
	const completionAction = (
		<Button
			type="button"
			variant={completed ? 'secondary' : 'primary'}
			onClick={() => markComplete(progressLessonId)}
		>
			{completed ? 'Problem completed' : 'Mark problem complete'}
		</Button>
	);
	return (
		<LearningContentLayout currentLessonId={progressLessonId} action={completionAction}>
			<section className="programming-page">
				<div className="programming-layout">
					<Card className="programming-main">
						<span className="eyebrow">{title}</span>
						<h2 className="lesson-section-title">Two Sum II</h2>
						<p className="page-subtitle">
							Use two pointers to find a pair in a sorted array.
						</p>
						<div className="programming-tabs">
							<Link
								className={view === 'reading' ? 'is-active' : ''}
								to={`/programming/${problemId}/reading`}
							>
								Reading
							</Link>
							<Link
								className={view === 'preview' ? 'is-active' : ''}
								to={`/programming/${problemId}/preview`}
							>
								Preview
							</Link>
							<Link
								className={view === 'video' ? 'is-active' : ''}
								to={`/programming/${problemId}/video`}
							>
								Video
							</Link>
						</div>
						{view === 'video' ? (
							<div className="programming-video">▶ Problem walkthrough</div>
						) : (
							<>
								<h2>{view === 'preview' ? 'Problem statement' : 'Task'}</h2>
								<p>
									Return the 1-indexed positions of two numbers that add up to the
									target.
								</p>
								<pre>
									<code>{`left, right = 0, len(numbers) - 1\nwhile left < right:\n    total = numbers[left] + numbers[right]`}</code>
								</pre>
							</>
						)}
						{view === 'preview' ? (
							<Link
								className="ui-button ui-button-secondary"
								to="/online-judge/problems"
							>
								Open in Online Judge
							</Link>
						) : null}
					</Card>
					<Card className="programming-side">
						<strong>Problem details</strong>
						<span>Difficulty: Medium</span>
						<span>Language: Python</span>
						<span>Test cases: 8</span>
						<span>Accepted submissions unlock completion in the connected judge.</span>
					</Card>
				</div>
			</section>
		</LearningContentLayout>
	);
}

import { Link, useParams } from 'react-router-dom';
import { Button, Card, StatusBadge } from '../../shared/ui';
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
	const completed = isComplete(problemId);
	return (
		<section className="programming-page">
			<Link className="back-link" to="/classroom/workspace">
				← Back to workspace
			</Link>
			<div className="programming-layout">
				<Card className="programming-main">
					<StatusBadge tone={completed ? 'success' : 'indigo'}>
						{completed ? 'Completed' : view}
					</StatusBadge>
					<h1 className="page-title">{title}: Two Sum II</h1>
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
						<Link className="ui-button ui-button-secondary" to="/online-judge/problems">
							Open in Online Judge
						</Link>
					) : null}
					<Button
						type="button"
						variant={completed ? 'secondary' : 'primary'}
						onClick={() => markComplete(problemId)}
					>
						{completed ? 'Problem lesson completed' : 'Mark problem lesson complete'}
					</Button>
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
	);
}

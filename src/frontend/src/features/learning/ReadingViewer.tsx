import { Link, useParams } from 'react-router-dom';
import { Button, Card, StatusBadge } from '../../shared/ui';
import { useLearningProgress } from './LearningProgressProvider';

const markdown = [
	'When two keys share a bucket, the collision strategy keeps lookup performance predictable.',
	'',
	'## Separate chaining',
	'',
	'Store colliding entries in a small collection at the same bucket, then search that collection during lookup.',
	'',
	'```python',
	'bucket[key % size].append(entry)',
	'```',
	'',
	'> Tip: keep the load factor low so each bucket stays quick to search.',
	'',
	'## Open addressing',
	'',
	'Probe another slot when the preferred bucket is occupied, then repeat until an empty slot is found.'
].join('\n');

function renderInline(value: string) {
	const parts = value.split(/(\*\*[^*]+\*\*|\[[^\]]+\]\([^\s)]+\))/g);
	return parts.map((part, index) => {
		if (part.startsWith('**') && part.endsWith('**')) {
			return <strong key={index}>{part.slice(2, -2)}</strong>;
		}
		const link = part.match(/^\[([^\]]+)\]\(([^\s)]+)\)$/);
		if (link && (link[2].startsWith('https://') || link[2].startsWith('/'))) {
			return (
				<a href={link[2]} key={index}>
					{link[1]}
				</a>
			);
		}
		return <span key={index}>{part}</span>;
	});
}

function MarkdownContent({ source }: { source: string }) {
	const blocks = source.split('\n\n');
	return (
		<div className="reading-markdown">
			{blocks.map((block, index) => {
				if (block.startsWith('```')) {
					const [, language = '', code = ''] =
						block.match(/^```(\w*)\n([\s\S]*?)\n```$/) ?? [];
					return (
						<pre key={index} data-language={language}>
							<code>{code}</code>
						</pre>
					);
				}
				if (block.startsWith('## '))
					return <h2 key={index}>{renderInline(block.slice(3))}</h2>;
				if (block.startsWith('> '))
					return <blockquote key={index}>{renderInline(block.slice(2))}</blockquote>;
				return <p key={index}>{renderInline(block)}</p>;
			})}
		</div>
	);
}

export function ReadingViewer() {
	const { lessonId = 'collision-strategies' } = useParams();
	const { markComplete, isComplete } = useLearningProgress();
	const completed = isComplete(lessonId);
	return (
		<section className="reading-page">
			<Link className="back-link" to="/classroom/workspace">
				← Back to workspace
			</Link>
			<Card className="reading-card">
				<div className="reading-header">
					<div>
						<span className="eyebrow">Reading lesson</span>
						<h1 className="page-title">Collision strategies</h1>
					</div>
					<StatusBadge tone={completed ? 'success' : 'neutral'}>
						{completed ? 'Completed' : 'In progress'}
					</StatusBadge>
				</div>
				<MarkdownContent source={markdown} />
				<div className="reading-actions">
					<span className="reading-context">Lesson: {lessonId}</span>
					<Button
						type="button"
						variant={completed ? 'secondary' : 'primary'}
						onClick={() => markComplete(lessonId)}
					>
						{completed ? 'Lesson completed' : 'Mark reading complete'}
					</Button>
				</div>
			</Card>
		</section>
	);
}

import { Link } from 'react-router-dom';
import { Card, StatusBadge } from '../../shared/ui';
import { StudioPageHeader } from './StudioShared';

export function LessonPreviewPage() {
	return (
		<section className="studio-page">
			<StudioPageHeader
				eyebrow="Lesson content"
				title="Two-pointer patterns"
				subtitle="Module 2 · Lesson 3 · Student rendering preview"
				action={
					<Link
						className="ui-button ui-button-primary"
						to="/learn/python-foundations/two-pointer-patterns"
					>
						Preview as student
					</Link>
				}
			/>
			<Card className="studio-preview-card">
				<StatusBadge tone="neutral">Draft</StatusBadge>
				<p>Learn to scan an ordered collection with two pointers.</p>
				<div className="studio-preview-media">▶ Code and video preview</div>
				<div className="classroom-tabs">
					<button className="is-active" type="button">
						Notes
					</button>
					<button type="button">Resources</button>
					<button type="button">Assignment</button>
				</div>
				<pre>
					<code>{`left, right = 0, len(values) - 1\nwhile left < right:\n    compare(values[left], values[right])`}</code>
				</pre>
			</Card>
		</section>
	);
}

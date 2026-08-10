import { useState } from 'react';
import { Button, Card } from '../../shared/ui';
import { StudioPageHeader } from './StudioShared';

const initial = ['Introduction', 'Complexity', 'Two-pointer patterns', 'Sliding window'];

export function CurriculumReorderPage() {
	const [lessons, setLessons] = useState(initial);
	const [dirty, setDirty] = useState(false);
	function move(index: number, offset: number) {
		const target = index + offset;
		if (target < 0 || target >= lessons.length) return;
		setLessons((items) => {
			const next = [...items];
			[next[index], next[target]] = [next[target], next[index]];
			return next;
		});
		setDirty(true);
	}
	return (
		<section className="studio-page">
			<StudioPageHeader
				eyebrow="Course curriculum"
				title="Reorder lessons"
				subtitle="Use the explicit controls to keep ordering accessible by keyboard."
				action={
					<Button type="button" disabled={!dirty} onClick={() => setDirty(false)}>
						{dirty ? 'Save order' : 'Order saved'}
					</Button>
				}
			/>
			<Card className="studio-curriculum-card">
				<div className="studio-module-heading">
					<div>
						<span className="eyebrow">Module 2</span>
						<h2>Patterns</h2>
					</div>
					<strong>{lessons.length} lessons</strong>
				</div>
				{lessons.map((lesson, index) => (
					<div className="studio-reorder-row" key={lesson}>
						<span className="drag-handle" aria-hidden="true">
							≡
						</span>
						<strong>
							{index + 1}. {lesson}
						</strong>
						<div>
							<button
								type="button"
								aria-label={`Move ${lesson} up`}
								disabled={index === 0}
								onClick={() => move(index, -1)}
							>
								↑
							</button>
							<button
								type="button"
								aria-label={`Move ${lesson} down`}
								disabled={index === lessons.length - 1}
								onClick={() => move(index, 1)}
							>
								↓
							</button>
						</div>
					</div>
				))}
				<button
					className="studio-add-row"
					type="button"
					onClick={() => {
						setLessons((items) => [...items, `New lesson ${items.length + 1}`]);
						setDirty(true);
					}}
				>
					+ Add lesson
				</button>
			</Card>
		</section>
	);
}

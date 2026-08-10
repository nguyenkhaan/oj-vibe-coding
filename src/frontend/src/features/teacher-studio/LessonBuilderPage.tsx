import { useState } from 'react';
import { Button, Card, StatusBadge } from '../../shared/ui';
import { StudioPageHeader } from './StudioShared';

type ContentType = 'Reading' | 'Video' | 'Quiz' | 'Problem';

export function LessonBuilderPage() {
	const [type, setType] = useState<ContentType>('Reading');
	const [blocks, setBlocks] = useState(['Explain the core pattern with a practical example.']);
	const [saved, setSaved] = useState(false);
	const assessed = type === 'Quiz' || type === 'Problem';
	return (
		<section className="studio-page">
			<StudioPageHeader
				eyebrow="Lesson content"
				title="Lesson builder"
				subtitle="Compose ordered Reading, Video, Quiz and Problem content blocks."
				action={<StatusBadge tone="neutral">Draft</StatusBadge>}
			/>
			<div className="studio-builder-layout">
				<Card className="studio-form-card">
					<div className="studio-form-grid">
						<label className="field-label">
							Lesson title
							<input defaultValue="Two-pointer patterns" />
						</label>
						<label className="field-label">
							Content type
							<select
								value={type}
								onChange={(event) => {
									setType(event.target.value as ContentType);
									setSaved(false);
								}}
							>
								<option>Reading</option>
								<option>Video</option>
								<option>Quiz</option>
								<option>Problem</option>
							</select>
						</label>
						{assessed ? (
							<>
								<label className="field-label">
									Passing score (%)
									<input type="number" min="1" max="100" defaultValue="70" />
								</label>
								<label className="field-label">
									Maximum attempts
									<input type="number" min="1" max="10" defaultValue="2" />
								</label>
							</>
						) : null}
					</div>
					{blocks.map((block, index) => (
						<label className="field-label" key={index}>
							Content block {index + 1}
							<textarea
								rows={5}
								value={block}
								onChange={(event) =>
									setBlocks((items) =>
										items.map((item, itemIndex) =>
											itemIndex === index ? event.target.value : item
										)
									)
								}
							/>
						</label>
					))}
					<button
						className="studio-add-row"
						type="button"
						onClick={() => setBlocks((items) => [...items, ''])}
					>
						+ Add content block
					</button>
					{saved ? (
						<p className="studio-success" role="status">
							Lesson draft saved.
						</p>
					) : null}
					<div className="studio-form-actions">
						<Button variant="secondary" type="button" onClick={() => setSaved(true)}>
							Save draft
						</Button>
						<Button type="button">Publish lesson</Button>
					</div>
				</Card>
				<Card className="studio-module-rail">
					<strong>Lesson module</strong>
					{['Introduction', 'Hash tables', 'Two-pointer patterns', 'Sliding window'].map(
						(lesson, index) => (
							<button
								className={index === 2 ? 'is-current' : ''}
								type="button"
								key={lesson}
							>
								<span>{index + 1}</span>
								{lesson}
							</button>
						)
					)}
				</Card>
			</div>
		</section>
	);
}

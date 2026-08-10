import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button, Card, StatusBadge } from '../../shared/ui';
import { StudioPageHeader } from './StudioShared';

export function CourseBuilderPage() {
	const [title, setTitle] = useState('Data Structures & Algorithms');
	const [saved, setSaved] = useState(false);
	const [sections, setSections] = useState([
		'Foundations',
		'Hash tables',
		'Two-pointer patterns'
	]);
	const valid = Boolean(title.trim());
	return (
		<section className="studio-page">
			<StudioPageHeader
				eyebrow="Course studio"
				title="Course curriculum builder"
				subtitle="Define course information before organizing lesson content."
				action={<StatusBadge tone="neutral">Draft</StatusBadge>}
			/>
			<div className="studio-builder-layout">
				<Card className="studio-form-card">
					<h2>Course information</h2>
					<div className="studio-form-grid">
						<label className="field-label">
							Course title
							<input
								value={title}
								onChange={(event) => {
									setTitle(event.target.value);
									setSaved(false);
								}}
							/>
							{!valid ? (
								<small className="field-error">Course title is required.</small>
							) : null}
						</label>
						<label className="field-label">
							Category
							<select>
								<option>Programming</option>
								<option>Algorithms</option>
								<option>Web development</option>
							</select>
						</label>
						<label className="field-label studio-field-wide">
							Description
							<textarea
								rows={5}
								defaultValue="Build durable data structure and algorithm problem-solving skills."
							/>
						</label>
						<label className="field-label">
							Price (VND)
							<input type="number" min="0" defaultValue="79000" />
						</label>
						<label className="field-label">
							Thumbnail
							<input type="file" />
						</label>
					</div>
					{saved ? (
						<p className="studio-success" role="status">
							Draft saved.
						</p>
					) : null}
					<div className="studio-form-actions">
						<Button
							variant="secondary"
							type="button"
							disabled={!valid}
							onClick={() => setSaved(true)}
						>
							Save draft
						</Button>
						<Link
							className="ui-button ui-button-primary"
							to="/teacher/courses/dsa/review-status"
						>
							Review checklist
						</Link>
					</div>
				</Card>
				<Card className="studio-curriculum-preview">
					<div className="studio-card-heading">
						<div>
							<span className="eyebrow">Curriculum</span>
							<h2>Section preview</h2>
						</div>
						<Link className="text-link" to="/teacher/curriculum/reorder">
							Reorder →
						</Link>
					</div>
					{sections.map((section, index) => (
						<div className="studio-builder-row" key={section}>
							<span>{index + 1}</span>
							<strong>{section}</strong>
							<button
								type="button"
								onClick={() =>
									setSections((items) => items.filter((item) => item !== section))
								}
							>
								Delete
							</button>
						</div>
					))}
					<button
						className="studio-add-row"
						type="button"
						onClick={() =>
							setSections((items) => [...items, `New section ${items.length + 1}`])
						}
					>
						+ Add section
					</button>
				</Card>
			</div>
		</section>
	);
}

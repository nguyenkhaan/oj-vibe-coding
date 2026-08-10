import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button, Card, StatusBadge } from '../../shared/ui';
import { StudioPageHeader } from '../teacher-studio/StudioShared';
import { usePhaseFour } from '../teacher-studio/phaseFourContext';

export function CourseReviewPage() {
	const { courseStatus, decideCourse } = usePhaseFour();
	const [note, setNote] = useState('');
	const pending = courseStatus === 'PENDING_REVIEW';
	return (
		<section className="studio-page">
			<StudioPageHeader
				eyebrow="Course moderation"
				title="Course approval review"
				subtitle="Data Structures & Algorithms by Edythe Andrew"
				action={
					<StatusBadge
						tone={
							courseStatus === 'PUBLISHED'
								? 'success'
								: courseStatus === 'REJECTED'
									? 'error'
									: 'warning'
						}
					>
						{courseStatus.replaceAll('_', ' ')}
					</StatusBadge>
				}
			/>
			<div className="admin-review-layout">
				<Card className="admin-queue">
					<h2>Pending courses</h2>
					<Link className="is-current" to="/admin/course-review/dsa">
						<strong>Data Structures & Algorithms</strong>
						<span>24 lessons</span>
					</Link>
					<Link to="/admin/course-review/react">
						<strong>Production React</strong>
						<span>12 lessons</span>
					</Link>
				</Card>
				<div className="admin-review-main">
					<Card className="studio-summary-card">
						<h2>Course information</h2>
						<dl>
							<div>
								<dt>Teacher</dt>
								<dd>Edythe Andrew</dd>
							</div>
							<div>
								<dt>Price</dt>
								<dd>79,000 VND</dd>
							</div>
							<div>
								<dt>Sections</dt>
								<dd>4</dd>
							</div>
							<div>
								<dt>Lessons</dt>
								<dd>24</dd>
							</div>
						</dl>
					</Card>
					<Card className="admin-curriculum-preview">
						<h2>Curriculum/content preview</h2>
						{[
							'Foundations · Reading',
							'Hash tables · Video',
							'Control flow · Quiz',
							'Problem set · Problem'
						].map((item, index) => (
							<div key={item}>
								<span>{index + 1}</span>
								<strong>{item}</strong>
							</div>
						))}
					</Card>
					<Card className="studio-decision-card">
						<label className="field-label">
							Decision note
							<textarea
								rows={4}
								value={note}
								onChange={(event) => setNote(event.target.value)}
								placeholder="Required for rejection"
							/>
						</label>
						<div className="studio-form-actions">
							<Button
								type="button"
								disabled={!pending}
								onClick={() => decideCourse('PUBLISHED', note)}
							>
								Approve course
							</Button>
							<Button
								variant="secondary"
								type="button"
								disabled={!pending || !note.trim()}
								onClick={() => decideCourse('REJECTED', note)}
							>
								Request changes
							</Button>
							<Button
								variant="danger"
								type="button"
								disabled={!pending || !note.trim()}
								onClick={() => decideCourse('REJECTED', note)}
							>
								Reject
							</Button>
						</div>
					</Card>
				</div>
			</div>
		</section>
	);
}

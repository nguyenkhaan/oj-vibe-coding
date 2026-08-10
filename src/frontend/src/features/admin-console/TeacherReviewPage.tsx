import { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Button, Card, StatusBadge } from '../../shared/ui';
import { StudioPageHeader } from '../teacher-studio/StudioShared';
import { usePhaseFour } from '../teacher-studio/phaseFourContext';
import { teacherRequests, type ModerationStatus } from '../teacher-studio/phase4Data';

export function TeacherReviewPage() {
	const { requestId = teacherRequests[0].id } = useParams();
	const request = teacherRequests.find((item) => item.id === requestId) ?? teacherRequests[0];
	const { teacherDecisions, decideTeacher } = usePhaseFour();
	const [note, setNote] = useState('');
	const [checked, setChecked] = useState(['Email verified', 'Phone verified']);
	const status = teacherDecisions[request.id] ?? 'PENDING';
	const allChecked = checked.length === 5;
	function decide(next: ModerationStatus) {
		if (next !== 'APPROVED' && !note.trim()) return;
		decideTeacher(request.id, next, note);
	}
	return (
		<section className="studio-page">
			<StudioPageHeader
				eyebrow="Identity verification"
				title="Teacher registration review"
				subtitle={`Request ${request.id}`}
				action={
					<StatusBadge
						tone={
							status === 'APPROVED'
								? 'success'
								: status === 'REJECTED'
									? 'error'
									: 'warning'
						}
					>
						{status.replaceAll('_', ' ')}
					</StatusBadge>
				}
			/>
			<div className="admin-review-layout">
				<Card className="admin-queue">
					<h2>Pending requests</h2>
					{teacherRequests.map((item) => (
						<Link
							className={item.id === request.id ? 'is-current' : ''}
							to={`/admin/teacher-registration/${item.id}`}
							key={item.id}
						>
							<strong>{item.name}</strong>
							<span>{teacherDecisions[item.id] ?? 'PENDING'}</span>
						</Link>
					))}
				</Card>
				<div className="admin-review-main">
					<Card className="studio-summary-card">
						<h2>Applicant information</h2>
						<dl>
							<div>
								<dt>Name</dt>
								<dd>{request.name}</dd>
							</div>
							<div>
								<dt>Email</dt>
								<dd>{request.email}</dd>
							</div>
							<div>
								<dt>Expertise</dt>
								<dd>{request.expertise}</dd>
							</div>
						</dl>
						<div className="admin-document-grid">
							<div>ID document front</div>
							<div>ID document back</div>
						</div>
					</Card>
					<Card className="studio-checklist">
						<h2>Verification checklist</h2>
						{[
							'Email verified',
							'Phone verified',
							'ID document reviewed',
							'Background check',
							'Profile complete'
						].map((item) => (
							<label key={item}>
								<input
									type="checkbox"
									checked={checked.includes(item)}
									onChange={() =>
										setChecked((items) =>
											items.includes(item)
												? items.filter((value) => value !== item)
												: [...items, item]
										)
									}
								/>
								{item}
							</label>
						))}
					</Card>
					<Card className="studio-decision-card">
						<label className="field-label">
							Decision note
							<textarea
								rows={3}
								value={note}
								onChange={(event) => setNote(event.target.value)}
								placeholder="Required for rejection or changes"
							/>
						</label>
						<div className="studio-form-actions">
							<Button
								type="button"
								disabled={!allChecked || status !== 'PENDING'}
								onClick={() => decide('APPROVED')}
							>
								Approve request
							</Button>
							<Button
								variant="secondary"
								type="button"
								disabled={status !== 'PENDING'}
								onClick={() => decide('CHANGES_REQUESTED')}
							>
								Request changes
							</Button>
							<Button
								variant="danger"
								type="button"
								disabled={status !== 'PENDING'}
								onClick={() => decide('REJECTED')}
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

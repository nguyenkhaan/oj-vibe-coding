import { Link } from 'react-router-dom';
import { Button, Card, StatusBadge } from '../../shared/ui';
import { StudioPageHeader } from './StudioShared';
import { usePhaseFour } from './phaseFourContext';

export function CourseApprovalPage() {
	const { courseStatus, adminNote, submitCourse, withdrawCourse } = usePhaseFour();
	const pending = courseStatus === 'PENDING_REVIEW';
	return (
		<section className="studio-page">
			<StudioPageHeader
				eyebrow="Course moderation"
				title="Course review status"
				subtitle="Data Structures & Algorithms"
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
			<div className="studio-approval-grid">
				<Card className="studio-timeline">
					<h2>Status timeline</h2>
					{['DRAFT', 'PENDING_REVIEW', 'PUBLISHED'].map((status, index) => (
						<div
							className={
								status === courseStatus
									? 'is-current'
									: index < (courseStatus === 'PUBLISHED' ? 3 : pending ? 1 : 0)
										? 'is-done'
										: ''
							}
							key={status}
						>
							<span>{status === courseStatus ? '●' : '○'}</span>
							<strong>{status.replaceAll('_', ' ')}</strong>
						</div>
					))}
				</Card>
				<Card className="studio-summary-card">
					<h2>Course summary</h2>
					<dl>
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
					<Link className="text-link" to="/teacher/course-builder">
						Open course builder →
					</Link>
				</Card>
				<Card className="studio-checklist">
					<h2>Submission checklist</h2>
					{['Course information', 'Curriculum', 'Lesson content', 'Price'].map((item) => (
						<label key={item}>
							<input type="checkbox" checked readOnly />
							{item}
						</label>
					))}
					<div className="studio-form-actions">
						{pending ? (
							<Button variant="secondary" type="button" onClick={withdrawCourse}>
								Withdraw submission
							</Button>
						) : (
							<Button type="button" onClick={submitCourse}>
								{courseStatus === 'REJECTED'
									? 'Resubmit course'
									: 'Submit for review'}
							</Button>
						)}
					</div>
				</Card>
				<Card className="studio-decision-card">
					<h2>Admin decision</h2>
					<p>Status: {courseStatus.replaceAll('_', ' ')}</p>
					<p>Submitted: 16 Jan 2024</p>
					<p>Note: {adminNote || '--'}</p>
				</Card>
			</div>
		</section>
	);
}

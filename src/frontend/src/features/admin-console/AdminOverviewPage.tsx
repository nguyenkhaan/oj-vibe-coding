import { Link } from 'react-router-dom';
import { Card, StatusBadge } from '../../shared/ui';
import { StudioMetrics, StudioPageHeader } from '../teacher-studio/StudioShared';
import { teacherRequests } from '../teacher-studio/phase4Data';

export function AdminOverviewPage() {
	return (
		<section className="studio-page">
			<StudioPageHeader
				eyebrow="Admin console"
				title="Operations overview"
				subtitle="Review pending Teacher and course moderation work."
			/>
			<StudioMetrics
				items={[
					{ label: 'Teacher requests', value: '02', note: 'Awaiting review' },
					{ label: 'Course reviews', value: '03', note: '1 needs changes' },
					{ label: 'Unread notifications', value: '05' },
					{ label: 'Audit events', value: '128', note: 'This month' }
				]}
			/>
			<div className="studio-dashboard-grid">
				<Card className="studio-list-card">
					<div className="studio-card-heading">
						<div>
							<span className="eyebrow">Identity</span>
							<h2>Pending Teacher requests</h2>
						</div>
						<Link className="text-link" to="/admin/teacher-applications">
							Open queue →
						</Link>
					</div>
					{teacherRequests.map((request) => (
						<Link
							className="studio-review-row"
							to={`/admin/teacher-registration/${request.id}`}
							key={request.id}
						>
							<div className="studio-avatar">
								{request.name.slice(0, 2).toUpperCase()}
							</div>
							<div>
								<strong>{request.name}</strong>
								<span>{request.expertise}</span>
							</div>
							<StatusBadge tone="warning">Pending</StatusBadge>
						</Link>
					))}
				</Card>
				<Card className="studio-list-card">
					<div className="studio-card-heading">
						<div>
							<span className="eyebrow">Courses</span>
							<h2>Pending course reviews</h2>
						</div>
						<Link className="text-link" to="/admin/course-reviews">
							Open queue →
						</Link>
					</div>
					<Link className="studio-review-row" to="/admin/course-review/dsa">
						<div className="studio-course-art">DS</div>
						<div>
							<strong>Data Structures & Algorithms</strong>
							<span>Edythe Andrew · 24 lessons</span>
						</div>
						<StatusBadge tone="warning">Pending</StatusBadge>
					</Link>
				</Card>
			</div>
		</section>
	);
}

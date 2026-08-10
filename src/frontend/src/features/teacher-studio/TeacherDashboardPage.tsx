import { Link } from 'react-router-dom';
import { Card, StatusBadge } from '../../shared/ui';
import { StudioMetrics, StudioPageHeader, ProgressCell } from './StudioShared';
import { teacherStudents } from './phase4Data';

export function TeacherDashboardPage() {
	return (
		<section className="studio-page">
			<StudioPageHeader
				eyebrow="Teacher studio"
				title="Welcome back, Edythe"
				subtitle="Monitor course performance and student activity from one workspace."
				action={
					<Link className="ui-button ui-button-primary" to="/teacher/course-builder">
						Create course
					</Link>
				}
			/>
			<StudioMetrics
				items={[
					{ label: 'Total courses', value: '08', note: '3 active drafts' },
					{ label: 'Total students', value: '120', note: '+14 this month' },
					{ label: 'Average review', value: '4.8', note: 'Across 84 reviews' },
					{ label: 'Revenue', value: '8M VND', note: 'Teacher share' }
				]}
			/>
			<div className="studio-dashboard-grid">
				<Card className="studio-chart">
					<div className="studio-card-heading">
						<div>
							<span className="eyebrow">Revenue overview</span>
							<h2>Last six months</h2>
						</div>
						<StatusBadge tone="success">+18.4%</StatusBadge>
					</div>
					<div className="studio-bars" aria-label="Revenue chart">
						{[34, 52, 48, 70, 64, 88].map((value, index) => (
							<span key={index} style={{ height: `${value}%` }} />
						))}
					</div>
				</Card>
				<Card className="studio-chart">
					<div className="studio-card-heading">
						<div>
							<span className="eyebrow">Course performance</span>
							<h2>Completion rate</h2>
						</div>
					</div>
					<div className="studio-donut">
						<strong>68%</strong>
						<span>Average completion</span>
					</div>
				</Card>
			</div>
			<Card className="studio-table-card">
				<div className="studio-card-heading">
					<div>
						<span className="eyebrow">Students</span>
						<h2>Recent activity</h2>
					</div>
					<Link className="text-link" to="/teacher/students">
						View all →
					</Link>
				</div>
				<div className="studio-table-wrap">
					<table className="studio-table">
						<thead>
							<tr>
								<th>Student</th>
								<th>Course</th>
								<th>Progress</th>
								<th>Last active</th>
							</tr>
						</thead>
						<tbody>
							{teacherStudents.map((student) => (
								<tr key={student.id}>
									<td>{student.name}</td>
									<td>{student.course}</td>
									<td>
										<ProgressCell value={student.progress} />
									</td>
									<td>{student.active}</td>
								</tr>
							))}
						</tbody>
					</table>
				</div>
			</Card>
		</section>
	);
}

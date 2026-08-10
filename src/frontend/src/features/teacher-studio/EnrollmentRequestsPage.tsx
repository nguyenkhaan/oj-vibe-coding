import { useState } from 'react';
import { Button, Card, StatusBadge } from '../../shared/ui';
import { StudioPageHeader } from './StudioShared';
import { usePhaseFour } from './phaseFourContext';

const tone = (status: string) =>
	status === 'APPROVED' ? 'success' : status === 'REJECTED' ? 'error' : 'warning';

export function EnrollmentRequestsPage() {
	const [filter, setFilter] = useState('ALL');
	const { enrollments, decideEnrollment } = usePhaseFour();
	const rows =
		filter === 'ALL' ? enrollments : enrollments.filter((item) => item.status === filter);
	return (
		<section className="studio-page">
			<StudioPageHeader
				eyebrow="Course operations"
				title="Enrollment requests"
				subtitle="Review manual enrollment requests for courses you own."
			/>
			<Card className="studio-table-card">
				<div className="learning-tabs" role="tablist" aria-label="Enrollment status">
					{['ALL', 'PENDING', 'APPROVED', 'REJECTED'].map((item) => (
						<button
							role="tab"
							aria-selected={filter === item}
							type="button"
							key={item}
							onClick={() => setFilter(item)}
						>
							{item}
						</button>
					))}
				</div>
				<div className="studio-table-wrap">
					<table className="studio-table">
						<thead>
							<tr>
								<th>Student</th>
								<th>Course</th>
								<th>Date</th>
								<th>Status</th>
								<th>Action</th>
							</tr>
						</thead>
						<tbody>
							{rows.map((row) => (
								<tr key={row.id}>
									<td>{row.student}</td>
									<td>{row.course}</td>
									<td>{row.date}</td>
									<td>
										<StatusBadge tone={tone(row.status)}>
											{row.status}
										</StatusBadge>
									</td>
									<td>
										{row.status === 'PENDING' ? (
											<div className="studio-row-actions">
												<Button
													type="button"
													onClick={() =>
														decideEnrollment(row.id, 'APPROVED')
													}
												>
													Approve
												</Button>
												<Button
													variant="danger"
													type="button"
													onClick={() =>
														decideEnrollment(row.id, 'REJECTED')
													}
												>
													Reject
												</Button>
											</div>
										) : (
											<span>Decision recorded</span>
										)}
									</td>
								</tr>
							))}
						</tbody>
					</table>
				</div>
			</Card>
		</section>
	);
}

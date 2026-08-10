import { Card, StatusBadge } from '../../shared/ui';
import { StudioPageHeader } from '../teacher-studio/StudioShared';
import { usePhaseFour } from '../teacher-studio/phaseFourContext';

export function AuditLogsPage() {
	const { auditEvents } = usePhaseFour();
	return (
		<section className="studio-page">
			<StudioPageHeader
				eyebrow="Governance"
				title="Audit logs & notifications"
				subtitle="Immutable mock history for Teacher, course and enrollment decisions."
			/>
			<Card className="studio-table-card">
				<div className="studio-toolbar">
					<label className="field-label">
						Event type
						<select>
							<option>All events</option>
							<option>Teacher decisions</option>
							<option>Course decisions</option>
						</select>
					</label>
					<label className="field-label">
						Search
						<input type="search" placeholder="Action or detail" />
					</label>
				</div>
				<div className="studio-table-wrap">
					<table className="studio-table">
						<thead>
							<tr>
								<th>Event</th>
								<th>Detail</th>
								<th>Delivery</th>
							</tr>
						</thead>
						<tbody>
							{auditEvents.map((event) => (
								<tr key={event.id}>
									<td>
										<strong>{event.action}</strong>
									</td>
									<td>{event.detail}</td>
									<td>
										<StatusBadge tone="success">Notified</StatusBadge>
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

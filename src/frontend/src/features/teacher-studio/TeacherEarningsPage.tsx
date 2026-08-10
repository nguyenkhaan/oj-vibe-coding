import { useState } from 'react';
import { Card, StatusBadge } from '../../shared/ui';
import { StudioMetrics, StudioPageHeader } from './StudioShared';
import { earningRows } from './phase4Data';

export function TeacherEarningsPage() {
	const [period, setPeriod] = useState('This month');
	return (
		<section className="studio-page">
			<StudioPageHeader
				eyebrow="Finance"
				title="Earnings"
				subtitle="Track settled revenue and pending teacher payouts."
				action={
					<label className="field-label studio-inline-field">
						Period
						<select value={period} onChange={(event) => setPeriod(event.target.value)}>
							<option>This month</option>
							<option>Last 3 months</option>
							<option>This year</option>
						</select>
					</label>
				}
			/>
			<StudioMetrics
				items={[
					{ label: 'Total revenue', value: '8,000,000 VND' },
					{ label: period, value: '1,240,000 VND' },
					{ label: 'Available payout', value: '2,400,000 VND' }
				]}
			/>
			<Card className="studio-chart">
				<div className="studio-card-heading">
					<div>
						<span className="eyebrow">Revenue overview</span>
						<h2>Teacher share by period</h2>
					</div>
				</div>
				<div className="studio-line-chart" aria-label="Revenue trend">
					<span />
					<span />
					<span />
					<span />
					<span />
				</div>
			</Card>
			<Card className="studio-table-card">
				<div className="studio-table-wrap">
					<table className="studio-table">
						<thead>
							<tr>
								<th>Date</th>
								<th>Course</th>
								<th>Student</th>
								<th>Amount</th>
								<th>Status</th>
							</tr>
						</thead>
						<tbody>
							{earningRows.map((row) => (
								<tr key={`${row.date}-${row.course}`}>
									<td>{row.date}</td>
									<td>{row.course}</td>
									<td>{row.student}</td>
									<td>{row.amount.toLocaleString()} VND</td>
									<td>
										<StatusBadge
											tone={row.status === 'Paid' ? 'success' : 'warning'}
										>
											{row.status}
										</StatusBadge>
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

import { useState } from 'react';
import { Button, Card, StatusBadge } from '../../shared/ui';
import { StudioMetrics, StudioPageHeader } from './StudioShared';

export function TeacherWalletPage() {
	const [amount, setAmount] = useState(1000);
	const [requested, setRequested] = useState(false);
	const valid = amount >= 1000 && amount <= 2400000;
	return (
		<section className="studio-page">
			<StudioPageHeader
				eyebrow="Finance"
				title="Wallet & payout"
				subtitle="Request a payout from your available teacher balance."
			/>
			<StudioMetrics
				items={[
					{ label: 'Available balance', value: '2,400,000 VND' },
					{ label: 'Pending', value: '350,000 VND' },
					{ label: 'Total earned', value: '8,000,000 VND' }
				]}
			/>
			<div className="studio-wallet-grid">
				<Card className="studio-form-card">
					<h2>Request payout</h2>
					<label className="field-label">
						Amount (VND)
						<input
							type="number"
							min="1000"
							max="2400000"
							value={amount}
							onChange={(event) => {
								setAmount(Number(event.target.value));
								setRequested(false);
							}}
						/>
						{!valid ? (
							<small className="field-error">Enter 1,000–2,400,000 VND.</small>
						) : null}
					</label>
					<label className="field-label">
						Bank name
						<input defaultValue="Vietcombank" />
					</label>
					<label className="field-label">
						Account name
						<input defaultValue="EDYTHE ANDREW" />
					</label>
					<label className="field-label">
						Account number
						<input defaultValue="0123456789" />
					</label>
					{requested ? (
						<p className="studio-success" role="status">
							Payout request submitted for Admin approval.
						</p>
					) : null}
					<Button
						type="button"
						disabled={!valid || requested}
						onClick={() => setRequested(true)}
					>
						Request payout
					</Button>
				</Card>
				<Card className="studio-rules-card">
					<h2>Payout rules</h2>
					<p>Minimum request: 1,000 VND</p>
					<p>Teacher share: 80%</p>
					<p>Platform share: 20%</p>
					<StatusBadge tone="warning">Admin approval required</StatusBadge>
				</Card>
			</div>
			<Card className="studio-table-card">
				<h2>Wallet ledger</h2>
				<div className="studio-table-wrap">
					<table className="studio-table">
						<thead>
							<tr>
								<th>Date</th>
								<th>Type</th>
								<th>Amount</th>
								<th>Status</th>
							</tr>
						</thead>
						<tbody>
							<tr>
								<td>16 Jan</td>
								<td>Course revenue</td>
								<td>+79,000 VND</td>
								<td>
									<StatusBadge tone="success">Completed</StatusBadge>
								</td>
							</tr>
							<tr>
								<td>18 Jan</td>
								<td>Payout debit</td>
								<td>-1,000 VND</td>
								<td>
									<StatusBadge tone="warning">Pending</StatusBadge>
								</td>
							</tr>
						</tbody>
					</table>
				</div>
			</Card>
		</section>
	);
}

import { useState, type FormEvent } from 'react';
import { Button, Card, StatusBadge } from '../../shared/ui';
import { useCommerce } from '../commerce/commerceContext';
import { StudioMetrics, StudioPageHeader } from './StudioShared';

const money = (value: number) => `${value.toLocaleString('vi-VN')} VND`;
const tone = (status: string) =>
	status === 'COMPLETED'
		? 'success'
		: ['REJECTED', 'FAILED'].includes(status)
			? 'error'
			: 'warning';

export function TeacherWalletPage() {
	const { availableBalanceVnd, pendingBalanceVnd, ledger, payout, requestPayout } = useCommerce();
	const [amount, setAmount] = useState(1000);
	const [bankName, setBankName] = useState('Vietcombank');
	const [accountName, setAccountName] = useState('EDYTHE ANDREW');
	const valid = amount >= 1000 && amount <= availableBalanceVnd;
	const blocksDuplicate = payout && ['PENDING', 'APPROVED', 'PROCESSING'].includes(payout.status);
	function submit(event: FormEvent) {
		event.preventDefault();
		if (valid && !blocksDuplicate) requestPayout(amount, bankName, accountName);
	}
	return (
		<section className="studio-page">
			<StudioPageHeader
				eyebrow="Finance"
				title="Wallet & payout"
				subtitle="Track your 80% revenue share and request a secure payout."
			/>
			<StudioMetrics
				items={[
					{ label: 'Available balance', value: money(availableBalanceVnd) },
					{ label: 'Reserved / pending', value: money(pendingBalanceVnd) },
					{ label: 'Revenue share', value: '80% Teacher' }
				]}
			/>
			<div className="studio-wallet-grid">
				<Card className="studio-form-card">
					<h2>Request payout</h2>
					<form className="studio-form-stack" onSubmit={submit}>
						<label className="field-label">
							Amount (VND)
							<input
								aria-label="Amount (VND)"
								type="number"
								min="0"
								value={amount}
								onChange={(event) => setAmount(Number(event.target.value))}
							/>
							{!valid ? (
								<small className="field-error">
									Enter 1,000–{availableBalanceVnd.toLocaleString('vi-VN')} VND.
								</small>
							) : null}
						</label>
						<label className="field-label">
							Bank name
							<input
								required
								value={bankName}
								onChange={(event) => setBankName(event.target.value)}
							/>
						</label>
						<label className="field-label">
							Account name
							<input
								required
								value={accountName}
								onChange={(event) => setAccountName(event.target.value)}
							/>
						</label>
						<label className="field-label">
							Account number
							<input required defaultValue="0123456789" />
						</label>
						<Button type="submit" disabled={!valid || Boolean(blocksDuplicate)}>
							Request payout
						</Button>
					</form>
					{blocksDuplicate ? (
						<p className="commerce-notice" role="status">
							A payout is already awaiting settlement.
						</p>
					) : null}
					{payout ? (
						<div className="studio-payout-state">
							<StatusBadge tone={tone(payout.status)}>{payout.status}</StatusBadge>
							<strong>{money(payout.amountVnd)}</strong>
							{payout.note ? <p>Admin note: {payout.note}</p> : null}
						</div>
					) : null}
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
				<h2>Immutable wallet ledger</h2>
				<div className="studio-table-wrap">
					<table className="studio-table">
						<thead>
							<tr>
								<th>Date</th>
								<th>Type</th>
								<th>Detail</th>
								<th>Amount</th>
								<th>Status</th>
							</tr>
						</thead>
						<tbody>
							{ledger.map((entry) => (
								<tr key={entry.id}>
									<td>{entry.date}</td>
									<td>{entry.type}</td>
									<td>{entry.detail}</td>
									<td
										className={
											entry.amountVnd >= 0
												? 'money-positive'
												: 'money-negative'
										}
									>
										{entry.amountVnd >= 0 ? '+' : ''}
										{money(entry.amountVnd)}
									</td>
									<td>
										<StatusBadge tone={tone(entry.status)}>
											{entry.status}
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

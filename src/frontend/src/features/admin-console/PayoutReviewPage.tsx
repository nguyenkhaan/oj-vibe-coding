import { useState } from 'react';
import { Button, Card, StatusBadge } from '../../shared/ui';
import { useCommerce } from '../commerce/commerceContext';

const money = (value: number) => `${value.toLocaleString('vi-VN')} VND`;

export function PayoutReviewPage() {
	const { payout, availableBalanceVnd, pendingBalanceVnd, decidePayout, settlePayout } =
		useCommerce();
	const [note, setNote] = useState('');
	return (
		<section className="admin-page">
			<header className="studio-page-header">
				<div>
					<span className="eyebrow">Finance moderation</span>
					<h1>Payout requests</h1>
					<p>Review bank snapshots and reserve balances before settlement.</p>
				</div>
			</header>
			<div className="studio-metric-grid">
				<Card className="studio-metric-card">
					<span>Available</span>
					<strong>{money(availableBalanceVnd)}</strong>
				</Card>
				<Card className="studio-metric-card">
					<span>Reserved</span>
					<strong>{money(pendingBalanceVnd)}</strong>
				</Card>
			</div>
			{payout ? (
				<Card className="admin-payout-card">
					<div className="admin-payout-heading">
						<div>
							<span>{payout.id}</span>
							<h2>{money(payout.amountVnd)}</h2>
						</div>
						<StatusBadge
							tone={
								payout.status === 'COMPLETED'
									? 'success'
									: ['REJECTED', 'FAILED'].includes(payout.status)
										? 'error'
										: 'warning'
							}
						>
							{payout.status}
						</StatusBadge>
					</div>
					<dl className="admin-payout-details">
						<div>
							<dt>Bank</dt>
							<dd>{payout.bankName}</dd>
						</div>
						<div>
							<dt>Account</dt>
							<dd>{payout.accountName}</dd>
						</div>
						<div>
							<dt>Number</dt>
							<dd>{payout.accountNumberMasked}</dd>
						</div>
					</dl>
					{payout.status === 'PENDING' ? (
						<>
							<label className="field-label">
								Decision note
								<textarea
									value={note}
									onChange={(event) => setNote(event.target.value)}
								/>
							</label>
							<div className="studio-row-actions">
								<Button
									type="button"
									onClick={() => decidePayout('APPROVED', note)}
								>
									Approve & reserve
								</Button>
								<Button
									variant="danger"
									type="button"
									disabled={!note.trim()}
									onClick={() => decidePayout('REJECTED', note)}
								>
									Reject
								</Button>
							</div>
						</>
					) : null}
					{payout.status === 'APPROVED' ? (
						<div className="studio-row-actions">
							<Button type="button" onClick={() => settlePayout('COMPLETED')}>
								Complete settlement
							</Button>
							<Button
								variant="danger"
								type="button"
								onClick={() => settlePayout('FAILED')}
							>
								Simulate failure
							</Button>
						</div>
					) : null}
					{payout.note ? (
						<p className="commerce-notice">Decision note: {payout.note}</p>
					) : null}
				</Card>
			) : (
				<Card className="commerce-empty">
					<h2>No payout requests</h2>
					<p>New Teacher requests will appear here.</p>
				</Card>
			)}
		</section>
	);
}

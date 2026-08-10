import { Link, useParams } from 'react-router-dom';
import { Button, Card, StatusBadge } from '../../shared/ui';
import { useCommerce, type PaymentStatus } from './commerceContext';

const copy: Record<
	PaymentStatus,
	{ title: string; detail: string; tone: 'warning' | 'success' | 'error' }
> = {
	PENDING: {
		title: 'Waiting for payment',
		detail: 'PayOS has not confirmed this transfer yet.',
		tone: 'warning'
	},
	COMPLETED: {
		title: 'Payment completed',
		detail: 'Enrollment was created exactly once. You can start learning now.',
		tone: 'success'
	},
	FAILED: {
		title: 'Payment failed',
		detail: 'No enrollment was created. You can safely retry the payment.',
		tone: 'error'
	},
	EXPIRED: {
		title: 'Payment expired',
		detail: 'The payment link expired and no enrollment was created.',
		tone: 'error'
	}
};

export function PaymentResultPage() {
	const { orderId } = useParams();
	const { order, events, enrolledCourseIds, simulateWebhook } = useCommerce();
	const state = copy[order.status];
	return (
		<section className="commerce-page commerce-result-page">
			<Card className={`commerce-result commerce-result-${order.status.toLowerCase()}`}>
				<div className="commerce-result-icon">
					{order.status === 'COMPLETED' ? '✓' : order.status === 'PENDING' ? '…' : '!'}
				</div>
				<StatusBadge tone={state.tone}>{order.status}</StatusBadge>
				<h1>{state.title}</h1>
				<p>{state.detail}</p>
				<div className="commerce-result-facts">
					<span>
						Order<strong>{orderId}</strong>
					</span>
					<span>
						Transaction<strong>{order.transactionId}</strong>
					</span>
					<span>
						Amount<strong>{order.course.priceVnd.toLocaleString('vi-VN')} VND</strong>
					</span>
				</div>
				{order.status === 'PENDING' ? (
					<div className="commerce-simulator" aria-label="Mock PayOS webhook">
						<strong>Mock webhook</strong>
						<Button type="button" onClick={() => simulateWebhook('COMPLETED')}>
							Complete payment
						</Button>
						<Button
							variant="secondary"
							type="button"
							onClick={() => simulateWebhook('FAILED')}
						>
							Fail payment
						</Button>
						<Button
							variant="ghost"
							type="button"
							onClick={() => simulateWebhook('EXPIRED')}
						>
							Expire payment
						</Button>
					</div>
				) : null}
				{order.status === 'COMPLETED' && enrolledCourseIds.includes(order.course.id) ? (
					<Link
						className="ui-button ui-button-primary"
						to="/learn/python-backend-foundations/reading-http"
					>
						Start learning
					</Link>
				) : null}
			</Card>
			<Card className="commerce-event-log">
				<h2>Payment activity</h2>
				{events.map((event) => (
					<p key={event.id}>
						<span>{event.id}</span>
						{event.message}
						<StatusBadge tone={copy[event.status].tone}>{event.status}</StatusBadge>
					</p>
				))}
			</Card>
		</section>
	);
}

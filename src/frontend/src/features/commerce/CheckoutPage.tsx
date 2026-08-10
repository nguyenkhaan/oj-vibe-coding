import { type FormEvent } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Button, Card, StatusBadge } from '../../shared/ui';
import { useCommerce } from './commerceContext';

export function CheckoutPage() {
	const { order } = useCommerce();
	const { orderId } = useParams();
	const navigate = useNavigate();
	function submit(event: FormEvent) {
		event.preventDefault();
		navigate(`/checkout/${order.id}/result`);
	}
	return (
		<section className="commerce-page">
			<header className="commerce-heading">
				<div>
					<span className="eyebrow">Order {orderId}</span>
					<h1>Secure checkout</h1>
					<p>Your order contains exactly one course and is paid through PayOS.</p>
				</div>
				<StatusBadge tone="success">Encrypted checkout</StatusBadge>
			</header>
			<form className="commerce-checkout-layout" onSubmit={submit}>
				<Card className="commerce-form">
					<h2>Billing information</h2>
					<label className="field-label">
						Full name
						<input required defaultValue="Nguyen Minh Anh" />
					</label>
					<label className="field-label">
						Email
						<input required type="email" defaultValue="student@example.com" />
					</label>
					<label className="field-label">
						Phone
						<input required defaultValue="0901234567" />
					</label>
					<label className="field-label">
						Address
						<input required defaultValue="Ho Chi Minh City" />
					</label>
					<div className="commerce-payment-method">
						<strong>Payment method</strong>
						<span>PayOS bank transfer / VietQR</span>
						<small>Enrollment is created only after a verified webhook.</small>
					</div>
				</Card>
				<Card className="commerce-summary commerce-order-summary">
					<h2>Order summary</h2>
					<div className={`commerce-course-art commerce-course-art-${order.course.tone}`}>
						⌘
					</div>
					<strong>{order.course.title}</strong>
					<span>{order.course.priceVnd.toLocaleString('vi-VN')} VND</span>
					<hr />
					<div className="commerce-total">
						<span>Total</span>
						<strong>{order.course.priceVnd.toLocaleString('vi-VN')} VND</strong>
					</div>
					<Button type="submit">Create PayOS payment</Button>
				</Card>
			</form>
		</section>
	);
}

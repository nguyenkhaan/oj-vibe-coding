import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Card, StatusBadge } from '../../shared/ui';
import { commerceCourses } from './commerceData';
import { useCommerce } from './commerceContext';

const money = (value: number) => `${value.toLocaleString('vi-VN')} VND`;

export function CartPage() {
	const navigate = useNavigate();
	const { cart, enrolledCourseIds, addToCart, removeFromCart, selectOrderCourse } = useCommerce();
	const [notice, setNotice] = useState('');
	const total = cart.reduce((sum, item) => sum + item.priceVnd, 0);
	function add(courseId: string) {
		const result = addToCart(courseId);
		setNotice(
			result === 'ADDED'
				? 'Course added to cart.'
				: result === 'IN_CART'
					? 'Course is already in your cart.'
					: 'You are already enrolled in this course.'
		);
	}
	return (
		<section className="commerce-page">
			<header className="commerce-heading">
				<div>
					<span className="eyebrow">Secure learning purchase</span>
					<h1>Shopping cart</h1>
					<p>Each course is checked out as a separate order in this MVP.</p>
				</div>
				<StatusBadge tone="indigo">{cart.length} courses</StatusBadge>
			</header>
			{notice ? (
				<p className="commerce-notice" role="status">
					{notice}
				</p>
			) : null}
			<div className="commerce-cart-layout">
				<div className="commerce-stack">
					{cart.length ? (
						cart.map((course) => (
							<Card className="commerce-cart-item" key={course.id}>
								<div
									className={`commerce-course-art commerce-course-art-${course.tone}`}
								>
									⌘
								</div>
								<div>
									<h2>{course.title}</h2>
									<p>By {course.instructor}</p>
									<strong>{money(course.priceVnd)}</strong>
								</div>
								<Button
									variant="ghost"
									type="button"
									onClick={() => removeFromCart(course.id)}
								>
									Remove
								</Button>
							</Card>
						))
					) : (
						<Card className="commerce-empty">
							<h2>Your cart is empty</h2>
							<p>Add a course below to continue.</p>
						</Card>
					)}
					<Card className="commerce-discovery">
						<h2>More courses</h2>
						{commerceCourses.map((course) => (
							<div className="commerce-discovery-row" key={course.id}>
								<span>{course.title}</span>
								<Button
									variant="secondary"
									type="button"
									disabled={enrolledCourseIds.includes(course.id)}
									onClick={() => add(course.id)}
								>
									{enrolledCourseIds.includes(course.id)
										? 'Already enrolled'
										: 'Add to cart'}
								</Button>
							</div>
						))}
					</Card>
				</div>
				<Card className="commerce-summary">
					<span>Cart total</span>
					<strong>{money(total)}</strong>
					<p>Choose one course to create a secure PayOS order.</p>
					{cart.map((course) => (
						<Button
							type="button"
							key={course.id}
							onClick={() => {
								selectOrderCourse(course.id);
								navigate('/checkout/ORD-0001');
							}}
						>
							Checkout {course.title}
						</Button>
					))}
				</Card>
			</div>
		</section>
	);
}

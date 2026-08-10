import { useRef, useState, type ReactNode } from 'react';
import { CommerceContext, type PaymentStatus, type Payout } from './commerceContext';
import { commerceCourses, initialLedger, initialOrder } from './commerceData';

export function CommerceProvider({ children }: { children: ReactNode }) {
	const [cart, setCart] = useState([commerceCourses[0]]);
	const [enrolledCourseIds, setEnrolled] = useState(['algorithms']);
	const [order, setOrder] = useState(initialOrder);
	const [events, setEvents] = useState([
		{ id: 1, status: 'PENDING' as PaymentStatus, message: 'Waiting for PayOS confirmation' }
	]);
	const [availableBalanceVnd, setAvailable] = useState(2400000);
	const [pendingBalanceVnd, setPending] = useState(0);
	const [ledger, setLedger] = useState(initialLedger);
	const [payout, setPayout] = useState<Payout | null>(null);
	const fulfilledOrderIds = useRef(new Set<string>());

	function addToCart(courseId: string) {
		if (enrolledCourseIds.includes(courseId)) return 'ENROLLED' as const;
		if (cart.some((item) => item.id === courseId)) return 'IN_CART' as const;
		setCart((items) => [...items, commerceCourses.find((item) => item.id === courseId)!]);
		return 'ADDED' as const;
	}
	function simulateWebhook(status: PaymentStatus) {
		setOrder((current) => ({ ...current, status }));
		setEvents((items) => [
			...items,
			{ id: items.length + 1, status, message: `PayOS webhook: ${status.toLowerCase()}` }
		]);
		if (status === 'COMPLETED' && !fulfilledOrderIds.current.has(order.id)) {
			fulfilledOrderIds.current.add(order.id);
			setEnrolled((items) => [...items, order.course.id]);
			setAvailable((balance) => balance + Math.round(order.course.priceVnd * 0.8));
			setLedger((items) => [
				{
					id: `LED-${items.length + 1}`,
					date: 'Today',
					type: 'COURSE_REVENUE',
					detail: `${order.id} · gross ${order.course.priceVnd.toLocaleString()} VND · Teacher 80%`,
					amountVnd: Math.round(order.course.priceVnd * 0.8),
					status: 'COMPLETED'
				},
				...items
			]);
		}
	}
	function requestPayout(amountVnd: number, bankName: string, accountName: string) {
		if (payout && ['PENDING', 'APPROVED', 'PROCESSING'].includes(payout.status)) return;
		setPayout({
			id: 'PAY-0001',
			amountVnd,
			bankName,
			accountName,
			accountNumberMasked: '******6789',
			status: 'PENDING'
		});
	}
	function decidePayout(decision: 'APPROVED' | 'REJECTED', note?: string) {
		if (!payout || payout.status !== 'PENDING') return;
		setPayout({ ...payout, status: decision, note });
		if (decision === 'APPROVED') {
			setAvailable((value) => value - payout.amountVnd);
			setPending((value) => value + payout.amountVnd);
		}
	}
	function settlePayout(status: 'COMPLETED' | 'FAILED') {
		if (!payout || !['APPROVED', 'PROCESSING'].includes(payout.status)) return;
		setPending((value) => value - payout.amountVnd);
		if (status === 'FAILED') setAvailable((value) => value + payout.amountVnd);
		setPayout({ ...payout, status });
		setLedger((items) => [
			{
				id: `LED-${items.length + 1}`,
				date: 'Today',
				type: status === 'FAILED' ? 'ADJUSTMENT' : 'PAYOUT_DEBIT',
				detail: `${payout.id} · ${status.toLowerCase()}`,
				amountVnd: status === 'FAILED' ? payout.amountVnd : -payout.amountVnd,
				status
			},
			...items
		]);
	}
	return (
		<CommerceContext.Provider
			value={{
				cart,
				enrolledCourseIds,
				order,
				events,
				availableBalanceVnd,
				pendingBalanceVnd,
				ledger,
				payout,
				addToCart,
				removeFromCart: (id) => setCart((items) => items.filter((item) => item.id !== id)),
				selectOrderCourse: (id) =>
					setOrder({
						...initialOrder,
						course: commerceCourses.find((item) => item.id === id)!
					}),
				simulateWebhook,
				requestPayout,
				decidePayout,
				settlePayout
			}}
		>
			{children}
		</CommerceContext.Provider>
	);
}

import { createContext, useContext } from 'react';

export type PaymentStatus = 'PENDING' | 'COMPLETED' | 'FAILED' | 'EXPIRED';
export type CartCourse = {
	id: string;
	title: string;
	instructor: string;
	priceVnd: number;
	tone: string;
};
export type Order = {
	id: string;
	course: CartCourse;
	status: PaymentStatus;
	transactionId: string;
	createdAt: string;
};
export type PaymentEvent = { id: number; status: PaymentStatus; message: string };
export type LedgerEntry = {
	id: string;
	date: string;
	type: 'COURSE_REVENUE' | 'PAYOUT_DEBIT' | 'ADJUSTMENT';
	detail: string;
	amountVnd: number;
	status: string;
};
export type Payout = {
	id: string;
	amountVnd: number;
	bankName: string;
	accountName: string;
	accountNumberMasked: string;
	status: 'PENDING' | 'APPROVED' | 'PROCESSING' | 'COMPLETED' | 'REJECTED' | 'FAILED';
	note?: string;
};
export type CommerceValue = {
	cart: CartCourse[];
	enrolledCourseIds: string[];
	order: Order;
	events: PaymentEvent[];
	availableBalanceVnd: number;
	pendingBalanceVnd: number;
	ledger: LedgerEntry[];
	payout: Payout | null;
	addToCart: (courseId: string) => 'ADDED' | 'IN_CART' | 'ENROLLED';
	removeFromCart: (courseId: string) => void;
	selectOrderCourse: (courseId: string) => void;
	simulateWebhook: (status: PaymentStatus) => void;
	requestPayout: (amountVnd: number, bankName: string, accountName: string) => void;
	decidePayout: (decision: 'APPROVED' | 'REJECTED', note?: string) => void;
	settlePayout: (status: 'COMPLETED' | 'FAILED') => void;
};

export const CommerceContext = createContext<CommerceValue | null>(null);

export function useCommerce() {
	const value = useContext(CommerceContext);
	if (!value) throw new Error('useCommerce must be used within CommerceProvider');
	return value;
}

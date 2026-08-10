import type { ReactNode } from 'react';
import { cn } from '../../lib/cn';

type BadgeVariant = 'indigo' | 'pink' | 'green' | 'yellow' | 'neutral';

type BadgeProps = {
	children: ReactNode;
	variant?: BadgeVariant;
	className?: string;
};

const badgeClasses: Record<BadgeVariant, string> = {
	indigo: 'bg-[rgba(93,75,255,0.12)] text-[#4d00ff]',
	pink: 'bg-[rgba(255,93,122,0.12)] text-[#d00416]',
	green: 'bg-[rgba(31,193,107,0.12)] text-[#1fc16b]',
	yellow: 'bg-[rgba(255,219,67,0.18)] text-[#dfb400]',
	neutral: 'bg-[rgba(22,22,42,0.06)] text-[#5a5f7a]',
};

export function Badge({ children, variant = 'neutral', className }: BadgeProps) {
	return (
		<span className={cn('inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold', badgeClasses[variant], className)}>
			{children}
		</span>
	);
}

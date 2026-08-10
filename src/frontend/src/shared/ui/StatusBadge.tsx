import { cn } from '../lib/cn';

type StatusTone = 'success' | 'warning' | 'error' | 'neutral' | 'indigo';

type StatusBadgeProps = {
	children: string;
	tone?: StatusTone;
};

export function StatusBadge({ children, tone = 'neutral' }: StatusBadgeProps) {
	return <span className={cn('status-badge', `status-badge-${tone}`)}>{children}</span>;
}

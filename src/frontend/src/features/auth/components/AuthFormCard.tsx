import type { ReactNode } from 'react';
import { cn } from '../../../shared/lib/cn';

type AuthFormCardProps = {
	title: string;
	subtitle: string;
	children: ReactNode;
	footer?: ReactNode;
	className?: string;
};

export function AuthFormCard({ title, subtitle, children, footer, className }: AuthFormCardProps) {
	return (
		<div
			className={cn(
				'w-full max-w-[560px] rounded-[28px] border border-[rgba(22,22,42,0.08)] bg-white/95 p-6 shadow-[0_24px_70px_rgba(31,27,77,0.08)] sm:p-8',
				className,
			)}
		>
			<div className="space-y-2">
				<h2 className="text-2xl font-semibold tracking-[-0.04em] text-[var(--text-primary)] sm:text-[2rem]">{title}</h2>
				<p className="text-sm leading-6 text-[var(--text-secondary)] sm:text-[15px]">{subtitle}</p>
			</div>
			<div className="mt-6 space-y-5">{children}</div>
			{footer ? <div className="mt-6">{footer}</div> : null}
		</div>
	);
}

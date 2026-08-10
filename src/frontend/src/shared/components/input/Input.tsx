import type { InputHTMLAttributes, ReactNode } from 'react';
import { cn } from '../../lib/cn';

type InputProps = InputHTMLAttributes<HTMLInputElement> & {
	label?: string;
	hint?: string;
	error?: string;
	leading?: ReactNode;
};

export function Input({ label, hint, error, leading, className, id, ...props }: InputProps) {
	const inputId = id ?? label?.toLowerCase().replace(/\s+/g, '-');

	return (
		<label className="flex flex-col gap-2 text-sm font-medium text-[var(--text-primary)]" htmlFor={inputId}>
			{label ? <span>{label}</span> : null}
			<div
				className={cn(
					'flex items-center gap-3 rounded-2xl border border-[var(--border-subtle)] bg-white px-4 py-3 shadow-[0_1px_0_rgba(22,22,42,0.02)] transition focus-within:border-[rgba(93,75,255,0.45)] focus-within:ring-4 focus-within:ring-[rgba(93,75,255,0.08)]',
					error && 'border-[rgba(251,55,72,0.45)] focus-within:border-[rgba(251,55,72,0.6)] focus-within:ring-[rgba(251,55,72,0.08)]',
				)}
			>
				{leading ? <span className="shrink-0 text-[var(--text-muted)]">{leading}</span> : null}
				<input
					id={inputId}
					className={cn(
						'min-w-0 flex-1 border-0 bg-transparent p-0 text-sm outline-none placeholder:text-[var(--text-muted)]',
						className,
					)}
					{...props}
				/>
			</div>
			{hint ? <span className="text-xs font-normal text-[var(--text-muted)]">{hint}</span> : null}
			{error ? <span className="text-xs font-semibold text-[#d00416]">{error}</span> : null}
		</label>
	);
}

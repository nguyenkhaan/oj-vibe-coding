import type { TextareaHTMLAttributes } from 'react';
import { cn } from '../../lib/cn';

type TextareaProps = TextareaHTMLAttributes<HTMLTextAreaElement> & {
	label?: string;
	hint?: string;
	error?: string;
};

export function Textarea({ label, hint, error, className, id, ...props }: TextareaProps) {
	const textareaId = id ?? label?.toLowerCase().replace(/\s+/g, '-');

	return (
		<label className="flex flex-col gap-2 text-sm font-medium text-[var(--text-primary)]" htmlFor={textareaId}>
			{label ? <span>{label}</span> : null}
			<textarea
				id={textareaId}
				className={cn(
					'min-h-28 rounded-2xl border border-[var(--border-subtle)] bg-white px-4 py-3 text-sm outline-none transition placeholder:text-[var(--text-muted)] focus:border-[rgba(93,75,255,0.45)] focus:ring-4 focus:ring-[rgba(93,75,255,0.08)]',
					error && 'border-[rgba(251,55,72,0.45)] focus:border-[rgba(251,55,72,0.6)] focus:ring-[rgba(251,55,72,0.08)]',
					className,
				)}
				{...props}
			/>
			{hint ? <span className="text-xs font-normal text-[var(--text-muted)]">{hint}</span> : null}
			{error ? <span className="text-xs font-semibold text-[#d00416]">{error}</span> : null}
		</label>
	);
}

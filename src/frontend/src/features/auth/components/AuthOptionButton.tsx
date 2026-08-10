import type { ReactNode } from 'react';

type AuthOptionButtonProps = {
	icon?: ReactNode;
	label: string;
	hint?: string;
};

export function AuthOptionButton({ icon, label, hint }: AuthOptionButtonProps) {
	return (
		<button
			type="button"
			className="flex items-center justify-between rounded-2xl border border-[rgba(22,22,42,0.08)] bg-white px-4 py-3 text-left transition hover:border-[rgba(93,75,255,0.28)] hover:bg-[#faf9ff]"
		>
			<div className="flex items-center gap-3">
				<span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[rgba(93,75,255,0.08)] text-[var(--text-primary)]">
					{icon}
				</span>
				<div>
					<div className="text-sm font-semibold text-[var(--text-primary)]">{label}</div>
					{hint ? <div className="text-xs text-[var(--text-muted)]">{hint}</div> : null}
				</div>
			</div>
			<span className="text-sm text-[var(--text-muted)]">→</span>
		</button>
	);
}

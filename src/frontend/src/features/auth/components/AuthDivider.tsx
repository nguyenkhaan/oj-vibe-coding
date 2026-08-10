export function AuthDivider() {
	return (
		<div className="flex items-center gap-3 text-xs uppercase tracking-[0.18em] text-[var(--text-muted)]">
			<span className="h-px flex-1 bg-[rgba(22,22,42,0.08)]" />
			<span>or continue with</span>
			<span className="h-px flex-1 bg-[rgba(22,22,42,0.08)]" />
		</div>
	);
}

import { AuthShell } from '../../features/auth/components/AuthShell';
import { authDemoItems } from '../../app/config/auth-demo';

export function AuthOverviewPage() {
	return (
		<AuthShell
			eyebrow="Account access"
			title="Sign in or create your SkillBoost account"
			subtitle="Use one of the dedicated auth routes below to access your learner or instructor experience."
			footerNote="Each auth screen now has its own route, which keeps the experience focused and easier to maintain."
		>
			<div className="rounded-[28px] border border-[rgba(22,22,42,0.08)] bg-white/95 p-6 shadow-[0_24px_70px_rgba(31,27,77,0.08)] sm:p-8">
				<p className="text-sm font-semibold uppercase tracking-[0.18em] text-[var(--text-muted)]">Choose a route</p>
				<div className="mt-4 grid gap-3 sm:grid-cols-2">
					{authDemoItems.map((item) => (
						<a
							key={item.key}
							href={item.route}
							className="rounded-2xl border border-[rgba(22,22,42,0.08)] bg-[rgba(93,75,255,0.05)] px-4 py-4 text-sm font-semibold text-[var(--text-primary)] transition hover:border-[rgba(93,75,255,0.26)] hover:bg-[rgba(93,75,255,0.08)]"
						>
							{item.label}
						</a>
					))}
				</div>
			</div>
		</AuthShell>
	);
}

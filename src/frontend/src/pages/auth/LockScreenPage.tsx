import { Badge } from '../../shared/components/badge/Badge';
import { Button } from '../../shared/components/button/Button';
import { AuthFormCard } from '../../features/auth/components/AuthFormCard';
import { AuthShell } from '../../features/auth/components/AuthShell';

export function LockScreenPage() {
	return (
		<AuthShell
			eyebrow="Session locked"
			title="Unlock your session"
			subtitle="Your SkillBoost account is still signed in on this device. Enter your password to continue."
		>
			<AuthFormCard
				title="Lock screen"
				subtitle="Re-authenticate quickly to continue where you left off."
				footer={
					<p className="text-sm text-[var(--text-secondary)]">
						Use a different account? <a className="font-semibold text-[#4d00ff]" href="/auth/login">Sign in again</a>
					</p>
				}
			>
				<div className="flex items-center gap-4 rounded-3xl bg-[rgba(93,75,255,0.06)] p-4">
					<div className="h-14 w-14 rounded-2xl bg-[linear-gradient(135deg,#2f2a87_0%,#ff5d7a_100%)]" />
					<div>
						<p className="text-sm font-semibold text-[var(--text-primary)]">Rosalind Franklin</p>
						<p className="text-xs text-[var(--text-muted)]">rosalind@example.com</p>
					</div>
				</div>
				<label className="flex flex-col gap-2 text-sm font-medium text-[var(--text-primary)]">
					<span>Password</span>
					<input
						type="password"
						placeholder="Enter password to unlock"
						className="rounded-2xl border border-[var(--border-subtle)] bg-white px-4 py-3 text-sm outline-none transition placeholder:text-[var(--text-muted)] focus:border-[rgba(93,75,255,0.45)] focus:ring-4 focus:ring-[rgba(93,75,255,0.08)]"
					/>
				</label>
				<div className="flex items-center justify-between">
					<Badge variant="yellow">Locked</Badge>
					<a className="text-sm font-semibold text-[#4d00ff]" href="/auth/forgot-password">
						Forgot password?
					</a>
				</div>
				<Button className="w-full">Unlock session</Button>
			</AuthFormCard>
		</AuthShell>
	);
}

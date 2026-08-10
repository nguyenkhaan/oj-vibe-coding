import { Button } from '../../shared/components/button/Button';
import { Input } from '../../shared/components/input/Input';
import { AuthFormCard } from '../../features/auth/components/AuthFormCard';
import { AuthShell } from '../../features/auth/components/AuthShell';

export function SetPasswordPage() {
	return (
		<AuthShell
			eyebrow="Secure setup"
			title="Set a new password"
			subtitle="Choose a new password for your SkillBoost account and continue securely."
		>
			<AuthFormCard
				title="Set password"
				subtitle="Create a strong password to secure your account."
			>
				<div className="space-y-4">
					<Input label="New password" type="password" placeholder="Create a strong password" />
					<Input label="Confirm password" type="password" placeholder="Repeat the password" />
				</div>
				<Button className="w-full">Save password</Button>
				<div className="rounded-2xl bg-[rgba(93,75,255,0.06)] px-4 py-3 text-sm text-[var(--text-secondary)]">
					Password rules and strength feedback can appear here without changing the page shell.
				</div>
			</AuthFormCard>
		</AuthShell>
	);
}

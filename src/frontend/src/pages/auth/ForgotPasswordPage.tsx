import { Button } from '../../shared/components/button/Button';
import { Input } from '../../shared/components/input/Input';
import { AuthFormCard } from '../../features/auth/components/AuthFormCard';
import { AuthShell } from '../../features/auth/components/AuthShell';

export function ForgotPasswordPage() {
	return (
		<AuthShell
			eyebrow="Account recovery"
			title="Recover your account"
			subtitle="We will send a reset link to the email address linked to your SkillBoost account."
		>
			<AuthFormCard
				title="Reset password"
				subtitle="Enter your email address and we will send instructions to reset your password."
				footer={
					<p className="text-sm text-[var(--text-secondary)]">
						Remembered it? <a className="font-semibold text-[#4d00ff]" href="/auth/login">Back to login</a>
					</p>
				}
			>
				<Input label="Email address" placeholder="you@example.com" />
				<Button className="w-full">Send reset link</Button>
				<div className="rounded-2xl border border-[rgba(31,193,107,0.18)] bg-[rgba(31,193,107,0.06)] px-4 py-3 text-sm text-[var(--text-secondary)]">
					If the account exists, we will email a secure reset link.
				</div>
			</AuthFormCard>
		</AuthShell>
	);
}

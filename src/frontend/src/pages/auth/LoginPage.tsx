import { Badge } from '../../shared/components/badge/Badge';
import { Button } from '../../shared/components/button/Button';
import { Input } from '../../shared/components/input/Input';
import { AuthDivider } from '../../features/auth/components/AuthDivider';
import { AuthFormCard } from '../../features/auth/components/AuthFormCard';
import { AuthOptionButton } from '../../features/auth/components/AuthOptionButton';
import { AuthShell } from '../../features/auth/components/AuthShell';

export function LoginPage() {
	return (
		<AuthShell
			eyebrow="Welcome back"
			title="Sign in to SkillBoost"
			subtitle="Access your courses, classroom workspace, interview practice, and instructor dashboard from one account."
		>
			<AuthFormCard
				title="Sign in"
				subtitle="Use your email and password to continue."
				footer={
					<p className="text-sm text-[var(--text-secondary)]">
						No account yet? <a className="font-semibold text-[#4d00ff]" href="/auth/register">Create account</a>
					</p>
				}
			>
				<div className="space-y-4">
					<Input label="Email address" placeholder="you@example.com" />
					<Input label="Password" type="password" placeholder="Enter your password" />
				</div>
				<div className="flex items-center justify-between text-sm">
					<label className="flex items-center gap-2 text-[var(--text-secondary)]">
						<input type="checkbox" className="h-4 w-4 rounded border-[rgba(22,22,42,0.18)]" />
						Remember me
					</label>
					<a className="font-semibold text-[#4d00ff]" href="/auth/forgot-password">
						Forgot password?
					</a>
				</div>
				<div className="space-y-3">
					<Button className="w-full">Sign in</Button>
					<AuthDivider />
					<div className="space-y-3">
						<AuthOptionButton label="Continue with Google" hint="Fast access for learners and instructors" />
						<AuthOptionButton label="Continue with GitHub" hint="Useful for coding workspace access" />
					</div>
				</div>
				<div className="flex items-center justify-between rounded-2xl bg-[rgba(93,75,255,0.06)] px-4 py-3 text-sm text-[var(--text-secondary)]">
					<span>Session security</span>
					<Badge variant="green">Protected login</Badge>
				</div>
			</AuthFormCard>
		</AuthShell>
	);
}

import { Button } from '../../shared/components/button/Button';
import { Input } from '../../shared/components/input/Input';
import { AuthDivider } from '../../features/auth/components/AuthDivider';
import { AuthFormCard } from '../../features/auth/components/AuthFormCard';
import { AuthOptionButton } from '../../features/auth/components/AuthOptionButton';
import { AuthShell } from '../../features/auth/components/AuthShell';

export function RegisterPage() {
	return (
		<AuthShell
			eyebrow="Create account"
			title="Create your SkillBoost account"
			subtitle="Start as a learner, then unlock classroom, interview, and instructor tools when you need them."
		>
			<AuthFormCard
				title="Create account"
				subtitle="Set up your access to courses, coding practice, and progress tracking."
				footer={
					<p className="text-sm text-[var(--text-secondary)]">
						Already have an account? <a className="font-semibold text-[#4d00ff]" href="/auth/login">Sign in</a>
					</p>
				}
			>
				<div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
					<Input label="First name" placeholder="Jane" />
					<Input label="Last name" placeholder="Doe" />
				</div>
				<Input label="Email address" placeholder="you@example.com" />
				<div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
					<Input label="Password" type="password" placeholder="Create a password" />
					<Input label="Confirm password" type="password" placeholder="Repeat password" />
				</div>
				<label className="flex items-start gap-3 rounded-2xl bg-[rgba(93,75,255,0.06)] px-4 py-3 text-sm text-[var(--text-secondary)]">
					<input type="checkbox" className="mt-1 h-4 w-4 rounded border-[rgba(22,22,42,0.18)]" />
					<span>
						I agree to the Terms of Service and Privacy Policy and want to receive account updates.
					</span>
				</label>
				<Button className="w-full">Create account</Button>
				<AuthDivider />
				<div className="space-y-3">
					<AuthOptionButton label="Sign up with Google" hint="Fastest path for new users" />
					<AuthOptionButton label="Sign up with GitHub" hint="Handy for coding-related workflows" />
				</div>
			</AuthFormCard>
		</AuthShell>
	);
}

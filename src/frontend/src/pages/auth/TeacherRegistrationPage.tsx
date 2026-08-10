import { Badge } from '../../shared/components/badge/Badge';
import { Button } from '../../shared/components/button/Button';
import { Input } from '../../shared/components/input/Input';
import { Textarea } from '../../shared/components/textarea/Textarea';
import { AuthFileDrop } from '../../features/auth/components/AuthFileDrop';
import { AuthFormCard } from '../../features/auth/components/AuthFormCard';
import { AuthShell } from '../../features/auth/components/AuthShell';

export function TeacherRegistrationPage() {
	return (
		<AuthShell
			eyebrow="Instructor onboarding"
			title="Teacher Registration"
			subtitle="Apply to teach on SkillBoost and complete the verification and payout details in one flow."
		>
			<AuthFormCard
				title="Teacher registration"
				subtitle="Provide your identity details, supporting documents, and payout information."
				footer={
					<div className="flex items-center justify-between rounded-2xl bg-[rgba(93,75,255,0.06)] px-4 py-3 text-sm text-[var(--text-secondary)]">
						<span>Application status</span>
						<Badge variant="yellow">Pending review</Badge>
					</div>
				}
			>
				<div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
					<Input label="Full name" placeholder="As printed on your ID" />
					<Input label="Professional title" placeholder="e.g. Senior Backend Engineer" />
				</div>
				<div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
					<Input label="Email" placeholder="you@example.com" />
					<Input label="Phone" placeholder="+84 ..." />
				</div>
				<Textarea label="Short bio" placeholder="Tell students about your experience and teaching style." />

				<div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
					<Input label="Primary category" placeholder="Backend" />
					<Input label="Years of experience" placeholder="5-8 years" />
				</div>
				<Input label="Portfolio / GitHub / LinkedIn" placeholder="https://" />

				<div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
					<AuthFileDrop label="National ID / Passport - front" subtitle="PNG or JPG, max 5MB" />
					<AuthFileDrop label="National ID / Passport - back" subtitle="PNG or JPG, max 5MB" />
					<AuthFileDrop label="Selfie holding your ID" subtitle="PNG or JPG, max 5MB" />
					<AuthFileDrop label="Teaching certificate (optional)" subtitle="PNG or JPG, max 5MB" />
				</div>

				<div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
					<Input label="Bank" placeholder="e.g. Vietcombank" />
					<Input label="Account number" placeholder="000 000 000" />
				</div>
				<Input label="Account holder name" placeholder="Must match your ID" />

				<label className="flex items-start gap-3 rounded-2xl bg-[rgba(93,75,255,0.06)] px-4 py-3 text-sm text-[var(--text-secondary)]">
					<input type="checkbox" className="mt-1 h-4 w-4 rounded border-[rgba(22,22,42,0.18)]" />
					<span>
						I confirm that the information is accurate and accept the instructor agreement and revenue share terms.
					</span>
				</label>

				<div className="flex flex-wrap gap-3">
					<Button variant="secondary">Back</Button>
					<Button className="flex-1">Submit application</Button>
				</div>
			</AuthFormCard>
		</AuthShell>
	);
}

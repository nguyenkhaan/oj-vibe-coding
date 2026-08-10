import { Button } from '../../shared/components/button/Button';
import { AuthFormCard } from '../../features/auth/components/AuthFormCard';
import { AuthShell } from '../../features/auth/components/AuthShell';

const otpSlots = ['', '', '', '', '', ''];

export function OtpVerificationPage() {
	return (
		<AuthShell
			eyebrow="Verification"
			title="Verify your email"
			subtitle="Enter the 6-digit code sent to your email address to continue."
		>
			<AuthFormCard
				title="Enter code"
				subtitle="We sent a verification code to your email address. Enter it below to complete the step."
				footer={
					<p className="text-sm text-[var(--text-secondary)]">
						Didn't receive it? <a className="font-semibold text-[#4d00ff]" href="/auth/otp">Resend code</a>
					</p>
				}
			>
				<div className="space-y-4">
					<div className="flex items-center justify-between gap-3">
						{otpSlots.map((slot, index) => (
							<div
								key={index}
								className="flex h-14 flex-1 items-center justify-center rounded-2xl border border-[rgba(22,22,42,0.08)] bg-white text-lg font-semibold text-[var(--text-primary)]"
							>
								{slot}
							</div>
						))}
					</div>
					<div className="flex items-center justify-between text-sm">
						<span className="text-[var(--text-secondary)]">Code expires in 09:59</span>
						<span className="font-semibold text-[#4d00ff]">Resend available</span>
					</div>
				</div>
				<Button className="w-full">Verify and continue</Button>
			</AuthFormCard>
		</AuthShell>
	);
}

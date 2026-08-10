import type { ReactNode } from 'react';
import { Badge } from '../../../shared/components/badge/Badge';
import { routePaths } from '../../../app/router/route-paths';

type AuthShellProps = {
	title: string;
	subtitle: string;
	children: ReactNode;
	footerNote?: string;
	eyebrow?: string;
};

export function AuthShell({
	title,
	subtitle,
	children,
	footerNote = 'One SkillBoost account gives you access to courses, classroom, interview practice, and instructor tools.',
	eyebrow = 'Authentication',
}: AuthShellProps) {
	return (
		<div className="min-h-screen bg-white">
			<div className="grid min-h-screen lg:grid-cols-[1.02fr_0.98fr]">
				<aside className="relative flex flex-col justify-between overflow-hidden bg-[linear-gradient(180deg,#fde8ee_0%,#f6f1ff_56%,#edf7ff_100%)] px-6 py-6 sm:px-8 sm:py-8 lg:px-10 lg:py-9">
					<div className="flex items-center justify-between">
						<div className="flex items-center gap-3">
							<div className="h-11 w-11 rounded-2xl bg-[linear-gradient(135deg,#2f2a87_0%,#ff5d7a_100%)] shadow-[0_14px_28px_rgba(47,42,135,0.2)]" />
							<div>
								<div className="text-lg font-bold tracking-[-0.03em]">SkillBoost</div>
								<p className="text-xs text-[var(--text-secondary)]">LMS Coding Platform</p>
							</div>
						</div>
						<Badge variant="indigo">FE-first</Badge>
					</div>

					<div className="mx-auto flex w-full max-w-xl flex-1 flex-col justify-center py-12 text-center">
						<div className="mx-auto mb-10 flex h-64 w-64 items-center justify-center rounded-full bg-white/72 shadow-[0_20px_60px_rgba(34,27,77,0.08)]">
							<div className="relative h-44 w-44 rounded-[40px] border-[10px] border-[rgba(31,23,64,0.8)] bg-white shadow-[0_16px_30px_rgba(31,23,64,0.15)]">
								<div className="absolute left-5 top-5 h-3 w-10 rounded-full bg-[#fb3748]" />
								<div className="absolute left-5 top-12 h-3 w-26 rounded-full bg-[rgba(93,75,255,0.7)]" />
								<div className="absolute left-5 top-20 h-3 w-18 rounded-full bg-[rgba(31,193,107,0.7)]" />
								<div className="absolute bottom-5 left-5 h-8 w-20 rounded-xl bg-[#fb3748]" />
							</div>
						</div>
						<p className="text-sm font-semibold uppercase tracking-[0.18em] text-[var(--text-muted)]">{eyebrow}</p>
						<h1 className="mt-4 text-4xl font-semibold tracking-[-0.05em] text-[var(--text-primary)] sm:text-5xl">
							{title}
						</h1>
						<p className="mx-auto mt-4 max-w-lg text-base leading-7 text-[var(--text-secondary)]">{subtitle}</p>
						<div className="mt-8 flex items-center justify-center gap-2">
							<span className="h-2 w-8 rounded-full bg-[#fb3748]" />
							<span className="h-2 w-2 rounded-full bg-[rgba(22,22,42,0.15)]" />
							<span className="h-2 w-2 rounded-full bg-[rgba(22,22,42,0.15)]" />
						</div>
					</div>

					<p className="max-w-md text-sm leading-6 text-[var(--text-secondary)]">{footerNote}</p>
				</aside>

				<section className="flex min-h-screen flex-col bg-white px-6 py-6 sm:px-8 sm:py-8 lg:px-12 lg:py-10">
					<div className="flex items-center justify-between">
						<div className="flex items-center gap-3">
							<div className="h-10 w-10 rounded-2xl bg-[linear-gradient(135deg,#2f2a87_0%,#ff5d7a_100%)] shadow-[0_12px_22px_rgba(47,42,135,0.2)]" />
							<div>
								<div className="text-sm font-semibold tracking-[-0.02em] text-[var(--text-primary)]">SkillBoost</div>
								<p className="text-xs text-[var(--text-muted)]">Authentication</p>
							</div>
						</div>
						<a
							className="text-sm font-semibold text-[#4d00ff] transition hover:text-[#3c00c6]"
							href={routePaths.home}
						>
							Back to home
						</a>
					</div>

					<div className="flex flex-1 items-center justify-center py-10">{children}</div>
				</section>
			</div>
		</div>
	);
}

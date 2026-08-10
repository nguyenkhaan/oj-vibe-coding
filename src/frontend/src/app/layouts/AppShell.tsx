import type { ReactNode } from 'react';
import { Badge } from '../../shared/components/badge/Badge';
import { Button } from '../../shared/components/button/Button';
import { cn } from '../../shared/lib/cn';
import { sidebarGroups } from '../config/navigation';

type AppShellProps = {
	children: ReactNode;
	activeHref?: string;
	title: string;
	subtitle: string;
};

export function AppShell({ children, activeHref = '/', title, subtitle }: AppShellProps) {
	return (
		<div className="app-frame">
			<header className="app-topbar">
				<div className="app-brand">
					<div className="app-brand-mark" aria-hidden="true" />
					<div>
						<div>SkillBoost</div>
						<p className="app-brand-subtitle">Frontend foundation preview</p>
					</div>
				</div>
				<div className="flex items-center gap-3">
					<Badge variant="green">FE-first</Badge>
					<Button variant="secondary">Preview</Button>
					<Button>Publish UI</Button>
				</div>
			</header>

			<div className="app-shell">
				<aside className="app-sidebar">
					<div className="app-sidebar__section">
						<p className="app-sidebar__label">Navigation</p>
						<nav className="app-nav">
							{sidebarGroups.map((group) => (
								<div key={group.label} className="stack">
									<p className="app-sidebar__label">{group.label}</p>
									<div className="app-nav">
										{group.items.map((item) => (
											<a
												key={item.href}
												href={item.href}
												className={cn('app-nav__item', activeHref === item.href && 'app-nav__item--active')}
											>
												<span>{item.label}</span>
												{item.hint ? <span>{item.hint}</span> : null}
											</a>
										))}
									</div>
								</div>
							))}
						</nav>
					</div>
					<div className="app-sidebar__section">
						<p className="app-sidebar__label">System Notes</p>
						<div className="text-sm leading-6 text-[rgba(248,247,255,0.82)]">
							No God File, no mixed responsibilities. Each feature stays inside its own folder.
						</div>
					</div>
				</aside>

				<main className="app-shell__main">
					<section className="hero-banner">
						<p className="hero-banner__eyebrow">Design tokens · layout primitives · navigation</p>
						<h1 className="hero-banner__title">{title}</h1>
						<p className="hero-banner__description">{subtitle}</p>
					</section>
					{children}
				</main>
			</div>

			<footer className="footer-bar">
				<span>SkillBoost UI foundation</span>
				<span>Shared shell and tokens established for FE-first implementation.</span>
			</footer>
		</div>
	);
}

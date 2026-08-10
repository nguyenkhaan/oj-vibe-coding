import { useState, type ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../../shared/ui';

export type ShellVariant = 'public' | 'auth' | 'student' | 'teacher' | 'admin' | 'coding';

type NavigationItem = {
	label: string;
	to: string;
	icon: string;
};

const navigation: Record<ShellVariant, NavigationItem[]> = {
	public: [
		{ label: 'Explore courses', to: '/courses', icon: '⌕' },
		{ label: 'Instructors', to: '/instructors', icon: '◎' }
	],
	auth: [],
	student: [
		{ label: 'Overview', to: '/student/dashboard', icon: '◈' },
		{ label: 'My courses', to: '/student/courses', icon: '▣' },
		{ label: 'Favorites', to: '/student/favorites', icon: '♡' },
		{ label: 'AI interview', to: '/interview/setup', icon: '✦' }
	],
	teacher: [
		{ label: 'Dashboard', to: '/teacher/dashboard', icon: '◈' },
		{ label: 'My courses', to: '/teacher/courses', icon: '▣' },
		{ label: 'Students', to: '/teacher/students', icon: '◎' },
		{ label: 'Wallet', to: '/teacher/wallet', icon: '$' }
	],
	admin: [
		{ label: 'Overview', to: '/admin', icon: '◈' },
		{ label: 'Teacher reviews', to: '/admin/teacher-applications', icon: '✓' },
		{ label: 'Course reviews', to: '/admin/course-reviews', icon: '▣' },
		{ label: 'Audit logs', to: '/admin/audit-logs', icon: '≡' }
	],
	coding: [
		{ label: 'Problems', to: '/online-judge/problems', icon: '{ }' },
		{ label: 'Submissions', to: '/online-judge/submissions', icon: '↗' },
		{ label: 'AI interview', to: '/interview/setup', icon: '✦' }
	]
};

type AppShellProps = {
	variant: ShellVariant;
	pageTitle: string;
	children: ReactNode;
};

export function AppShell({ variant, pageTitle, children }: AppShellProps) {
	const [isNavigationOpen, setNavigationOpen] = useState(false);
	const items = navigation[variant];
	const isAuthShell = variant === 'auth';

	return (
		<div className="app-shell">
			{!isAuthShell && (
				<aside
					className={`app-sidebar${isNavigationOpen ? 'is-open' : ''}`}
					aria-label="Primary navigation"
				>
					<Link className="brand-mark" to="/">
						<span className="brand-dot" aria-hidden="true">
							S
						</span>
						SkillBoost
					</Link>
					<nav className="sidebar-nav">
						{items.map((item) => (
							<Link
								className="sidebar-link"
								to={item.to}
								key={item.to}
								onClick={() => setNavigationOpen(false)}
							>
								<span className="sidebar-link-icon" aria-hidden="true">
									{item.icon}
								</span>
								{item.label}
							</Link>
						))}
					</nav>
					<div className="sidebar-footer">
						<span className="eyebrow">Keep learning</span>
						<p>Small steps become sharp skills.</p>
					</div>
				</aside>
			)}
			<div className="app-main">
				<header className="app-header">
					<button
						className="mobile-menu-button"
						type="button"
						aria-label="Open navigation"
						aria-expanded={isNavigationOpen}
						onClick={() => setNavigationOpen((open) => !open)}
					>
						☰
					</button>
					<div>
						<span className="eyebrow">
							{variant === 'public' ? 'SkillBoost LMS' : variant}
						</span>
						<strong className="header-title">{pageTitle}</strong>
					</div>
					<div className="shell-actions">
						{variant === 'public' ? <Button variant="secondary">Sign in</Button> : null}
						<div className="shell-user">
							<span>Minh Anh</span>
							<span className="avatar" aria-hidden="true">
								MA
							</span>
						</div>
					</div>
				</header>
				<main className="app-content">{children}</main>
			</div>
		</div>
	);
}

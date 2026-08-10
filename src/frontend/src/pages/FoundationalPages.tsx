import { Button, Card, StatusBadge } from '../shared/ui';

export function HomePage() {
	return (
		<section className="hero-panel">
			<div>
				<span className="eyebrow">Learn with momentum</span>
				<h1 className="page-title">Build skills that stay with you.</h1>
				<p className="page-subtitle">
					A focused learning space for coding courses, real problems and sharper interview
					practice.
				</p>
				<div className="hero-actions">
					<Button>Explore courses</Button>
					<Button variant="secondary">See how it works</Button>
				</div>
			</div>
			<div className="hero-orbit" aria-hidden="true">
				<span>PY</span>
				<strong>+24%</strong>
				<small>weekly progress</small>
			</div>
		</section>
	);
}

export function CatalogPage() {
	return (
		<section>
			<span className="eyebrow">Curated for your next step</span>
			<h1 className="page-title">Find your next course.</h1>
			<p className="page-subtitle">
				Course cards and filters will be implemented from COURSE01 in Phase 2.
			</p>
			<div className="foundation-grid">
				{['Python Backend Foundations', 'Algorithms in Practice', 'AI Interview Lab'].map(
					(course, index) => (
						<Card className="course-preview-card" key={course}>
							<div className={`course-color course-color-${index + 1}`}>
								{index === 0 ? 'PY' : index === 1 ? '{ }' : 'AI'}
							</div>
							<div className="card-row">
								<StatusBadge tone={index === 1 ? 'warning' : 'indigo'}>
									{index === 1 ? 'Popular' : 'Featured'}
								</StatusBadge>
								<span className="muted-text">8 weeks</span>
							</div>
							<h2>{course}</h2>
							<p>Wireframe-backed course card foundation.</p>
						</Card>
					)
				)}
			</div>
		</section>
	);
}

export function DashboardPage({ role }: { role: 'student' | 'teacher' | 'admin' }) {
	const copy = {
		student: [
			'Your learning dashboard',
			'Keep your streak alive with one focused session today.'
		],
		teacher: [
			'Your teaching studio',
			'See what needs your attention across courses and learners.'
		],
		admin: ['Operations overview', 'Review activity across the learning platform.']
	}[role];

	return (
		<section>
			<span className="eyebrow">{role} workspace</span>
			<h1 className="page-title">{copy[0]}</h1>
			<p className="page-subtitle">{copy[1]}</p>
			<div className="metric-grid">
				{[
					['24%', 'Current progress', '↑ 8% this week'],
					['12', 'Active lessons', '3 due today'],
					['4.8', 'Average rating', 'Across your work']
				].map(([value, label, note]) => (
					<Card className="metric-card" key={label}>
						<strong>{value}</strong>
						<span>{label}</span>
						<small>{note}</small>
					</Card>
				))}
			</div>
			<Card className="focus-card">
				<div className="card-row">
					<div>
						<span className="eyebrow">Continue where you left off</span>
						<h2>Python Backend Foundations</h2>
					</div>
					<StatusBadge tone="success">In progress</StatusBadge>
				</div>
				<div className="progress-track">
					<span style={{ width: '42%' }} />
				</div>
				<div className="card-row muted-text">
					<span>Lesson 8 of 19</span>
					<span>42%</span>
				</div>
			</Card>
		</section>
	);
}

export function LoginPage() {
	return (
		<section className="auth-card surface-card">
			<span className="eyebrow">Welcome back</span>
			<h1 className="page-title">Make your next session count.</h1>
			<p className="page-subtitle">
				Auth form foundation follows AUTH01 wireframe in Phase 2.
			</p>
			<Button>Continue with email</Button>
		</section>
	);
}

export function PlaceholderPage({ title, description }: { title: string; description: string }) {
	return (
		<section className="empty-panel surface-card">
			<span className="eyebrow">Phase 1 foundation</span>
			<h1 className="page-title">{title}</h1>
			<p className="page-subtitle">{description}</p>
		</section>
	);
}

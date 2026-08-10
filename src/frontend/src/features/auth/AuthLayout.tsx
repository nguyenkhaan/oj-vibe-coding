import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';

export function AuthLayout({ title, children }: { title: string; children: ReactNode }) {
	return (
		<div className="auth-screen">
			<section className="auth-brand-panel">
				<Link className="brand-mark" to="/">
					<span className="brand-dot" aria-hidden="true">
						S
					</span>
					SkillBoost
				</Link>
				<div className="auth-brand-copy">
					<span className="eyebrow">Coding platform</span>
					<h1>Make the next commit count.</h1>
					<p>
						Learn from structured courses, practice real problems and prepare for
						technical interviews.
					</p>
				</div>
				<div className="auth-code-tile" aria-hidden="true">
					<span>01</span>
					<code>learn.build();</code>
					<strong>+</strong>
				</div>
			</section>
			<section className="auth-form-panel">
				<Link className="back-link" to="/">
					← Back to home
				</Link>
				<div className="auth-form-content">
					<span className="eyebrow">{title}</span>
					{children}
				</div>
			</section>
		</div>
	);
}

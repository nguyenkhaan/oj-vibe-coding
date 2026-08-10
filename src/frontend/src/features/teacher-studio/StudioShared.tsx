import type { ReactNode } from 'react';
import { Card } from '../../shared/ui';

export function StudioPageHeader({
	eyebrow,
	title,
	subtitle,
	action
}: {
	eyebrow: string;
	title: string;
	subtitle: string;
	action?: ReactNode;
}) {
	return (
		<header className="studio-page-header">
			<div>
				<span className="eyebrow">{eyebrow}</span>
				<h1 className="page-title">{title}</h1>
				<p className="page-subtitle">{subtitle}</p>
			</div>
			{action}
		</header>
	);
}

export function StudioMetrics({
	items
}: {
	items: Array<{ label: string; value: string; note?: string }>;
}) {
	return (
		<div className="studio-metric-grid">
			{items.map((item) => (
				<Card className="studio-metric" key={item.label}>
					<span>{item.label}</span>
					<strong>{item.value}</strong>
					{item.note ? <small>{item.note}</small> : null}
				</Card>
			))}
		</div>
	);
}

export function ProgressCell({ value }: { value: number }) {
	return (
		<div className="studio-progress">
			<div>
				<span style={{ width: `${value}%` }} />
			</div>
			<strong>{value}%</strong>
		</div>
	);
}

export function EmptyState({ title, description }: { title: string; description: string }) {
	return (
		<div className="studio-empty">
			<strong>{title}</strong>
			<span>{description}</span>
		</div>
	);
}

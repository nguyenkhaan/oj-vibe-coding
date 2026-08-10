import { Button, Card, StatusBadge } from '../shared/ui';

export function ComponentPreviewPage() {
	return (
		<section>
			<span className="eyebrow">Foundation preview</span>
			<h1 className="page-title">Shared component canvas.</h1>
			<p className="page-subtitle">
				A small, routeable preview keeps primitive UI decisions visible before feature pages
				are implemented.
			</p>
			<div className="preview-grid">
				<Card>
					<span className="eyebrow">Buttons</span>
					<div className="preview-row">
						<Button>Primary</Button>
						<Button variant="secondary">Secondary</Button>
						<Button variant="ghost">Ghost</Button>
						<Button variant="danger">Danger</Button>
					</div>
				</Card>
				<Card>
					<span className="eyebrow">Statuses</span>
					<div className="preview-row">
						<StatusBadge tone="success">Completed</StatusBadge>
						<StatusBadge tone="warning">Pending</StatusBadge>
						<StatusBadge tone="error">Failed</StatusBadge>
						<StatusBadge tone="indigo">In progress</StatusBadge>
					</div>
				</Card>
			</div>
		</section>
	);
}

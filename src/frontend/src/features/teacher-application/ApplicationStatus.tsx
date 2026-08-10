import { Link } from 'react-router-dom';
import { Button, Card, StatusBadge } from '../../shared/ui';

export type ApplicationState = 'DRAFT' | 'PENDING' | 'REJECTED' | 'APPROVED';

export function ApplicationStatus({ state }: { state: ApplicationState }) {
	if (state === 'DRAFT') return null;
	if (state === 'PENDING')
		return (
			<Card className="application-status">
				<StatusBadge tone="warning">Pending review</StatusBadge>
				<h2>Application pending</h2>
				<p>Admin will review your identity and teaching information before approval.</p>
			</Card>
		);
	if (state === 'REJECTED')
		return (
			<Card className="application-status application-rejected">
				<StatusBadge tone="error">Changes requested</StatusBadge>
				<h2>Changes requested</h2>
				<p>Please add a clearer teaching portfolio.</p>
				<Button type="button">Resubmit application</Button>
			</Card>
		);
	return (
		<Card className="application-status application-approved">
			<StatusBadge tone="success">Approved</StatusBadge>
			<h2>You can start teaching.</h2>
			<p>Your TeacherProfile is approved and ready for course creation.</p>
			<Link className="ui-button ui-button-primary" to="/teacher/dashboard">
				Open teacher dashboard
			</Link>
		</Card>
	);
}

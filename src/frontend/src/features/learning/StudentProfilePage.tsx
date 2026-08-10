import { Button, Card, StatusBadge } from '../../shared/ui';
import { Link } from 'react-router-dom';
import { studentProfile } from './learningData';

export function StudentProfilePage() {
	return (
		<section className="profile-page">
			<div className="catalog-heading">
				<div>
					<span className="eyebrow">Student account</span>
					<h1 className="page-title">My Profile</h1>
					<p className="page-subtitle">Your account details and learning identity.</p>
				</div>
				<Button variant="secondary" type="button">
					Edit profile
				</Button>
			</div>
			<Card className="profile-identity-card">
				<div className="avatar profile-avatar">RR</div>
				<div>
					<h2>
						{studentProfile.firstName} {studentProfile.lastName}
					</h2>
					<p>Student</p>
				</div>
				<Link className="ui-button ui-button-secondary" to="/student/teacher-application">
					Become a teacher
				</Link>
			</Card>
			<Card className="profile-details-card">
				<div className="profile-details-heading">
					<h2>Profile details</h2>
					<StatusBadge tone="neutral">Read only</StatusBadge>
				</div>
				<dl className="profile-detail-grid">
					{Object.entries(studentProfile)
						.filter(([key]) => key !== 'bio')
						.map(([key, value]) => (
							<div key={key}>
								<dt>{key.replaceAll(/([A-Z])/g, ' $1')}</dt>
								<dd>{value}</dd>
							</div>
						))}
				</dl>
				<div className="profile-bio">
					<dt>Bio</dt>
					<dd>{studentProfile.bio}</dd>
				</div>
			</Card>
		</section>
	);
}

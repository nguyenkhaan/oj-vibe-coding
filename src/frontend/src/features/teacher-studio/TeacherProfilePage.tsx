import { useState } from 'react';
import { Button, Card, StatusBadge } from '../../shared/ui';
import { StudioPageHeader } from './StudioShared';
import { teacherProfile } from './phase4Data';

export function TeacherProfilePage() {
	const [editing, setEditing] = useState(false);
	const [saved, setSaved] = useState(false);
	return (
		<section className="studio-page">
			<StudioPageHeader
				eyebrow="Teacher account"
				title="My profile"
				subtitle="Keep your public instructor identity and experience up to date."
				action={
					<Button
						variant={editing ? 'primary' : 'secondary'}
						type="button"
						onClick={() => {
							if (editing) setSaved(true);
							setEditing((value) => !value);
						}}
					>
						{editing ? 'Save profile' : 'Edit profile'}
					</Button>
				}
			/>
			<Card className="studio-profile-card">
				<div className="studio-profile-identity">
					<div className="studio-avatar">EA</div>
					<div>
						<h2>{teacherProfile.name}</h2>
						<p>Teacher · Programming & Algorithms</p>
					</div>
					<StatusBadge tone="success">Approved teacher</StatusBadge>
				</div>
				{saved ? (
					<p className="studio-success" role="status">
						Profile changes saved.
					</p>
				) : null}
				<div className="studio-form-grid">
					{Object.entries(teacherProfile)
						.filter(([key]) => key !== 'bio')
						.map(([key, value]) => (
							<label className="field-label" key={key}>
								{key.replaceAll(/([A-Z])/g, ' $1')}
								<input defaultValue={value} disabled={!editing} />
							</label>
						))}
				</div>
				<label className="field-label">
					Bio
					<textarea defaultValue={teacherProfile.bio} disabled={!editing} rows={4} />
				</label>
				<div className="studio-experience">
					<h2>Education & experience</h2>
					<div>
						<strong>MSc Computer Science</strong>
						<span>University of Technology · 2014</span>
					</div>
					<div>
						<strong>Senior Software Instructor</strong>
						<span>8 years teaching practical coding</span>
					</div>
				</div>
			</Card>
		</section>
	);
}

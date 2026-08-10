import { Card, StatusBadge } from '../../shared/ui';
import { ProgressCell, StudioPageHeader } from './StudioShared';
import { submissionRows, teacherStudents } from './phase4Data';

function StudentTable({ compact = false }: { compact?: boolean }) {
	return (
		<Card className="studio-table-card">
			<div className="studio-toolbar">
				<label className="field-label">
					Course
					<select>
						<option>Data Structures & Algorithms</option>
						<option>All courses</option>
					</select>
				</label>
				<label className="field-label">
					Search
					<input type="search" placeholder="Student name" />
				</label>
			</div>
			<div className="studio-table-wrap">
				<table className="studio-table">
					<thead>
						<tr>
							<th>Student</th>
							{!compact ? <th>Email</th> : null}
							<th>Progress</th>
							<th>Score</th>
							<th>Last active</th>
						</tr>
					</thead>
					<tbody>
						{teacherStudents.map((student) => (
							<tr key={student.id}>
								<td>{student.name}</td>
								{!compact ? <td>{student.email}</td> : null}
								<td>
									<ProgressCell value={student.progress} />
								</td>
								<td>{student.score}</td>
								<td>{student.active}</td>
							</tr>
						))}
					</tbody>
				</table>
			</div>
		</Card>
	);
}

export function StudentProgressPage() {
	return (
		<section className="studio-page">
			<StudioPageHeader
				eyebrow="Learning analytics"
				title="Student progress"
				subtitle="Compare completion, scores and last activity for the selected course."
			/>
			<StudentTable compact />
		</section>
	);
}

export function CourseStudentsPage() {
	return (
		<section className="studio-page">
			<StudioPageHeader
				eyebrow="Course operations"
				title="Course students"
				subtitle="View active students enrolled in Data Structures & Algorithms."
			/>
			<StudentTable />
		</section>
	);
}

export function SubmissionReviewPage() {
	return (
		<section className="studio-page">
			<StudioPageHeader
				eyebrow="Assessment"
				title="Submission history"
				subtitle="Review scores and pending programming submissions."
			/>
			<Card className="studio-table-card">
				<div className="studio-toolbar">
					<label className="field-label">
						Course
						<select>
							<option>All courses</option>
						</select>
					</label>
					<label className="field-label">
						Status
						<select>
							<option>All statuses</option>
							<option>Passed</option>
							<option>Review</option>
						</select>
					</label>
				</div>
				<div className="studio-table-wrap">
					<table className="studio-table">
						<thead>
							<tr>
								<th>Student</th>
								<th>Problem</th>
								<th>Submitted</th>
								<th>Score</th>
								<th>Status</th>
								<th>Action</th>
							</tr>
						</thead>
						<tbody>
							{submissionRows.map((row) => (
								<tr key={row.id}>
									<td>{row.student}</td>
									<td>{row.problem}</td>
									<td>{row.date}</td>
									<td>{row.score}</td>
									<td>
										<StatusBadge
											tone={
												row.status === 'Passed'
													? 'success'
													: row.status === 'Pending'
														? 'warning'
														: 'indigo'
											}
										>
											{row.status}
										</StatusBadge>
									</td>
									<td>
										<button
											className="text-link studio-link-button"
											type="button"
										>
											Review
										</button>
									</td>
								</tr>
							))}
						</tbody>
					</table>
				</div>
			</Card>
		</section>
	);
}

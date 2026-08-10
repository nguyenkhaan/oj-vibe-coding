import { useMemo, useState } from 'react';
import { Card, StatusBadge } from '../../shared/ui';
import { ProgressCell, StudioPageHeader, EmptyState } from './StudioShared';
import { teacherStudents } from './phase4Data';

export function TeacherStudentsPage() {
	const [query, setQuery] = useState('');
	const filtered = useMemo(
		() =>
			teacherStudents.filter(
				(student) =>
					student.name.toLowerCase().includes(query.toLowerCase()) ||
					student.course.toLowerCase().includes(query.toLowerCase())
			),
		[query]
	);
	return (
		<section className="studio-page">
			<StudioPageHeader
				eyebrow="Learner management"
				title="Students"
				subtitle="Find enrolled students and review progress across your courses."
			/>
			<Card className="studio-table-card">
				<div className="studio-toolbar">
					<label className="field-label">
						Search student
						<input
							type="search"
							value={query}
							onChange={(event) => setQuery(event.target.value)}
							placeholder="Name or course"
						/>
					</label>
					<label className="field-label">
						Course
						<select>
							<option>All courses</option>
							<option>Data Structures & Algorithms</option>
							<option>Production React & TypeScript</option>
						</select>
					</label>
				</div>
				{filtered.length ? (
					<div className="studio-student-grid">
						{filtered.map((student) => (
							<article className="studio-student-card" key={student.id}>
								<div className="studio-avatar">
									{student.name
										.split(' ')
										.map((part) => part[0])
										.slice(0, 2)
										.join('')}
								</div>
								<div>
									<h2>{student.name}</h2>
									<p>{student.course}</p>
								</div>
								<StatusBadge tone="success">Active</StatusBadge>
								<ProgressCell value={student.progress} />
								<small>Last active {student.active}</small>
							</article>
						))}
					</div>
				) : (
					<EmptyState
						title="No students found"
						description="Try another name or course filter."
					/>
				)}
			</Card>
		</section>
	);
}

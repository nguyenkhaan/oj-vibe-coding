import { useState } from 'react';
import { Button, Card, StatusBadge } from '../../shared/ui';
import { StudioPageHeader } from './StudioShared';
import { usePhaseFour } from './phaseFourContext';

export function CodingProblemsPage() {
	const [selected, setSelected] = useState<string[]>([]);
	const [creating, setCreating] = useState(false);
	const { problems, toggleProblem } = usePhaseFour();
	return (
		<section className="studio-page">
			<StudioPageHeader
				eyebrow="Online judge"
				title="Coding problem management"
				subtitle="Manage language, testcase and publication settings."
				action={
					<Button type="button" onClick={() => setCreating((value) => !value)}>
						Create problem
					</Button>
				}
			/>
			{creating ? (
				<Card className="studio-form-card">
					<h2>New problem</h2>
					<div className="studio-form-grid">
						<label className="field-label">
							Title
							<input placeholder="Problem title" />
						</label>
						<label className="field-label">
							Difficulty
							<select>
								<option>Easy</option>
								<option>Medium</option>
								<option>Hard</option>
							</select>
						</label>
						<label className="field-label">
							Language
							<select>
								<option>Python</option>
								<option>TypeScript</option>
								<option>Java</option>
							</select>
						</label>
						<label className="field-label">
							Passing score
							<input type="number" defaultValue="100" />
						</label>
						<label className="field-label">
							Maximum attempts
							<input type="number" defaultValue="5" />
						</label>
						<label className="field-label">
							Testcase input
							<textarea rows={3} placeholder="Input data" />
						</label>
					</div>
					<Button type="button">Save problem draft</Button>
				</Card>
			) : null}
			<Card className="studio-table-card">
				<div className="studio-table-wrap">
					<table className="studio-table">
						<thead>
							<tr>
								<th>Select</th>
								<th>ID</th>
								<th>Title</th>
								<th>Difficulty</th>
								<th>Language</th>
								<th>Tests</th>
								<th>Status</th>
								<th>Action</th>
							</tr>
						</thead>
						<tbody>
							{problems.map((problem) => (
								<tr key={problem.id}>
									<td>
										<input
											type="checkbox"
											aria-label={`Select ${problem.title}`}
											checked={selected.includes(problem.id)}
											onChange={() =>
												setSelected((items) =>
													items.includes(problem.id)
														? items.filter((id) => id !== problem.id)
														: [...items, problem.id]
												)
											}
										/>
									</td>
									<td>{problem.id}</td>
									<td>{problem.title}</td>
									<td>{problem.difficulty}</td>
									<td>{problem.language}</td>
									<td>{problem.tests}</td>
									<td>
										<StatusBadge
											tone={
												problem.status === 'Active' ? 'success' : 'neutral'
											}
										>
											{problem.status}
										</StatusBadge>
									</td>
									<td>
										<button
											className="text-link studio-link-button"
											type="button"
											onClick={() => toggleProblem(problem.id)}
										>
											{problem.status === 'Active' ? 'Archive' : 'Publish'}
										</button>
									</td>
								</tr>
							))}
						</tbody>
					</table>
				</div>
				<div className="studio-form-actions">
					<Button variant="secondary" type="button" disabled={!selected.length}>
						Bulk publish
					</Button>
					<Button variant="danger" type="button" disabled={!selected.length}>
						Bulk archive
					</Button>
				</div>
			</Card>
		</section>
	);
}

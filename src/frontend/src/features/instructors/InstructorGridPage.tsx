import { useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { instructors } from './data';
import { InstructorCard } from './InstructorCard';

export function InstructorGridPage() {
	const [query, setQuery] = useState('');
	const [view, setView] = useState<'grid' | 'list'>('grid');
	const [followed, setFollowed] = useState<string[]>([]);
	const [searchParams, setSearchParams] = useSearchParams();
	const filtered = useMemo(
		() =>
			instructors.filter((item) =>
				`${item.name} ${item.role}`.toLowerCase().includes(query.toLowerCase())
			),
		[query]
	);
	const currentView = searchParams.get('view') === 'list' ? 'list' : view;
	function changeView(next: 'grid' | 'list') {
		setView(next);
		setSearchParams(next === 'list' ? { view: 'list' } : {});
	}
	return (
		<section className="instructor-page">
			<div className="catalog-heading">
				<div>
					<span className="eyebrow">Instructors</span>
					<h1 className="page-title">Learn from people who build.</h1>
					<p className="page-subtitle">
						Find practical guidance for your next technical step.
					</p>
				</div>
				<div className="view-toggle">
					<button
						type="button"
						className={currentView === 'grid' ? 'is-active' : ''}
						onClick={() => changeView('grid')}
					>
						Grid
					</button>
					<button
						type="button"
						className={currentView === 'list' ? 'is-active' : ''}
						onClick={() => changeView('list')}
					>
						List
					</button>
				</div>
			</div>
			<div className="instructor-toolbar">
				<label className="field-label">
					Search instructors
					<input
						type="search"
						aria-label="Search instructors"
						value={query}
						onChange={(event) => setQuery(event.target.value)}
						placeholder="Name or expertise"
					/>
				</label>
				<label className="field-label">
					Expertise
					<select>
						<option>All expertise</option>
						<option>Algorithms</option>
						<option>Frontend</option>
						<option>Backend</option>
					</select>
				</label>
			</div>
			{filtered.length ? (
				<div className={`instructor-results instructor-results-${currentView}`}>
					{filtered.map((item) => (
						<InstructorCard
							instructor={item}
							followed={followed.includes(item.id)}
							onToggle={() =>
								setFollowed((current) =>
									current.includes(item.id)
										? current.filter((id) => id !== item.id)
										: [...current, item.id]
								)
							}
							key={item.id}
						/>
					))}
				</div>
			) : (
				<div className="catalog-no-results">
					<h2>No instructor matches this search.</h2>
					<p>Try a different name or expertise.</p>
				</div>
			)}
		</section>
	);
}

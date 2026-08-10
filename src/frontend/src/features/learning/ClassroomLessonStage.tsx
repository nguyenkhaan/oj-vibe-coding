import { Card } from '../../shared/ui';
import type { ClassroomLesson } from './classroomData';
import { LessonComments } from './LessonComments';

type LessonStageProps = {
	current: ClassroomLesson;
	watchedPercent: number;
	playing: boolean;
	tab: 'Notes' | 'Resources' | 'Assignment';
	setPlaying: (value: boolean | ((current: boolean) => boolean)) => void;
	setVideoProgress: (lessonId: string, percent: number) => void;
	markComplete: (lessonId: string) => void;
	setTab: (tab: 'Notes' | 'Resources' | 'Assignment') => void;
};

export function ClassroomLessonStage({
	current,
	watchedPercent,
	playing,
	tab,
	setPlaying,
	setVideoProgress,
	markComplete,
	setTab
}: LessonStageProps) {
	return (
		<section className="video-lesson-page">
			<Card className="classroom-video">
				<button
					type="button"
					aria-label={`${playing ? 'Pause' : 'Play'} ${current.title}`}
					onClick={() => setPlaying((value) => !value)}
				>
					{playing ? 'Ⅱ' : '▶'}
				</button>
				<span>{playing ? 'PLAYING' : current.type.toUpperCase()} PLAYER</span>
			</Card>
			<div className="classroom-video-meta">
				<div>
					<h2>{current.title}</h2>
					<p>{current.duration} · Instructor: Ronald Richard</p>
					<small className="video-progress-note">Watched {watchedPercent}%</small>
					<label className="video-progress-control">
						<span>Resume position</span>
						<input
							type="range"
							min="0"
							max="100"
							value={watchedPercent}
							aria-label="Video progress"
							onChange={(event) => {
								const value = Number(event.target.value);
								setVideoProgress(current.id, value);
								if (value === 100) markComplete(current.id);
							}}
						/>
					</label>
				</div>
			</div>
			<div className="classroom-tabs" role="tablist" aria-label="Lesson details">
				{(['Notes', 'Resources', 'Assignment'] as const).map((item) => (
					<button
						role="tab"
						aria-selected={tab === item}
						className={tab === item ? 'is-active' : ''}
						type="button"
						key={item}
						onClick={() => setTab(item)}
					>
						{item}
					</button>
				))}
			</div>
			<Card className="classroom-note">
				<h2>{current.title}</h2>
				{tab === 'Notes' ? (
					<p>{current.note}</p>
				) : tab === 'Resources' ? (
					<p>Downloadable examples and lesson references.</p>
				) : (
					<p>Complete the practice task to reinforce this lesson.</p>
				)}
			</Card>
			<LessonComments />
		</section>
	);
}

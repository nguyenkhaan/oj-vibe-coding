import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Button } from '../../shared/ui';
import { ClassroomChat } from './ClassroomChat';
import { classroomLessons } from './classroomData';
import { ClassroomLessonRail } from './ClassroomLessonRail';
import { ClassroomLessonStage } from './ClassroomLessonStage';
import { useLearningProgress } from './LearningProgressProvider';

export function ClassroomRoutePage() {
	const { lessonContentId } = useParams();
	return <ClassroomPage initialLessonId={lessonContentId} />;
}

export function ClassroomPage({
	initialLessonId = 'two-pointer-patterns'
}: {
	initialLessonId?: string;
}) {
	const [currentId, setCurrentId] = useState(initialLessonId);
	const [tab, setTab] = useState<'Notes' | 'Resources' | 'Assignment'>('Notes');
	const [playing, setPlaying] = useState(false);
	const { markComplete, isComplete, progressPercent, videoProgress, setVideoProgress } =
		useLearningProgress();
	const navigate = useNavigate();
	const currentIndex = Math.max(
		0,
		classroomLessons.findIndex((lesson) => lesson.id === currentId)
	);
	const current = classroomLessons[currentIndex] ?? classroomLessons[0];
	const completed = isComplete(current.id);
	const watchedPercent = videoProgress[current.id] ?? 0;
	const progress = progressPercent(classroomLessons.length);
	useEffect(() => {
		setPlaying(false);
		setTab('Notes');
	}, [current.id]);
	useEffect(() => {
		if (!playing || watchedPercent >= 100) return;
		const timer = window.setInterval(() => {
			setVideoProgress(current.id, (videoProgress[current.id] ?? 0) + 5);
		}, 500);
		return () => window.clearInterval(timer);
	}, [current.id, playing, setVideoProgress, videoProgress, watchedPercent]);
	function selectLesson(id: string) {
		const lesson = classroomLessons.find((item) => item.id === id);
		if (lesson?.prerequisiteId && !isComplete(lesson.prerequisiteId)) return;
		setCurrentId(id);
		if (lesson?.type === 'Reading') navigate(`/reading/${id}`);
		if (lesson?.type === 'Quiz') navigate(`/quiz/control-flow/preview`);
		if (lesson?.type === 'Problem') navigate(`/programming/two-pointers/reading`);
	}
	return (
		<section className="classroom-page">
			<div className="classroom-heading">
				<div>
					<span className="eyebrow">Workspace</span>
					<h1 className="page-title">Data Structures &amp; Algorithms</h1>
					<p className="page-subtitle">
						Module 2 · Lesson {currentIndex + 1} · {current.title}
					</p>
				</div>
				<Button
					type="button"
					variant={completed ? 'secondary' : 'primary'}
					onClick={() => markComplete(current.id)}
				>
					{completed ? (
						<span aria-label="Lesson completed">Completed</span>
					) : (
						'Mark lesson complete'
					)}
				</Button>
			</div>
			<div className="classroom-search">
				<label className="field-label">
					Search in lesson
					<input type="search" placeholder="Search notes, resources or lessons" />
				</label>
			</div>
			<div className="classroom-layout">
				<ClassroomLessonStage
					current={current}
					currentIndex={currentIndex}
					lessonCount={classroomLessons.length}
					watchedPercent={watchedPercent}
					playing={playing}
					tab={tab}
					setPlaying={setPlaying}
					setVideoProgress={setVideoProgress}
					markComplete={markComplete}
					setTab={setTab}
					selectLesson={(id) => {
						if (id.startsWith('previous-'))
							selectLesson(classroomLessons[currentIndex - 1].id);
						else if (id.startsWith('next-'))
							selectLesson(classroomLessons[currentIndex + 1].id);
					}}
				/>
				<aside className="classroom-sidebar">
					<ClassroomLessonRail
						lessons={classroomLessons}
						currentId={current.id}
						progress={progress}
						isComplete={isComplete}
						onSelect={selectLesson}
					/>
					<ClassroomChat />
				</aside>
			</div>
		</section>
	);
}

import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Button } from '../../shared/ui';
import { classroomLessons } from './classroomData';
import { ClassroomChat } from './ClassroomChat';
import { ClassroomLessonStage } from './ClassroomLessonStage';
import { LearningContentLayout } from './LearningContentLayout';
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
	const [tab, setTab] = useState<'Notes' | 'Resources' | 'Assignment'>('Notes');
	const [playing, setPlaying] = useState(false);
	const { markComplete, isComplete, videoProgress, setVideoProgress } = useLearningProgress();
	const current =
		classroomLessons.find((lesson) => lesson.id === initialLessonId) ?? classroomLessons[0];
	const completed = isComplete(current.id);
	const watchedPercent = videoProgress[current.id] ?? 0;

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

	const completionAction = (
		<Button
			type="button"
			variant={completed ? 'secondary' : 'primary'}
			onClick={() => {
				setVideoProgress(current.id, 100);
				markComplete(current.id);
				setPlaying(false);
			}}
		>
			{completed ? 'Video completed' : 'Mark video watched'}
		</Button>
	);

	return (
		<LearningContentLayout currentLessonId={current.id} action={completionAction}>
			<ClassroomLessonStage
				current={current}
				watchedPercent={watchedPercent}
				playing={playing}
				tab={tab}
				setPlaying={setPlaying}
				setVideoProgress={setVideoProgress}
				markComplete={markComplete}
				setTab={setTab}
			/>
			<div className="learning-support-panel">
				<ClassroomChat />
			</div>
		</LearningContentLayout>
	);
}

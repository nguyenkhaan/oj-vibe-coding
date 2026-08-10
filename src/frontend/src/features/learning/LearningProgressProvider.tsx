import { createContext, useContext, useMemo, useState, type ReactNode } from 'react';

type ProgressContextValue = {
	completed: string[];
	videoProgress: Record<string, number>;
	markComplete: (lessonId: string) => void;
	setVideoProgress: (lessonId: string, percent: number) => void;
	isComplete: (lessonId: string) => boolean;
	progressPercent: (totalLessons: number) => number;
};

const ProgressContext = createContext<ProgressContextValue | null>(null);

export function LearningProgressProvider({ children }: { children: ReactNode }) {
	const [completed, setCompleted] = useState(['hash-tables', 'collision-strategies']);
	const [videoProgress, setVideoProgressState] = useState<Record<string, number>>({
		'two-pointer-patterns': 40
	});
	const value = useMemo<ProgressContextValue>(
		() => ({
			completed,
			videoProgress,
			markComplete: (lessonId) =>
				setCompleted((current) =>
					current.includes(lessonId) ? current : [...current, lessonId]
				),
			setVideoProgress: (lessonId, percent) =>
				setVideoProgressState((current) => ({
					...current,
					[lessonId]: Math.min(100, Math.max(0, percent))
				})),
			isComplete: (lessonId) => completed.includes(lessonId),
			progressPercent: (totalLessons) =>
				totalLessons ? Math.round((completed.length / totalLessons) * 100) : 0
		}),
		[completed, videoProgress]
	);
	return <ProgressContext.Provider value={value}>{children}</ProgressContext.Provider>;
}

export function useLearningProgress() {
	const value = useContext(ProgressContext);
	if (!value) throw new Error('useLearningProgress must be used within LearningProgressProvider');
	return value;
}

export type ClassroomLesson = {
	id: string;
	title: string;
	duration: string;
	type: 'Video' | 'Reading' | 'Quiz' | 'Problem';
	note: string;
	prerequisiteId?: string;
};

export const classroomLessons: ClassroomLesson[] = [
	{
		id: 'hash-tables',
		title: 'Hash tables from scratch',
		duration: '18:20',
		type: 'Video',
		note: 'Hash tables use a key to place and retrieve values in near constant time.'
	},
	{
		id: 'collision-strategies',
		title: 'Collision strategies',
		duration: '14:10',
		type: 'Reading',
		note: 'When two keys share a bucket, choose a collision strategy that preserves lookup performance.'
	},
	{
		id: 'two-pointer-patterns',
		title: 'Two-pointer patterns',
		duration: '12:35',
		type: 'Video',
		note: 'Use two indexes to scan the ordered collection from both sides. Move the pointer whose value cannot be part of the current answer, then repeat until the pointers meet.'
	},
	{
		id: 'sliding-window-lab',
		title: 'Sliding window lab',
		duration: '22:00',
		type: 'Quiz',
		note: 'Apply a moving window to keep the active range small while scanning a sequence.',
		prerequisiteId: 'two-pointer-patterns'
	},
	{
		id: 'judge-problem-set-b',
		title: 'Judge problem set B',
		duration: '30:00',
		type: 'Problem',
		note: 'Solve the problem set and submit your solution to the judge.',
		prerequisiteId: 'sliding-window-lab'
	}
];

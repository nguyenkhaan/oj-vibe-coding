export type CourseLevel = 'Beginner' | 'Intermediate' | 'Advanced';

export type Course = {
	id: string;
	slug: string;
	title: string;
	shortTitle: string;
	description: string;
	instructor: string;
	instructorRole: string;
	code: string;
	category: string;
	level: CourseLevel;
	priceVnd: number;
	rating: number;
	reviews: number;
	lessons: number;
	duration: string;
	accent: 'indigo' | 'coral' | 'teal';
	modules: CourseModule[];
};

export type CourseModule = {
	title: string;
	lessons: { title: string; duration: string; free?: boolean }[];
};

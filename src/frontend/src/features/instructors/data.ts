export const instructors = [
	{
		id: 'edythe-andrew',
		name: 'Edythe Andrew',
		role: 'Coding Instructor',
		rating: 4.9,
		courses: 24,
		code: 'EA',
		accent: 'indigo'
	},
	{
		id: 'ronald-richard',
		name: 'Ronald Richard',
		role: 'Algorithms Expert',
		rating: 4.8,
		courses: 18,
		code: 'RR',
		accent: 'coral'
	},
	{
		id: 'jenny-wilson',
		name: 'Jenny Wilson',
		role: 'React Instructor',
		rating: 4.7,
		courses: 14,
		code: 'JW',
		accent: 'teal'
	},
	{
		id: 'patricia-brown',
		name: 'Patricia Brown',
		role: 'Python Instructor',
		rating: 4.6,
		courses: 12,
		code: 'PB',
		accent: 'indigo'
	}
];

export type Instructor = (typeof instructors)[number];

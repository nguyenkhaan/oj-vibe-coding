export type Role = 'STUDENT' | 'TEACHER' | 'ADMIN';

export type UserSession = {
	id: string;
	fullName: string;
	email: string;
	roles: Role[];
};

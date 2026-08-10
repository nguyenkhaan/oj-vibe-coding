import { createContext, useContext } from 'react';
import {
	initialEnrollments,
	initialProblems,
	type CourseReviewStatus,
	type ModerationStatus
} from './phase4Data';

export type AuditEvent = { id: number; action: string; detail: string };

export type PhaseFourValue = {
	courseStatus: CourseReviewStatus;
	adminNote: string;
	enrollments: typeof initialEnrollments;
	problems: typeof initialProblems;
	teacherDecisions: Record<string, ModerationStatus>;
	auditEvents: AuditEvent[];
	submitCourse: () => void;
	withdrawCourse: () => void;
	decideCourse: (status: CourseReviewStatus, note: string) => void;
	decideTeacher: (id: string, status: ModerationStatus, note: string) => void;
	decideEnrollment: (id: string, status: ModerationStatus) => void;
	toggleProblem: (id: string) => void;
};

export const PhaseFourContext = createContext<PhaseFourValue | null>(null);

export function usePhaseFour() {
	const value = useContext(PhaseFourContext);
	if (!value) throw new Error('usePhaseFour must be used within PhaseFourProvider');
	return value;
}

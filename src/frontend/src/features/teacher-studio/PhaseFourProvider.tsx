import { useMemo, useState, type ReactNode } from 'react';
import {
	initialEnrollments,
	initialProblems,
	type CourseReviewStatus,
	type ModerationStatus
} from './phase4Data';
import { PhaseFourContext, type AuditEvent, type PhaseFourValue } from './phaseFourContext';

export function PhaseFourProvider({ children }: { children: ReactNode }) {
	const [courseStatus, setCourseStatus] = useState<CourseReviewStatus>('PENDING_REVIEW');
	const [adminNote, setAdminNote] = useState('');
	const [enrollments, setEnrollments] = useState(initialEnrollments);
	const [problems, setProblems] = useState(initialProblems);
	const [teacherDecisions, setTeacherDecisions] = useState<Record<string, ModerationStatus>>({});
	const [auditEvents, setAuditEvents] = useState<AuditEvent[]>([
		{
			id: 1,
			action: 'COURSE_SUBMITTED',
			detail: 'Data Structures & Algorithms submitted for review'
		}
	]);
	function audit(action: string, detail: string) {
		setAuditEvents((events) => [{ id: Date.now(), action, detail }, ...events]);
	}
	const value = useMemo<PhaseFourValue>(
		() => ({
			courseStatus,
			adminNote,
			enrollments,
			problems,
			teacherDecisions,
			auditEvents,
			submitCourse: () => {
				setCourseStatus('PENDING_REVIEW');
				audit('COURSE_SUBMITTED', 'Teacher submitted course for review');
			},
			withdrawCourse: () => {
				setCourseStatus('DRAFT');
				audit('COURSE_WITHDRAWN', 'Teacher withdrew pending review');
			},
			decideCourse: (status, note) => {
				setCourseStatus(status);
				setAdminNote(note);
				audit(`COURSE_${status}`, note || 'Course moderation decision');
			},
			decideTeacher: (id, status, note) => {
				setTeacherDecisions((items) => ({ ...items, [id]: status }));
				audit(`TEACHER_${status}`, `${id}: ${note || 'Decision recorded'}`);
			},
			decideEnrollment: (id, status) => {
				setEnrollments((items) =>
					items.map((item) => (item.id === id ? { ...item, status } : item))
				);
				audit(`ENROLLMENT_${status}`, id);
			},
			toggleProblem: (id) => {
				setProblems((items) =>
					items.map((item) =>
						item.id === id
							? { ...item, status: item.status === 'Active' ? 'Draft' : 'Active' }
							: item
					)
				);
				audit('PROBLEM_STATUS_CHANGED', id);
			}
		}),
		[adminNote, auditEvents, courseStatus, enrollments, problems, teacherDecisions]
	);
	return <PhaseFourContext.Provider value={value}>{children}</PhaseFourContext.Provider>;
}

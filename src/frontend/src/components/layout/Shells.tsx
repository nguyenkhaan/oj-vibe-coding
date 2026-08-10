import type { ReactNode } from 'react';
import { AppShell, type ShellVariant } from './AppShell';

type ShellProps = {
	children: ReactNode;
	pageTitle: string;
};

function RoleShell({ children, pageTitle, variant }: ShellProps & { variant: ShellVariant }) {
	return (
		<AppShell pageTitle={pageTitle} variant={variant}>
			{children}
		</AppShell>
	);
}

export function PublicShell(props: ShellProps) {
	return <RoleShell {...props} variant="public" />;
}

export function AuthShell(props: ShellProps) {
	return <RoleShell {...props} variant="auth" />;
}

export function StudentShell(props: ShellProps) {
	return <RoleShell {...props} variant="student" />;
}

export function TeacherShell(props: ShellProps) {
	return <RoleShell {...props} variant="teacher" />;
}

export function AdminShell(props: ShellProps) {
	return <RoleShell {...props} variant="admin" />;
}

export function CodingShell(props: ShellProps) {
	return <RoleShell {...props} variant="coding" />;
}

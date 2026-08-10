import { Route } from 'react-router-dom';
import { AuthShell } from '../../components/layout/Shells';
import { LoginPage } from '../../features/auth/LoginPage';
import {
	ForgotPasswordPage,
	RegisterPage,
	SetPasswordPage
} from '../../features/auth/PasswordPages';
import {
	LockScreenPage,
	OtpPage,
	TeacherRegistrationPage
} from '../../features/auth/VerificationPages';

export const authRouteElements = [
	<Route
		key="login"
		path="/auth/login"
		element={
			<AuthShell pageTitle="Sign in">
				<LoginPage />
			</AuthShell>
		}
	/>,
	<Route
		key="register"
		path="/auth/register"
		element={
			<AuthShell pageTitle="Create account">
				<RegisterPage />
			</AuthShell>
		}
	/>,
	<Route
		key="forgot-password"
		path="/auth/forgot-password"
		element={
			<AuthShell pageTitle="Forgot password">
				<ForgotPasswordPage />
			</AuthShell>
		}
	/>,
	<Route
		key="set-password"
		path="/auth/set-password"
		element={
			<AuthShell pageTitle="Set password">
				<SetPasswordPage />
			</AuthShell>
		}
	/>,
	<Route
		key="verify-otp"
		path="/auth/verify-otp"
		element={
			<AuthShell pageTitle="Verify email">
				<OtpPage />
			</AuthShell>
		}
	/>,
	<Route
		key="lock-screen"
		path="/auth/locked"
		element={
			<AuthShell pageTitle="Screen locked">
				<LockScreenPage />
			</AuthShell>
		}
	/>,
	<Route
		key="teacher-registration"
		path="/auth/teacher-registration"
		element={
			<AuthShell pageTitle="Become a teacher">
				<TeacherRegistrationPage />
			</AuthShell>
		}
	/>
];

import { useEffect, useMemo, useState } from 'react';
import { routePaths } from './route-paths';
import { ForgotPasswordPage } from '../../pages/auth/ForgotPasswordPage';
import { LoginPage } from '../../pages/auth/LoginPage';
import { LockScreenPage } from '../../pages/auth/LockScreenPage';
import { OtpVerificationPage } from '../../pages/auth/OtpVerificationPage';
import { RegisterPage } from '../../pages/auth/RegisterPage';
import { SetPasswordPage } from '../../pages/auth/SetPasswordPage';
import { TeacherRegistrationPage } from '../../pages/auth/TeacherRegistrationPage';

function getPathname() {
	return window.location.pathname || routePaths.home;
}

export function AppRouter() {
	const [pathname, setPathname] = useState(getPathname);

	useEffect(() => {
		const handlePopState = () => setPathname(getPathname());

		window.addEventListener('popstate', handlePopState);
		return () => window.removeEventListener('popstate', handlePopState);
	}, []);

	return useMemo(() => {
		switch (pathname) {
			case routePaths.home:
			case routePaths.authOverview:
				return <LoginPage />;
			case routePaths.login:
				return <LoginPage />;
			case routePaths.register:
				return <RegisterPage />;
			case routePaths.forgotPassword:
				return <ForgotPasswordPage />;
			case routePaths.setPassword:
				return <SetPasswordPage />;
			case routePaths.otp:
				return <OtpVerificationPage />;
			case routePaths.lock:
				return <LockScreenPage />;
			case routePaths.teacherRegistration:
				return <TeacherRegistrationPage />;
			default:
				return <LoginPage />;
		}
	}, [pathname]);
}

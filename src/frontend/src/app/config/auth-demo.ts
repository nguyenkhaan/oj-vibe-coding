export type AuthDemoItem = {
	key: string;
	label: string;
	route: string;
};

export const authDemoItems: AuthDemoItem[] = [
	{ key: 'login', label: 'Login', route: '/auth/login' },
	{ key: 'register', label: 'Register', route: '/auth/register' },
	{ key: 'forgot', label: 'Forgot Password', route: '/auth/forgot-password' },
	{ key: 'set-password', label: 'Set Password', route: '/auth/set-password' },
	{ key: 'otp', label: 'OTP Verification', route: '/auth/otp' },
	{ key: 'teacher-registration', label: 'Teacher Registration', route: '/auth/teacher-registration' },
];

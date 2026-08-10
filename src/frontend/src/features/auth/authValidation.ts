export function isValidEmail(value: string) {
	return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

export function validateCredentials(email: string, password: string) {
	return isValidEmail(email) && password.length >= 8;
}

export function validatePassword(password: string, confirmation: string) {
	return (
		password.length >= 8 &&
		/[A-Z]/.test(password) &&
		/[a-z]/.test(password) &&
		/\d/.test(password) &&
		password === confirmation
	);
}

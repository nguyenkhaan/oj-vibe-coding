import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../app/auth/useAuth';
import { Button } from '../../shared/ui';
import { AuthLayout } from './AuthLayout';
import { validateCredentials } from './authValidation';

export function LoginPage() {
	const navigate = useNavigate();
	const location = useLocation();
	const { signIn } = useAuth();
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [role, setRole] = useState('STUDENT');
	const [error, setError] = useState('');
	const from = (location.state as { from?: string } | null)?.from;

	function submit(event: React.FormEvent<HTMLFormElement>) {
		event.preventDefault();
		if (!validateCredentials(email, password)) {
			setError('Enter a valid email and password.');
			return;
		}
		setError('');
		signIn({
			id: 'demo-user',
			fullName: email.split('@')[0],
			email,
			roles: [role as 'STUDENT' | 'TEACHER' | 'ADMIN']
		});
		navigate(
			from ??
				(role === 'TEACHER'
					? '/teacher/dashboard'
					: role === 'ADMIN'
						? '/admin'
						: '/student/dashboard')
		);
	}

	return (
		<AuthLayout title="Sign in">
			<h1 className="auth-title">Welcome back.</h1>
			<p className="auth-description">Continue where you left off.</p>
			<form className="auth-form" onSubmit={submit} noValidate>
				{error ? (
					<div role="alert" className="form-error">
						{error}
					</div>
				) : null}
				<label className="auth-field">
					Email
					<input
						type="email"
						autoComplete="email"
						value={email}
						onChange={(event) => setEmail(event.target.value)}
					/>
				</label>
				<label className="auth-field">
					Password
					<input
						type="password"
						autoComplete="current-password"
						value={password}
						onChange={(event) => setPassword(event.target.value)}
					/>
				</label>
				<label className="auth-field">
					Demo role
					<select
						aria-label="Demo role"
						value={role}
						onChange={(event) => setRole(event.target.value)}
					>
						<option value="STUDENT">Student</option>
						<option value="TEACHER">Teacher</option>
						<option value="ADMIN">Admin</option>
					</select>
				</label>
				<div className="auth-form-row">
					<label className="check-label">
						<input type="checkbox" /> Remember me
					</label>
					<Link to="/auth/forgot-password">Forgot password?</Link>
				</div>
				<Button type="submit">Sign in</Button>
			</form>
			<p className="auth-switch">
				New to SkillBoost? <Link to="/auth/register">Create an account</Link>
			</p>
		</AuthLayout>
	);
}

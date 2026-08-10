import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '../../shared/ui';
import { AuthLayout } from './AuthLayout';
import { validatePassword } from './authValidation';

export function RegisterPage() {
	const navigate = useNavigate();
	const [name, setName] = useState('');
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [confirmation, setConfirmation] = useState('');
	const [error, setError] = useState('');
	return (
		<AuthLayout title="Create account">
			<h1 className="auth-title">Start building skills.</h1>
			<form
				className="auth-form"
				onSubmit={(event) => {
					event.preventDefault();
					if (!name || !email || !validatePassword(password, confirmation)) {
						setError('Complete your name, email and a strong matching password.');
						return;
					}
					navigate('/auth/verify-otp');
				}}
				noValidate
			>
				{error ? (
					<div role="alert" className="form-error">
						{error}
					</div>
				) : null}
				<label className="auth-field">
					Full name
					<input value={name} onChange={(event) => setName(event.target.value)} />
				</label>
				<label className="auth-field">
					Email
					<input
						type="email"
						value={email}
						onChange={(event) => setEmail(event.target.value)}
					/>
				</label>
				<label className="auth-field">
					Password
					<input
						type="password"
						value={password}
						onChange={(event) => setPassword(event.target.value)}
					/>
				</label>
				<label className="auth-field">
					Confirm password
					<input
						type="password"
						value={confirmation}
						onChange={(event) => setConfirmation(event.target.value)}
					/>
				</label>
				<Button type="submit">Create account</Button>
			</form>
			<p className="auth-switch">
				Already have an account? <Link to="/auth/login">Sign in</Link>
			</p>
		</AuthLayout>
	);
}

export function ForgotPasswordPage() {
	const [submitted, setSubmitted] = useState(false);
	return (
		<AuthLayout title="Forgot password">
			<h1 className="auth-title">Reset access.</h1>
			<p className="auth-description">Enter your email and we will send a reset link.</p>
			{submitted ? (
				<div className="form-success" role="status">
					Reset instructions sent.
				</div>
			) : (
				<form
					className="auth-form"
					onSubmit={(event) => {
						event.preventDefault();
						setSubmitted(true);
					}}
				>
					<label className="auth-field">
						Email
						<input type="email" required />
					</label>
					<Button type="submit">Send reset link</Button>
				</form>
			)}
			<p className="auth-switch">
				<Link to="/auth/login">← Back to sign in</Link>
			</p>
		</AuthLayout>
	);
}

export function SetPasswordPage() {
	const navigate = useNavigate();
	const [password, setPassword] = useState('');
	const [confirmation, setConfirmation] = useState('');
	const [error, setError] = useState('');
	return (
		<AuthLayout title="Set password">
			<h1 className="auth-title">Choose a new password.</h1>
			<form
				className="auth-form"
				onSubmit={(event) => {
					event.preventDefault();
					if (!validatePassword(password, confirmation)) {
						setError('Use 8 characters with upper, lower and number.');
						return;
					}
					navigate('/auth/login');
				}}
			>
				<label className="auth-field">
					New password
					<input
						type="password"
						value={password}
						onChange={(event) => setPassword(event.target.value)}
					/>
				</label>
				<label className="auth-field">
					Confirm password
					<input
						type="password"
						value={confirmation}
						onChange={(event) => setConfirmation(event.target.value)}
					/>
				</label>
				{error ? (
					<div role="alert" className="form-error">
						{error}
					</div>
				) : null}
				<Button type="submit">Reset password</Button>
			</form>
		</AuthLayout>
	);
}

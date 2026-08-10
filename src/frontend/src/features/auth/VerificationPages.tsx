import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '../../shared/ui';
import { AuthLayout } from './AuthLayout';

export function OtpPage() {
	const navigate = useNavigate();
	const [code, setCode] = useState(['', '', '', '', '', '']);
	const complete = code.every(Boolean);
	return (
		<AuthLayout title="Verify email">
			<h1 className="auth-title">Check your inbox.</h1>
			<p className="auth-description">Enter the 6-digit code to activate your account.</p>
			<form
				className="auth-form"
				onSubmit={(event) => {
					event.preventDefault();
					if (complete) navigate('/auth/login');
				}}
			>
				<div className="otp-grid">
					{code.map((value, index) => (
						<input
							key={index}
							aria-label={`OTP digit ${index + 1}`}
							inputMode="numeric"
							maxLength={1}
							value={value}
							onChange={(event) =>
								setCode((current) =>
									current.map((item, itemIndex) =>
										itemIndex === index
											? event.target.value.replace(/\D/g, '')
											: item
									)
								)
							}
						/>
					))}
				</div>
				<Button type="submit" disabled={!complete}>
					Verify and proceed
				</Button>
			</form>
			<p className="auth-switch">
				Code expires in 00:59 ·{' '}
				<button className="inline-button" type="button">
					Resend code
				</button>
			</p>
		</AuthLayout>
	);
}

export function LockScreenPage() {
	const navigate = useNavigate();
	return (
		<AuthLayout title="Screen locked">
			<div className="lock-profile">
				<div className="avatar">MA</div>
				<h1 className="auth-title">Welcome back, Minh Anh.</h1>
				<p className="auth-description">Enter your password to continue.</p>
			</div>
			<form
				className="auth-form"
				onSubmit={(event) => {
					event.preventDefault();
					navigate('/student/dashboard');
				}}
			>
				<label className="auth-field">
					Password
					<input type="password" autoFocus />
				</label>
				<Button type="submit">Sign in</Button>
			</form>
		</AuthLayout>
	);
}

export function TeacherRegistrationPage() {
	return (
		<AuthLayout title="Become a teacher">
			<h1 className="auth-title">Share what you know.</h1>
			<p className="auth-description">
				Create your account first, then submit your teacher application from the student
				workspace.
			</p>
			<Link className="ui-button ui-button-primary auth-block-link" to="/auth/register">
				Create account
			</Link>
		</AuthLayout>
	);
}

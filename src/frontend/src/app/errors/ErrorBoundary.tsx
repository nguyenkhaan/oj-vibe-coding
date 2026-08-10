import { Component, type ErrorInfo, type ReactNode } from 'react';
import { Button } from '../../shared/ui';

type ErrorBoundaryProps = {
	children: ReactNode;
};

type ErrorBoundaryState = {
	hasError: boolean;
};

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
	state: ErrorBoundaryState = { hasError: false };

	static getDerivedStateFromError(): ErrorBoundaryState {
		return { hasError: true };
	}

	componentDidCatch(error: Error, info: ErrorInfo) {
		console.error('Unhandled UI error', { error, componentStack: info.componentStack });
	}

	private retry = () => {
		this.setState({ hasError: false });
	};

	render() {
		if (this.state.hasError) {
			return (
				<main className="error-boundary surface-card">
					<span className="eyebrow">Unexpected detour</span>
					<h1>Something went wrong</h1>
					<p>
						We could not render this section. Try again or return to the previous flow.
					</p>
					<Button onClick={this.retry}>Try again</Button>
				</main>
			);
		}

		return this.props.children;
	}
}

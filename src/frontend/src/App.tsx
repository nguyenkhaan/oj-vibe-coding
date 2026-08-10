import { AppRouter } from './app/routing/AppRouter';
import { ErrorBoundary } from './app/errors/ErrorBoundary';

export default function App() {
	return (
		<ErrorBoundary>
			<AppRouter />
		</ErrorBoundary>
	);
}

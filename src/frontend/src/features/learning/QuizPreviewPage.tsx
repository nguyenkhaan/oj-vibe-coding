import { Link } from 'react-router-dom';
import { Card } from '../../shared/ui';
import { LearningContentLayout } from './LearningContentLayout';
import { quizQuestion } from './quizData';

export function QuizPreviewPage() {
	const startAction = (
		<Link className="ui-button ui-button-primary" to="/quiz/control-flow/attempt">
			Start quiz
		</Link>
	);
	return (
		<LearningContentLayout currentLessonId="sliding-window-lab" action={startAction}>
			<section className="quiz-page">
				<Card className="quiz-preview-card">
					<span className="eyebrow">Quiz preview</span>
					<h2 className="lesson-section-title">Control Flow assessment</h2>
					<p className="quiz-meta">10 questions · 20 minutes</p>
					<div className="quiz-rules">
						<strong>Passing score 70%</strong>
						<span>Question types: multiple choice, code reading</span>
						<span>Answer every question before submitting.</span>
					</div>
					<div className="quiz-sample">
						<strong>Q1. {quizQuestion.prompt}</strong>
						<pre>
							<code>{quizQuestion.code}</code>
						</pre>
						<div>
							{quizQuestion.answers.slice(0, 3).map((answer) => (
								<span key={answer}>○ {answer}</span>
							))}
						</div>
					</div>
				</Card>
			</section>
		</LearningContentLayout>
	);
}

import { Link } from 'react-router-dom';
import { Card } from '../../shared/ui';
import { quizQuestion } from './quizData';

export function QuizPreviewPage() {
	return (
		<section className="quiz-page">
			<Link className="back-link" to="/classroom/workspace">
				← Back to lesson
			</Link>
			<Card className="quiz-preview-card">
				<span className="eyebrow">Quiz preview</span>
				<h1 className="page-title">Quiz: Control Flow</h1>
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
				<div className="quiz-actions">
					<Link className="ui-button ui-button-primary" to="/quiz/control-flow/attempt">
						Start quiz
					</Link>
				</div>
			</Card>
		</section>
	);
}

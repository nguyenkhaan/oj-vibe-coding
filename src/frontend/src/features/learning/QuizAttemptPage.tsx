import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Button, Card, StatusBadge } from '../../shared/ui';
import { useLearningProgress } from './LearningProgressProvider';
import { quizQuestion } from './quizData';

export function QuizAttemptPage() {
	const [answer, setAnswer] = useState<number | null>(null);
	const [submitted, setSubmitted] = useState(false);
	const [attempts, setAttempts] = useState(0);
	const { markComplete, isComplete } = useLearningProgress();
	const maxAttempts = 2;
	useEffect(() => {
		if (submitted && answer === quizQuestion.correct && !isComplete('sliding-window-lab'))
			markComplete('sliding-window-lab');
	}, [answer, isComplete, markComplete, submitted]);
	if (submitted) {
		const passed = answer === quizQuestion.correct;
		const canRetry = !passed && attempts < maxAttempts;
		return (
			<section className="quiz-page">
				<Card className="quiz-result-card">
					<StatusBadge tone={passed ? 'success' : 'error'}>
						{passed ? 'Passed' : 'Failed'}
					</StatusBadge>
					<h1 className="page-title">
						{passed ? 'Quiz passed' : 'Quiz needs another attempt'}
					</h1>
					<p>{passed ? '1 of 1 correct · 100%' : '0 of 1 correct · 0%'}</p>
					<p className="quiz-attempts">
						Attempts used: {attempts}/{maxAttempts} ·{' '}
						{Math.max(0, maxAttempts - attempts)} remaining
					</p>
					{passed ? (
						<Link className="ui-button ui-button-primary" to="/classroom/workspace">
							Back to lesson
						</Link>
					) : canRetry ? (
						<Button
							type="button"
							onClick={() => {
								setAnswer(null);
								setSubmitted(false);
							}}
						>
							Retry quiz
						</Button>
					) : (
						<Link className="ui-button ui-button-secondary" to="/classroom/workspace">
							Back to lesson
						</Link>
					)}
				</Card>
			</section>
		);
	}
	return (
		<section className="quiz-page">
			<div className="quiz-attempt-header">
				<div>
					<span className="eyebrow">Quiz: Control Flow</span>
					<strong>
						Question 1 of 10 · Attempt {attempts + 1} of {maxAttempts}
					</strong>
				</div>
				<span className="quiz-timer">14:32</span>
			</div>
			<div className="quiz-attempt-layout">
				<Card className="quiz-question-card">
					<h1>{quizQuestion.prompt}</h1>
					<pre>
						<code>{quizQuestion.code}</code>
					</pre>
					<fieldset>
						<legend>Choose one answer</legend>
						{quizQuestion.answers.map((item, index) => (
							<label key={item}>
								<input
									type="radio"
									name="answer"
									aria-label={item}
									checked={answer === index}
									onChange={() => setAnswer(index)}
								/>
								{item}
							</label>
						))}
					</fieldset>
					<div className="quiz-actions">
						<Button variant="secondary" type="button">
							Previous
						</Button>
						<Button
							type="button"
							onClick={() => {
								setAttempts((current) => current + 1);
								setSubmitted(true);
							}}
							disabled={answer === null}
						>
							Submit quiz
						</Button>
					</div>
				</Card>
				<Card className="quiz-navigation">
					<strong>Question navigation</strong>
					<div>
						{Array.from({ length: 10 }, (_, index) => (
							<button
								className={index === 0 ? 'is-current' : ''}
								type="button"
								key={index}
							>
								{index + 1}
							</button>
						))}
					</div>
					<small>Answered questions are marked after selection.</small>
				</Card>
			</div>
		</section>
	);
}

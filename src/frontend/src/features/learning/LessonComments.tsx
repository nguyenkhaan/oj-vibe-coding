import { useState } from 'react';
import { Button, Card } from '../../shared/ui';

export function LessonComments() {
	const [replying, setReplying] = useState(false);
	const [reply, setReply] = useState('');
	const [replies, setReplies] = useState<string[]>([]);
	return (
		<Card className="lesson-comments">
			<div className="comments-heading">
				<strong>Lesson discussion</strong>
				<span>1 comment</span>
			</div>
			<div className="comment">
				<strong>Minh Anh</strong>
				<p>Can we compare this with a sliding window?</p>
				<button type="button" onClick={() => setReplying((current) => !current)}>
					Reply
				</button>
			</div>
			{replies.map((item) => (
				<p className="comment-reply" key={item}>
					You: {item}
				</p>
			))}
			{replying ? (
				<form
					onSubmit={(event) => {
						event.preventDefault();
						if (!reply.trim()) return;
						setReplies((current) => [...current, reply.trim()]);
						setReply('');
						setReplying(false);
					}}
				>
					<input
						aria-label="Reply to comment"
						value={reply}
						onChange={(event) => setReply(event.target.value)}
						placeholder="Write a reply"
					/>
					<Button type="submit">Reply</Button>
				</form>
			) : null}
		</Card>
	);
}

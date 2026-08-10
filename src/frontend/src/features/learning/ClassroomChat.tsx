import { useState } from 'react';
import { Button, Card } from '../../shared/ui';

export function ClassroomChat() {
	const [message, setMessage] = useState('');
	const [messages, setMessages] = useState(['Ronald: Welcome to module 2']);
	function send(event: React.FormEvent<HTMLFormElement>) {
		event.preventDefault();
		if (!message.trim()) return;
		setMessages((current) => [...current, `You: ${message.trim()}`]);
		setMessage('');
	}
	return (
		<Card className="classroom-chat">
			<strong>Cohort chat</strong>
			<div className="chat-messages" aria-live="polite">
				{messages.map((item, index) => (
					<span key={`${item}-${index}`}>{item}</span>
				))}
			</div>
			<form onSubmit={send}>
				<input
					aria-label="Chat message"
					value={message}
					onChange={(event) => setMessage(event.target.value)}
					placeholder="Type a message"
				/>
				<Button type="submit">Send</Button>
			</form>
		</Card>
	);
}

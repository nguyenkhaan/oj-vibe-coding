import type { ReactNode } from 'react';
import { cn } from '../../lib/cn';

type CardProps = {
	title?: string;
	description?: string;
	actions?: ReactNode;
	children: ReactNode;
	className?: string;
	bodyClassName?: string;
};

export function Card({ title, description, actions, children, className, bodyClassName }: CardProps) {
	return (
		<section className={cn('surface-card', className)}>
			{title || description || actions ? (
				<header className="surface-card__header">
					<div>
						{title ? <h2 className="surface-card__title">{title}</h2> : null}
						{description ? <p className="surface-card__description">{description}</p> : null}
					</div>
					{actions ? <div>{actions}</div> : null}
				</header>
			) : null}
			<div className={cn('surface-card__body', bodyClassName)}>{children}</div>
		</section>
	);
}

import type { ButtonHTMLAttributes, ReactNode } from 'react';
import { cn } from '../../lib/cn';

type ButtonVariant = 'primary' | 'secondary' | 'ghost';

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
	variant?: ButtonVariant;
	children: ReactNode;
};

const variantClassMap: Record<ButtonVariant, string> = {
	primary:
		'bg-[linear-gradient(135deg,#ff5d7a_0%,#5d4bff_100%)] text-white shadow-[0_14px_30px_rgba(93,75,255,0.22)] hover:-translate-y-0.5',
	secondary:
		'bg-white text-[#1f1740] border border-[rgba(31,23,64,0.12)] hover:bg-[#f5f2ff]',
	ghost: 'bg-transparent text-[#5a5f7a] hover:bg-[rgba(22,22,42,0.05)]',
};

export function Button({ className, variant = 'primary', children, ...props }: ButtonProps) {
	return (
		<button
			className={cn(
				'inline-flex items-center justify-center gap-2 rounded-full px-4 py-2 text-sm font-semibold transition duration-200 ease-out disabled:cursor-not-allowed disabled:opacity-50',
				variantClassMap[variant],
				className,
			)}
			{...props}
		>
			{children}
		</button>
	);
}

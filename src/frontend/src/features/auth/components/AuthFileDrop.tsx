import { Badge } from '../../../shared/components/badge/Badge';

type AuthFileDropProps = {
	label: string;
	subtitle: string;
};

export function AuthFileDrop({ label, subtitle }: AuthFileDropProps) {
	return (
		<div className="flex min-h-28 flex-col justify-between rounded-3xl border border-dashed border-[rgba(93,75,255,0.22)] bg-[linear-gradient(180deg,#fbfbff_0%,#f5f1ff_100%)] p-5">
			<div className="flex items-center justify-between gap-3">
				<p className="text-sm font-semibold text-[var(--text-primary)]">{label}</p>
				<Badge variant="indigo">upload</Badge>
			</div>
			<p className="mt-6 text-sm leading-6 text-[var(--text-secondary)]">{subtitle}</p>
		</div>
	);
}

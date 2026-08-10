import { Button, Card } from '../../shared/ui';

export type ApplicationFormValues = {
	bio: string;
	school: string;
	motivation: string;
	idNumber: string;
	front: File | null;
	back: File | null;
};
type FormProps = {
	values: ApplicationFormValues;
	error: string;
	saved: boolean;
	onChange: (field: keyof ApplicationFormValues, value: string) => void;
	onFile: (field: 'front' | 'back', file: File | null) => void;
	onSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
	onSave: () => void;
};

export function TeacherApplicationForm({
	values,
	error,
	saved,
	onChange,
	onFile,
	onSubmit,
	onSave
}: FormProps) {
	return (
		<Card className="application-form-card">
			<form className="application-form" onSubmit={onSubmit}>
				<div className="application-section">
					<span className="eyebrow">01 · Your profile</span>
					<label className="field-label">
						Bio
						<textarea
							aria-label="Bio"
							rows={4}
							value={values.bio}
							onChange={(event) => onChange('bio', event.target.value)}
							placeholder="What do you teach well?"
						/>
					</label>
					<label className="field-label">
						School or company
						<input
							aria-label="School or company"
							value={values.school}
							onChange={(event) => onChange('school', event.target.value)}
						/>
					</label>
					<label className="field-label">
						Motivation
						<textarea
							aria-label="Motivation"
							rows={4}
							value={values.motivation}
							onChange={(event) => onChange('motivation', event.target.value)}
							placeholder="Why do you want to teach here?"
						/>
					</label>
				</div>
				<div className="application-section">
					<span className="eyebrow">02 · Identity</span>
					<label className="field-label">
						CCCD number
						<input
							aria-label="CCCD number"
							inputMode="numeric"
							value={values.idNumber}
							onChange={(event) => onChange('idNumber', event.target.value)}
						/>
					</label>
					<div className="upload-grid">
						<FileField
							label="CCCD front"
							file={values.front}
							onChange={(file) => onFile('front', file)}
						/>
						<FileField
							label="CCCD back"
							file={values.back}
							onChange={(file) => onFile('back', file)}
						/>
					</div>
				</div>
				{error ? (
					<div role="alert" className="form-error">
						{error}
					</div>
				) : null}
				<div className="application-actions">
					<Button variant="secondary" type="button" onClick={onSave}>
						Save draft
					</Button>
					<Button type="submit">Submit application</Button>
				</div>
				{saved ? (
					<span className="save-note" role="status">
						Draft saved.
					</span>
				) : null}
			</form>
		</Card>
	);
}

function FileField({
	label,
	file,
	onChange
}: {
	label: string;
	file: File | null;
	onChange: (file: File | null) => void;
}) {
	return (
		<label className="file-field">
			{label}
			<input
				type="file"
				accept="image/png,image/jpeg,application/pdf"
				aria-label={label}
				onChange={(event) => onChange(event.target.files?.[0] ?? null)}
			/>
			{file ? <span>{file.name}</span> : <small>PNG, JPG or PDF · max 5 MB</small>}
		</label>
	);
}

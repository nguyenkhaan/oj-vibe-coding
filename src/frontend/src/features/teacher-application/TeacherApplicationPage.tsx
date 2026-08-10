import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { ApplicationStatus, type ApplicationState } from './ApplicationStatus';
import { validateApplication, validateUpload } from './applicationValidation';
import { TeacherApplicationForm, type ApplicationFormValues } from './TeacherApplicationForm';

const emptyValues: ApplicationFormValues = {
	bio: '',
	school: '',
	motivation: '',
	idNumber: '',
	front: null,
	back: null
};

export function TeacherApplicationPage() {
	const [searchParams] = useSearchParams();
	const initialState = (searchParams.get('status')?.toUpperCase() as ApplicationState) || 'DRAFT';
	const [state, setState] = useState<ApplicationState>(initialState);
	const [values, setValues] = useState<ApplicationFormValues>(emptyValues);
	const [error, setError] = useState('');
	const [saved, setSaved] = useState(false);
	function update(field: keyof ApplicationFormValues, value: string) {
		setValues((current) => ({ ...current, [field]: value }));
	}
	function updateFile(field: 'front' | 'back', file: File | null) {
		const uploadError = validateUpload(file);
		setError(uploadError);
		if (!uploadError) setValues((current) => ({ ...current, [field]: file }));
	}
	function submit(event: React.FormEvent<HTMLFormElement>) {
		event.preventDefault();
		if (!validateApplication(values)) {
			setError('Complete the required fields before submitting.');
			return;
		}
		setError('');
		setState('PENDING');
	}
	return (
		<section className="teacher-application-page">
			<div className="catalog-heading">
				<div>
					<span className="eyebrow">Teacher application</span>
					<h1 className="page-title">Share your craft.</h1>
					<p className="page-subtitle">
						Tell Admin how you will help students build better software.
					</p>
				</div>
			</div>
			<ApplicationStatus state={state} />
			<TeacherApplicationForm
				values={values}
				error={error}
				saved={saved}
				onChange={update}
				onFile={updateFile}
				onSubmit={submit}
				onSave={() => {
					setSaved(true);
					setError('');
				}}
			/>
		</section>
	);
}

export function validateApplication(values: {
	bio: string;
	school: string;
	motivation: string;
	idNumber: string;
	front: File | null;
	back: File | null;
}) {
	return Boolean(
		values.bio.trim() &&
		values.school.trim() &&
		values.motivation.trim() &&
		values.idNumber.trim() &&
		values.front &&
		values.back
	);
}

export function validateUpload(file: File | null) {
	if (!file) return 'Choose a file.';
	if (!['image/png', 'image/jpeg', 'application/pdf'].includes(file.type))
		return 'Use PNG, JPG or PDF.';
	if (file.size > 5_000_000) return 'File must be 5 MB or smaller.';
	return '';
}

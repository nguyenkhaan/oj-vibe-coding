import { describe, expect, it } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { LearningProgressProvider, useLearningProgress } from './LearningProgressProvider';

describe('learning progress store', () => {
	it('optimistically marks a lesson complete and updates the percentage', () => {
		const { result } = renderHook(() => useLearningProgress(), {
			wrapper: LearningProgressProvider
		});

		act(() => result.current.markComplete('two-pointer-patterns'));

		expect(result.current.isComplete('two-pointer-patterns')).toBe(true);
		expect(result.current.progressPercent(5)).toBe(60);
	});
});

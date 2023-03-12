export const sortHelper = (comparisonCriteria: number[]): number => {
	for (const criteria of comparisonCriteria) {
		if (criteria !== 0) return criteria;
	}
	return 0;
};

export function formatPainScore(score: number | null | undefined): string {
  if (score === null || score === undefined || Number.isNaN(score)) {
    return '-';
  }

  return Number.isInteger(score) ? String(score) : score.toFixed(1);
}

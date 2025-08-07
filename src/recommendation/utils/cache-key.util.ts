export function getRecommendationCacheKey(
  userId: string,
  date = new Date(),
): string {
  const day = date.toISOString().split('T')[0]; // "2025-08-07"
  return `user:${userId}:recommendations:${day}`;
}

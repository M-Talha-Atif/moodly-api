export const DEFAULT_EXPERIENCE_RECOMMENDATION_LIMIT = 10;

// How many nearest neighbors MongoDB's $vectorSearch scans before applying `limit`.
// Higher improves recall at some latency cost; not currently tuned against real data.
export const VECTOR_SEARCH_CANDIDATE_POOL = 100;

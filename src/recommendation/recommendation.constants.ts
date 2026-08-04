export const DEFAULT_MOOD_RECOMMENDATION_LIMIT = 10;

// Embedding-based path (not currently wired to a controller, see README).
export const EMBEDDING_CANDIDATE_POOL_SIZE = 25;
export const RERANKED_RECOMMENDATION_LIMIT = 10;

// 0 favors consistent, repeatable rankings over creative variation, appropriate for a
// ranking task rather than free-form generation.
export const RANKING_TEMPERATURE = 0;

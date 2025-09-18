// src/recommendation/interfaces/ranking-provider.interface.ts
export type Candidate = {
  id: string;
  title: string;
  description?: string;
};

export interface RankingProvider {
  rerank(userContext: string, candidates: Candidate[]): Promise<string[]>;
}
